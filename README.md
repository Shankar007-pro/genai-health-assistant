# genai-health-assistant
GenAI-powered medical assistant for rural India, aiding diagnosis via symptoms, history, and vitals. Provides differential diagnoses, treatment protocols, specialist referrals. Supports Hindi, Tamil, Telugu, Bengali, offers drug alerts, dosage guidance, offline use, and patient privacy compliance.
## Project Overview

This project implements a Generative AI-powered medical diagnosis assistant tailored for rural healthcare centers and primary health clinics in India. It empowers healthcare workers and doctors to diagnose common diseases by analyzing patient symptoms, medical history, and vital signs, supporting multilingual interaction and offline usage in low-connectivity environments.

---

## Key Features

- AI-driven symptom checker and differential diagnosis with confidence scores using OpenAI GPT-4  
- Biomedical Named Entity Recognition for accurate extraction of diseases and symptoms using Hugging Face BioBERT  
- Multilingual input/output support: Hindi, Tamil, Telugu, Bengali  
- Drug interaction alerts and dosage recommendations based on patient demographics  
- Local data storage via SQLite ensuring patient privacy and offline functionality  
- Integration with India’s healthcare protocols and rural health issue knowledge base  
- Designed for offline operation after initial setup, suitable for low-resource settings  

---

## Technologies Used

| Component             | Technology/Library       | Description                             |
|-----------------------|-------------------------|-----------------------------------------|
| AI Models             | OpenAI GPT-4,           |  Diagnosis generati on, biomedical NLP   |
| Backend Framework     | Flask / FastAPI           | API development and AI model integration |
| Frontend Framework    | HTML/CSS/JavaScript | User interface providing multilingual support |
| Database              | SQLite                   | Local patient data storage              |
| Languages              | Python, JavaScript        | Backend and frontend development         |
| Libraries              | transformers, torch, openai, flask, react | Model inference, API, UI components    |

---

## Setup Guide

### Prerequisites

- Python 3.8+ installed  
- Node.js and npm (for frontend React app)  
- OpenAI account and API key for GPT-4 access  
- Internet access for initial package/model downloads and API calls  

### Backend Setup

1. Clone the repository and navigate to the backend folder.

2. Create and activate a Python virtual environment:

python -m venv venv
source venv/bin/activate # Linux/Mac
venv\Scripts\activate # Windows

text

3. Install backend dependencies:

pip install flask openai transformers torch sqlite3

text

4. Insert your OpenAI GPT-4 API key in `app.py`:

openai.api_key = "YOUR_OPENAI_API_KEY"

text

5. Run the backend server:

python app.py

text

### Frontend Setup

1. Navigate to the frontend folder.

2. Install dependencies:

npm install

text

3. Start the frontend dev server:

npm start

text

4. The frontend will communicate with the backend API at `http://localhost:5000`.

---

## Usage Instructions

- Use the frontend interface or API to input patient symptoms, history, and vitals in supported Indian languages.  
- The system analyzes inputs, extracts key biomedical entities, and calls GPT-4 for comprehensive diagnosis.  
- Results include differential diagnoses, confidence scores, treatment guidance, drug safety alerts, and referral recommendations.  
- Patient data is saved locally with encryption options for privacy compliance.  

---

## Important Notes

- PyTorch must be installed for Hugging Face model loading:

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

text

- GPT-4 API calls require billing-enabled OpenAI account and internet. Offline diagnosis fallback with BioBERT is in place.  
- Multilingual support leverages transliteration libraries and custom text processing modules.  
- Designed for scalability and ease of deployment in rural environments with intermittent internet access.  

---

## Project Structure Overview

root/
│
├── backend/
│ ├── app.py # Flask backend with AI integration
│ ├── patients.db # SQLite database
│ └── requirements.txt # Backend dependencies
│
├── frontend/
│ ├── public/ # Static files
│ ├── src/
│ │ ├── components/ # React components for UI
│ │ └── App.js # Main app file
│ ├── package.json # Frontend dependencies
│ └── README.md # Frontend-specific README
│
└── README.md # Project-level documentation and guidelines

text

---

## Future Enhancements

- Advanced drug interaction and personalized dosage algorithms  
- Enhanced voice input/output system for low-literacy users  
- Secure authentication and audit trails for patient data  
- Integration with portable medical devices for real-time vitals input  
- Continuous learning to update rural disease database dynamically  

