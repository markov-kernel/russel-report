const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

/**
 * Default configuration for the Markdown to PDF converter
 */
const defaultConfig = {
  // Pandoc settings
  pandoc: {
    binPath: 'pandoc',  // Path to pandoc executable
    pdfEngine: 'xelatex', // PDF engine: xelatex, pdflatex, lualatex
    args: [
      '--pdf-engine={pdfEngine}',
      '--highlight-style={highlightStyle}',
      '--variable=graphics:yes',
      '--variable=linkcolor:blue',
      '--variable=urlcolor:blue',
      '--variable=toccolor:black',
      '--variable=margin-left=1in',
      '--variable=margin-right=1in',
      '--variable=margin-top=1in',
      '--variable=margin-bottom=1in',
      '--variable=pagestyle:headings',
      '--variable=papersize:a4',
      '--variable=documentclass:report',
      '--variable=fontsize:11pt',
      '--variable=mainfontoptions:Numbers=OldStyle',
      '--variable=linestretch:1.15',
      '--variable=booktabs:true',
      '--variable=tables:true',
      '--standalone',
      '--smart'
    ]
  },
  
  // Typography settings
  typography: {
    mainfont: 'Cambria', // Main font for body text
    sansfont: 'Calibri', // Sans-serif font for headings
    monofont: 'Consolas', // Monospace font for code blocks
    fontsize: '11pt', // Base font size
    lineheight: '1.15',
    smallcaps: true, // Use small caps for section headings
    microtype: true, // Enable LaTeX microtype extensions for better typography
    lang: 'dutch', // Default language
    enhanced: true, // Enable enhanced typography features
  },
  
  // PDF output settings
  output: {
    papersize: 'a4', // a4, letter, etc.
    toc: false, // Include table of contents
    tocDepth: 3, // Depth of table of contents
    numbered: true, // Number sections
    coverpage: true, // Include a cover page
    pagestyle: 'headings', // LaTeX pagestyle
    template: 'technical_proposal', // Default template for technical documents
    geometry: 'margin=2.5cm', // Default margins
  },
  
  // Markdown rendering options
  markdown: {
    highlightStyle: 'zenburn', // Better code highlighting style
    smartypants: true, // Convert quotes, dashes, etc.
    citations: true, // Enable citation rendering
    mathSupport: true, // Enable math support
    diagrams: true, // Enable diagram support
    tableStyling: true, // Enable better table styling
  },
  
  // Paths
  paths: {
    templatesDir: path.join(__dirname, '..', 'templates'),
    assetsDir: path.join(__dirname, '..', 'assets'),
    fontsDir: path.join(__dirname, '..', 'assets', 'fonts'),
    cacheDir: path.join(process.cwd(), '.md2pdf-cache'),
  },
  
  // Hooks for extending functionality
  hooks: {
    beforeConversion: null,
    afterConversion: null,
    onError: null,
  }
};

/**
 * Get the default configuration
 * @returns {Object} Default configuration object
 */
function getDefaultConfig() {
  return _.cloneDeep(defaultConfig);
}

/**
 * Merge user configuration with default configuration
 * @param {Object} defaultConfig - Default configuration object
 * @param {Object} userConfig - User configuration object
 * @returns {Object} Merged configuration
 */
function mergeConfig(defaultConfig, userConfig) {
  return _.merge({}, defaultConfig, userConfig);
}

/**
 * Load configuration from file
 * @param {string} configPath - Path to configuration file
 * @returns {Object} Configuration object
 */
function loadConfigFile(configPath) {
  try {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }
    
    const ext = path.extname(configPath).toLowerCase();
    
    if (ext === '.json') {
      return fs.readJsonSync(configPath);
    } else if (ext === '.js') {
      return require(path.resolve(configPath));
    } else {
      throw new Error(`Unsupported configuration file format: ${ext}`);
    }
  } catch (error) {
    throw new Error(`Failed to load configuration file: ${error.message}`);
  }
}

/**
 * Get configuration from command line arguments
 * @param {Object} args - Command line arguments
 * @returns {Object} Configuration object derived from args
 */
function getConfigFromArgs(args) {
  const config = {};
  
  // Map command line args to config
  if (args.pdfEngine) {
    _.set(config, 'pandoc.pdfEngine', args.pdfEngine);
  }
  
  if (args.highlightStyle) {
    _.set(config, 'markdown.highlightStyle', args.highlightStyle);
  }
  
  if (args.toc !== undefined) {
    _.set(config, 'output.toc', args.toc);
  }
  
  if (args.tocDepth) {
    _.set(config, 'output.tocDepth', parseInt(args.tocDepth, 10));
  }
  
  if (args.template) {
    _.set(config, 'output.template', args.template);
  }
  
  return config;
}

/**
 * Resolve template path based on template name
 * @param {Object} config - Configuration object
 * @returns {string} Resolved template path
 */
function resolveTemplatePath(config) {
  const templateName = config.output.template;
  const templatesDir = config.paths.templatesDir;
  
  // Check for built-in templates
  const builtInPath = path.join(templatesDir, `${templateName}.tex`);
  if (fs.existsSync(builtInPath)) {
    return builtInPath;
  }
  
  // Check if it's a custom template path
  if (fs.existsSync(templateName)) {
    return templateName;
  }
  
  // Default to the default template
  return path.join(templatesDir, 'default.tex');
}

module.exports = {
  getDefaultConfig,
  mergeConfig,
  loadConfigFile,
  getConfigFromArgs,
  resolveTemplatePath
};