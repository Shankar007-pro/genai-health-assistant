const messages = {  
  en: {
    loading: "Loading diagnosis...",
    error: "Error fetching diagnosis: ",
    diagnosis: "Diagnosis:",
    confidence: "Confidence:",
    drugInteraction: "Drug Interaction Alert:",
    dosage: "Dosage Recommendation:",
    referral: "Specialist Referral Advice:"
  },
  hi: {
    loading: "निदान लोड हो रहा है...",
    error: "निदान लाने में त्रुटि: ",
    diagnosis: "निदान:",
    confidence: "विश्वसनीयता:",
    drugInteraction: "दवा इंटरैक्शन चेतावनी:",
    dosage: "खुराक की सिफारिश:",
    referral: "विशेषज्ञ परामर्श सलाह:"
  },
  ta: { loading: "மருத்துவ ஆலோசனை ஏற்றப்படுகிறது...", error: "பிழை:", diagnosis: "மருத்துவ நிலை:", confidence: "நம்பகத்தன்மை:", drugInteraction: "மருந்து தொடர்பு எச்சரிக்கை:", dosage: "மருந்து பரிந்துரை:", referral: "தொகுதியியல் ஆலோசனை:" },
  te: { loading: "నిర్ధారణ లోడ్ అవుతోంది...", error: "లోపం:", diagnosis: "నిర్ధారణ:", confidence: "నమ్మకం:", drugInteraction: "మందుల పరస్పర చర్య హెచ్చరిక:", dosage: "మోతాదు సిఫార్సు:", referral: "నిపుణుల సూచన:" },
  bn: { loading: "রোগ নির্ণয় চলছে...", error: "ত্রুটি:", diagnosis: "রোগ নির্ণয়:", confidence: "বিশ্বাসযোগ্যতা:", drugInteraction: "ড্রাগ ইন্টারঅ্যাকশন সতর্কতা:", dosage: "ডোজ সুপারিশ:", referral: "বিশেষজ্ঞ পরামর্শ:" }
};

document.getElementById('diagnosisForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const symptoms = document.getElementById('symptoms').value.trim();
  const history = document.getElementById('history').value.trim();
  const vitals = parseFloat(document.getElementById('vitals').value);
  const language = document.getElementById('language').value;

  const msg = messages[language] || messages.en;
  const resultsDiv = document.getElementById('results');

  if (!symptoms) {
    resultsDiv.textContent = msg.error + "Symptoms are required.";
    return;
  }
  if (isNaN(vitals) || vitals < 30 || vitals > 45) {
    resultsDiv.textContent = msg.error + "Vital signs input is invalid.";
    return;
  }

  const payload = { symptoms, history, vitals, language };

  resultsDiv.textContent = msg.loading;

  try {
    // Replace with actual backend fetch call when ready
    const data = {
      diagnosis: "Common Cold",
      confidence: 88,
      drugInteractionAlert: "No known drug interactions.",
      dosageRecommendation: "Paracetamol 500mg every 6 hours.",
      referralAdvice: "No specialist referral required."
    };

    resultsDiv.innerHTML = `
      <h3>${msg.diagnosis}</h3><p>${data.diagnosis}</p>
      <h4>${msg.confidence}</h4><p>${data.confidence}%</p>
      <h4>${msg.drugInteraction}</h4><p>${data.drugInteractionAlert}</p>
      <h4>${msg.dosage}</h4><p>${data.dosageRecommendation}</p>
      <h4>${msg.referral}</h4><p>${data.referralAdvice}</p>
    `;
  } catch (err) {
    resultsDiv.textContent = msg.error + err.message;
  }
});
