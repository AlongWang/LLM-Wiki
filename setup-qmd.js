#!/usr/bin/env node

/**
 * QMD Setup Script for LLM Wiki
 * This script initializes QMD collections and generates embeddings
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up QMD for LLM Wiki...\n');

// Check if QMD is installed
try {
  console.log('Checking QMD installation...');
  execSync('qmd --version', { stdio: 'inherit' });
  console.log('✅ QMD is installed\n');
} catch (error) {
  console.error('❌ QMD is not installed. Please install it first:');
  console.error('   npm install -g @tobilu/qmd');
  console.error('   or');
  console.error('   bun install -g @tobilu/qmd');
  process.exit(1);
}

// Check if wiki directory exists
const wikiPath = path.join(__dirname, 'wiki');
if (!fs.existsSync(wikiPath)) {
  console.log('Creating wiki directory...');
  fs.mkdirSync(wikiPath, { recursive: true });
  console.log('✅ Wiki directory created\n');
}

// Initialize collections
const collections = [
  {
    name: 'wiki',
    path: './wiki',
    mask: '**/*.md',
    description: 'LLM Wiki knowledge base - structured markdown files'
  },
  {
    name: 'raw-documents',
    path: './raw/documents',
    mask: '**/*.md',
    description: 'Source documents - original articles, papers, and design documents'
  },
  {
    name: 'raw-codebases',
    path: './raw/codebases',
    mask: '**/*.{md,ts,js,py,go,rs,java}',
    description: 'Source codebases - code files with documentation'
  }
];

console.log('📦 Initializing collections...\n');

collections.forEach(collection => {
  try {
    console.log(`Adding collection: ${collection.name}`);
    execSync(`qmd collection add ${collection.path} --name ${collection.name} --mask "${collection.mask}"`, { 
      stdio: 'inherit',
      cwd: __dirname
    });
    console.log(`✅ Collection "${collection.name}" added\n`);
  } catch (error) {
    console.log(`⚠️  Collection "${collection.name}" may already exist, skipping...\n`);
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
      cwd: __dirname
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
    cwd: __dirname
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
    cwd: __dirname
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
