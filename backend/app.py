from flask import Flask, request, jsonify
import openai
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import sqlite3

app = Flask(__name__)

openai.api_key = "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"

tokenizer = AutoTokenizer.from_pretrained("ugaray96/biobert_ncbi_disease_ner")
model = AutoModelForTokenClassification.from_pretrained("ugaray96/biobert_ncbi_disease_ner")
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

def init_db():
    conn = sqlite3.connect('patients.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS records
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  symptoms TEXT,
                  history TEXT,
                  vitals TEXT,
                  diagnosis TEXT)''')
    conn.commit()
    conn.close()

def save_record(symptoms, history, vitals, diagnosis):
    conn = sqlite3.connect('patients.db')
    c = conn.cursor()
    c.execute("INSERT INTO records (symptoms, history, vitals, diagnosis) VALUES (?, ?, ?, ?)",
              (symptoms, history, vitals, diagnosis))
    conn.commit()
    conn.close()

def run_gpt4(symptoms, history, vitals):
    prompt = (
        f"Patient symptoms: {symptoms}\n"
        f"Medical history: {history}\n"
        f"Vital signs: {vitals}\n"
        "Provide a differential diagnosis with confidence scores, suggested treatments, and referral advice."
    )
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.2,
        )
        diagnosis_text = response['choices'][0]['message']['content']
        return diagnosis_text
    except Exception as e:
        return f"Error during GPT-4 API call: {str(e)}"

def extract_diseases(text):
    if not text.strip():
        return []
    ner_results = ner_pipeline(text)
    diseases = []
    for entity in ner_results:
        if entity['entity_group'] == 'Disease':
            diseases.append(entity['word'])
    return list(set(diseases))  # Remove duplicates

@app.route("/diagnose", methods=["POST"])
def diagnose():
    data = request.json
    symptoms = data.get("symptoms", "")
    history = data.get("history", "")
    vitals = data.get("vitals", "")


    extracted_diseases = extract_diseases(symptoms + " " + history)


    diagnosis = run_gpt4(symptoms, history, vitals)


    save_record(symptoms, history, vitals, diagnosis)

    return jsonify({
        "extracted_diseases": extracted_diseases,
        "diagnosis": diagnosis
    })

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
