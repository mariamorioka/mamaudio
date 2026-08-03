export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({ error: 'Chave da API da Groq não configurada no Vercel.' });
  }

  try {
    // Captura os dados brutos enviados pelo frontend (FormData)
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Cria um novo FormData para enviar à Groq
    const boundary = '----VercelFormDataBoundary' + Math.random().toString(36).substring(2);
    
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        ...req.headers,
        host: 'api.groq.com',
      },
      body: buffer
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao processar na Groq');
    }

    return res.status(200).json({ text: data.text });
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: error.message });
  }
}