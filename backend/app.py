import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq  # Updated library
from dotenv import load_dotenv

# 1. Initialize the App
app = Flask(__name__)
CORS(app)

# 2. Configure API Key
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("❌ ERROR: No GROQ_API_KEY found in .env or environment variables.")
else:
    # Initialize the Groq Client
    client = Groq(api_key=api_key)

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

    # Format history for Groq's Chat Completion API
    messages = [{"role": "system", "content": SYSTEM_INSTRUCTION}]
    
    # Add conversation history
    for msg in history:
        role = "assistant" if msg['role'] == 'model' else "user"
        messages.append({"role": role, "content": msg['content']})
    
    # Add current user message
    messages.append({"role": "user", "content": user_message})

    try:
        # Generate completion using Llama 3.3 70B
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile", # High limit, high speed
            temperature=0.5,
            max_tokens=1024,
        )
        
        reply = chat_completion.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print(f"-------------> GROQ ERROR: {e}")
        return jsonify({"reply": "**Error:** The health assistant is busy. Please try again in a few moments."})

if __name__ == '__main__':
    # Use port 5000 as per your previous configuration
    app.run(debug=True, port=5000)