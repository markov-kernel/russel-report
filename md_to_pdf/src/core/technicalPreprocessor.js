/**
 * Technical document preprocessor
 * Enhances tables, blockquotes, and other elements in technical documents
 */

/**
 * Process tables for better formatting
 * @param {string} content - Markdown content
 * @returns {string} Processed content with enhanced tables
 */
function enhanceTables(content) {
  // Find Markdown tables
  const tableRegex = /\n(\|[^\n]+\|\n\|[-:| ]+\|\n(?:\|[^\n]+\|\n)+)/g;
  
  return content.replace(tableRegex, (match, table) => {
    // Add a caption if the table is preceded by a line starting with "Table:"
    const lines = match.split('\n');
    let caption = '';
    let tableWithCaption = match;
    
    // Check for table caption in previous line
    if (content.includes(`\nTable: ${lines[1]}`)) {
      caption = `\n: Table caption\n`;
      tableWithCaption = match + caption;
    }
    
    // Add extra spacing for better readability
    return `\n\n${tableWithCaption}\n\n`;
  });
}

/**
 * Process blockquotes for better styling
 * @param {string} content - Markdown content
 * @returns {string} Processed content with enhanced blockquotes
 */
function enhanceBlockquotes(content) {
  // Find blockquotes that start with "> **"
  // These are often styled quotes or notes in technical documents
  const quoteRegex = /\n(>[^\n]*?\*\*[^\n]*?\*\*[^\n]*?\n(?:>[^\n]*?\n)*)/g;
  
  return content.replace(quoteRegex, (match, quote) => {
    // Add spacing for better separation
    return `\n\n${quote}\n\n`;
  });
}

/**
 * Process bullet points to ensure consistent formatting
 * @param {string} content - Markdown content
 * @returns {string} Processed content with enhanced bullet points
 */
function enhanceBulletPoints(content) {
  // First, properly format lists that appear after bold text/headers
  // This is a common pattern in technical documents: "**Header:** - item1 - item2"
  content = content.replace(/(\*\*[^*\n]+\*\*:?)\s*\n([ ]*[-*+] )/g, '$1\n\n$2');
  
  // Find and process blocks of lists, including nested lists
  // Look for both indented and non-indented list items
  const listBlockRegex = /\n((?:[ ]*[-*+][^\n]+\n(?:[ ]*[-*+][^\n]+\n|[ ]+[^\n]+\n)*))/g;
  
  return content.replace(listBlockRegex, (match, list) => {
    // Standardize bullet style (use - instead of * or +)
    let standardizedList = list.replace(/^([ ]*)([*+])/gm, '$1-');
    
    // Ensure proper spacing in list items with colons
    standardizedList = standardizedList.replace(/^([ ]*- \*\*[^:]+):(.*)/gm, '$1:$2');
    
    // Ensure nested items have proper indentation
    standardizedList = standardizedList.replace(/^([ ]+)([^-\s])/gm, '$1  $2');
    
    // Add spacing for better separation
    return `\n\n${standardizedList}\n\n`;
  });
}

/**
 * Process description lists (term: definition) format
 * @param {string} content - Markdown content
 * @returns {string} Processed content with enhanced description lists
 */
function enhanceDescriptionLists(content) {
  // Find lines that match a description list pattern (term: definition)
  const descRegex = /\n((?:[^\n:]+:[ \t]+[^\n]+\n)+)/g;
  
  return content.replace(descRegex, (match, descList) => {
    // Convert to proper markdown description list format
    const formattedList = descList.replace(/^([^:]+):[ \t]+([^\n]+)$/gm, '$1\n: $2');
    
    // Add spacing for better separation
    return `\n\n${formattedList}\n\n`;
  });
}

/**
 * Process section headings for better spacing
 * @param {string} content - Markdown content
 * @returns {string} Processed content with enhanced section headings
 */
function enhanceSectionHeadings(content) {
  // Add proper spacing before and after headings
  content = content.replace(/\n(#{1,6} .+)\n/g, '\n\n$1\n\n');
  
  return content;
}

/**
 * Process code blocks for better syntax highlighting
 * @param {string} content - Markdown content
 * @returns {string} Processed content with enhanced code blocks
 */
function enhanceCodeBlocks(content) {
  // Find code blocks and ensure they have a language specified
  const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
  
  return content.replace(codeBlockRegex, (match, lang, code) => {
    // If no language is specified, try to detect it or default to text
    const language = lang || 'text';
    return '```' + language + '\n' + code + '```';
  });
}

/**
 * Process the entire document with all enhancements
 * @param {string} content - Markdown content
 * @returns {string} Fully processed content
 */
function processTechnicalDocument(content) {
  let processed = content;
  
  // Apply all enhancements
  processed = enhanceTables(processed);
  processed = enhanceBlockquotes(processed);
  processed = enhanceBulletPoints(processed);
  processed = enhanceDescriptionLists(processed);
  processed = enhanceSectionHeadings(processed);
  processed = enhanceCodeBlocks(processed);
  
  // Remove multiple consecutive blank lines (more than 2)
  processed = processed.replace(/\n{3,}/g, '\n\n');
  
  return processed;
}

module.exports = {
  processTechnicalDocument,
  enhanceTables,
  enhanceBlockquotes,
  enhanceBulletPoints,
  enhanceDescriptionLists,
  enhanceSectionHeadings,
  enhanceCodeBlocks
};