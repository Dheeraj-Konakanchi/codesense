import fs from "fs";
import path from "path";

export function walkDirectory(rootPath){
    const results = [];
    const entries = fs.readdirSync(rootPath, { withFileTypes : true});

    for(const entry of entries){
        const fullPath = path.join(rootPath, entry.name);

        if(entry.isDirectory()){
            if(entry.name === "node_modules" || entry.name === ".git"){
                continue;
            }
            const subResults = walkDirectory(fullPath);
            results.push(...subResults);
        }
        else{
            results.push(fullPath);
        }
    }

    return results;
}