# 🎙️ MamAudio — Transcrição de Áudio Inteligente & Privada

[![Render Status](https://img.shields.io/badge/Render-Live-brightgreen?style=for-the-badge&logo=render)](https://mamaudio.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-black?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **🚀 Teste a aplicação ao vivo:** [https://mamaudio.onrender.com](https://mamaudio.onrender.com)

**MamAudio** é uma aplicação web moderna projetada para capturar e transcrever áudios em tempo real com alta precisão e foco total em **privacidade do usuário**. A transcrição é executada no cliente através de modelos avançados de IA diretamente no navegador.

---

## ✨ Principais Recursos

- 🎙️ **Gravação em Tempo Real:** Captura de áudio de alta fidelidade usando a Web Audio API.
- 🔒 **Privacidade Avançada:** O processamento e transcrição ocorrem diretamente no navegador do usuário via Transformers.js e IA Whisper.
- 🎨 **Interface Moderna:** Design elegante com estética *Glassmorphism* em modo escuro, totalmente responsivo para desktop e dispositivos móveis.
- ⚡ **Leve & Rápido:** Backend minimalista em Python/Flask otimizado para entrega rápida de assets.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **HTML5 & CSS3:** Layout responsivo com efeitos de *Glassmorphism* e variáveis CSS.
- **JavaScript (ES6+):** Manipulação de eventos e controle da gravação.
- **Web Audio API:** Captura e tratamento de fluxo de áudio do microfone.
- **Transformers.js / Whisper:** Processamento de inteligência artificial no navegador.

### **Backend**
- **Python 3:** Linguagem principal do servidor.
- **Flask:** Framework web leve para roteamento.
- **Gunicorn:** WSGI HTTP Server para produção.

### **Deploy & Infraestrutura**
- **Git & GitHub:** Controle de versão.
- **Render:** Hospedagem da aplicação em nuvem.

---

## 📁 Estrutura do Projeto

```text
mamaudio/
├── static/
│   ├── script.js        # Lógica de áudio e integração com o modelo
│   └── styles.css       # Estilização Glassmorphism & Dark Mode
├── templates/
│   └── index.html       # Estrutura principal da interface
├── app.py               # Servidor Flask
├── Procfile             # Configuração do Gunicorn para deploy no Render
├── requirements.txt     # Dependências Python
├── .gitignore           # Ignora venv e arquivos temporários
└── README.md            # Documentação do projeto