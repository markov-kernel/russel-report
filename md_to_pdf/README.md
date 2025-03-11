# High-Quality Markdown to PDF Converter

A Pandoc and LaTeX-based Markdown to PDF converter designed for exceptional typography and document quality, optimized for MacTeX.

This module is part of the [Russel Report Tools](../README.md) collection but can be used independently.

## Features

- **Beautiful Typography**: Optimized font selection, spacing, and layout
- **Multiple Conversion Options**: High-quality or simple conversion paths
- **MacTeX Optimization**: Specifically tuned for optimal results with MacTeX
- **Code Highlighting**: Syntax highlighting with Zenburn or Tango themes
- **Dutch Language Support**: Built-in support for Dutch documents
- **Smart Quotes and Dashes**: Proper typographic quotes and dashes
- **Custom Styling**: Beautiful blue callouts for blockquotes
- **Enhanced Tables**: Clean, professional tables with proper spacing
- **Math Support**: Full LaTeX math formula support
- **Command-line Interface**: Simple CLI for easy integration
- **Markdown Validation**: Built-in tool to detect and fix formatting issues
- **Automatic Section Numbering**: Clean, consistent document structure

## Prerequisites

- **Node.js** >= 14.x
- **Pandoc** >= 2.11
- **MacTeX** (full installation recommended for best results)

### Installing MacTeX

```bash
# Install MacTeX using Homebrew
brew install --cask mactex

# After installation, you may need to add /Library/TeX/texbin to your PATH
export PATH="/Library/TeX/texbin:$PATH"
```

