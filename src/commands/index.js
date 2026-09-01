import { walkDirectory } from "../core/fileWalker.js";
import { readFileLines, chunkLines } from "../core/chunker.js";

export function runIndex(){
    const allFiles = walkDirectory('.');
    const jsFiles = allFiles.filter((filePath)=> filePath.endsWith('.js'));

    let allChunks = [];

    for(const filePath of jsFiles){
        const lines = readFileLines(filePath);
        const chunks = chunkLines(lines);

        const chunksWithFiles = chunks.map((chunk)=>{
            return {...chunk, filePath : filePath};
        });

        allChunks.push(...chunksWithFiles);
    }

    console.log(`Processed ${jsFiles.length} files, created ${allChunks.length} chunks`);
}