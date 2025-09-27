document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('diagnosisForm');
  const symptomsInput = document.getElementById('symptoms');
  const historyInput = document.getElementById('history');
  const vitalsInput = document.getElementById('vitals');
  const languageSelect = document.getElementById('language');
  const resultsSection = document.getElementById('results');
  const validationErrors = document.getElementById('validationErrors');
  const submitButton = form.querySelector('button[type="submit"]');

  async function sendDiagnosisRequest(data) {
    try {
      const response = await fetch("http://localhost:5000/diagnose", {
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

  function displayResults({ diagnosis, confidence, extracted_diseases }) {
    resultsSection.innerHTML = `
      <h2>Diagnosis Results</h2>
      <p><strong>Extracted Diseases:</strong> ${extracted_diseases.length ? extracted_diseases.join(', ') : 'None found'}</p>
      <p><strong>Diagnosis:</strong> ${diagnosis}</p>
      <p><strong>Confidence Score:</strong> ${confidence !== null ? (confidence * 100).toFixed(1) + '%' : 'N/A'}</p>
    `;
    resultsSection.focus();
  }

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

    const data = {
      symptoms: symptomsInput.value.trim(),
      history: historyInput.value.trim(),
      vitals: vitalsInput.value.trim(),
      language: languageSelect.value
    };

    resultsSection.textContent = 'Diagnosing... Please wait.';

    try {
      const result = await sendDiagnosisRequest(data);
      displayResults(result);
    } catch (error) {
      resultsSection.textContent = 'Error: ' + error.message;
    } finally {
      submitButton.removeAttribute('aria-busy');
      submitButton.disabled = false;
    }
  });
});
