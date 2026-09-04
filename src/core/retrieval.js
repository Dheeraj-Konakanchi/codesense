import { loadIndex } from "../storage/vectorStore.js";
import { getEmbedding } from "./embeddings.js";
import { cosineSimilarity } from "./similarity.js";

export async function retrieveTopChunks(query, topN = 5, indexFile = 'codesense-index.json'){
    const chunks = loadIndex(indexFile);
    const queryEmbedding = await getEmbedding(query);

    const chunksWithScore = chunks.map((chunk)=>{
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
        return {...chunk, similarity : similarity};
    });

    chunksWithScore.sort((a,b) => b.similarity-a.similarity);

    return chunksWithScore.slice(0,topN);
}