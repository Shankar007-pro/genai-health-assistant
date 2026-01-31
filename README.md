---

```markdown
---
title: Aarogya AI
emoji: 🩺
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# 🩺 Aarogya-AI: Rural Health Assistant

**Aarogya-AI** is a compassionate, AI-powered medical assistant designed specifically for rural India. It bridges the gap in healthcare accessibility by understanding symptoms and providing guidance in multiple regional languages. 

> ⚠️ **MEDICAL DISCLAIMER:** > This application is for **informational purposes only**. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider. In case of an emergency, contact local emergency services immediately.

## 🚀 Live Demo
**[Interact with Aarogya-AI on Hugging Face](https://shankar0747-aarogya-ai-v2.hf.space/)**

## ✨ Key Features
* **Multimodal Interaction:** * 🎤 **Voice:** Speak your symptoms naturally using Whisper-powered transcription.
    * 📸 **Vision:** Upload images of skin conditions or symptoms for instant analysis.
* **Multilingual Support:** Intelligent detection and response in **Telugu, Hindi, Tamil, Kannada, and English**.
* **Emergency Detection:** Instantly identifies life-threatening symptoms and provides immediate red-alert warnings.
* **Markdown Reports:** Generates clean, structured advice including **Diagnosis**, **Home Remedies**, and **Generic Medicine** names.
* **Ultra-Fast Inference:** Powered by **Groq Cloud** for near-instant responses.

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite)
* **Backend:** Flask (Python) + Gunicorn
* **AI Models:** * Chat: `llama-3.3-70b-versatile`
    * Vision: `meta-llama/llama-4-scout-17b-16e-instruct`
    * Voice: `whisper-large-v3-turbo`
* **Containerization:** Docker

## 🔧 Environment Variables
To run this project, you need to add the following secret to your environment or Hugging Face Space:

| Key | Description |
| :--- | :--- |
| `GROQ_API_KEY` | Your API key from [GroqCloud Console](https://console.groq.com/) |

## 💻 Local Development

### 1. Prerequisites
* Python 3.10+
* Node.js 18+
* **FFmpeg** (Required for audio/voice processing)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
# Create .env and add: GROQ_API_KEY=your_key
python app.py

```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run build # For production testing
npm start     # For development

```

## 📦 Deployment Guide (Hugging Face)

This project is configured for **Docker SDK**. When you push to Hugging Face:

1. The `Dockerfile` builds the React frontend.
2. It installs `ffmpeg` and Python dependencies in a Linux container.
3. The Flask server serves the static React build on port **7860**.

**Quick Push Command (PowerShell):**
`git add . ; git commit -m "Update Aarogya-AI" ; git push origin main`

---

*Developed with ❤️ by **Shankar Reddy** - Specialized in AI & ML*

```

---

**Would you like me to also generate a `.dockerignore` file to make your future uploads even faster by skipping unnecessary files?**

```
