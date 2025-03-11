# Makefile for converting test.md to PDF with different quality settings
# Optimized for MacTeX

# Input and output files
INPUT_FILE = ../test.md
OUTPUT_PDF = ../test.pdf

# Check for XeLaTeX (part of MacTeX)
XELATEX_CHECK := $(shell which xelatex >/dev/null 2>&1 && echo "yes" || echo "no")

# Default target with dependency check
all: check-deps pdf

# Dependency check
check-deps:
	@if [ "$(XELATEX_CHECK)" != "yes" ]; then \
		echo "⚠️  XeLaTeX not found in PATH. Make sure MacTeX is properly installed."; \
		echo "   You can install MacTeX from: https://www.tug.org/mactex/"; \
		echo "   After installation, you may need to add /Library/TeX/texbin to your PATH."; \
		exit 1; \
	else \
		echo "✓ MacTeX/XeLaTeX found. Ready to convert."; \
	fi

# High-quality LaTeX conversion (requires full LaTeX installation)
pdf:
	@echo "Converting $(INPUT_FILE) to $(OUTPUT_PDF) with high-quality LaTeX settings..."
	@mkdir -p src/templates
	@node examples/latex_convert.js

# Simple LaTeX conversion (works with basic LaTeX)
simple:
	@echo "Converting $(INPUT_FILE) to $(OUTPUT_PDF) with simple LaTeX settings..."
	@node examples/simple_latex.js

# Direct pandoc command optimized for MacTeX
direct:
	@echo "Converting $(INPUT_FILE) to $(OUTPUT_PDF) with direct pandoc command..."
	@pandoc $(INPUT_FILE) \
		-o $(OUTPUT_PDF) \
		--pdf-engine=xelatex \
		--toc \
		--number-sections \
		--variable=mainfont:"Hoefler Text" \
		--variable=sansfont:"Helvetica Neue" \
		--variable=monofont:Menlo \
		--variable=geometry:margin=2.5cm \
		--variable=colorlinks:true \
		--variable=lang:nl \
		--variable=urlcolor:blue \
		--highlight-style=tango \
		--dpi=300

# Clean up generated files
clean:
	@echo "Cleaning up generated files..."
	@rm -f $(OUTPUT_PDF) src/templates/technical_template.tex

.PHONY: all check-deps pdf simple direct clean