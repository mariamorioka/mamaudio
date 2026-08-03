export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({ error: 'Chave da API da Groq não configurada no Vercel.' });
  }

  try {
    // Como o Vercel Serverless recebe a requisição, repassamos o corpo bruto (formData) para a Groq
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: req.body,
      // Importante: repassamos os headers de tipo de conteúdo (multipart/form-data)
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        ...req.headers,
        host: 'api.groq.com',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao processar na Groq');
    }

    return res.status(200).json({ text: data.text });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: error.message });
  }
}