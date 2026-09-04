import { Command } from "commander";
import { runAsk } from "./src/commands/ask.js";
import { runIndex } from "./src/commands/index.js";
import { runExplain } from "./src/commands/explain.js";

const program = new Command();

program
    .name('codesense')
    .description('Search your Codebase in Plain English')
    .version ('1.0.0');

program
    .command('index [directory]')
    .description('Build the search index for current Codebase')
    .action(runIndex);

program
    .command('ask <query>')
    .description('Ask a question about your codebase')
    .action(runAsk);

program
    .command('explain <query>')
    .description('Explains about this codebase')
    .action(runExplain);

program.parse();