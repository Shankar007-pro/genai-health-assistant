import os
import io
import base64
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from groq import Groq 
from dotenv import load_dotenv

# 1. Initialize the App
app = Flask(__name__, static_folder='build', static_url_path='/')
CORS(app)

# 2. Configure API Key
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

if api_key:
    api_key = api_key.strip()
    print(f"✅ DEBUG: Key found. Starts with: {api_key[:7]}...") 
    client = Groq(api_key=api_key)
else:
    print("❌ DEBUG: No GROQ_API_KEY found in environment!")
    client = None

# --- IMPROVED SYSTEM PERSONA ---
SYSTEM_INSTRUCTION = """
You are 'Aarogya-AI', a professional medical assistant for rural healthcare.
Your primary goal is to provide clear, human-readable medical guidance.

STRICT FORMATTING RULES:
1. RESPONSE LANGUAGE: Reply ONLY in the language requested by the user. If the user asks in Telugu, reply in Telugu. If English, reply in English.
2. NO GIBBERISH: Do not output technical strings, code fragments, or random characters (like 'iav726' or 'det'). Use only natural human language.
3. STRUCTURE: Always use this Markdown structure:
   ## **Aarogya-AI Medical Assessment**
   
   ### **Possible Condition:**
   [Name of the condition in plain terms]
   
   ### **Key Symptoms identified:**
   * [Symptom 1]
   * [Symptom 2]
   
   ### **Recommended Home Care:**
   [Simple steps for the patient to follow]
   
   ### **Suggested Generic Medicine:**
   [Only generic names, e.g., Paracetamol, Cetirizine]
   
   ---
   ⚠️ **MEDICAL DISCLAIMER:** This is an AI-generated assessment. This is NOT a substitute for a professional medical diagnosis. Please consult a doctor immediately if symptoms worsen.
"""
@app.route("/")
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

# --- VOICE TRANSCRIPTION (Whisper Large V3 Turbo) ---
@app.route('/transcribe-voice', methods=['POST'])
def transcribe_voice():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file"}), 400
    
    # Get language from frontend to improve transcription accuracy
    selected_language = request.form.get('language', 'English')
    
    lang_map = {
        "English": "en",
        "Telugu": "te",
        "Hindi": "hi",
        "Kannada": "kn",
        "Tamil": "ta"
    }
    target_lang = lang_map.get(selected_language, "en")

    audio_file = request.files['audio']
    try:
        audio_data = audio_file.read()
        buffer = io.BytesIO(audio_data)
        buffer.name = 'audio.wav' 

        transcription = client.audio.transcriptions.create(
            file=buffer,
            model="whisper-large-v3-turbo",
            language=target_lang
        )
        return jsonify({"text": transcription.text})
    except Exception as e:
        print(f"Transcription Error: {e}")
        return jsonify({"error": "Failed to transcribe audio"}), 500

# --- IMAGE ANALYSIS (Llama 3.2 Vision / Llama 4 Scout) ---
@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    if not client:
        return jsonify({"analysis": "⚠️ **Configuration Error:** API Key missing."}), 500
        
    data = request.get_json()
    try:
        base64_image = data.get('image').split(',')[1]
        user_text = data.get('text', "Analyze this photo.") 
        
        # ✅ UPDATED: Switched to Llama 3.2 11B Vision (Stable) or Llama 4 Scout
        # meta-llama/llama-4-scout-17b-16e-instruct is the 2026 production standard
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": f"User Input: {user_text}\n\nSTRICT RULE: Analyze this medical photo. You MUST provide the diagnosis and advice in the specific language requested by the user in the input. Do not use English if another language is requested."
                        },
                        {
                            "type": "image_url", 
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                        }
                    ]
                }
            ],
            max_tokens=512
        )
        return jsonify({"analysis": response.choices[0].message.content})
    except Exception as e:
        print(f"Vision Error: {e}")
        # Falling back to a text-based error if decommissioned again
        return jsonify({"analysis": "⚠️ **Error:** I couldn't process the image. Please ensure you are using a clear photo and try again."})

# --- CHAT API (Llama 3.3 Versatile) ---
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    history = data.get('history', [])

    messages = [{"role": "system", "content": SYSTEM_INSTRUCTION}]
    
    for msg in history:
        role = "assistant" if msg['role'] == 'model' else "user"
        messages.append({"role": role, "content": msg['content']})
    
    messages.append({"role": "user", "content": user_message})

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile", 
            temperature=0.5,
            max_tokens=1024,
        )
        
        reply = chat_completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({"reply": "**Error:** The health assistant is busy. Please try again later."})

if __name__ == '__main__':
    # Default port for Hugging Face Spaces
    app.run(host='0.0.0.0', port=7860)