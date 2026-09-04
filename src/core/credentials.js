import fs from "fs";
import os from "os";
import path from "path";

const configDir = path.join(os.homedir(), '.codesense');
const configPath = path.join(configDir, 'config.json');

export function saveApiKey(apiKey){
    if(!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }
    const config = { apiKey };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function getApiKey(){
    if(fs.existsSync(configPath)){
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        return config.apiKey;
    }

    return process.env.GEMINI_API_KEY;
}