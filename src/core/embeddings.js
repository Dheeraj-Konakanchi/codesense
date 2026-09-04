import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function getEmbedding(text){
    const result = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: { outputDimensionality: 768 },
        });

    return result.embeddings[0].values;
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}