import { saveApiKey } from '../core/credentials.js';

export function runConfig(apiKey){
    saveApiKey(apiKey);
    console.log('API key saved successfully.');
}