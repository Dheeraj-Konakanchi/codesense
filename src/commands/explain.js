import 'dotenv/config';
import { getApiKey } from '../core/credentials.js';
import { GoogleGenAI } from '@google/genai';
import { retrieveTopChunks } from '../core/retrieval.js';
import { buildPrompt } from '../core/prompt.js';
import { retryWithBackoff } from '../core/retry.js';

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export async function runExplain(query){
    const topResults = await retrieveTopChunks(query);
    const prompt = buildPrompt(query, topResults);

    const response = await retryWithBackoff(() => ai.models.generateContent({
        model : "gemini-3.6-flash",
        contents : prompt
    }));

    console.log(response.text);
}