function formatChunk(chunk){
    return `[${chunk.filePath}, line ${chunk.startLine}]\n${chunk.content}`;
}

export function buildPrompt(query, chunks){
    const contextBlocks = chunks.map(formatChunk);
    const contextText = contextBlocks.join("\n\n");

    return `You are a code assistant. Answer the question using ONLY the code context below. Cite the file path and line number for anything you reference.
    
    Context:
    ${contextText}
    
    Question: ${query}`;
}