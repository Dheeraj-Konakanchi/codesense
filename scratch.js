import { parse } from "@babel/parser";
import fs from "fs";

const code = fs.readFileSync('src/commands/ask.js','utf-8');

const ast = parse(code, {
    sourceType : "module",
});

function findFunctionBoundaries(ast){
    const boundaries = [];

    for(const node of ast.program.body){
        let actualNode = node;
        if(node.type === "ExportNamedDeclaration" && node.declaration){
            actualNode=node.declaration;
        }

        if(actualNode.type === "FunctionDeclaration" || actualNode.type === "ClassDeclaration"){
            boundaries.push({start: node.loc.start.line, end: node.loc.end.line});
        }
    }

    return boundaries;
}

console.log(findFunctionBoundaries(ast));
