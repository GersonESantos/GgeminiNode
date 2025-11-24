import express from 'express';
import clientGemini from './index.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const response = await clientGemini('Quem é você');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(`
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Document</title>
                </head>
                <body style="font-family: sans-serif;">
                    <h1>Resposta do Gemini</h1>
                    <p>${response}</p>
                </body>
            </html>
        `);
    } catch (error) {
        console.log('Erro ao chamar o clientGemini:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});