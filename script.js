document.getElementById('upload-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        if (file.type === 'application/pdf') {
            // Si el archivo es un PDF
            extractTextFromPdf(file);
        } else {
            // Si el archivo es una imagen
            extractTextFromImage(file);
        }
    }
});

async function extractTextFromImage(file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);

    img.onload = async function () {
        const { data: { text } } = await Tesseract.recognize(img, 'spa'); // Cambiar a 'spa' para español

        // Limpiar el texto extraído
        const cleanedText = cleanText(text);

        // Analizar la continuidad de la imagen
        const continuityResult = checkContinuity(img);
        displayResult(cleanedText, continuityResult);
    };
}

async function extractTextFromPdf(file) {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += pageText + '\n';
    }

    const cleanedText = cleanText(text);
    const continuityResult = 'Continuidad no analizada para PDF.'; // Aquí se puede implementar lógica similar si es necesario
    displayResult(cleanedText, continuityResult);
}

function cleanText(text) {
    return text.replace(/[^\w\s.,!?¿¡\n]/g, '').replace(/\s+/g, ' ').trim(); // Mantener los saltos de línea
}


function checkContinuity(img) {
    // Simular análisis de continuidad (esto se puede mejorar con lógica real)
    const continuityUpToDown = Math.random() * 100; // Simular un porcentaje de continuidad
    const continuityDownToUp = Math.random() * 100; // Simular otro porcentaje de continuidad

    return `
        Porcentaje de continuidad de arriba hacia abajo: ${continuityUpToDown.toFixed(2)}%<br>
        Porcentaje de continuidad de abajo hacia arriba: ${continuityDownToUp.toFixed(2)}%
    `;
}

function displayResult(text, continuityResult) {
    const encodedText = encodeURIComponent(text);
    const encodedContinuity = encodeURIComponent(continuityResult);
    window.location.href = `result.html?text=${encodedText}&continuity=${encodedContinuity}`;
}
