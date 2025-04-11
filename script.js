const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const translateBtn = document.getElementById('translate-btn');
const speakBtn = document.getElementById('speak-btn');
const copyBtn = document.getElementById('copy-btn');
const apiStatus = document.getElementById('api-status');

let currentTranslation = '';

// EVENT
translateBtn.addEventListener('click', translateText);
speakBtn.addEventListener('click', speakText);
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputText.textContent)
        .then(() => showToast('Teks berhasil disalin!'))
        .catch(err => showToast('Gagal salin: ' + err));
});

// GOOGLE TRANSLATE API
async function translateText() {
    const text = inputText.value.trim();
    if (!text) return;

    outputText.textContent = 'Menerjemahkan...';

    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=ja&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();

        const translated = data[0].map(item => item[0]).join('');
        currentTranslation = translated;
        displayTranslation(translated);
        apiStatus.textContent = 'Status: Terhubung ke Google Translate API';
        apiStatus.style.color = 'green';
    } catch (err) {
        outputText.textContent = 'Terjadi kesalahan saat menerjemahkan.';
        apiStatus.textContent = 'Status: Gagal terhubung';
        apiStatus.style.color = 'red';
    }
}

// TAMPILKAN HASIL
function displayTranslation(text) {
    outputText.textContent = text;
}

// TEXT-TO-SPEECH
async function speakText() {
    if (!currentTranslation) return;

    const apiKey = 'sk_e206bf6ca42c5d7ca5ea4f41d8fff553347e0deef1743dfd'; 
    const voiceId = '8kS8nwk1TQdxvQOmfTZA';
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: currentTranslation,
                model_id: 'eleven_flash_v2_5',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });

        if (!response.ok) {
            throw new Error(`TTS API error: ${response.statusText}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    } catch (error) {
        console.error('Error generating speech:', error);
        showToast('Gagal menghasilkan suara.');
    }
}



// TOAST NOTIFIKASI
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// PHRASE BUTTONS
const phraseBtns = document.querySelectorAll('.phrase-btn');
phraseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        inputText.value = btn.dataset.phrase;
        translateText();
    });
});
