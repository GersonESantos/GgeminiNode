import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
const ai = new GoogleGenAI({});

export default async function clientGemini(prompt, { model='gemini-2.5-flash' } = {}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não definida');
  }
  const resp = await ai.models.generateContent({
    model,
    contents: prompt,
  });
  return resp.text;
}