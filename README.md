# Russel Report Tools

A collection of tools for creating high-quality reports, presentations, and documents with exceptional typography and professional formatting.

## Project Structure

This project is organized as a multi-module repository:

- `md_to_pdf/` - High-quality Markdown to PDF converter
- `data_report/` - Data reporting module
  - `src/datareport.tsx` - Data report component
  - `assets/logo.jpg` - Logo for the data report
- More modules to be added (e.g., md-to-slides)

## Key Features

- **Beautiful Typography**: Professional font selection, spacing, and layout
- **Multiple Document Types**: Reports, academic papers, business documents
- **Code Highlighting**: Syntax highlighting for programming code
- **Math Support**: LaTeX math support for equations and formulas
- **Data Visualization**: Generate data-rich reports with charts and tables
- **Customizable**: Easily adapt to various document requirements
- **Multiple Languages**: Support for Dutch and other languages

## Modules

### Markdown to PDF Converter

The Markdown to PDF module (`md_to_pdf/`) provides a powerful converter that turns Markdown files into professionally typeset PDF documents using Pandoc and LaTeX.

```bash
# Navigate to the module directory
cd md_to_pdf

# Install dependencies
npm install

# Convert a document
./bin/md2pdf.js -i ../test.md -o ../output.pdf
```

For detailed usage instructions, see the [Markdown to PDF README](./md_to_pdf/README.md).

### Data Report Module

The data report module provides functionality for generating data-rich reports:

```bash
# Navigate to the data report directory
cd data_report

# Install dependencies
npm install

# Generate a report
node src/datareport.tsx -i input.json -o report.pdf
```

## Installation

Each module can be installed independently:

```bash
# Install the Markdown to PDF converter
cd md_to_pdf
npm install

# Install the Data Report module
cd ../data_report
npm install
```

## Usage

See each module's README for specific usage instructions:

- [Markdown to PDF Converter](./md_to_pdf/README.md)
- Data Report Module (documentation coming soon)

## Prerequisites

### Global Requirements

- Node.js >= 14.x

### Markdown to PDF Module Requirements

- Pandoc >= 2.11
- MacTeX (full installation recommended)

To install MacTeX:

```bash
# Using Homebrew
brew install --cask mactex

# Add TeX tools to PATH
export PATH="/Library/TeX/texbin:$PATH"
```

## Examples

Example files are available in each module directory:

- `md_to_pdf/examples/` - Sample conversion scripts
- `test.md` - Sample Markdown document for testing

## Development

To contribute to this project:

1. Choose the appropriate module for your feature or fix
2. Make your changes following the existing code style
3. Test thoroughly with the provided examples
4. Submit a pull request with a clear description of your changes

## License

MIT