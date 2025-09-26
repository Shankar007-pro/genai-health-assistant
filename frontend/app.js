document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('diagnosisForm');
  const symptomsInput = document.getElementById('symptoms');
  const historyInput = document.getElementById('history');
  const vitalsInput = document.getElementById('vitals');
  const languageSelect = document.getElementById('language');
  const resultsSection = document.getElementById('results');
  const validationErrors = document.getElementById('validationErrors');
  const submitButton = form.querySelector('button[type="submit"]');

  // Simple client-side validation rules
  function validateForm() {
    let errors = [];
    // Trim inputs
    const symptoms = symptomsInput.value.trim();
    const vitals = vitalsInput.value.trim();

    if (!symptoms) errors.push('Symptoms are required.');
    if (!vitals) {
      errors.push('Vital temperature is required.');
    } else {
      const v = parseFloat(vitals);
      if (isNaN(v) || v < 30 || v > 45) {
        errors.push('Vital temperature must be between 30.0 and 45.0 °C.');
      }
    }
    return errors;
  }

  // Simulated async diagnosis logic
  function diagnose(symptoms, history, vitals, language) {
    // Mock diagnosis results with confidence, treatment, drug alerts, referral
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic mock logic for demo
        let diagnosis = "Common Cold";
        let confidence = 0.85;
        let treatment = [
          "Rest and hydration",
          "Over-the-counter cold medications",
          "Warm fluids like soup or tea"
        ];
        let drugAlert = "No known drug interactions.";
        let referral = null;

        // Modifier based on temp
        if (vitals > 38) {
          diagnosis = "Flu or Viral Infection";
          confidence = 0.92;
          treatment.push("Consult doctor if symptoms worsen after 3 days.");
          drugAlert = "Avoid NSAIDs if allergy present.";
          referral = "Nearest primary healthcare clinic recommended.";
        }

        // Localization stub (real translation would happen server-side or via library)
        if (language !== 'en') {
          diagnosis = translateMock(diagnosis, language);
          treatment = treatment.map(t => translateMock(t, language));
          drugAlert = translateMock(drugAlert, language);
          referral = referral ? translateMock(referral, language) : null;
        }

        resolve({
          diagnosis,
          confidence,
          treatment,
          drugAlert,
          referral
        });
      }, 2000);
    });
  }

  // Mock translation function for demo purposes
  function translateMock(text, lang) {
    const translations = {
      hi: {
        "Common Cold": "साधारण जुकाम",
        "Flu or Viral Infection": "फ्लू या वायरल संक्रमण",
        "Rest and hydration": "आराम और जलोजन",
        "Over-the-counter cold medications": "ओवर-द-काउंटर सर्दी की दवाएं",
        "Warm fluids like soup or tea": "गर्म तरल जैसे सूप या चाय",
        "Consult doctor if symptoms worsen after 3 days.": "यदि लक्षण 3 दिन बाद बिगड़ें तो डॉक्टर से परामर्श करें।",
        "No known drug interactions.": "कोई ज्ञात दवा अंतःक्रिया नहीं।",
        "Avoid NSAIDs if allergy present.": "एलर्जी होने पर NSAIDs से बचें।",
        "Nearest primary healthcare clinic recommended.": "निकटतम प्राथमिक स्वास्थ्य केंद्र की सलाह दी जाती है।"
      },
      ta: {
        "Common Cold": "சாதாரண நுரையீரல் வழக்கம்",
        "Flu or Viral Infection": "காய்ச்சல் அல்லது வைரல் தொற்று",
        "Rest and hydration": "உறக்கம் மற்றும் நீர்சத்து",
        "Over-the-counter cold medications": "மருந்து மருந்துகள்",
        "Warm fluids like soup or tea": "வெப்பமான திரவங்கள் போன்ற சூப் அல்லது தேநீர்",
        "Consult doctor if symptoms worsen after 3 days.": "3 நாட்களுக்கு பின்னர் அறிகுறிகள் மோசமாயின் மருத்துவரை அணுகவும்.",
        "No known drug interactions.": "பெறப்பட்ட மருந்து ஊடுருவல்கள் இல்லை.",
        "Avoid NSAIDs if allergy present.": "ஆலர்ஜி இருந்தால் NSAIDs தவிர்க்கவும்.",
        "Nearest primary healthcare clinic recommended.": "அருகில் உள்ள சுகாதார மையத்தை பரிந்துரைக்கப்படுகிறது."
      },
      te: {
        "Common Cold": "సాధారణ జలుబు",
        "Flu or Viral Infection": "ఫ్లూ లేదా వైరల్ ఇస్తాపం",
        "Rest and hydration": "విశ్రాంతి మరియు హైడ్రేషన్",
        "Over-the-counter cold medications": "మందుల కోసం మందులు",
        "Warm fluids like soup or tea": "వెడల ద్రవాలు ఎలాంటివి సూప్ లేదా టీ",
        "Consult doctor if symptoms worsen after 3 days.": "3 రోజుల తర్వాత లక్షణాలు పెరిగితే వైద్యుని సంప్రదించండి.",
        "No known drug interactions.": "తెలియని మందుల పరస్పర చర్యలు లేవు.",
        "Avoid NSAIDs if allergy present.": "అలర్జి ఉంటే NSAIDs నివారించాలి.",
        "Nearest primary healthcare clinic recommended.": "సమీప ప్రాథమిక ఆరోగ్య కేంద్రం సిఫార్సు చేయబడింది."
      },
      bn: {
        "Common Cold": "সাধারণ সর্দি",
        "Flu or Viral Infection": "ফ্লু বা ভাইরাল সংক্রমণ",
        "Rest and hydration": "বিশ্রাম এবং হাইড্রেশন",
        "Over-the-counter cold medications": "ওভার-দ্যা-কাউন্টার ঠান্ডাজনিত ওষুধ",
        "Warm fluids like soup or tea": "গরম তরল যেমন স্যুপ বা চা",
        "Consult doctor if symptoms worsen after 3 days.": "3 দিনের মধ্যে লক্ষণ খারাপ হলে ডাক্তারের পরামর্শ নিন।",
        "No known drug interactions.": "কোনও পরিচিত ওষুধ প্রতিক্রিয়া নেই।",
        "Avoid NSAIDs if allergy present.": "এলার্জি থাকলে NSAIDs এড়িয়ে চলুন।",
        "Nearest primary healthcare clinic recommended.": "নিকটস্থ প্রাথমিক স্বাস্থ্যকেন্দ্র সুপারিশ করা হয়।"
      }
    };
    return translations[lang]?.[text] || text;
  }

  // Display error messages
  function showValidationErrors(errors) {
    validationErrors.innerHTML = '';
    if (errors.length) {
      const ul = document.createElement('ul');
      errors.forEach(e => {
        const li = document.createElement('li');
        li.textContent = e;
        ul.appendChild(li);
      });
      validationErrors.appendChild(ul);
      return true;
    }
    return false;
  }

  // Render diagnosis results
  function displayResults({ diagnosis, confidence, treatment, drugAlert, referral }) {
    resultsSection.innerHTML = `
      <h2>Diagnosis Results</h2>
      <p><strong>Diagnosis:</strong> ${diagnosis}</p>
      <p><strong>Confidence Score:</strong> ${(confidence * 100).toFixed(1)}%</p>
      <p><strong>Treatment Suggestions:</strong></p>
      <ul>${treatment.map(t => `<li>${t}</li>`).join('')}</ul>
      <p><strong>Drug Interaction Alert:</strong> ${drugAlert}</p>
      ${referral ? `<p><strong>Referral Recommendation:</strong> ${referral}</p>` : ''}
    `;
    resultsSection.focus();
  }

  // Clear previous results and errors
  function clearFeedback() {
    validationErrors.innerHTML = '';
    resultsSection.innerHTML = '';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearFeedback();
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.disabled = true;

    const errors = validateForm();
    if (showValidationErrors(errors)) {
      submitButton.removeAttribute('aria-busy');
      submitButton.disabled = false;
      return;
    }

    const symptoms = symptomsInput.value.trim();
    const history = historyInput.value.trim();
    const vitals = parseFloat(vitalsInput.value.trim());
    const language = languageSelect.value;

    resultsSection.textContent = 'Diagnosing... Please wait.';
    
    try {
      const results = await diagnose(symptoms, history, vitals, language);
      displayResults(results);
    } catch (error) {
      resultsSection.textContent = 'An error occurred during diagnosis. Please try again.';
    } finally {
      submitButton.removeAttribute('aria-busy');
      submitButton.disabled = false;
    }
  });
});
