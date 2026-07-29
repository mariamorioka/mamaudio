import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0';

let transcriber = null;

const btnTranscrever = document.getElementById('btn-transcrever');
const dropzone = document.getElementById('dropzone');

// 1. Carregar o modelo Whisper em segundo plano ao abrir o site
async function carregarModelo() {
    try {
        if (btnTranscrever) {
            btnTranscrever.innerHTML = `<span>Carregando IA...</span>`;
            btnTranscrever.disabled = true;
        }

        // Carrega o modelo whisper-tiny otimizado para navegador
        transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');

        if (btnTranscrever) {
            btnTranscrever.innerHTML = `<span>INICIAR TRANSCRIÇÃO</span> <i class="fa-solid fa-arrow-right"></i>`;
            btnTranscrever.disabled = false;
        }
        console.log("Modelo de IA carregado com sucesso no navegador!");
    } catch (error) {
        console.error("Erro ao carregar o modelo:", error);
        if (btnTranscrever) {
            btnTranscrever.innerHTML = `<span>Erro ao carregar IA</span>`;
        }
    }
}

carregarModelo();

// 2. Manipular o upload do arquivo de áudio
let arquivoAudioSelecionado = null;

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'audio/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

dropzone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        arquivoAudioSelecionado = file;
        const titleEl = dropzone.querySelector('.dropzone-title');
        if (titleEl) {
            titleEl.innerHTML = `Arquivo selecionado: <strong>${file.name}</strong>`;
        }
    }
});

// 3. Executar a transcrição ao clicar no botão
btnTranscrever.addEventListener('click', async () => {
    if (!arquivoAudioSelecionado) {
        alert('Por favor, selecione um arquivo de áudio primeiro.');
        return;
    }

    if (!transcriber) {
        alert('O modelo de IA ainda está carregando. Aguarde um instante.');
        return;
    }

    try {
        btnTranscrever.innerHTML = `<span>Transcrevendo áudio...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        btnTranscrever.disabled = true;

        const audioURL = URL.createObjectURL(arquivoAudioSelecionado);
        const resultado = await transcriber(audioURL);

        // Criar ou atualizar a caixa de resultado na tela
        let resultadoBox = document.getElementById('resultado-transcricao');
        if (!resultadoBox) {
            resultadoBox = document.createElement('div');
            resultadoBox.id = 'resultado-transcricao';
            resultadoBox.style.cssText = "margin-top: 20px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: left;";
            dropzone.parentNode.appendChild(resultadoBox);
        }

        resultadoBox.innerHTML = `
            <h3 style="color: #0f172a; margin-bottom: 10px; font-size: 1.1rem;"><i class="fa-solid fa-file-lines"></i> Resultado da Transcrição:</h3>
            <p style="color: #334155; line-height: 1.6; font-size: 1rem; white-space: pre-wrap;">${resultado.text}</p>
        `;

        btnTranscrever.innerHTML = `<span>INICIAR TRANSCRIÇÃO</span> <i class="fa-solid fa-arrow-right"></i>`;
        btnTranscrever.disabled = false;

    } catch (error) {
        console.error("Erro na transcrição:", error);
        alert("Ocorreu um erro ao processar o áudio.");
        btnTranscrever.innerHTML = `<span>INICIAR TRANSCRIÇÃO</span> <i class="fa-solid fa-arrow-right"></i>`;
        btnTranscrever.disabled = false;
    }
});