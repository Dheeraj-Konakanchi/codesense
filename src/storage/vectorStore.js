import fs from "fs";

export function saveIndex(chunks, filePath){
    const jsonString = JSON.stringify(chunks, null, 2);
    fs.writeFileSync(filePath, jsonString);
}

export function loadIndex(filePath){
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonString);
    return data;
}