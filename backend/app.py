import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
from transformers import BioGptTokenizer, BioGptForCausalLM, pipeline as gen_pipeline, set_seed

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS

# Initialize NER pipeline (BioBERT disease NER)
tokenizer = AutoTokenizer.from_pretrained("ugaray96/biobert_ncbi_disease_ner")
model = AutoModelForTokenClassification.from_pretrained("ugaray96/biobert_ncbi_disease_ner")
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

# Initialize BioGPT generative model
biogpt_tokenizer = BioGptTokenizer.from_pretrained("microsoft/biogpt")
biogpt_model = BioGptForCausalLM.from_pretrained("microsoft/biogpt")
generator = gen_pipeline('text-generation', model=biogpt_model, tokenizer=biogpt_tokenizer)
set_seed(42)

DB_PATH = 'patients.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symptoms TEXT NOT NULL,
                history TEXT,
                vitals TEXT,
                diagnosis TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    logger.info("Database initialized.")

def save_record(symptoms, history, vitals, diagnosis):
    try:
        with get_db_connection() as conn:
            conn.execute(
                "INSERT INTO records (symptoms, history, vitals, diagnosis) VALUES (?, ?, ?, ?)",
                (symptoms, history, vitals, diagnosis)
            )
            conn.commit()
        logger.info("Record saved.")
    except Exception as e:
        logger.error(f"Error saving record: {e}")

def extract_diseases(text):
    if not text.strip():
        return []
    ner_results = ner_pipeline(text)
    diseases = set()
    for entity in ner_results:
        if entity.get('entity_group') == 'Disease':
            diseases.add(entity['word'].strip().lower())
    return list(diseases)

def generate_diagnosis_biogpt(symptoms, history, vitals):
    prompt = (
        f"Patient symptoms: {symptoms}\n"
        f"Medical history: {history}\n"
        f"Vital signs: {vitals}\n"
        f"Provide a detailed differential diagnosis with confidence scores, suggested treatments, and referral advice."
    )
    outputs = generator(prompt, max_length=200, num_return_sequences=1, do_sample=True)
    generated_text = outputs[0]['generated_text']
    diagnosis_text = generated_text[len(prompt):].strip() if generated_text.startswith(prompt) else generated_text
    return diagnosis_text

def validate_input(data):
    errors = []
    if "symptoms" not in data or not data["symptoms"].strip():
        errors.append("Symptoms are required.")
    vitals = data.get("vitals", "")
    if vitals:
        try:
            temp = float(vitals)
            if not (30 <= temp <= 45):
                errors.append("Vitals temperature must be between 30 and 45 °C.")
        except ValueError:
            errors.append("Vitals must be a valid number.")
    return errors

@app.route("/diagnose", methods=["POST"])
def diagnose():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON data."}), 400

    errors = validate_input(data)
    if errors:
        return jsonify({"errors": errors}), 400

    symptoms = data.get("symptoms", "").strip()
    history = data.get("history", "").strip()
    vitals = data.get("vitals", "").strip()

    diseases = extract_diseases(f"{symptoms} {history}")
    diagnosis = generate_diagnosis_biogpt(symptoms, history, vitals)
    save_record(symptoms, history, vitals, diagnosis)

    return jsonify({
        "extracted_diseases": diseases,
        "diagnosis": diagnosis,
        "confidence": None  # Optionally calculate confidence later
    }), 200

@app.route("/")
def home():
    return "GenAI Health Assistant Backend is running."

if __name__ == "__main__":
    logger.info("Starting GenAI Health Assistant server...")
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
