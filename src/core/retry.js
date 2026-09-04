import { sleep } from "./embeddings.js";

export async function retryWithBackoff(asyncFunction, maxRetries = 3){
    for(let attempt =1; attempt<=maxRetries; attempt++){
        try{
            return await asyncFunction();
        }catch(error){
            if(attempt === maxRetries){
                throw error;
            }
            const delay = 2000 * attempt;
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }
}