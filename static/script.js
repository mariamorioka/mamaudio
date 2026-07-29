<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MamAudio - Transcrição de Áudio Inteligente</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}">
    <!-- Ícones Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🎙️ MamAudio</h1>
            <p>Transcrição de áudio em tempo real com alta privacidade</p>
        </header>

        <main>
            <div class="card">
                <div class="controls">
                    <button id="btn-record" class="btn btn-primary">
                        <i class="fa-solid fa-microphone"></i> Iniciar Gravação
                    </button>
                    <button id="btn-stop" class="btn btn-danger" disabled>
                        <i class="fa-solid fa-square"></i> Parar
                    </button>
                </div>

                <div id="status" class="status-indicator">
                    Pronto para gravar...
                </div>

                <div class="transcription-container">
                    <h3>Transcrição:</h3>
                    <div id="transcription-output" class="output-box">
                        Clique em "Iniciar Gravação" e fale algo...
                    </div>
                </div>
            </div>
        </main>

        <footer>
            <p>Desenvolvido por <strong>Maria Aparecida Morioka</strong></p>
            <div class="social-links">
                <a href="https://github.com/mariamorioka/mamaudio" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <i class="fa-brands fa-github"></i> GitHub
                </a>
                <a href="https://www.linkedin.com/in/maria-aparecida-assis-morioka-8361b012a/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <i class="fa-brands fa-linkedin"></i> LinkedIn
                </a>
            </div>
        </footer>
    </div>

    <script src="{{ url_for('static', filename='script.js') }}"></script>
</body>
</html>