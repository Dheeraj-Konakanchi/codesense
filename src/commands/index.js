import fs from "fs";
import { walkDirectory } from "../core/fileWalker.js";
import { readFileLines, chunkLines, hashContent, chunkFileAST } from "../core/chunker.js";
import { loadIndex, saveIndex } from "../storage/vectorStore.js";
import { getEmbedding, sleep } from "../core/embeddings.js";

export async function runIndex(directory = '.'){
    const indexFileName = directory === '.' ? 'codesense-index.json' : 'commander-index.json';
    const allFiles = walkDirectory(directory);
    const jsFiles = allFiles.filter((filePath)=> filePath.endsWith('.js'));

    let oldChunksByHash = {};

    if(fs.existsSync(indexFileName)){
        const oldChunks = loadIndex(indexFileName);

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

            if (content.length > 10000) {
                console.log(`Skipping oversized chunk in ${filePath} (${content.length} characters)`);
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
                await sleep(5000);
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

    saveIndex(allChunks, indexFileName);

    console.log(`Processed ${jsFiles.length} files, created ${allChunks.length} chunks (${reusedCount} reused, ${embeddedCount} newly embedded)`);
}

