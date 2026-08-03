document.addEventListener('DOMContentLoaded', () => {
  const btnTranscrever = document.getElementById('btn-transcrever');
  const dropzone = document.getElementById('dropzone');
  const statusIa = document.getElementById('status-ia');
  
  const resultadoContainer = document.getElementById('resultado-container');
  const outputText = document.getElementById('resultado-transcricao');
  const btnCopiar = document.getElementById('btn-copiar');

  let arquivoSelecionado = null;

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
    if (!arquivoSelecionado) {
      alert('Por favor, selecione um arquivo de áudio primeiro.');
      return;
    }

    const originalContent = btnTranscrever.innerHTML;
    btnTranscrever.disabled = true;
    btnTranscrever.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>TRANSCREVENDO COM IA...</span>`;
    resultadoContainer.style.display = 'block';
    outputText.textContent = 'Enviando áudio para processamento seguro na nuvem...';

    try {
      // Cria um FormData para enviar o arquivo de áudio e os parâmetros da Groq
      const formData = new FormData();
      formData.append('file', arquivoSelecionado);
      formData.append('model', 'whisper-large-v3');
      formData.append('language', 'pt');
      formData.append('response_format', 'json');

      const response = await fetch('/api/transcrever', {
        method: 'POST',
        body: arquivoSelecionado,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na transcrição');
      }

      const textoTranscrito = data.text ? data.text.trim() : '';

      if (!textoTranscrito) {
        outputText.textContent = 'Nenhum texto foi detectado no arquivo.';
      } else {
        outputText.textContent = textoTranscrito;
        adicionarBotaoDownload(textoTranscrito);
      }
    } catch (err) {
      console.error('Erro:', err);
      outputText.textContent = 'Ocorreu um erro ao transcrever o áudio. Tente novamente.';
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