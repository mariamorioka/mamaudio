# 🎙️ MamAudio — Transcrição de Áudio Inteligente

[![Render Status](https://img.shields.io/badge/Render-Live-brightgreen?style=for-the-badge&logo=render)](https://mamaudio.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-black?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **🚀 Aplicação Online:** [https://mamaudio.onrender.com](https://mamaudio.onrender.com)

**MamAudio** é uma solução web moderna e privativa desenvolvida para converter arquivos de áudio em texto de forma rápida e eficiente. Com suporte a múltiplos formatos (`.mp3`, `.wav`, `.m4a`, `.ogg`), a plataforma oferece um fluxo simples de upload e processamento direto no navegador.

---

## 🎨 Recursos Principais

- 📁 **Upload Flexível:** Suporte a arrastar e soltar arquivos de áudio.
- 🔒 **Foco em Privacidade:** Processamento seguro dos dados de áudio.
- ⚡ **Interface Ultra-Moderna:** Design em modo escuro com estética *Glassmorphism*.
- 📋 **Cópia em 1 Clique:** Copie o texto transcrito diretamente para a área de transferência.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Python, Flask, Gunicorn
- **Frontend:** HTML5, CSS3 (*Glassmorphism*), JavaScript ES6+
- **Ícones & Fontes:** Font Awesome, Google Fonts (*Inter* & *JetBrains Mono*)
- **Deploy:** Render

---

## 💻 Como Executar Localmente

```bash
# Clone o repositório
git clone [https://github.com/mariamorioka/mamaudio.git](https://github.com/mariamorioka/mamaudio.git)
cd mamaudio

# Crie e ative o ambiente virtual
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1
# Linux/Mac: source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Execute a aplicação
python app.py