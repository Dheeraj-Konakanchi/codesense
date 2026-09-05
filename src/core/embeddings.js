import 'dotenv/config';
import { getApiKey } from './credentials.js';
import { GoogleGenAI } from '@google/genai';

let ai = null;

function getClient() {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return ai;
}

export async function getEmbedding(text){
    const client = getClient();
    const result = await client.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: { outputDimensionality: 768 },
        });

    return result.embeddings[0].values;
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}