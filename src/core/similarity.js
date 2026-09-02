export function dotProduct(vecA, vecB){

    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must be the same length");
    }

    let total = 0;
    for(let i=0; i<vecA.length; i++){
        const product = vecA[i] * vecB[i];

        total += product;
    }

    return total;
}

export function magnitude(vec){
    let total =0;
    for(let i=0; i<vec.length; i++){
        total += vec[i]*vec[i];
    }

    return Math.sqrt(total);
}

export function cosineSimilarity(vecA, vecB){
    const dot = dotProduct(vecA, vecB);
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);

    return dot/(magA * magB);
}