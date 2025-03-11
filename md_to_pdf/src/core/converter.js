const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const tmp = require('tmp-promise');
const matter = require('gray-matter');
const { resolveTemplatePath } = require('../config/configManager');
const { processAssets } = require('./assetManager');
const { formatFrontMatter } = require('./frontMatterFormatter');

/**
 * Replace template variables in a string
 * @param {string} text - Text with template variables
 * @param {Object} variables - Variable values
 * @returns {string} Text with variables replaced
 */
function replaceTemplateVariables(text, variables) {
  return text.replace(/\{([a-zA-Z0-9_.]+)\}/g, (match, key) => {
    const value = key.split('.').reduce((obj, k) => obj && obj[k], variables);
    return value !== undefined ? value : match;
  });
}

/**
 * Build pandoc arguments based on config
 * @param {Object} config - Configuration object
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @returns {Array} Array of pandoc command line arguments
 */
function buildPandocArgs(config, inputPath, outputPath) {
  const args = [];
  
  // Input and output
  args.push(inputPath);
  args.push('-o', outputPath);
  
  // Template
  const templatePath = resolveTemplatePath(config);
  if (templatePath) {
    args.push('--template', templatePath);
  }
  
  // Table of contents
  if (config.output.toc) {
    args.push('--toc');
    args.push('--toc-depth', config.output.tocDepth.toString());
  }
  
  // Section numbering - for technical template, we'll keep manual numbering
  // and disable automatic numbering to prevent conflicts
  if (templatePath && templatePath.includes('technical')) {
    // For technical template, use manual numbering from markdown
    args.push('--variable', 'numbersections=false');
  } else if (config.output.numbered) {
    // For other templates, use automatic numbering if requested
    args.push('-N');
  }
  
  // PDF engine
  args.push('--pdf-engine', config.pandoc.pdfEngine);
  
  // Code highlighting
  args.push('--highlight-style', config.markdown.highlightStyle);
  
  // Typography settings
  if (config.typography.mainfont) {
    args.push('--variable', `mainfont=${config.typography.mainfont}`);
  }
  
  if (config.typography.sansfont) {
    args.push('--variable', `sansfont=${config.typography.sansfont}`);
  }
  
  if (config.typography.monofont) {
    args.push('--variable', `monofont=${config.typography.monofont}`);
  }
  
  if (config.typography.fontsize) {
    args.push('--variable', `fontsize=${config.typography.fontsize}`);
  }
  
  // Paper size
  args.push('--variable', `papersize=${config.output.papersize}`);
  
  // Line spacing
  if (config.typography.lineheight) {
    args.push('--variable', `linestretch=${config.typography.lineheight}`);
  }
  
  // Microtype
  if (config.typography.microtype) {
    args.push('--variable', 'microtype=true');
  }
  
  // Citations
  if (config.markdown.citations) {
    args.push('--citeproc');
  }
  
  // Math support
  if (config.markdown.mathSupport) {
    args.push('--mathjax');
  }
  
  // Table formatting
  args.push('--variable', 'booktabs=true');
  args.push('--variable', 'tables=true');
  
  // Language support
  if (config.typography.lang) {
    args.push('--variable', `lang=${config.typography.lang}`);
  }
  
  // Basic styling
  args.push('--variable', 'graphics=yes');
  args.push('--variable', 'linkcolor=blue');
  args.push('--variable', 'urlcolor=blue');
  args.push('--variable', 'toccolor=black');
  
  // Margins
  if (config.output.geometry) {
    args.push('--variable', `geometry=${config.output.geometry}`);
  } else {
    args.push('--variable', 'margin-left=1in');
    args.push('--variable', 'margin-right=1in');
    args.push('--variable', 'margin-top=1in');
    args.push('--variable', 'margin-bottom=1in');
  }
  
  // Page style
  args.push('--variable', `pagestyle=${config.output.pagestyle}`);
  
  // Diagrams
  if (config.markdown.diagrams) {
    args.push('--filter', 'pandoc-diagrams');
  }
  
  // Enhanced typesetting features
  args.push('--variable', 'csquotes=true');
  args.push('--variable', 'colorlinks=true');
  args.push('--variable', 'links-as-notes=false');
  
  // Headers and footers
  if (config.output.header) {
    args.push('--variable', `header=${config.output.header}`);
  }
  
  if (config.output.footer) {
    args.push('--variable', `footer=${config.output.footer}`);
  }
  
  // Smart typography (quotes, dashes, etc.)
  args.push('--smart');
  
  // Add support for standalone paragraphs
  args.push('--standalone');
  
  return args;
}

