import fs from "fs";
import { walkDirectory } from "../core/fileWalker.js";
import { readFileLines, chunkLines, hashContent, chunkFileAST } from "../core/chunker.js";
import { loadIndex, saveIndex } from "../storage/vectorStore.js";
import { getEmbedding } from "../core/embeddings.js";

export async function runIndex(){
    const allFiles = walkDirectory('.');
    const jsFiles = allFiles.filter((filePath)=> filePath.endsWith('.js'));

    let oldChunksByHash = {};

    if(fs.existsSync('codesense-index.json')){
        const oldChunks = loadIndex('codesense-index.json');

        for(const oldChunk of oldChunks){
            oldChunksByHash[oldChunk.contentHash]=oldChunk;
        }
    }

    let reusedCount = 0;
    let embeddedCount = 0;

    let allChunks = [];

    for(const filePath of jsFiles){
        const lines = readFileLines(filePath);

        let chunks;
        try{
            chunks = chunkFileAST(lines);
        }catch(error){
            chunks = chunkLines(lines);
        }

        for(const chunk of chunks){
            const content = chunk.lines.join('\n');
            if (content.trim() === '') {
                continue;
            }
            const contentHash = hashContent(content);

            let embedding;
            if(oldChunksByHash[contentHash]){
                embedding = oldChunksByHash[contentHash].embedding;
                reusedCount++;
            }
            else{
                embedding = await getEmbedding(content);
                embeddedCount++;
            }

            const finalChunk = {
                filePath : filePath,
                startLine : chunk.startLine,
                content : content,
                contentHash : contentHash,
                embedding : embedding
            };

            allChunks.push(finalChunk);
        }
    }

    saveIndex(allChunks, 'codesense-index.json');

    console.log(`Processed ${jsFiles.length} files, created ${allChunks.length} chunks (${reusedCount} reused, ${embeddedCount} newly embedded)`);
}

