# 🎙️ MamAudio — Transcrição de Áudio Inteligente

[![Render Status](https://img.shields.io/badge/Render-Live-brightgreen?style=for-the-badge&logo=render)](https://mamaudio.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-black?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **🚀 Acesse a aplicação ao vivo:** [https://mamaudio.onrender.com](https://mamaudio.onrender.com)

---

## 📌 Sobre o Projeto

O **MamAudio** é uma solução web moderna, privativa e intuitiva desenvolvida para converter arquivos de áudio em texto de forma rápida e precisa. Pensado para simplificar a rotina de profissionais que lidam com registros em áudio como audiências, reuniões, entrevistas ou notas de voz, o sistema permite o envio direto de arquivos com transcrição instantânea no navegador.

---

## ✨ Principais Funcionalidades

- 📁 **Upload Simples de Arquivos:** Suporte aos principais formatos de áudio (`.mp3`, `.wav`, `.m4a`, `.ogg`, `.flac`).
- ⚡ **Processamento Inteligente:** Conversão de voz para texto com foco em clareza e legibilidade.
- 📋 **Cópia em 1 Clique:** Botão dedicado para copiar o texto transcrito diretamente para a área de transferência.
- 🎨 **Interface Futurista (Glassmorphism):** Design escuro responsivo com elementos em neon e alta usabilidade.
- 🔒 **Privacidade & Segurança:** Processamento seguro dos dados enviados pelo usuário.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Python 3, Flask, Gunicorn
- **Frontend:** HTML5, CSS3 (*Glassmorphism & Flexbox/Grid*), JavaScript (ES6+)
- **Ícones & Tipografia:** Font Awesome 6, Google Fonts (*Inter* & *JetBrains Mono*)
- **Hospedagem & Deploy:** Render

---

## 📂 Estrutura do Projeto

```text
mamaudio/
├── static/                  # Arquivos estáticos (CSS, JS)
│   ├── script.js            # Lógica de upload e integração assíncrona (Fetch API)
│   └── styles.css           # Estilização visual futurista
├── templates/               # Templates HTML
│   └── index.html           # Interface principal da aplicação
├── .gitignore               # Arquivos ignorados pelo Git
├── Procfile                 # Comando de inicialização para deploy no Render
├── README.md                # Documentação oficial do projeto
├── app.py                   # Servidor Flask e rotas da API
└── requirements.txt         # Dependências do projeto Python