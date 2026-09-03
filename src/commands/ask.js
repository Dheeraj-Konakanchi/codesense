import { retrieveTopChunks } from "../core/retrieval.js";

export async function runAsk(query){
    const topResults = await retrieveTopChunks(query);

    for(const result of topResults){
        console.log(`${result.filePath} (line ${result.startLine}) - similarity : ${result.similarity}`);
        console.log(result.content.slice(0, 100));
        console.log('---');
    }
}