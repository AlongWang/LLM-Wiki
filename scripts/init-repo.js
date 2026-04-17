#!/usr/bin/env node

/**
 * Repository bootstrap script for new users.
 *
 * Responsibilities:
 * - Create the expected directory skeleton
 * - Optionally run QMD setup if qmd is installed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const skipQmd = process.argv.includes('--skip-qmd');

const requiredDirectories = [
  'raw/documents',
  'raw/codebases',
  'raw/assets/diagrams',
  'raw/assets/images',
  'wiki/summaries',
  'wiki/entities',
  'wiki/concepts',
  'wiki/sources',
  'wiki/analyses',
  'wiki/systems',
  'wiki/components',
  'wiki/services',
  'wiki/data-models',
  'wiki/dependencies',
  'wiki/architectures/diagrams/system-designs',
  'wiki/architectures/relationships',
  'prompts',
];

function ensureDirectory(relativePath) {
  const dirPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created ${relativePath}`);
  }
}

function hasQmd() {
  try {
    execSync('qmd --version', {
      cwd: repoRoot,
      stdio: 'ignore',
    });
    return true;
  } catch (error) {
    return false;
  }
}

console.log('🚀 Initializing LLM Wiki repository...\n');

requiredDirectories.forEach(ensureDirectory);

console.log('\n📁 Repository skeleton is ready.');

if (skipQmd) {
  console.log('\n⏭️  Skipping QMD setup because --skip-qmd was provided.');
  console.log('Run `node scripts/setup-qmd.js` later if you want local search.');
  process.exit(0);
}

if (!hasQmd()) {
  console.log('\n⚠️  QMD is not installed, so only the repository skeleton was initialized.');
  console.log('Install QMD with one of the following commands:');
  console.log('  npm install -g @tobilu/qmd');
  console.log('  bun install -g @tobilu/qmd');
  console.log('\nThen run:');
  console.log('  node scripts/setup-qmd.js');
  process.exit(0);
}

console.log('\n🔍 QMD detected. Running search index setup...\n');

execSync(`node "${path.join(repoRoot, 'scripts', 'setup-qmd.js')}"`, {
  cwd: repoRoot,
  stdio: 'inherit',
});

console.log('\n🎉 Repository initialization complete.');
console.log('Next steps:');
console.log('  1. Put source documents into raw/documents');
console.log('  2. Put codebases into raw/codebases');
console.log('  3. Run qmd update && qmd embed after adding content');
