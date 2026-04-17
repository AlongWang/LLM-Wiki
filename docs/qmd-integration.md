# QMD Integration Guide

This guide explains how to use QMD (Query Markup Documents) as the search engine for LLM Wiki.

## What is QMD?

QMD is an on-device search engine that combines:
- **BM25 full-text search** - Fast keyword matching
- **Vector semantic search** - Semantic similarity using embeddings
- **LLM re-ranking** - Best quality results using local LLM models

All models run locally via node-llama-cpp with GGUF models, ensuring data privacy and no external API calls.

## Installation

### Recommended Repository Bootstrap

From the repository root, initialize the directory structure and QMD in one step:

```bash
npm run init:repo
```

If you only want the repository skeleton without QMD setup:

```bash
npm run init:repo:skip-qmd
```

### Prerequisites

- Node.js >= 22 or Bun >= 1.0.0
- macOS: Homebrew SQLite (for extension support)
  ```bash
  brew install sqlite
  ```

### Install QMD

```bash
# Using npm
npm install -g @tobilu/qmd

# Using Bun
bun install -g @tobilu/qmd

# Or run directly without installation
npx @tobilu/qmd ...
bunx @tobilu/qmd ...
```

### First-Time Setup

QMD will automatically download required GGUF models on first use (~2GB total):
- `embeddinggemma-300M-Q8_0` - Vector embeddings (~300MB)
- `qwen3-reranker-0.6b-q8_0` - Re-ranking (~640MB)
- `qmd-query-expansion-1.7B-q4_k_m` - Query expansion (~1.1GB)

Models are cached in `~/.cache/qmd/models/`.

## Configuration

### Using the Configuration File

LLM Wiki includes a pre-configured `qmd.yml` file:

```yaml
collections:
  wiki:
    path: ./wiki
    pattern: "**/*.md"
    description: "LLM Wiki knowledge base"
  
  raw-documents:
    path: ./raw/documents
    pattern: "**/*.md"
    description: "Source documents"
  
  raw-codebases:
    path: ./raw/codebases
    pattern: "**/*.{md,ts,js,py,go,rs,java}"
    description: "Source codebases"

global_context: "LLM Wiki - A persistent knowledge management system"
```

### Initialize Collections

Recommended:

```bash
npm run setup:qmd
```

Manual equivalent:

```bash
# Add wiki collection
qmd collection add ./wiki --name wiki

# Add raw documents collection
qmd collection add ./raw/documents --name raw-documents

# Add raw codebases collection
qmd collection add ./raw/codebases --name raw-codebases --mask "**/*.{md,ts,js,py,go,rs,java}"

# Add context for better search relevance
qmd context add qmd://wiki "LLM Wiki knowledge base - structured markdown files"
qmd context add qmd://wiki/entities "Entity pages - people, organizations, and places"
qmd context add qmd://wiki/concepts "Concept pages - theories, methods, and technologies"
qmd context add qmd://wiki/systems "System pages - software system overviews"
```

### Generate Embeddings

```bash
# Generate vector embeddings for all collections
qmd embed

# Force re-embed everything
qmd embed -f

# Use AST-aware chunking for code files
qmd embed --chunk-strategy auto
```

## Usage

### Search Commands

```bash
# Fast keyword search (BM25)
qmd search "订单系统"

# Semantic search (vector similarity)
qmd vsearch "how to implement authentication"

# Hybrid search with re-ranking (best quality)
qmd query "订单系统架构设计"

# Search within a specific collection
qmd search "API" -c wiki

# Get 10 results with minimum score 0.3
qmd query -n 10 --min-score 0.3 "微服务架构"
```

### Output Formats

```bash
# JSON output for LLM processing
qmd query --json "订单系统"

# Markdown output for documentation
qmd search --md "认证流程"

# CSV output for data analysis
qmd query --csv "数据模型"

# List all relevant files above a threshold
qmd query --all --files --min-score 0.4 "系统架构"
```

### Document Retrieval

```bash
# Get a specific document
qmd get "wiki/systems/order-service/order-service.md"

# Get document by docid (from search results)
qmd get "#abc123"

# Get document starting at line 50, max 100 lines
qmd get "wiki/systems/order-service/order-service.md:50 -l 100"

# Get multiple documents by glob pattern
qmd multi-get "wiki/systems/**/*.md"

# Get multiple documents by comma-separated list
qmd multi-get "doc1.md, doc2.md, #abc123"
```

## MCP Server Integration

QMD provides an MCP (Model Context Protocol) server for seamless integration with Claude Code.

