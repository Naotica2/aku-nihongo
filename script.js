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
function speakText() {
    const files = [
        'sound/prank1.mp3',
        'sound/prank2.mp3',
        'sound/prank3.mp3'
    ];

    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFile = files[randomIndex];

    const audio = new Audio(randomFile);

    audio.addEventListener('error', (e) => {
        console.error(`Gagal memuat file audio: ${randomFile}`, e);
    });

    audio.play().catch((err) => {
        console.error('Gagal memutar audio:', err);
    });
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
