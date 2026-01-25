import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv # Keep this if you installed python-dotenv

# 1. Initialize the App (This was missing!)
app = Flask(__name__)
CORS(app)

# 2. Configure API Key
# If you are using .env file, keep load_dotenv(). 
# If not, you can delete 'load_dotenv()' and put the key directly below.
load_dotenv() 

# ERROR FIX: Ensure the key is loaded. 
# If you are NOT using .env yet, replace os.getenv(...) with "YOUR_KEY_HERE"
api_key = os.getenv("GEMINI_API_KEY")

# Fallback if .env isn't set up yet (replace quotes with your actual key if needed)
if not api_key:
    api_key = "YOUR_ACTUAL_API_KEY_HERE"

genai.configure(api_key=api_key)
# Initialize Gemini 1.5 Flash (Free & Fast)
model = genai.GenerativeModel('gemini-flash-latest')

# --- SYSTEM PERSONA ---
SYSTEM_INSTRUCTION = """
You are 'Aarogya-AI', a compassionate medical assistant for rural India. 
Your Goal: Help diagnose issues based on symptoms and history.

Rules:
1. Detect the language (Hindi, Telugu, Tamil, etc.) and reply in the SAME language.
2. If symptoms are dangerous (chest pain, breathing trouble), urge them to see a doctor immediately.
3. Format output in Markdown:
   - **Diagnosis:** (Possible condition)
   - **Home Remedies:** (Simple care)
   - **Medicine:** (Generic names only, e.g., Paracetamol)
"""

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    history = data.get('history', [])

    # Construct prompt with history context
    conversation = f"{SYSTEM_INSTRUCTION}\n\n"
    for msg in history:
        role = "User" if msg['role'] == 'user' else "Model"
        conversation += f"{role}: {msg['content']}\n"
    
    conversation += f"User: {user_message}\nModel:"

    try:
        response = model.generate_content(conversation)
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"-------------> GOOGLE ERROR: {e}")  # <--- Add this line!
        return jsonify({"reply": "**Error:** Check internet connection or API Key."})
if __name__ == '__main__':
    app.run(debug=True, port=5000)