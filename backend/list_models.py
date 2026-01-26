import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load your secret key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: API Key not found. Check your .env file.")
else:
    genai.configure(api_key=api_key)
    print("SEARCHING FOR AVAILABLE MODELS...\n")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"✅ Found: {m.name}")
    except Exception as e:
        print(f"❌ Error listing models: {e}")