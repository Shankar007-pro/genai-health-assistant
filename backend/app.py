from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/')
def home():
    return 'Welcome to GenAI Health Assistant Backend!'

def log_patient(data):
    try:
        conn = sqlite3.connect('database/patients.db')
        cur = conn.cursor()
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

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.get_json()
    symptoms = data.get('symptoms')
    # Add your diagnosis logic or call AI models here
    response = {
        "diagnosis": "Common Cold",
        "confidence": 85,
        "drugInteractionAlert": "No known drug interactions.",
        "dosageRecommendation": "Paracetamol 500mg every 6 hours.",
        "referralAdvice": "No specialist referral required.",
        # Including original data for logging
        "symptoms": symptoms,
        "history": data.get('history', ''),
        "vitals": data.get('vitals'),
        "language": data.get('language', 'en')
    }
    log_patient(response)  # Save data to DB
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
