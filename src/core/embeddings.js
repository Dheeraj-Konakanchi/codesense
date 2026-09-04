import 'dotenv/config';
import { getApiKey } from './credentials.js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({apiKey: getApiKey()});

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