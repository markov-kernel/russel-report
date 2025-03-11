#!/usr/bin/env node

/**
 * Simple script to convert test.md using pandoc with LaTeX
 * Compatible with most LaTeX installations
 */

const { spawn } = require('child_process');
const path = require('path');

// Setup paths - use environment variables if available
const inputPath = process.env.MD2PDF_INPUT 
  ? path.resolve(process.env.MD2PDF_INPUT)
  : path.resolve(__dirname, '../../test.md'); // Default to test.md in repo root

const outputPath = process.env.MD2PDF_OUTPUT
  ? path.resolve(process.env.MD2PDF_OUTPUT)
  : path.resolve(__dirname, '../../test.pdf'); // Default to test.pdf in repo root

console.log('Starting simple pandoc conversion with LaTeX...');

// Basic pandoc command optimized for MacTeX
const pandocArgs = [
  inputPath,
  '-o', outputPath,
  '--pdf-engine=xelatex',  // MacTeX works best with xelatex for Unicode support
  '--toc',
  '--number-sections',
  '--variable', 'documentclass=article',
  '--variable', 'papersize=a4',
  '--variable', 'geometry=margin=2.5cm',
  '--variable', 'colorlinks=true',
  '--variable', 'mainfont=Hoefler Text',  // MacTeX/macOS default font
  '--variable', 'sansfont=Helvetica Neue',  // MacTeX/macOS default font
  '--variable', 'monofont=Menlo',  // MacTeX/macOS default font
  '--variable', 'lang=nl',  // Dutch language code
  '--variable', 'urlcolor=blue',
  '--highlight-style=tango',  // Good for MacTeX default fonts
  '--metadata', 'title=Ontwikkelingsproject – Uitgebreid Aanvraagdocument van markov',
  '--metadata', 'author=Olivier Debeuf De Rijcker',
  '--metadata', 'date=2025-01-01',
  '--dpi=300'  // Higher resolution images
];

console.log(`Command: pandoc ${pandocArgs.join(' ')}`);

// Execute pandoc
const pandocProcess = spawn('pandoc', pandocArgs);

pandocProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

pandocProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

pandocProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`Conversion successful. PDF saved to: ${outputPath}`);
  } else {
    console.error(`Error: Pandoc exited with code ${code}`);
  }
});