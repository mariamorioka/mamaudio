import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0';

let transcriber = null;

// Elementos da interface (certifique-se de que os IDs existam no HTML)
const btnTranscrever = document.getElementById('btn-transcrever');
const dropzone = document.getElementById('dropzone');

// 1. Carregar o modelo Whisper assim que o site abrir
async function carregarModelo() {
    try {
        if (btnTranscrever) {
            btnTranscrever.innerHTML = `<span>Carregando IA...</span>`;
            btnTranscrever.disabled = true;
        }

        // Usamos o modelo whisper-tiny quantizado para rodar rápido no navegador
        transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
            // Se quiser suporte a português direto, pode testar modelos multilíngues compatíveis com ONNX
        });

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

// Chamar o carregamento ao iniciar a página
carregarModelo();

// 2. Manipular o arquivo de áudio carregado pelo usuário
let arquivoAudioSelecionado = null;

// Criar um input de arquivo invisível para capturar o clique na dropzone
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
        dropzone.querySelector('.dropzone-title').innerHTML = `Arquivo selecionado: <strong>${file.name}</strong>`;
    }
});

// 3. Executar a transcrição ao clicar no botão
btnTranscrever.addEventListener('click', async () => {
    if (!arquivoAudioSelecionado) {
        alert('Por favor, selecione um arquivo de áudio primeiro.');
        return;
    }

    if (!transcriber) {
        alert('O modelo de IA ainda está sendo baixado/carregado. Aguarde um momento.');
        return;
    }

    try {
        btnTranscrever.innerHTML = `<span>Transcrevendo áudio...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        btnTranscrever.disabled = true;

        // Converter o arquivo de áudio para URL legível pelo navegador
        const audioURL = URL.createObjectURL(arquivoAudioSelecionado);

        // Executar o Whisper localmente
        const resultado = await transcriber(audioURL);

        console.log("Resultado da Transcrição:", resultado);
        
        // Exibir o resultado na tela (você pode criar uma caixa de texto no HTML para mostrar isso)
        alert("Transcrição concluída: " + resultado.text);

        btnTranscrever.innerHTML = `<span>INICIAR TRANSCRIÇÃO</span> <i class="fa-solid fa-arrow-right"></i>`;
        btnTranscrever.disabled = false;

    } catch (error) {
        console.error("Erro na transcrição:", error);
        alert("Ocorreu um erro ao transcrever o áudio.");
        btnTranscrever.innerHTML = `<span>INICIAR TRANSCRIÇÃO</span> <i class="fa-solid fa-arrow-right"></i>`;
        btnTranscrever.disabled = false;
    }
});