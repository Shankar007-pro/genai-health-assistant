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

---

## 💻 How to Run Locally

### 1. Prerequisites

* **Python 3.9+** and **Node.js** installed.
* A **Groq API Key** (Get it from [GroqCloud](https://console.groq.com/)).

### 2. Backend Setup

1. Navigate to the `backend` folder.
2. Create a `.env` file and add: `GROQ_API_KEY=your_key_here`.
3. Install dependencies:
```bash
pip install -r requirements.txt

```


4. Start the Flask server:
```bash
python app.py

```



### 3. Frontend Setup

1. Navigate to the `frontend` folder.
2. Install dependencies:
```bash
npm install

```


3. Run the development server:
```bash
npm start

```
