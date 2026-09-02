import { walkDirectory } from "../core/fileWalker.js";
import { readFileLines, chunkLines, hashContent } from "../core/chunker.js";
import { saveIndex } from "../storage/vectorStore.js";
import { getEmbedding } from "../core/embeddings.js";

export async function runIndex(){
    const allFiles = walkDirectory('.');
    const jsFiles = allFiles.filter((filePath)=> filePath.endsWith('.js'));

    let allChunks = [];

    for(const filePath of jsFiles){
        const lines = readFileLines(filePath);
        const chunks = chunkLines(lines);

        for(const chunk of chunks){
            const content = chunk.lines.join('\n');
            if (content.trim() === '') {
                continue;
            }
            const contentHash = hashContent(content);
            const embedding = await getEmbedding(content);

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

    console.log(`Processed ${jsFiles.length} files, created ${allChunks.length} chunks`);
}

