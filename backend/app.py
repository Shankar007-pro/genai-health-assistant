import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Initialize the App
app = Flask(__name__)
CORS(app)  # Enables the Frontend to talk to the Backend

# 2. Configure API Key
load_dotenv() # Load key from .env file (for Localhost)

# Get the key from the environment (Works for both Render and Localhost)
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ERROR: No API Key found! Please check your .env file or Render settings.")
else:
    genai.configure(api_key=api_key)

# 3. Initialize the Model (Switched to Stable Version)
# 'gemini-1.5-flash' is much faster and has higher free limits than 'flash-latest'
model = genai.GenerativeModel('gemini-1.5-flash')

# --- SYSTEM PERSONA ---
SYSTEM_INSTRUCTION = """
You are 'Aarogya-AI', a compassionate medical assistant for rural India. 
Your Goal: Help diagnose issues based on symptoms and history.

Rules:
1. Detect the language (Hindi, Telugu, Tamil, etc.) and reply in the SAME language.
2. If symptoms are dangerous (chest pain, breathing trouble), urge them to see a doctor immediately.
3. Keep answers short, simple, and easy to read.
4. Format output in Markdown:
   - **Diagnosis:** (Possible condition)
   - **Home Remedies:** (Simple care)
   - **Medicine:** (Generic names only, e.g., Paracetamol)
"""

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    history = data.get('history', [])

    # Construct the conversation prompt
    # We add the System Instruction at the very start
    conversation = f"{SYSTEM_INSTRUCTION}\n\nCurrent Conversation:\n"
    
    for msg in history:
        role = "User" if msg['role'] == 'user' else "Model"
        conversation += f"{role}: {msg['content']}\n"
    
    conversation += f"User: {user_message}\nModel:"

    try:
        response = model.generate_content(conversation)
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"-------------> GOOGLE ERROR: {e}") 
        # Returns the error to the frontend console so we can see it
        return jsonify({"reply": "**Error:** System is busy or Key is invalid. Try again in 1 minute."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)