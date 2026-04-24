const BACKEND_URL = '';

const form = document.getElementById('lookup-form');
const plateInput = document.getElementById('plate-input');
const resultBox = document.getElementById('result');

function renderMessage(text, isError = false) {
  resultBox.textContent = text;
  resultBox.className = isError ? 'result error' : 'result success';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const plate = plateInput.value.trim();

  if (!plate) {
    renderMessage('Kérjük, add meg a rendszámot.', true);
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/lookup?plate=${encodeURIComponent(plate)}`);
    const data = await response.json();

    if (!response.ok) {
      renderMessage(data.message || 'Hiba történt a lekérdezés során.', true);
      return;
    }

    renderMessage(`Rendszám: ${data.plate} – Tulajdonos: ${data.owner}`);
  } catch (error) {
    renderMessage('Nem sikerült kapcsolódni a backendhez.', true);
  }
});
