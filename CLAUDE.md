# Russel Report Tools - Developer Guide

## Build & Run Commands
- `npm install` - Install dependencies (run in repo root or module folder)
- `cd md_to_pdf && node src/index.js` - Run the markdown converter
- `cd md_to_pdf && ./bin/md2pdf.js -i input.md -o output.pdf` - Convert markdown to PDF
- `cd md_to_pdf && make pdf` - Convert test.md using high-quality settings
- `cd md_to_pdf && make simple` - Convert test.md using simple settings
- `cd md_to_pdf && make direct` - Direct pandoc conversion

## Code Style Guidelines
- **Naming**: camelCase for variables and functions, PascalCase for classes
- **Formatting**: 2-space indentation, single quotes for strings
- **Error Handling**: Use try/catch with descriptive error messages
- **Documentation**: JSDoc comments for functions with @param and @returns
- **Imports**: Group Node.js core modules first, then third-party, then local
- **Modularity**: Organize code into focused modules with single responsibilities
- **Variables**: Use const by default, let when necessary, avoid var
- **Promises**: Prefer async/await over Promise chains for readability

## Architecture
- `src/core/` - Core conversion logic modules
- `src/config/` - Configuration management
- `src/templates/` - LaTeX templates for different document styles
- `bin/` - CLI executable scripts