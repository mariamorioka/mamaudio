import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0';

let transcriber = null;

const btnTranscrever = document.getElementById('btn-transcrever');
const dropzone = document.getElementById('dropzone');
const statusIA = document.getElementById('status-ia');
const resultadoContainer = document.getElementById('resultado-container');
const resultadoTexto = document.getElementById('resultado-transcricao');
const btnCopiar = document.getElementById('btn-copiar');

// 1. Carregar o modelo Whisper
async function carregarModelo() {
    try {
        if (statusIA) statusIA.innerText = "O navegador está baixando a Inteligência Artificial (isso ocorre apenas na primeira vez). Aguarde...";
        if (btnTranscrever) {
            btnTranscrever.innerText = "CARREGANDO IA...";
            btnTranscrever.disabled = true;
        }

        // Usamos o modelo whisper-tiny otimizado para navegador
        transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
            device: 'wasm' // Força o uso de WebAssembly para compatibilidade
        });

        if (statusIA) statusIA.innerText = "IA carregada e pronta! Selecione o áudio.";
        if (btnTranscrever) {
            btnTranscrever.innerHTML = `<span>INICIAR TRANSCRIÇÃO</span> <i class="fa-solid fa-arrow-right"></i>`;
            btnTranscrever.disabled = false;
        }
        console.log("Whisper carregado com sucesso.");
    } catch (error) {
        console.error("Erro ao carregar:", error);
        if (statusIA) statusIA.innerText = "Erro ao carregar IA. Verifique sua conexão.";
    }
}

carregarModelo();

// 2. Upload de arquivo
let arquivoAudioSelecionado = null;
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'audio/*,video/*'; // Aceita áudio e vídeo
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

dropzone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        arquivoAudioSelecionado = file;
        dropzone.querySelector('.dropzone-title').innerHTML = `Arquivo: <strong>${file.name}</strong>`;
        dropzone.classList.add('arquivo-carregado');
        resultadoContainer.style.display = 'none'; // Esconder resultado anterior
        if (statusIA) statusIA.innerText = "Arquivo pronto para transcrição.";
    }
});

// 3. Transcrição
btnTranscrever.addEventListener('click', async () => {
    if (!arquivoAudioSelecionado || !transcriber) return;

    try {
        btnTranscrever.innerHTML = `<span>Processando...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        btnTranscrever.disabled = true;
        if (statusIA) statusIA.innerText = "IA analisando o áudio... (pode demorar um pouco, aguarde)";

        const audioURL = URL.createObjectURL(arquivoAudioSelecionado);
        
        // Executar Whisper localmente
        const resultado = await transcriber(audioURL);

        // Exibir resultado
        resultadoTexto.innerText = resultado.text;
        resultadoContainer.style.display = 'block';
        
        // Resetar interface
        btnTranscrever.innerHTML = `<span>INICIAR TRANSCRIÇÃO</span> <i class="fa-solid fa-arrow-right"></i>`;
        btnTranscrever.disabled = false;
        if (statusIA) statusIA.innerText = "Transcrição concluída!";
        
        // Scroll para o resultado
        resultadoContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Erro na transcrição:", error);
        alert("Ocorreu um erro ao processar o áudio. Tente um arquivo menor ou diferente.");
        btnTranscrever.innerHTML = `<span>INICIAR TRANSCRIÇÃO</span> <i class="fa-solid fa-arrow-right"></i>`;
        btnTranscrever.disabled = false;
    }
});

// 4. Botão de copiar
btnCopiar.addEventListener('click', () => {
    navigator.clipboard.writeText(resultadoTexto.innerText).then(() => {
        const icone = btnCopiar.querySelector('i');
        icone.classList.remove('fa-regular', 'fa-copy');
        icone.classList.add('fa-solid', 'fa-check');
        btnCopiar.innerText = "Copiado!";
        setTimeout(() => {
            btnCopiar.innerHTML = `<i class="fa-regular fa-copy"></i> Copiar`;
            icone.classList.remove('fa-solid', 'fa-check');
            icone.classList.add('fa-regular', 'fa-copy');
        }, 2000);
    });
});