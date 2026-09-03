import { parse } from "@babel/parser";
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

export function chunkFileAST(lines){
    const sourceCode = lines.join('\n');

    const ast = parse(sourceCode, {
        sourceType : "module",
    });

    const chunks = [];

    for(const node of ast.program.body){
        let actualNode = node;

        if(node.type === 'ExportNamedDeclaration' && node.declaration){
            actualNode = node.declaration;
        }

        if(actualNode.type === 'FunctionDeclaration' || actualNode.type === 'ClassDeclaration'){
            const startLine = node.loc.start.line - 1;
            const endLine = node.loc.end.line;
            const chunkLinesArray = lines.slice(startLine, endLine);

            chunks.push({startLine : startLine, lines : chunkLinesArray});
        }
    }

    return chunks;
}