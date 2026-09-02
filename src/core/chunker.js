import fs from "fs";
import crypto from "crypto";

export function readFileLines(filePath){
    const content = fs.readFileSync(filePath, 'utf-8');

    const lines = content.split(/\r?\n/);

    return lines;
}

export function chunkLines(lines){
    const chunks = [];
    let currentChunk =  { startLine: 0, lines: []};

    for(let i=0;i<lines.length;i++){
        const line = lines[i];

        const isFunctionStart = line.includes("function") || line.includes("=>") || line.includes("class ");

        if(isFunctionStart && currentChunk.lines.length>0){
            chunks.push(currentChunk);
            currentChunk = { startLine: i, lines: []};
        }

        currentChunk.lines.push(line);
    }

    chunks.push(currentChunk);

    return chunks;
}

export function hashContent(text){
    const hash = crypto.createHash('sha256').update(text).digest('hex');

    return hash;
}