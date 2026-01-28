---
title: Aarogya AI
emoji: 🩺
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
---

# 🩺 Aarogya-AI: Rural Health Assistant

**Aarogya-AI** is a compassionate AI medical assistant designed for rural India, capable of understanding symptoms and providing health advice in multiple regional languages. It leverages high-speed inference to provide instant support for symptom checking, home remedies, and emergency guidance.

## 🚀 Live Demo

**[Click here to view the live app](https://shankar0747-aarogya-ai.hf.space/)**

## 🛠️ Tech Stack

* **Frontend:** React.js with Vite and Markdown rendering.
* **Backend:** Flask (Python) with Gunicorn for production.
* **AI Engine:** Groq SDK utilizing the **Llama-3.3-70B** model.
* **Deployment:** Dockerized on Hugging Face Spaces.

## ✨ Key Features

* **Multilingual Support:** Detects and responds in Hindi, Telugu, Tamil, and more.
* **Emergency Detection:** Instantly recognizes dangerous symptoms and urges professional medical help.
* **Markdown Support:** Provides clean, structured medical advice using diagnosis and remedy headers.
* **Optimized Performance:** Uses Groq Cloud for near-instant AI responses.

## 🔧 Deployment Instructions

To host this yourself on Hugging Face:

1. **Build the Frontend:** Run `npm run build` to generate the production folder.
2. **Dockerize:** Use the provided Dockerfile to bundle the Flask server and the React build.
3. **Configure Secrets:** Add your `GROQ_API_KEY` in the Hugging Face Space Settings.
4. **Port Mapping:** Ensure the container exposes port **7860**.

## 💻 How to Run Locally

Follow these steps to set up the development environment on your local machine.

### 1. Prerequisites

* **Python 3.9+** and **Node.js (LTS)** installed.
* A **Groq API Key**: Obtain one for free from the [GroqCloud Console](https://console.groq.com/).

### 2. Backend Setup (Flask)

1. Navigate to the backend directory:
```bash
cd backend

```


2. Create a virtual environment and activate it:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

```


3. Install the required Python packages:
```bash
pip install -r requirements.txt

```


4. Create a `.env` file in the `backend` folder and add your key:
```env
GROQ_API_KEY=your_actual_api_key_here

```


5. Start the Flask server:
```bash
python app.py

```


*The backend will now be running at `http://localhost:7860*`.

### 3. Frontend Setup (React)

1. Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend

```


2. Install the Node modules:
```bash
npm install

```


3. Start the React development server:
```bash
npm start

```


*The app will open automatically in your browser at `http://localhost:3000*`.

---

### **Project Architecture Overview**

* **Frontend-Backend Sync:** In the local environment, the React app communicates with the Flask server using **CORS** (Cross-Origin Resource Sharing).
* **Production vs. Local:** While the local setup uses `npm start`, your Hugging Face deployment uses `npm run build` to serve static files directly through Flask for better performance.
