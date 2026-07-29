document.addEventListener('DOMContentLoaded', () => {
  const btnTranscrever = document.getElementById('btn-transcrever');
  const dropzone = document.getElementById('dropzone');

  // Cria um input de arquivo invisível
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'audio/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  // Cria dinamicamente uma área para exibir o resultado da transcrição na tela
  const mainContainer = document.querySelector('.hero-container');
  const resultBox = document.createElement('div');
  resultBox.style.cssText = 'margin-top: 30px; background: #1e1e2f; padding: 20px; border-radius: 12px; border: 1px solid #333; display: none;';
  resultBox.innerHTML = `
    <h3 style="color: #fff; margin-bottom: 10px; font-size: 1.1rem;">Texto Transcrito:</h3>
    <p id="transcript-output" style="color: #bbb; line-height: 1.6; white-space: pre-wrap;"></p>
  `;
  mainContainer.appendChild(resultBox);
  const outputText = document.getElementById('transcript-output');

  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      dropzone.querySelector('.dropzone-title').innerHTML = `Arquivo selecionado: <span class="highlight-link">${fileName}</span>`;
    }
  });

  btnTranscrever.addEventListener('click', () => {
    // Verifica se o navegador suporta a API de reconhecimento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Seu navegador atual não suporta a transcrição nativa. Por favor, tente utilizar o Google Chrome.');
      return;
    }

    if (fileInput.files.length === 0) {
      alert('Por favor, selecione um arquivo de áudio primeiro clicando na área de upload.');
      return;
    }

    const audioFile = fileInput.files[0];
    const audioUrl = URL.createObjectURL(audioFile);
    const audioElement = new Audio(audioUrl);

    const originalContent = btnTranscrever.innerHTML;
    btnTranscrever.disabled = true;
    btnTranscrever.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>PROCESSANDO ÁUDIO...</span>`;
    resultBox.style.display = 'block';
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
      }
    };

    // Inicia a escuta e reproduz o áudio simultaneamente para o navegador capturar
    try {
      recognition.start();
      audioElement.play().catch(err => {
        console.error("Erro ao reproduzir áudio:", err);
        recognition.stop();
        btnTranscrever.disabled = false;
        btnTranscrever.innerHTML = originalContent;
        alert('Erro ao reproduzir o arquivo de áudio no navegador.');
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
});