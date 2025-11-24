import express from 'express';
import clientGemini from './index.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        // Renderiza um formulário para o usuário digitar a pergunta
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(`
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Pergunte ao Gemini</title>
                </head>
                <body style="font-family: sans-serif;">
                    <h1>Pergunte ao Gemini</h1>
                    <form method="post" action="/ask">
                        <label for="prompt">Digite sua pergunta:</label><br />
                        <textarea id="prompt" name="prompt" rows="4" cols="60" placeholder="Escreva sua pergunta aqui"></textarea><br />
                        <button type="submit">Enviar</button>
                    </form>
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
                    <title>Resposta</title>
                </head>
                <body style="font-family: sans-serif;">
                    <h1>Resposta do Gemini</h1>
                    <p><strong>Pergunta:</strong> ${escapeHtml(prompt)}</p>
                    <p><strong>Resposta:</strong></p>
                    <pre style="white-space: pre-wrap;">${escapeHtml(response)}</pre>
                    <p><a href="/">Fazer outra pergunta</a></p>
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