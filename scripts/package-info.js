#!/usr/bin/env node

/**
 * Package information and size analysis utility
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDirectorySize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  });

  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function analyzeDirectory(dirPath, name) {
  try {
    const size = getDirectorySize(dirPath);
    return { name, size, formatted: formatBytes(size) };
  } catch (error) {
    return { name, size: 0, formatted: 'N/A', error: error.message };
  }
}

function main() {
  const rootDir = path.join(__dirname, '..');
  
  console.log('\n📊 Package Size Analysis\n');
  console.log('━'.repeat(50));
  
  // Analyze different directories
  const analyses = [
    analyzeDirectory(path.join(rootDir, 'dist'), 'Compiled Code (dist/)'),
    analyzeDirectory(path.join(rootDir, 'src'), 'Source Code (src/)'),
    analyzeDirectory(path.join(rootDir, 'templates'), 'Templates (templates/)'),
    analyzeDirectory(path.join(rootDir, 'tests'), 'Tests (tests/)'),
    analyzeDirectory(path.join(rootDir, 'docs'), 'Documentation (docs/)'),
  ];

  analyses.forEach(({ name, formatted, error }) => {
    if (error) {
      console.log(`${name.padEnd(35)} ${formatted} (${error})`);
    } else {
      console.log(`${name.padEnd(35)} ${formatted}`);
    }
  });

  console.log('━'.repeat(50));

  // Calculate what will be published
  const distSize = analyses[0].size;
  const readmeSize = fs.existsSync(path.join(rootDir, 'README.md')) 
    ? fs.statSync(path.join(rootDir, 'README.md')).size 
    : 0;
  
  const publishedSize = distSize + readmeSize;
  
  console.log(`\n📦 Published Package Size: ${formatBytes(publishedSize)}`);
  console.log(`   (Only dist/ and README.md are published)\n`);

  // Show what's excluded
  console.log('🚫 Excluded from package (via .npmignore):');
  console.log('   • templates/ - Fetched from GitHub on demand');
  console.log('   • src/ - Source code (only dist/ is published)');
  console.log('   • tests/ - Test files');
  console.log('   • docs/ - Documentation files');
  console.log('   • Development config files\n');

  // File count
  const distFiles = countFiles(path.join(rootDir, 'dist'));
  console.log(`📄 Total files in package: ${distFiles}\n`);
}

function countFiles(dirPath) {
  let count = 0;
  try {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        count += countFiles(filePath);
      } else {
        count++;
      }
    });
  } catch (error) {
    // Directory doesn't exist
  }
  return count;
}

main();