Or download from [MacTeX website](https://www.tug.org/mactex/)

## Installation

```bash
# Navigate to the module directory
cd md_to_pdf

# Install dependencies
npm install

# Optional: Make the CLI executable
chmod +x bin/md2pdf.js
```

## Usage

### Workflow Overview

For best results, follow this workflow:

1. **Create or Edit Markdown**: Follow the [Markdown Guidelines](#markdown-guidelines)
2. **Validate Formatting**: Use the validator to check for issues
3. **Convert to PDF**: Use the CLI or Make commands

### Step 1: Validate Your Markdown

The validator checks for common formatting issues that can affect PDF output:

```bash
# Validate a single markdown file
npm run validate path/to/file.md

# Validate all markdown files in a directory
npm run validate docs/input/

# Get help
node src/utils/markdown-validator.js --help
```

### Step 2: Convert to PDF

#### Using the CLI

```bash
# Basic usage
./bin/md2pdf.js -i input.md -o output.pdf

# Simple conversion (faster, less features)
./bin/md2pdf.js -i input.md -o output.pdf --simple

# Show help
./bin/md2pdf.js --help
```

#### Using Make

```bash
# High-quality conversion
make pdf

# Simple conversion
make simple

# Direct pandoc command (most compatible)
make direct

# Show dependency check
make check-deps
```

## Customization

### Templates

The converter includes specialized templates:

1. **High-Quality Template**: `examples/latex_convert.js`
   - Custom typography with Hoefler Text, Helvetica Neue, and Menlo
   - Professional headers and footers
   - Beautiful blue callouts for blockquotes
   - Enhanced table styling
   - Proper Dutch language support

2. **Simple Template**: `examples/simple_latex.js`
   - Lightweight with fewer dependencies
   - Still produces good-looking documents
   - Works with any LaTeX installation

### Customizing Document Styling

You can customize the document appearance by modifying the LaTeX templates:

1. **Font Selection**: Change the fonts in the template files
   ```tex
   \setmainfont{Your Font Name}
   \setsansfont{Your Sans Font}
   \setmonofont{Your Mono Font}
   ```

2. **Color Scheme**: Modify the color definitions
   ```tex
   \definecolor{darkblue}{RGB}{0, 65, 118}
   \definecolor{mediumblue}{RGB}{0, 102, 204}
   ```

3. **Margins and Page Layout**: Adjust the geometry settings
   ```tex
   \geometry{a4paper, margin=2cm, includeheadfoot}
   ```

4. **Spacing**: Change the line spacing
   ```tex
   \linespread{1.2}  % Wider line spacing
   ```

### Markdown Front Matter

You can customize individual documents using front matter at the top of your Markdown files:

```markdown
---
title: "Document Title"
author: "Author Name"
date: "2025-03-11"
lang: "nl"
mainfont: "Palatino"
sansfont: "Optima"
monofont: "Menlo"
fontsize: "12pt"
linestretch: 1.2
geometry: "margin=3cm"
toc: true
---

# Document content starts here
```

## Examples

```bash
# Convert the test document
make pdf

# Clean up generated files
make clean
```

### Example Output

This converter produces professional-quality PDF documents with:

- Beautiful typography with proper kerning and ligatures
- Professional-looking headers with blue styling
- Clean, well-formatted tables with booktabs style
- Syntax-highlighted code blocks
- Attractive blue call-out boxes for quotes
- Properly formatted mathematics

## Markdown Guidelines {#markdown-guidelines}

For optimal results, follow these key formatting guidelines:

### Document Structure
- Use proper heading hierarchy (# for title, ## for sections, etc.)
- Let the converter handle section numbering automatically
- Include metadata at the top of your document (author, date)

### Spacing
- Add blank lines before and after lists, blockquotes, and tables
- Use consistent indentation (2 spaces per level) for nested lists
- Avoid manually hyphenating words at line breaks

### Lists
- Use hyphens (-) for bullet lists
- For nested items, indent with exactly 2 spaces per level
- Ensure a blank line before the first item and after the last item

### Example Document
See `docs/input/to_process/test-clean.md` for a properly formatted example.

## Troubleshooting

### Formatting Issues
- **Problem**: List items, blockquotes, or tables don't render correctly
- **Solution**: Run `npm run validate` on your document and fix any reported issues

### Common Conversion Issues

1. **XeLaTeX Not Found**
   - **Problem**: Error message "xelatex not found"
   - **Solution**: Ensure MacTeX is installed and /Library/TeX/texbin is in your PATH
   
2. **Font Not Found**
   - **Problem**: Error about missing fonts
   - **Solution**: Use system-installed fonts or modify the template to use available fonts
   
3. **Unicode Characters Not Rendering**
   - **Problem**: Special characters appear as boxes or question marks
   - **Solution**: Ensure you're using XeLaTeX (not pdfLaTeX) and proper Unicode fonts

### Getting Help

If you encounter issues not covered here:

1. Check the MacTeX and Pandoc documentation
2. Examine the Pandoc and LaTeX error messages
3. File an issue in the repository

## Advanced Usage

### Using Custom Filters

You can extend Pandoc's capabilities with filters:

```bash
# Using a custom filter
./bin/md2pdf.js -i input.md -o output.pdf --filter=my-filter.js
```

### Integration with Other Tools

This module can be integrated with other documentation workflows:

```javascript
// Example integration in a Node.js script
const { spawn } = require('child_process');
const converter = spawn('make', ['pdf'], { cwd: './md_to_pdf' });

converter.on('close', (code) => {
  console.log(`Conversion completed with code ${code}`);
  // Process the generated PDF...
});
```

## Project Structure

```
md_to_pdf/
├── bin/                   # CLI executable
├── examples/              # Example conversion scripts
├── src/                   # Source files
│   ├── core/              # Core conversion logic
│   ├── templates/         # LaTeX templates
│   └── utils/             # Utility functions
├── Makefile               # Make targets
├── package.json           # Dependencies
└── README.md              # This file
```

## Contributing

Contributions to improve this module are welcome:

1. **Bug Fixes**: Help identify and fix issues
2. **New Features**: Add support for additional document elements
3. **Template Improvements**: Enhance the LaTeX templates
4. **Documentation**: Improve the README and add examples

Please follow these guidelines:
- Maintain the existing code style
- Add comments to explain complex logic
- Test your changes thoroughly before submitting

## Future Enhancements

Planned improvements for future versions:

- [ ] Support for additional languages
- [ ] More document templates (technical, legal, letter)
- [ ] Bibliography and citation support
- [ ] Image optimization and auto-sizing
- [ ] Table of figures and table of tables
- [ ] PDF metadata and document properties

## License

MIT