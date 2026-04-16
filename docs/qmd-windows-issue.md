# QMD Windows Compatibility Issue

## Problem

QMD is currently designed for Unix-like systems (macOS and Linux) and has compatibility issues on Windows:

1. **Shell Script**: The `bin/qmd` file is a shell script (`#!/bin/sh`) that cannot run directly on Windows
2. **Path Issues**: The script uses Unix-style paths (`/bin/sh`) that don't exist on Windows
3. **No Windows Binary**: There's no pre-built Windows executable

## Current Status

- ✅ QMD package installed successfully via npm
- ❌ CLI command `qmd` not working on Windows
- ✅ SDK/library mode should work (JavaScript/TypeScript code)

## Solutions

### Option 1: Use QMD SDK (Recommended for Windows)

Instead of using the CLI, use QMD as a Node.js library:

```javascript
// qmd-search.js
const { createStore } = require('@tobilu/qmd');
const path = require('path');

async function main() {
  const store = await createStore({
    dbPath: path.join(__dirname, '.qmd-cache', 'index.sqlite'),
    config: {
      collections: {
        wiki: { 
          path: path.join(__dirname, 'wiki'), 
          pattern: '**/*.md' 
        },
      },
    },
  });

  // Search
  const results = await store.search({ query: "订单系统" });
  console.log(results);

  await store.close();
}

main().catch(console.error);
```

Run with:
```bash
node qmd-search.js
```

### Option 2: Use WSL (Windows Subsystem for Linux)

Install WSL and run QMD in a Linux environment:

1. Enable WSL:
   ```powershell
   wsl --install
   ```

2. Install Node.js in WSL:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Install and run QMD in WSL:
   ```bash
   npm install -g @tobilu/qmd
   qmd --version
   ```

### Option 3: Use Alternative Search Tools

Consider these Windows-compatible alternatives:

#### 1. **Meilisearch**
- Full-text search engine
- Windows support
- Easy to set up
- https://www.meilisearch.com/

#### 2. **Typesense**
- Fast, typo-tolerant search
- Windows support
- Open source
- https://typesense.org/

#### 3. **Elasticsearch**
- Powerful search engine
- Windows support
- Feature-rich
- https://www.elastic.co/

#### 4. **SQLite FTS5**
- Built into SQLite
- Full-text search
- No external dependencies
- Already available

### Option 4: Build Windows Binary

Build a Windows-compatible version of QMD:

1. Clone the repository:
   ```bash
   git clone https://github.com/tobi/qmd.git
   cd qmd
   ```

2. Modify `bin/qmd` to be Windows-compatible or create a new entry point

3. Build and test

## Recommended Approach for LLM Wiki

### Short-term (Immediate)

Use **SQLite FTS5** for basic search functionality:

```javascript
// simple-search.js
const Database = require('better-sqlite3');
const db = new Database('wiki-search.db');

// Create FTS5 table
db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS wiki_fts USING fts5(
    title,
    content,
    path,
    tokenize = 'porter unicode61'
  );
`);

// Search function
function search(query) {
  const stmt = db.prepare(`
    SELECT title, path, snippet(wiki_fts, 1, '>>>', '<<<', '...', 10) as snippet
    FROM wiki_fts
    WHERE wiki_fts MATCH ?
    ORDER BY rank
    LIMIT 10
  `);
  return stmt.all(query);
}
```

### Medium-term

Use **QMD SDK** for advanced search:

```javascript
// qmd-sdk.js
const { createStore } = require('@tobilu/qmd');

class WikiSearch {
  constructor() {
    this.store = null;
  }

  async initialize() {
    this.store = await createStore({
      dbPath: './.qmd-cache/index.sqlite',
      config: {
        collections: {
          wiki: { path: './wiki', pattern: '**/*.md' },
        },
      },
    });
  }

  async search(query, options = {}) {
    if (!this.store) await this.initialize();
    
    return await this.store.search({
      query,
      limit: options.limit || 10,
      minScore: options.minScore || 0.3,
    });
  }

  async close() {
    if (this.store) await this.store.close();
  }
}

module.exports = WikiSearch;
```

### Long-term

Wait for official Windows support from QMD or contribute Windows compatibility patches to the project.

## Integration with Skills

Update the skills to use the SDK approach:

### query-wiki Skill

```markdown
## Search Implementation

Use QMD SDK for search:

\`\`\`javascript
const WikiSearch = require('./qmd-sdk');

async function searchWiki(query) {
  const searcher = new WikiSearch();
  const results = await searcher.search(query);
  await searcher.close();
  return results;
}
\`\`\`
```

## Next Steps

1. **Test QMD SDK** - Verify SDK mode works on Windows
2. **Implement SDK Wrapper** - Create a simple wrapper for common operations
3. **Update Skills** - Modify skills to use SDK instead of CLI
4. **Document Approach** - Update documentation with Windows-specific instructions

## Resources

- [QMD GitHub Issues](https://github.com/tobi/qmd/issues) - Check for Windows support discussions
- [Node.js on Windows](https://nodejs.org/en/docs/) - Node.js Windows documentation
- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/) - Windows Subsystem for Linux