### Configure MCP Server

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    }
  }
}
```

### HTTP Transport (Recommended)

For a shared, long-lived server that avoids repeated model loading:

```bash
# Start HTTP server (foreground)
qmd mcp --http

# Start HTTP server on custom port
qmd mcp --http --port 8080

# Start as background daemon
qmd mcp --http --daemon

# Stop daemon
qmd mcp stop
```

Point any MCP client at `http://localhost:8181/mcp` to connect.

## AI Prompt For Repository Initialization

This repository also includes a reusable prompt file for AI assistants:

```text
prompts/init-repo.prompt.md
```

Use it when you want an agent to read the repository instructions, execute `npm run init:repo`, and verify that QMD is working.

### Available MCP Tools

- `query` - Search with typed sub-queries (`lex`/`vec`/`hyde`), combined via RRF + reranking
- `get` - Retrieve a document by path or docid (with fuzzy matching suggestions)
- `multi_get` - Batch retrieve by glob pattern, comma-separated list, or docids
- `status` - Index health and collection info

## Integration with LLM Wiki Skills

### query-wiki Skill Enhancement

The `query-wiki` skill can use QMD for enhanced search:

```markdown
## Search Strategy

1. Use QMD hybrid search for initial retrieval
2. Apply LLM re-ranking for best quality results
3. Return results with context and scores
4. Generate comprehensive answer with citations

## Example Usage

```bash
# Get structured results for LLM processing
qmd query --json "订单系统架构" -n 10

# Inspect scoring details
qmd query --json --explain "订单系统架构"
```
```

### ingest-codebase Skill Enhancement

The `ingest-codebase` skill can use QMD for code analysis:

```markdown
## Code Analysis Enhancement

1. Use QMD AST-aware chunking for code files
2. Generate vector embeddings automatically
3. Enable semantic code search
4. Support multiple programming languages

## Example Usage

```bash
# Embed code files with AST-aware chunking
qmd embed --chunk-strategy auto

# Semantic code search
qmd vsearch "authentication middleware implementation"
```
```

### lint-wiki Skill Enhancement

The `lint-wiki` skill can use QMD for quality checks:

```markdown
## Quality Checks Enhancement

1. Use QMD to detect similar content
2. Find duplicate or contradictory information
3. Identify orphan pages (no incoming links)
4. Check content freshness

## Example Usage

```bash
# Find similar content
qmd vsearch "订单系统" --min-score 0.8

# Find all pages about a topic
qmd search "订单" --all --files
```
```

## Multilingual Support

For better Chinese, Japanese, and Korean support, use Qwen3-Embedding:

```bash
# Set environment variable
export QMD_EMBED_MODEL="hf:Qwen/Qwen3-Embedding-0.6B-GGUF/Qwen3-Embedding-0.6B-Q8_0.gguf"

# Re-embed all collections with new model
qmd embed -f
```

## Index Maintenance

```bash
# Show index status
qmd status

# Re-index all collections
qmd update

# Re-index with git pull first (for remote repos)
qmd update --pull

# Clean up cache and orphaned data
qmd cleanup
```

## Data Storage

- Index database: `~/.cache/qmd/index.sqlite`
- Models: `~/.cache/qmd/models/`
- Configuration: `./qmd.yml` or inline config

## Performance Tips

1. **Use HTTP Transport** - Avoids repeated model loading
2. **Batch Operations** - Use `multi-get` for multiple documents
3. **Min Score Threshold** - Filter low-quality results with `--min-score`
4. **Collection Scoping** - Search specific collections for faster results
5. **Regular Updates** - Run `qmd update` after adding new content

## Troubleshooting

### Models Not Downloading

Check internet connection and HuggingFace access. Models are downloaded from:
- `https://huggingface.co/ggml-org/embeddinggemma-300M-GGUF`
- `https://huggingface.co/ggml-org/Qwen3-Reranker-0.6B-Q8_0-GGUF`
- `https://huggingface.co/tobil/qmd-query-expansion-1.7B-gguf`

### Slow Search Performance

1. Use `qmd search` (BM25 only) for fast keyword search
2. Use HTTP transport to keep models loaded
3. Reduce result count with `-n` parameter
4. Skip re-ranking with `--no-rerank` (if available)

### Memory Issues

GGUF models run on CPU by default. For GPU acceleration:
- Ensure proper GPU drivers are installed
- Check node-llama-cpp GPU support documentation

## Resources

- [QMD GitHub Repository](https://github.com/tobi/qmd)
- [QMD Documentation](https://github.com/tobi/qmd#readme)
- [node-llama-cpp](https://github.com/withcatai/node-llama-cpp)
- [GGUF Format](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md)
