import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { retrieveTopChunks } from '../core/retrieval.js';
import { buildPrompt } from '../core/prompt.js';
import { retryWithBackoff } from '../core/retry.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function runExplain(query){
    const topResults = await retrieveTopChunks(query);
    const prompt = buildPrompt(query, topResults);

    const response = await retryWithBackoff(() => ai.models.generateContent({
        model : "gemini-3.6-flash",
        contents : prompt
    }));

    console.log(response.text);
}