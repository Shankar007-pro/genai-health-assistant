import os
import google.generativeai as genai

# PASTE YOUR API KEY HERE
os.environ["GEMINI_API_KEY"] = "AIzaSyAUAcVRJZsuniSQUTPwReh08S1LutYCTJg"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

print("Checking available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")