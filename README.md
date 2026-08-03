# 🎙️ MamAudio — Transcrição de Áudio Inteligente

🚀 **Acesse a aplicação ao vivo:** [https://mamaudio-lbmi.vercel.app](https://mamaudio-lbmi.vercel.app)

---

## 📌 Sobre o Projeto

O **MamAudio** é uma solução web moderna, privativa e intuitiva desenvolvida para converter arquivos de áudio em texto de forma rápida e precisa. Pensado para simplificar a rotina de profissionais que lidam com registros em áudio — como reuniões, entrevistas ou notas de voz —, o sistema permite o envio direto de arquivos com transcrição instantânea utilizando inteligência artificial.

---

## ✨ Principais Funcionalidades

* 📁 **Upload Simples de Arquivos:** Suporte aos principais formatos de áudio (.mp3, .wav, .m4a, .ogg, .opus).
* ⚡ **Processamento Inteligente:** Conversão de voz para texto com foco em clareza, utilizando modelos de alta performance.
* 📋 **Cópia e Download em 1 Clique:** Botões dedicados para copiar o texto transcrito ou baixá-lo diretamente como um arquivo `.txt`.
* 🎨 **Interface Futurista (Glassmorphism):** Design escuro responsivo com elementos modernos e alta usabilidade.
* 🔒 **Privacidade & Segurança:** Processamento seguro dos dados através de backend em nuvem.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Glassmorphism & Flexbox/Grid), JavaScript (ES6+)
* **Backend:** Node.js / Vercel Serverless Functions
* **Inteligência Artificial:** Groq API (Whisper)
* **Ícones & Tipografia:** Font Awesome 6, Google Fonts (Inter & JetBrains Mono)
* **Hospedagem & Deploy:** Vercel

---

## 📂 Estrutura do Projeto

```text
mamaudio/
├── api/
│   └── transcrever.js       # Função serverless para integração segura com a API da Groq
├── venv/                    # Ambiente virtual Python (desenvolvimento local)
├── index.html               # Interface principal da aplicação
├── script.js                # Lógica de upload e integração assíncrona (Fetch API)
├── styles.css               # Estilização visual futurista
├── package.json             # Dependências e configurações do Node.js
└── README.md                # Documentação oficial do projeto