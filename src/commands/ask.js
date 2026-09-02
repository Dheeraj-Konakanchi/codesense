import { loadIndex } from "../storage/vectorStore.js";
import { getEmbedding } from "../core/embeddings.js";
import { cosineSimilarity } from "../core/similarity.js";

export async function runAsk(query){
    const chunks = loadIndex('codesense-index.json');
    const queryEmbedding = await getEmbedding(query);

    const chunksWithScore = chunks.map((chunk)=>{
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
        return {...chunk, similarity : similarity};
    });

    chunksWithScore.sort((a,b) => b.similarity-a.similarity);

    const topResults = chunksWithScore.slice(0,5);

    for(const result of topResults){
        console.log(`${result.filePath} (line ${result.startLine}) - similarity : ${result.similarity}`);
        console.log(result.content.slice(0, 100));
        console.log('---');
    }
}