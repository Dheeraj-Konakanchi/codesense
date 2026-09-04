import { evalData } from "./eval-data.js";
import { retrieveTopChunks } from "./src/core/retrieval.js";
import { loadIndex } from "./src/storage/vectorStore.js";

const stopwords = ['how', 'does', 'the', 'is', 'a', 'an', 'where', 'for', 'of', 'to', 'in'];

function extractKeywords(query) {
    const words = query.toLowerCase().split(' ');
    return words.filter((word) => !stopwords.includes(word));
}

function grepSearch(keywords, chunks) {
    return chunks.filter((chunk) => {
        const lowerContent = chunk.content.toLowerCase();
        return keywords.some((keyword) => lowerContent.includes(keyword));
    });
}

function evaluateGrep() {
    let hits = 0;

    for (const pair of evalData) {
        const chunks = loadIndex(pair.indexFile);
        const keywords = extractKeywords(pair.query);
        const results = grepSearch(keywords, chunks);

        const found = results.slice(0, 3).some((result) => result.filePath.includes(pair.expectedFile));

        if (found) {
        hits++;
        }
    }

    const accuracy = (hits / evalData.length) * 100;
    console.log(`Grep baseline top-3 accuracy: ${accuracy.toFixed(1)}% (${hits}/${evalData.length})`);
}


async function evaluateCodeSense() {
    let hits =0;

    for(const pair of evalData){
        const topResults = await retrieveTopChunks(pair.query, 3, pair.indexFile);
        const found = topResults.some((result) => result.filePath.includes(pair.expectedFile));

        if(found){
            hits++;
        } else {
            console.log(`MISS: "${pair.query}" — expected "${pair.expectedFile}"`);
        }
    }
    const accuracy = (hits/evalData.length) * 100;
    console.log(`CodeSense top-3 accuracy: ${accuracy.toFixed(1)}% (${hits}/${evalData.length})`);
}

evaluateCodeSense();
evaluateGrep();