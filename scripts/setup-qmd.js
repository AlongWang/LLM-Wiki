#!/usr/bin/env node

/**
 * QMD Setup Script for LLM Wiki
 * This script initializes QMD collections and generates embeddings
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function runCommand(command, options = {}) {
  return execSync(command, {
    cwd: repoRoot,
    stdio: 'pipe',
    encoding: 'utf8',
    ...options,
  });
}

function ensureDirectory(dirPath, label) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating ${label} directory...`);
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ ${label} directory created\n`);
  }
}

function getCollectionDetails(name) {
  try {
    const output = runCommand(`qmd collection show ${name}`);
    const currentPath = output.match(/Path:\s+(.+)/)?.[1]?.trim();
    const currentPattern = output.match(/Pattern:\s+(.+)/)?.[1]?.trim();
    return { currentPath, currentPattern };
  } catch (error) {
    return null;
  }
}

console.log('🚀 Setting up QMD for LLM Wiki...\n');

// Check if QMD is installed
try {
  console.log('Checking QMD installation...');
  execSync('qmd --version', { stdio: 'inherit', cwd: repoRoot });
  console.log('✅ QMD is installed\n');
} catch (error) {
  console.error('❌ QMD is not installed. Please install it first:');
  console.error('   npm install -g @tobilu/qmd');
  console.error('   or');
  console.error('   bun install -g @tobilu/qmd');
  process.exit(1);
}

ensureDirectory(path.join(repoRoot, 'wiki'), 'wiki');
ensureDirectory(path.join(repoRoot, 'raw', 'documents'), 'raw/documents');
ensureDirectory(path.join(repoRoot, 'raw', 'codebases'), 'raw/codebases');

// Initialize collections
const collections = [
  {
    name: 'wiki',
    path: path.join(repoRoot, 'wiki'),
    mask: '**/*.md',
    description: 'LLM Wiki knowledge base - structured markdown files'
  },
  {
    name: 'raw-documents',
    path: path.join(repoRoot, 'raw', 'documents'),
    mask: '**/*.md',
    description: 'Source documents - original articles, papers, and design documents'
  },
  {
    name: 'raw-codebases',
    path: path.join(repoRoot, 'raw', 'codebases'),
    mask: '**/*.{md,ts,js,py,go,rs,java}',
    description: 'Source codebases - code files with documentation'
  }
];

console.log('📦 Initializing collections...\n');

collections.forEach(collection => {
  const existingCollection = getCollectionDetails(collection.name);

  try {
    if (
      existingCollection &&
      existingCollection.currentPath === collection.path &&
      existingCollection.currentPattern === collection.mask
    ) {
      console.log(`Collection "${collection.name}" is already configured correctly\n`);
      return;
    }

    if (existingCollection) {
      console.log(`Updating collection: ${collection.name}`);
      execSync(`qmd collection remove ${collection.name}`, {
        stdio: 'inherit',
        cwd: repoRoot,
      });
    } else {
      console.log(`Adding collection: ${collection.name}`);
    }

    execSync(`qmd collection add "${collection.path}" --name ${collection.name} --mask "${collection.mask}"`, {
      stdio: 'inherit',
      cwd: repoRoot,
    });
    console.log(`✅ Collection "${collection.name}" added\n`);
  } catch (error) {
    console.log(`⚠️  Failed to configure collection "${collection.name}": ${error.message}\n`);
    process.exitCode = 1;
  }
});

// Add contexts
console.log('📝 Adding contexts...\n');

const contexts = [
  { path: 'qmd://wiki', context: 'LLM Wiki knowledge base - structured markdown files with entities, concepts, systems, and analyses' },
  { path: 'qmd://wiki/entities', context: 'Entity pages - people, organizations, and places' },
  { path: 'qmd://wiki/concepts', context: 'Concept pages - theories, methods, and technologies' },
  { path: 'qmd://wiki/systems', context: 'System pages - software system overviews and architectures' },
  { path: 'qmd://wiki/components', context: 'Component pages - system modules and components' },
  { path: 'qmd://wiki/services', context: 'Service pages - APIs and services' },
  { path: 'qmd://wiki/data-models', context: 'Data model pages - entities and table structures' },
  { path: 'qmd://wiki/dependencies', context: 'Dependency pages - dependency management and relationships' },
  { path: 'qmd://wiki/architectures', context: 'Architecture pages - system designs and diagrams' },
  { path: 'qmd://wiki/sources', context: 'Source document summaries - extracted key information' },
  { path: 'qmd://wiki/analyses', context: 'Analysis pages - comparisons and query results' }
];

contexts.forEach(({ path, context }) => {
  try {
    console.log(`Adding context for ${path}...`);
    execSync(`qmd context add "${path}" "${context}"`, { 
      stdio: 'inherit',
      cwd: repoRoot
    });
  } catch (error) {
    // Context may already exist, ignore error
  }
});

console.log('✅ Contexts added\n');

// Generate embeddings
console.log('🔍 Generating embeddings...\n');
console.log('This may take a while on first run (downloading models ~2GB)...\n');

try {
  execSync('qmd embed', { 
    stdio: 'inherit',
    cwd: repoRoot
  });
  console.log('\n✅ Embeddings generated\n');
} catch (error) {
  console.error('❌ Failed to generate embeddings');
  console.error('Error:', error.message);
  process.exit(1);
}

// Show status
console.log('📊 Index status:\n');
try {
  execSync('qmd status', { 
    stdio: 'inherit',
    cwd: repoRoot
  });
} catch (error) {
  // Ignore error
}

console.log('\n🎉 QMD setup complete!\n');
console.log('Quick start:');
console.log('  qmd search "订单系统"           # Fast keyword search');
console.log('  qmd vsearch "认证流程"         # Semantic search');
console.log('  qmd query "系统架构设计"       # Hybrid search with reranking');
console.log('\nFor more information, see docs/qmd-integration.md');
