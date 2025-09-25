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
  ta: {
    loading: "மருத்துவ ஆலோசனை ஏற்றப்படுகிறது...",
    error: "பிழை: ",
    diagnosis: "மருத்துவ நிலை:",
    confidence: "நம்பகத்தன்மை:",
    drugInteraction: "மருந்து தொடர்பு எச்சரிக்கை:",
    dosage: "மருந்து பரிந்துரை:",
    referral: "தொகுதியியல் ஆலோசனை:"
  },
  te: {
    loading: "నిర్ధారణ లోడ్ అవుతోంది...",
    error: "లోపం: ",
    diagnosis: "నిర్ధారణ:",
    confidence: "నమ్మకం:",
    drugInteraction: "మందుల పరస్పర చర్య హెచ్చరిక:",
    dosage: "మోతాదు సిఫార్సు:",
    referral: "నిపుణుల సూచన:"
  },
  bn: {
    loading: "রোগ নির্ণয় চলছে...",
    error: "ত্রুটি: ",
    diagnosis: "রোগ নির্ণয়:",
    confidence: "বিশ্বাসযোগ্যতা:",
    drugInteraction: "ড্রাগ ইন্টারঅ্যাকশন সতর্কতা:",
    dosage: "ডোজ সুপারিশ:",
    referral: "বিশেষজ্ঞ পরামর্শ:"
  }
};

const diagnosisForm = document.getElementById('diagnosisForm');
const resultsDiv = document.getElementById('results');

diagnosisForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const symptoms = document.getElementById('symptoms').value.trim();
  const history = document.getElementById('history').value.trim();
  const vitals = parseFloat(document.getElementById('vitals').value);
  const language = document.getElementById('language').value;
  const msg = messages[language] || messages.en;


  resultsDiv.innerHTML = '';

  if (!symptoms) {
    resultsDiv.textContent = msg.error + "Symptoms are required.";
    resultsDiv.style.color = '#e53935';
    return;
  }
  if (isNaN(vitals) || vitals < 30 || vitals > 45) {
    resultsDiv.textContent = msg.error + "Vital signs input is invalid.";
    resultsDiv.style.color = '#e53935';
    return;
  }

  resultsDiv.style.color = '#0057d9';
  resultsDiv.innerHTML = `<span>${msg.loading}</span><span class="loading-spinner" aria-hidden="true"></span>`;

  const payload = { symptoms, history, vitals, language };

  try {
    const response = await fetch('http://127.0.0.1:5000/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: (new AbortController()).signal, // Add abort control if needed
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();

    resultsDiv.innerHTML = `
      <h3>${msg.diagnosis}</h3><p>${escapeHtml(data.diagnosis)}</p>
      <h4>${msg.confidence}</h4><p>${escapeHtml(data.confidence)}%</p>
      <h4>${msg.drugInteraction}</h4><p>${escapeHtml(data.drugInteractionAlert || 'None')}</p>
      <h4>${msg.dosage}</h4><p>${escapeHtml(data.dosageRecommendation || 'Standard dosage applies')}</p>
      <h4>${msg.referral}</h4><p>${escapeHtml(data.referralAdvice || 'No referral needed')}</p>
    `;
    resultsDiv.style.color = '#263238';
  } catch (err) {
    resultsDiv.textContent = msg.error + err.message;
    resultsDiv.style.color = '#e53935';
  }
});

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function (match) {
    switch (match) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
    }
  });
}
