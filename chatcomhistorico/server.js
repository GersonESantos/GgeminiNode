import express from 'express';
import clientGemini from '.gemini.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/static', express.static(path.join(__dirname, 'public')));

// memória simples por sessão (substituir por Redis em produção)
const sessions = new Map();

app.post('/api/ask', async (req, res) => {
  try {
    const { prompt, sessionId = 'default' } = req.body;
    const answer = await clientGemini(prompt);
    const hist = sessions.get(sessionId) || [];
    hist.push({ question: prompt, answer, at: Date.now() });
    sessions.set(sessionId, hist.slice(-50)); // guarda últimos 50
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao chamar Gemini' });
  }
});

app.get('/api/history', (req, res) => {
  const { sessionId = 'default' } = req.query;
  res.json({ history: sessions.get(sessionId) || [] });
});

app.listen(port, () => console.log(`Server rodando em http://localhost:${port}`));