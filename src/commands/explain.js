import 'dotenv/config';
import { getApiKey } from '../core/credentials.js';
import { GoogleGenAI } from '@google/genai';
import { retrieveTopChunks } from '../core/retrieval.js';
import { buildPrompt } from '../core/prompt.js';
import { retryWithBackoff } from '../core/retry.js';

let ai = null;

function getClient() {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return ai;
}

export async function runExplain(query){
    const client = getClient();
    const topResults = await retrieveTopChunks(query);
    const prompt = buildPrompt(query, topResults);

    const response = await retryWithBackoff(() => client.models.generateContent({
        model : "gemini-3.6-flash",
        contents : prompt
    }));

    console.log(response.text);
}