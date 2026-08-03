import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

document.addEventListener('DOMContentLoaded', () => {
  const btnTranscrever = document.getElementById('btn-transcrever');
  const dropzone = document.getElementById('dropzone');
  const statusIa = document.getElementById('status-ia');
  
  const resultadoContainer = document.getElementById('resultado-container');
  const outputText = document.getElementById('resultado-transcricao');
  const btnCopiar = document.getElementById('btn-copiar');

  let arquivoSelecionado = null;
  let transcriatorPipeline = null;

  // Inicializa o modelo Whisper em segundo plano de forma otimizada
  async function carregarModeloIA() {
    try {
      if (statusIa) statusIa.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Baixando/Carregando IA Whisper (Primeiro acesso pode levar alguns segundos)...';
      
      // Usa o modelo tiny (leve e rápido para navegadores)
      transcriatorPipeline = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
      
      if (statusIa) statusIa.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> IA Pronta para uso!';
      btnTranscrever.disabled = false;
      btnTranscrever.innerHTML = `<span>TRANSCREVER ÁUDIO</span> <i class="fa-solid fa-arrow-right"></i>`;
    } catch (err) {
      console.error('Erro ao carregar IA:', err);
      if (statusIa) statusIa.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b;"></i> Erro ao carregar IA. Tente atualizar a página.';
    }
  }

  carregarModeloIA();

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'audio/*,.ogg,.opus,.mp3,.wav,.m4a';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      arquivoSelecionado = e.target.files[0];
      const fileName = arquivoSelecionado.name;
      dropzone.querySelector('.dropzone-title').innerHTML = `Arquivo selecionado: <span class="highlight-link">${fileName}</span>`;
    }
  });

  btnTranscrever.addEventListener('click', async () => {
    if (!arquivoSelecionado) {
      alert('Por favor, selecione um arquivo de áudio primeiro.');
      return;
    }

    if (!transcriatorPipeline) {
      alert('A IA ainda está sendo carregada. Aguarde um instante.');
      return;
    }

    const originalContent = btnTranscrever.innerHTML;
    btnTranscrever.disabled = true;
    btnTranscrever.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>TRANSCREVENDO COM IA (WHISPER)...</span>`;
    resultadoContainer.style.display = 'block';
    outputText.textContent = 'Processando o arquivo de áudio localmente, por favor aguarde...';

    try {
      // Converte o arquivo de áudio para formato compatível com o tensor do Whisper
      const arrayBuffer = await arquivoSelecionado.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const audioData = audioBuffer.getChannelData(0); // Pega o canal mono

      // Executa a transcrição local baseada em IA
      const resultado = await transcriatorPipeline(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: false,
      });

      const textoTranscrito = resultado.text ? resultado.text.trim() : '';

      if (!textoTranscrito) {
        outputText.textContent = 'Não foi possível detectar fala clara no arquivo enviado.';
      } else {
        outputText.textContent = textoTranscrito;
        adicionarBotaoDownload(textoTranscrito);
      }
    } catch (err) {
      console.error('Erro na transcrição:', err);
      outputText.textContent = 'Erro ao processar o arquivo de áudio. Certifique-se de enviar um formato compatível.';
    } finally {
      btnTranscrever.disabled = false;
      btnTranscrever.innerHTML = originalContent;
    }
  });

  if (btnCopiar) {
    btnCopiar.addEventListener('click', () => {
      const texto = outputText.innerText;
      navigator.clipboard.writeText(texto).then(() => {
        btnCopiar.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        setTimeout(() => {
          btnCopiar.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar';
        }, 2000);
      });
    });
  }

  function adicionarBotaoDownload(textoTranscrito) {
    let btnDownload = document.getElementById('btn-download-txt');
    
    if (!btnDownload) {
      const headerDiv = resultadoContainer.querySelector('div');
      btnDownload = document.createElement('button');
      btnDownload.id = 'btn-download-txt';
      btnDownload.style.cssText = 'background: #10b981; border: none; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; margin-left: 8px;';
      btnDownload.innerHTML = `<i class="fa-solid fa-download"></i> Baixar TXT`;
      headerDiv.appendChild(btnDownload);
    }

    btnDownload.onclick = () => {
      const blob = new Blob([textoTranscrito], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcricao-mamaudio.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
  }
});