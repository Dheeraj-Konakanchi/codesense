# CodeSense

A CLI tool that lets developers search any JavaScript/TypeScript codebase using plain-English questions, powered by embeddings, cosine similarity, and a Retrieval-Augmented Generation (RAG) layer.

Instead of grepping for exact keywords, ask questions like *"how does the file walker skip node_modules"* and get back the actual relevant code — or a natural-language explanation grounded in your real codebase.

Published on npm as [`codesense-rag`](https://www.npmjs.com/package/codesense-rag).

## Why

Keyword search (grep/ripgrep) only finds text that literally matches your search term. CodeSense understands *meaning* — a query about "reading directory contents" can surface a function named `walkDirectory` even if none of those exact words appear in it, because it compares the semantic meaning of your question against the semantic meaning of your code.

## Features

- **`codesense index [directory]`** — walks a codebase, chunks it by function/class boundaries (AST-based via `@babel/parser`, with a heuristic fallback), embeds each chunk with Google's Gemini embedding model, and stores the result locally
- **`codesense ask <query>`** — semantic search: returns the top-N most relevant code chunks for a plain-English question
- **`codesense explain <query>`** — full RAG: retrieves relevant chunks, builds a grounded prompt, and asks an LLM (Gemini) to synthesize a natural-language answer with file/line citations
- **`codesense config <apiKey>`** — saves your Gemini API key once, globally, to `~/.codesense/config.json`
- **Incremental re-indexing** — content-hash based change detection means re-running `index` only re-embeds files that actually changed
- **Resilient by design** — atomic index writes (no corruption on crash), automatic retry-with-backoff for transient API failures (rate limits, server overload, network timeouts)

## Architecture

CLI (Commander.js)
└─ commands/ (index, ask, explain, config) — thin wrappers, no business logic
└─ core/
├─ fileWalker.js — recursive directory traversal, skips node_modules/.git
├─ chunker.js — AST-based chunking (Babel) + heuristic fallback + content hashing
├─ embeddings.js — Gemini embedding API client (lazily initialized) + rate-limit  delay helper
├─ similarity.js — pure cosine similarity math (dot product, magnitude)
├─ retrieval.js — shared top-N retrieval logic (used by both ask and explain)
├─ prompt.js — RAG prompt construction
├─ retry.js — generic exponential-backoff wrapper for any async call
└─ credentials.js — reads/writes API key to the user's home directory
└─ storage/
└─ vectorStore.js — atomic read/write of the local JSON vector index


Core computation (similarity math, hashing) is kept fully separate from anything that touches the network or file system — this made the pure functions trivially unit-testable and meant the embedding provider could be swapped without touching search logic.

## Evaluation

To measure whether semantic search actually outperforms plain-text search, I built a 30-query labeled benchmark across two codebases (CodeSense itself, plus a subset of [commander.js](https://github.com/tj/commander.js)) and compared top-3 retrieval accuracy:

| Method | Top-3 Accuracy |
|---|---|
| **CodeSense (semantic search)** | **83.3%** (25/30) |
| Grep-style keyword baseline | 26.7% (8/30) |

The remaining CodeSense misses were concentrated in very short, structurally similar example files (commander.js's `examples/` folder), where minimal, generic code produces less distinguishing embedding signal — a known limitation of embedding-based search on short/boilerplate content.

## Design tradeoffs & decisions

- **AST-based chunking over pure heuristics**: an early heuristic chunker (splitting on lines containing `function`/`=>`/`class`) produced false splits — e.g., a string literal containing `"=>"` would trigger a spurious chunk boundary. Switching to `@babel/parser` fixed this by chunking on actual language grammar instead of text patterns. Heuristic chunking remains as a fallback for files that fail to parse.
- **Oversized chunk skipping**: AST chunking can produce very large chunks when a whole class (e.g., a large `Command` class with dozens of methods) is treated as one declaration. Chunks over ~10,000 characters are currently skipped rather than embedded, to avoid single requests blowing through free-tier per-minute token limits. A cleaner future fix would be sub-chunking large classes by method.
- **Per-directory index files, not a single merged index**: indexing a second project was found to silently overwrite the first project's saved index, since indexing always rebuilds from scratch. Rather than attempting unsafe partial-merge logic (which risks leaving stale/deleted entries), each indexed directory currently gets its own index file, named based on the target directory.
- **Global credential storage over `.env`**: `.env` files are resolved relative to the current working directory, which broke the tool the moment it was run as a globally-installed command from outside the project folder. API keys are now stored once in `~/.codesense/config.json`, following the pattern used by tools like the GitHub CLI.
- **Lazy API client initialization**: constructing the Gemini client at module load time caused misleading "API key not set" warnings even when running commands (like `--help`) that never touch the API. Clients are now created on first actual use and cached, avoiding both the false warnings and repeated object construction.

## Installation

```bash
npm install -g codesense-rag
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com), then run:

```bash
codesense config YOUR_GEMINI_API_KEY
```

This saves your key once, globally — you won't need to set it again.

## Usage

```bash
codesense index                  # index the current directory
codesense index ../some-project  # index a different directory
codesense ask "how does X work"
codesense explain "how does X work"
```

## Running tests

```bash
npm test
```

## Scope & limitations

- JavaScript/TypeScript only; other languages fall back to heuristic line-based chunking, which is untested at present
- No support yet for merging multiple indexed directories into a single searchable index
- Very large classes/functions may be skipped rather than chunked further
- Free-tier API rate limits (per-minute token caps) can slow down indexing of larger codebases; a fixed delay is used between embedding calls rather than adaptive throttling

## Possible future work

- `watch` mode for real-time re-indexing on file save
- Git-branch-aware index reconciliation
- Sub-chunking of large classes/functions
- Support for additional languages via language-specific parsers
- Adaptive rate-limit throttling instead of a fixed delay

## Tech stack

Node.js, Commander.js, `@babel/parser`, Google Gemini API (`gemini-embedding-001`, `gemini-3.6-flash`), Jest

## License

MIT