import express from 'express';
import clientGemini from './index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta `public` em /static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        // Renderiza um formulário estilizado para o usuário digitar a pergunta
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(`
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                    <title>Pergunte ao Gemini</title>
                    <link rel="stylesheet" href="/static/styles.css" />
                </head>
                <body>
                    <div class="container">
                        <h1>Pergunte ao Gemini</h1>
                        <form method="post" action="/ask" class="form">
                            <label for="prompt">Digite sua pergunta:</label>
                            <textarea id="prompt" name="prompt" rows="4" placeholder="Escreva sua pergunta aqui"></textarea>
                            <div class="actions">
                                <button type="submit" class="btn">Enviar</button>
                            </div>
                        </form>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.log('Erro ao chamar o clientGemini:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.post('/ask', async (req, res) => {
    try {
        const prompt = (req.body && req.body.prompt) || 'Quem é você';
        const response = await clientGemini(prompt);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(`
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                    <title>Resposta</title>
                    <link rel="stylesheet" href="/static/styles.css" />
                </head>
                <body>
                    <div class="container">
                        <h1>Resposta do Gemini</h1>
                        <div class="card">
                          <p><strong>Pergunta:</strong></p>
                          <pre class="prompt">${escapeHtml(prompt)}</pre>
                          <p><strong>Resposta:</strong></p>
                          <pre class="response">${escapeHtml(response)}</pre>
                          <p><a class="link" href="/">Fazer outra pergunta</a></p>
                        </div>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.log('Erro ao processar /ask:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

function escapeHtml(unsafe) {
    if (!unsafe && unsafe !== 0) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});