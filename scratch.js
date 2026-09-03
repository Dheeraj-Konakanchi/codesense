import { parse } from "@babel/parser";
import fs from "fs";

const code = fs.readFileSync('src/commands/ask.js','utf-8');

const ast = parse(code, {
    sourceType : "module",
});

for (const node of ast.program.body){
    console.log(node.type, node.loc.start.line, node.loc.end.line);
}
