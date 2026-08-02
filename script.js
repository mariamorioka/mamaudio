document.addEventListener('DOMContentLoaded', () => {
  const btnTranscrever = document.getElementById('btn-transcrever');
  const dropzone = document.getElementById('dropzone');
  const statusIa = document.getElementById('status-ia');
  
  // Elementos do resultado presentes no HTML
  const resultadoContainer = document.getElementById('resultado-container');
  const outputText = document.getElementById('resultado-transcricao');
  const btnCopiar = document.getElementById('btn-copiar');

  let arquivoSelecionado = null;

  // ATIVA O BOTÃO AO CARREGAR A PÁGINA
  setTimeout(() => {
    if (statusIa) statusIa.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> IA Pronta para uso!';
    btnTranscrever.disabled = false;
    btnTranscrever.innerHTML = `<span>TRANSCREVER ÁUDIO</span> <i class="fa-solid fa-arrow-right"></i>`;
  }, 1000);

  // Cria um input de arquivo invisível aceitando áudios (inclusive WhatsApp ogg/opus)
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

  btnTranscrever.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Seu navegador atual não suporta a transcrição nativa. Por favor, utilize o Google Chrome.');
      return;
    }

    if (!arquivoSelecionado) {
      alert('Por favor, selecione um arquivo de áudio primeiro clicando na área de upload.');
      return;
    }

    const audioUrl = URL.createObjectURL(arquivoSelecionado);
    const audioElement = new Audio(audioUrl);

    const originalContent = btnTranscrever.innerHTML;
    btnTranscrever.disabled = true;
    btnTranscrever.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>PROCESSANDO ÁUDIO...</span>`;
    resultadoContainer.style.display = 'block';
    outputText.textContent = 'Reproduzindo e capturando o áudio para transcrição em tempo real...';

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      outputText.textContent = finalTranscript + interim;
    };

    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento:', event.error);
    };

    recognition.onend = () => {
      btnTranscrever.disabled = false;
      btnTranscrever.innerHTML = originalContent;
      if (!finalTranscript) {
        outputText.textContent = 'Não foi possível detectar fala clara no arquivo. Certifique-se de que o áudio contém voz nítida.';
      } else {
        // Adiciona dinamicamente um botão de baixar se já não existir
        adicionarBotaoDownload(finalTranscript);
      }
    };

    try {
      recognition.start();
      audioElement.play().catch(err => {
        console.error("Erro ao reproduzir áudio:", err);
        recognition.stop();
        btnTranscrever.disabled = false;
        btnTranscrever.innerHTML = originalContent;
        alert('Erro ao reproduzir o arquivo de áudio no navegador. Verifique se o formato é suportado.');
      });

      audioElement.onended = () => {
        setTimeout(() => {
          recognition.stop();
        }, 1000);
      };
    } catch (err) {
      console.error(err);
      btnTranscrever.disabled = false;
      btnTranscrever.innerHTML = originalContent;
    }
  });

  // Funcionalidade do botão copiar
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

  // Função para criar o botão de download do texto transcrito
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

    // Ação de baixar o arquivo de texto
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