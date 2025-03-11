#!/usr/bin/env node

/**
 * Command-line interface for the Markdown to PDF converter
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// Parse command-line arguments
const args = process.argv.slice(2);
let inputFile = '';
let outputFile = '';
let useHighQuality = true;

// Simple argument parsing
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-i' || args[i] === '--input') {
    inputFile = args[i + 1];
    i++;
  } else if (args[i] === '-o' || args[i] === '--output') {
    outputFile = args[i + 1];
    i++;
  } else if (args[i] === '--simple') {
    useHighQuality = false;
  } else if (args[i] === '-h' || args[i] === '--help') {
    console.log(`
Markdown to PDF converter

Usage:
  md2pdf -i <input-file> [-o <output-file>] [--simple]

Options:
  -i, --input <file>  Input markdown file (required)
  -o, --output <file> Output PDF file (defaults to input filename with .pdf extension)
  --simple            Use simple conversion mode (faster, less features)
  -h, --help          Display this help message
    `);
    process.exit(0);
  }
}

// Check if input file is provided
if (!inputFile) {
  console.error('Error: Input file is required. Use -i or --input option.');
  process.exit(1);
}

// Resolve input path
const inputPath = path.resolve(inputFile);

// Check if input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

// Set output path
if (!outputFile) {
  const inputParsed = path.parse(inputPath);
  outputFile = path.join(inputParsed.dir, `${inputParsed.name}.pdf`);
}
const outputPath = path.resolve(outputFile);

// Choose the script to use
const scriptPath = useHighQuality
  ? path.join(__dirname, '../examples/latex_convert.js')
  : path.join(__dirname, '../examples/simple_latex.js');

// Execute the conversion script
const child = spawn('node', [scriptPath], {
  env: {
    ...process.env,
    MD2PDF_INPUT: inputPath,
    MD2PDF_OUTPUT: outputPath
  }
});

// Handle script output
child.stdout.on('data', (data) => {
  console.log(data.toString());
});

child.stderr.on('data', (data) => {
  console.error(data.toString());
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`Conversion failed with code ${code}`);
    process.exit(code);
  }
});