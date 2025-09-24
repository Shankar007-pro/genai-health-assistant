import os
from flask import Flask, request, jsonify
import sqlite3
import openai
import time

app = Flask(__name__)

# Load API key from env
openai.api_key = os.getenv("OPENAI_API_KEY")

DATABASE = 'database/patients.db'

# Function to log patient data into SQLite DB
def log_patient(data):
    try:
        conn = sqlite3.connect(DATABASE)
        cur = conn.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS patients (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        symptoms TEXT,
                        history TEXT,
                        vitals REAL,
                        language TEXT,
                        diagnosis TEXT,
                        confidence INTEGER,
                        drug_alert TEXT,
                        dosage TEXT,
                        referral TEXT,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                    )''')
        cur.execute('''INSERT INTO patients
            (symptoms, history, vitals, language, diagnosis, confidence, drug_alert, dosage, referral)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (data['symptoms'], data.get('history', ''), data['vitals'], data.get('language', 'en'),
             data['diagnosis'], data['confidence'], data['drugInteractionAlert'],
             data['dosageRecommendation'], data['referralAdvice'])
        )
        conn.commit()
    except Exception as e:
        print(f"DB Error: {e}")
    finally:
        conn.close()

# Helper: Compose AI prompt with patient info for diagnosis
def create_prompt(data):
    prompt = f"""
You are a medical diagnosis assistant helping doctors in rural India. Use the patient's language preference: {data.get('language', 'en')}.
Patient symptoms: {data['symptoms']}
Medical history: {data.get('history', 'None')}
Vital signs (Temperature in Celsius): {data['vitals']}

1. Suggest the most likely diagnosis with confidence percentage.
2. Suggest immediate treatment protocols following Indian healthcare guidelines.
3. Notify any potential drug interactions.
4. Give dosage recommendations based on typical adult dosage.
5. Advise if specialist referral is needed.

Respond in simple, easy-to-understand language suitable for rural healthcare workers.
Format your response as JSON with these keys:
diagnosis, confidence (0-100), drugInteractionAlert, dosageRecommendation, referralAdvice.
"""
    return prompt

@app.route('/')
def home():
    return 'Welcome to GenAI Health Assistant Backend!'

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.get_json()
    start_time = time.time()

    prompt = create_prompt(data)

    try:
        # Call OpenAI GPT-4 API (with timeout and reduced max tokens for faster response)
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.5,
            timeout=25  # Max time in seconds for API call
        )
        ai_message = response['choices'][0]['message']['content'].strip()

        # Parse AI JSON response safely
        import json
        try:
            ai_response = json.loads(ai_message)
        except json.JSONDecodeError:
            # Fallback to minimal response if AI output malformed
            ai_response = {
                "diagnosis": "Unable to determine diagnosis accurately.",
                "confidence": 0,
                "drugInteractionAlert": "Unknown",
                "dosageRecommendation": "Consult local guidelines",
                "referralAdvice": "Consult specialist if symptoms worsen."
            }

        # Prepare full response merging AI and input for logging
        full_response = {
            "diagnosis": ai_response.get("diagnosis", ""),
            "confidence": ai_response.get("confidence", 0),
            "drugInteractionAlert": ai_response.get("drugInteractionAlert", ""),
            "dosageRecommendation": ai_response.get("dosageRecommendation", ""),
            "referralAdvice": ai_response.get("referralAdvice", ""),
            "symptoms": data['symptoms'],
            "history": data.get('history', ''),
            "vitals": data['vitals'],
            "language": data.get('language', 'en')
        }

        # Log patient data and AI response
        log_patient(full_response)

        # Ensure total processing time is under 30 seconds
        elapsed = time.time() - start_time
        if elapsed > 30:
            print(f"Warning: Diagnosis processing took {elapsed:.2f}s, exceeding 30s limit")

        return jsonify(full_response)

    except Exception as e:
        # Handle API or processing errors gracefully
        return jsonify({
            "diagnosis": "Error processing diagnosis",
            "confidence": 0,
            "drugInteractionAlert": "N/A",
            "dosageRecommendation": "N/A",
            "referralAdvice": "N/A",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