/**
 * Execute pandoc command with provided arguments
 * @param {string} pandocPath - Path to pandoc executable
 * @param {Array} args - Array of command line arguments
 * @param {boolean} verbose - Whether to log verbose output
 * @returns {Promise<string>} Promise resolving to command output
 */
function executePandoc(pandocPath, args, verbose = false) {
  return new Promise((resolve, reject) => {
    if (verbose) {
      console.log(`Executing: ${pandocPath} ${args.join(' ')}`);
    }
    
    const process = spawn(pandocPath, args);
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
      if (verbose) {
        console.log(data.toString());
      }
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
      if (verbose) {
        console.error(data.toString());
      }
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Pandoc exited with code ${code}: ${stderr}`));
      }
    });
    
    process.on('error', (err) => {
      reject(new Error(`Failed to execute pandoc: ${err.message}`));
    });
  });
}

/**
 * Process markdown content before conversion
 * @param {string} content - Markdown content
 * @param {Object} config - Configuration object
 * @returns {Object} Processed content and frontmatter
 */
async function processMarkdown(content, config) {
  // Parse front matter
  const { data, content: markdownContent } = matter(content);
  
  // Format front matter for pandoc
  const frontMatter = formatFrontMatter(data, config);
  
  // Apply document-type specific preprocessing
  let processedMarkdownContent = markdownContent;
  
  // Apply technical document preprocessing if applicable
  if (data.template === 'technical_proposal' || config.output.template === 'technical_proposal') {
    const { processTechnicalDocument } = require('./technicalPreprocessor');
    processedMarkdownContent = processTechnicalDocument(markdownContent);
  }
  
  // Combine front matter and content
  const processedContent = frontMatter + processedMarkdownContent;
  
  return { 
    content: processedContent, 
    frontMatter: data 
  };
}

/**
 * Convert markdown to PDF using pandoc
 * @param {Object} config - Configuration object
 * @returns {Promise<string>} Promise resolving to output file path
 */
async function convertMarkdownToPdf(config) {
  try {
    const inputPath = path.resolve(config.input);
    const outputPath = path.resolve(config.output);
    
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }
    
    // Create output directory if it doesn't exist
    await fs.ensureDir(path.dirname(outputPath));
    
    // Read input markdown file
    const markdownContent = await fs.readFile(inputPath, 'utf8');
    
    // Process markdown content
    const { content: processedContent } = await processMarkdown(
      markdownContent, 
      config
    );
    
    // Process assets in the markdown file
    await processAssets(inputPath, config);
    
    // Create temporary file for processed markdown
    const tempFile = await tmp.file({ postfix: '.md' });
    await fs.writeFile(tempFile.path, processedContent);
    
    // Build pandoc arguments
    const pandocArgs = buildPandocArgs(config, tempFile.path, outputPath);
    
    // Execute pandoc
    await executePandoc(config.pandoc.binPath, pandocArgs, config.verbose);
    
    // Clean up temporary file
    await tempFile.cleanup();
    
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to convert markdown to PDF: ${error.message}`);
  }
}

module.exports = {
  convertMarkdownToPdf,
  buildPandocArgs,
  processMarkdown,
  replaceTemplateVariables
};