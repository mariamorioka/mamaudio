import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'Nenhum arquivo de áudio foi enviado'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

        # Aqui entra a sua lógica de transcrição (Whisper / SpeechRecognition / etc.)
        # Exemplo/Mock de retorno enquanto o modelo processa:
        # texto_transcrito = seu_modelo_de_transcricao(audio_file)
        
        texto_transcrito = "Transcrição realizada com sucesso!"
        
        return jsonify({'text': texto_transcrito})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)