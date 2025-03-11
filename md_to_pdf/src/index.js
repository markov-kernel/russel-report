#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { convertMarkdownToPdf } = require('./core/converter');
const { getDefaultConfig, mergeConfig } = require('./config/configManager');
const { version } = require('../package.json');

// Initialize the command line interface
const program = new Command();

program
  .name('md2pdf')
  .description('High-quality Markdown to PDF converter using Pandoc and LaTeX')
  .version(version)
  .option('-i, --input <file>', 'Input markdown file')
  .option('-o, --output <file>', 'Output PDF file')
  .option('-c, --config <file>', 'Custom configuration file')
  .option('-t, --template <name>', 'PDF template to use')
  .option('-w, --watch', 'Watch for changes and automatically rebuild')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--toc', 'Include table of contents')
  .option('--toc-depth <depth>', 'Table of contents depth', '3')
  .option('--highlight-style <style>', 'Code highlighting style', 'pygments')
  .option('--pdf-engine <engine>', 'PDF engine (xelatex, pdflatex, lualatex)', 'xelatex')
  .action(async (options) => {
    try {
      if (!options.input) {
        console.error(chalk.red('Error: Input file is required'));
        program.help();
        return;
      }

      // If output is not specified, use input filename with .pdf extension
      if (!options.output) {
        const inputPath = path.resolve(options.input);
        const parsedPath = path.parse(inputPath);
        options.output = path.join(parsedPath.dir, `${parsedPath.name}.pdf`);
      }

      // Load config
      let config = getDefaultConfig();
      
      if (options.config) {
        const customConfig = require(path.resolve(options.config));
        config = mergeConfig(config, customConfig);
      }

      // Merge command line options into config
      const cliOptions = {
        input: options.input,
        output: options.output,
        template: options.template,
        verbose: options.verbose,
        toc: options.toc,
        tocDepth: options.tocDepth,
        highlightStyle: options.highlightStyle,
        pdfEngine: options.pdfEngine
      };

      config = mergeConfig(config, cliOptions);

      if (options.watch) {
        const chokidar = require('chokidar');
        const inputPath = path.resolve(options.input);
        const watcher = chokidar.watch([
          inputPath,
          path.join(path.dirname(inputPath), '**/*.{md,jpg,jpeg,png,svg}')
        ], {
          ignored: [
            options.output,
            '**/node_modules/**',
            '**/.git/**'
          ],
          persistent: true
        });

        console.log(chalk.blue(`Watching for changes in ${inputPath} and related files...`));

        watcher.on('change', async (changedPath) => {
          console.log(chalk.yellow(`File changed: ${changedPath}`));
          try {
            await convertMarkdownToPdf(config);
            console.log(chalk.green(`✓ PDF rebuilt: ${config.output}`));
          } catch (error) {
            console.error(chalk.red(`Error rebuilding PDF: ${error.message}`));
          }
        });

        // Initial build
        await convertMarkdownToPdf(config);
        console.log(chalk.green(`✓ Initial PDF built: ${config.output}`));
      } else {
        await convertMarkdownToPdf(config);
        console.log(chalk.green(`✓ PDF created: ${config.output}`));
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      if (options.verbose) {
        console.error(error);
      }
      process.exit(1);
    }
  });

// Export program for bin script
module.exports = { program };

// Run directly if called from command line
if (require.main === module) {
  program.parse(process.argv);
}