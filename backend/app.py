import os
import logging
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS  # Added import for CORS
import sqlite3
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import openai

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Config from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-default-key-here")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")
openai.api_key = OPENAI_API_KEY

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (adjust origins if needed)

# Initialize NER pipeline once
tokenizer = AutoTokenizer.from_pretrained("ugaray96/biobert_ncbi_disease_ner")
model = AutoModelForTokenClassification.from_pretrained("ugaray96/biobert_ncbi_disease_ner")
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

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

async def run_gpt4_async(symptoms, history, vitals):
    prompt = (
        f"Patient symptoms: {symptoms}\n"
        f"Medical history: {history}\n"
        f"Vital signs: {vitals}\n"
        "Provide a differential diagnosis with confidence scores, suggested treatments, and referral advice."
    )
    try:
        response = await openai.ChatCompletion.acreate(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.2,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"GPT-4 API error: {e}")
        return f"Error during GPT-4 API call: {str(e)}"

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

    # Run GPT-4 async call within sync route using event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    diagnosis = loop.run_until_complete(run_gpt4_async(symptoms, history, vitals))
    loop.close()

    save_record(symptoms, history, vitals, diagnosis)

    return jsonify({
        "extracted_diseases": diseases,
        "diagnosis": diagnosis,
        "confidence": None
    }), 200

if __name__ == "__main__":
    logger.info("Starting GenAI Health Assistant server...")
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
