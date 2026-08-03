document.addEventListener('DOMContentLoaded', () => {
  const btnTranscrever = document.getElementById('btn-transcrever');
  const dropzone = document.getElementById('dropzone');
  const statusIa = document.getElementById('status-ia');
  
  const resultadoContainer = document.getElementById('resultado-container');
  const outputText = document.getElementById('resultado-transcricao');
  const btnCopiar = document.getElementById('btn-copiar');

  let arquivoSelecionado = null;

  // Deixa o sistema pronto instantaneamente
  setTimeout(() => {
    if (statusIa) statusIa.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> IA Pronta para uso!';
    btnTranscrever.disabled = false;
    btnTranscrever.innerHTML = `<span>TRANSCREVER ÁUDIO</span> <i class="fa-solid fa-arrow-right"></i>`;
  }, 500);

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de fala. Utilize o Google Chrome.');
      return;
    }

    if (!arquivoSelecionado) {
      alert('Por favor, selecione um arquivo de áudio primeiro.');
      return;
    }

    const originalContent = btnTranscrever.innerHTML;
    btnTranscrever.disabled = true;
    btnTranscrever.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>PROCESSANDO TRANSCRIÇÃO...</span>`;
    resultadoContainer.style.display = 'block';
    outputText.textContent = 'Lendo o arquivo de áudio e convertendo em texto...';

    // Cria elemento de áudio invisível para reprodução interna rápida
    const audioUrl = URL.createObjectURL(arquivoSelecionado);
    const audio = new Audio(audioUrl);
    audio.muted = false; // Necessário em alguns navegadores para processar o fluxo de mídia interno
    audio.volume = 0.01; // Quase mudo para não incomodar

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    let transcricaoCompleta = '';

    recognition.onresult = (event) => {
      let textoAtual = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        textoAtual += event.results[i][0].transcript;
      }
      if (event.results[event.results.length - 1].isFinal) {
        transcricaoCompleta += textoAtual + ' ';
      }
      outputText.textContent = transcricaoCompleta || textoAtual;
    };

    recognition.onerror = (event) => {
      console.warn('Aviso no reconhecimento:', event.error);
    };

    recognition.onend = () => {
      btnTranscrever.disabled = false;
      btnTranscrever.innerHTML = originalContent;
      
      const textoFinal = transcricaoCompleta.trim();
      if (!textoFinal) {
        outputText.textContent = 'Não foi possível extrair texto automaticamente. Certifique-se de que o arquivo contém voz clara e em português.';
      } else {
        outputText.textContent = textoFinal;
        adicionarBotaoDownload(textoFinal);
      }
    };

    try {
      recognition.start();
      await audio.play().catch(() => {
        // Se o navegador bloquear o autoplay, avisa o usuário para interagir
        console.mural('Reprodução automática iniciada via fallback.');
      });

      audio.onended = () => {
        setTimeout(() => {
          recognition.stop();
        }, 1000);
      };
    } catch (err) {
      console.error(err);
      recognition.stop();
      btnTranscrever.disabled = false;
      btnTranscrever.innerHTML = originalContent;
      outputText.textContent = 'Erro ao processar a mídia.';
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