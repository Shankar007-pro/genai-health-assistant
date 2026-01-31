
---
title: Aarogya AI
emoji: 🩺
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# 🩺 Aarogya-AI: Intelligent Rural Health Assistant

**Aarogya-AI** is a multimodal, multilingual AI assistant specifically engineered to bridge the healthcare gap in rural India. By utilizing state-of-the-art Large Language Models (LLMs), it provides instant symptom analysis, home remedies, and emergency guidance in regional languages.

> ⚠️ **IMPORTANT MEDICAL DISCLAIMER:**
> This application is an AI-powered informational tool and **not** a substitute for professional medical advice, diagnosis, or treatment. It does not provide clinical diagnoses. Always consult a qualified healthcare provider for medical concerns. **In emergencies, contact local medical services immediately.**

## 🚀 Live Deployment
**[Access the Live Interface on Hugging Face](https://shankar0747-aarogya-ai-v2.hf.space/)**

## ✨ Key Capabilities
* **Multimodal Diagnosis Support:**
    * 🎤 **Voice:** Natural language symptom reporting via Whisper-powered transcription.
    * 📸 **Vision:** Analysis of skin conditions or physical symptoms using Llama 4 Vision.
* **Native Multilingual Engine:** Intelligent support for **Telugu, Hindi, Tamil, Kannada, and English**.
* **Emergency Triaging:** Real-time detection of high-risk symptoms (e.g., respiratory distress, cardiac pain) with immediate escalation warnings.
* **Structured Clinical Guidance:** Outputs formatted in Markdown with specific sections for **Possible Condition**, **Recommended Care**, and **Generic Medications**.

## 🛠️ Technical Architecture
* **Frontend:** React.js (Vite) with Markdown processing.
* **Backend:** Flask (Python) served via Gunicorn.
* **AI Model Pipeline (Groq Inference):**
    * **Chat/Reasoning:** `llama-3.3-70b-versatile`
    * **Visual Analysis:** `meta-llama/llama-4-scout-17b-16e-instruct`
    * **Speech-to-Text:** `whisper-large-v3-turbo`
* **Infrastructure:** Containerized via Docker.


## 💻 Local Development Environment

### Prerequisites
* Python 3.10+
* Node.js 18+
* **FFmpeg** (System-level requirement for audio processing)

### Backend Setup
```bash
cd backend
python -m venv venv
# Activate: .\venv\Scripts\activate (Windows) or source venv/bin/activate (Unix)
pip install -r requirements.txt
# Configure .env with GROQ_API_KEY
python app.py

```

### Frontend Setup

```bash
cd frontend
npm install
npm start

```

## 📦 Deployment Configuration

This repository is optimized for **Hugging Face Spaces (Docker SDK)**.

The `Dockerfile` handles the multi-stage build process:

1. Compiles the React production build.
2. Initializes a Python environment with `FFmpeg`.
3. Exposes port **7860** for the Gunicorn gateway.

---

*Developed with ❤️ by [Shankar Reddy**](https://www.google.com/search?q=https://github.com/Shankar007-pro) *Specializing in Computer Science (AI & ML) at SVCET*

```
