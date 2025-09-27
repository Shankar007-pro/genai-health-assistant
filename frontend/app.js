document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('diagnosisForm');
  const symptomsInput = document.getElementById('symptoms');
  const historyInput = document.getElementById('history');
  const vitalsInput = document.getElementById('vitals');
  const languageSelect = document.getElementById('language');
  const resultsSection = document.getElementById('results');
  const validationErrors = document.getElementById('validationErrors');
  const submitButton = form.querySelector('button[type="submit"]');

  // Sends JSON POST request to Flask backend API /diagnose
  async function sendDiagnosisRequest(data) {
    try {
      const response = await fetch("http://localhost:5000/diagnose", { // Adjust URL for deployment
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server error");
      }
      return await response.json();
    } catch (error) {
      console.error("Error contacting backend:", error);
      throw error;
    }
  }

  // Form validation function
  function validateForm() {
    let errors = [];
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

  // Display validation errors in the UI
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

  // Display diagnosis results in the UI with translation markup for supported languages
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

  // Clear error messages and results area
  function clearFeedback() {
    validationErrors.innerHTML = '';
    resultsSection.innerHTML = '';
  }

  // Translation dictionary with [translate:] markup for native scripts
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
      bn: {
        "Common Cold": "[translate:সাধারণ সর্দি]",
        "Flu or Viral Infection": "[translate:ফ্লু বা ভাইরাল সংক্রমণ]",
        "Rest and hydration": "[translate:বিশ্রাম এবং জলের যোগান]",
        "Over-the-counter cold medications": "[translate:ওভার-দ্যা-কাউন্টার ঠান্ডাজনিত ওষুধ]",
        "Warm fluids like soup or tea": "[translate:গরম তরল যেমন স্যুপ বা চা]",
        "Consult doctor if symptoms worsen after 3 days.": "[translate:৩ দিনের মধ্যে লক্ষণ খারাপ হলে ডাক্তারকে দেখান]",
        "No known drug interactions.": "[translate:কোনো পরিচিত ওষুধের পারস্পরিক ক্রিয়া নেই]",
        "Avoid NSAIDs if allergy present.": "[translate:এলার্জি থাকলে NSAIDs এড়িয়ে চলুন]",
        "Nearest primary healthcare clinic recommended.": "[translate:নিকটস্থ প্রাথমিক স্বাস্থ্য কেন্দ্রের পরামর্শ দিন]"
      },
      te: {
        "Common Cold": "[translate:సాధారణ జలుబు]",
        "Flu or Viral Infection": "[translate:ఫ్లూ లేదా వైరల్ ఇన్ఫెక్షన్]",
        "Rest and hydration": "[translate:విశ్రాంతి మరియు తాగునీటి సమర్థత]",
        "Over-the-counter cold medications": "[translate:ఓవర్-ది-కౌంటర్ శీతల మందులు]",
        "Warm fluids like soup or tea": "[translate:సూప్ లేదా టీ వంటి వేడి ద్రవాలు]",
        "Consult doctor if symptoms worsen after 3 days.": "[translate:3 రోజుల తర్వాత లక్షణాలు పెరగితే డాక్టర్‌ను సంప్రదించండి]",
        "No known drug interactions.": "[translate:తెలియని మందుల పరస్పర చర్యలు లేవు]",
        "Avoid NSAIDs if allergy present.": "[translate:అలర్జీ ఉన్నప్పుడు NSAIDs నివారించండి]",
        "Nearest primary healthcare clinic recommended.": "[translate:సమీప ప్రాధమిక ఆరోగ్య కేంద్రాన్ని సిఫార్సు చేయబడింది]"
      },
      ta: {
        "Common Cold": "[translate:பொதுவான காய்ச்சல்]",
        "Flu or Viral Infection": "[translate:நுரையீரல் காய்ச்சல் அல்லது வைரல் தொற்று]",
        "Rest and hydration": "[translate:ஓய்வு மற்றும் திரவபானங்கள்]",
        "Over-the-counter cold medications": "[translate:மருந்துக் கடையில் கிடைக்கும் குளிர்ச்சியூட்டும் மருந்துகள்]",
        "Warm fluids like soup or tea": "[translate:சூப் அல்லது தேநீர் போன்ற சூடு திரவங்கள்]",
        "Consult doctor if symptoms worsen after 3 days.": "[translate:3 நாட்களுக்கு பிறகு அறிகுறிகள் மோசமாக இருந்தால் மருத்துவரை அணுகவும்]",
        "No known drug interactions.": "[translate:பரிமாற்றங்கள் இல்லை என்று தெரிகிறது]",
        "Avoid NSAIDs if allergy present.": "[translate:அலெர்ஜி இருந்தால் NSAIDs தவிர்க்கவும்]",
        "Nearest primary healthcare clinic recommended.": "[translate:அருகிலுள்ள ஆரம்ப சுகாதார நிலையம் பரிந்துரைக்கப்படுகிறது]"
      }
    };
     
    return translations[lang]?.[text] || text;
  }

  // Fallback mock diagnosis for offline/demo mode
  function mockDiagnose(symptoms, history, vitals, language) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let diagnosis = "Common Cold";
        let confidence = 0.85;
        let treatment = [
          "Rest and hydration",
          "Over-the-counter cold medications",
          "Warm fluids like soup or tea"
        ];
        let drugAlert = "No known drug interactions.";
        let referral = null;

        if (vitals > 38) {
          diagnosis = "Flu or Viral Infection";
          confidence = 0.92;
          treatment.push("Consult doctor if symptoms worsen after 3 days.");
          drugAlert = "Avoid NSAIDs if allergy present.";
          referral = "Nearest primary healthcare clinic recommended.";
        }

        if (language !== 'en') {
          diagnosis = translateMock(diagnosis, language);
          treatment = treatment.map(t => translateMock(t, language));
          drugAlert = translateMock(drugAlert, language);
          referral = referral ? translateMock(referral, language) : null;
        }

        resolve({ diagnosis, confidence, treatment, drugAlert, referral });
      }, 1500);
    });
  }

  // Submit handler for form
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

    const data = {
      symptoms: symptomsInput.value.trim(),
      history: historyInput.value.trim(),
      vitals: parseFloat(vitalsInput.value.trim()),
      language: languageSelect.value
    };

    resultsSection.textContent = 'Diagnosing... Please wait.';

    try {
      // Call backend API
      const result = await sendDiagnosisRequest(data);
      displayResults(result);
    } catch (error) {
      console.warn("Backend call failed, using mock:", error);
      // Fallback to mock diagnosis on failure
      const mockResult = await mockDiagnose(data.symptoms, data.history, data.vitals, data.language);
      displayResults(mockResult);
    } finally {
      submitButton.removeAttribute('aria-busy');
      submitButton.disabled = false;
    }
  });
});
