window.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('audioFile');
    const fileNameDisplay = document.getElementById('fileName');
    const form = document.getElementById('uploadForm');
    const loading = document.getElementById('loading');
    const resultContainer = document.getElementById('resultContainer');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const dropZone = document.getElementById('uploadForm');

    // Drag and Drop funcional e visual
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('border-purple-500', 'bg-purple-50/30');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-purple-500', 'bg-purple-50/30');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt.files.length > 0) {
            fileInput.files = dt.files;
            updateFileName(dt.files[0].name);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            updateFileName(fileInput.files[0].name);
        }
    });

    function updateFileName(name) {
        fileNameDisplay.textContent = `Arquivo Selecionado: ${name}`;
        fileNameDisplay.className = "text-sm text-purple-600 font-bold block mt-2";
    }

    // Comunicação AJAX com o Flask Backend
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (fileInput.files.length === 0) return;

        const formData = new FormData();
        formData.append('audio', fileInput.files[0]);

        loading.classList.remove('hidden');
        resultContainer.classList.add('hidden');

        try {
            const response = await fetch('/transcrever', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                resultText.value = data.text || "O áudio foi processado com sucesso, mas nenhum texto foi gerado.";
                resultContainer.classList.remove('hidden');
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(data.error || 'Ocorreu um erro ao processar o áudio.');
            }
        } catch (error) {
            alert('Erro ao se conectar ao servidor Python.');
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Copiar Texto para Área de Transferência
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultText.value);
        copyBtn.textContent = "✅ Copiado!";
        setTimeout(() => copyBtn.textContent = "📋 Copiar", 2000);
    });

    // Baixar arquivo de texto compilado .TXT
    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([resultText.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcricao-mamaudio.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
});
