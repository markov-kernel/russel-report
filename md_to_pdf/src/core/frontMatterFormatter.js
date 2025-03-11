const yaml = require('js-yaml');

/**
 * Convert a JavaScript object to YAML front matter format
 * @param {Object} data - Front matter data
 * @returns {string} YAML string
 */
function objectToYaml(data) {
  try {
    if (!data || Object.keys(data).length === 0) {
      return '';
    }
    return `---\n${yaml.dump(data)}---\n\n`;
  } catch (error) {
    throw new Error(`Failed to convert front matter to YAML: ${error.message}`);
  }
}

/**
 * Format front matter for Pandoc
 * @param {Object} frontMatter - Front matter data from markdown
 * @param {Object} config - Configuration object
 * @returns {string} Formatted front matter
 */
function formatFrontMatter(frontMatter, config) {
  // Start with a copy of the original front matter
  const formatted = { ...frontMatter };
  
  // Add title if not present
  if (!formatted.title && config.title) {
    formatted.title = config.title;
  }
  
  // Add author if not present
  if (!formatted.author && config.author) {
    formatted.author = config.author;
  }
  
  // Add date if not present
  if (!formatted.date && !formatted.date) {
    formatted.date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  // Add mainfont if not present
  if (!formatted.mainfont && config.typography.mainfont) {
    formatted.mainfont = config.typography.mainfont;
  }
  
  // Add sansfont if not present
  if (!formatted.sansfont && config.typography.sansfont) {
    formatted.sansfont = config.typography.sansfont;
  }
  
  // Add monofont if not present
  if (!formatted.monofont && config.typography.monofont) {
    formatted.monofont = config.typography.monofont;
  }
  
  // Add fontsize if not present
  if (!formatted.fontsize && config.typography.fontsize) {
    formatted.fontsize = config.typography.fontsize;
  }
  
  // Add lineheight if not present
  if (!formatted.lineheight && config.typography.lineheight) {
    formatted.lineheight = config.typography.lineheight;
  }
  
  // Add language if not present
  if (!formatted.lang && config.typography.lang) {
    formatted.lang = config.typography.lang;
  }
  
  // Add papersize if not present
  if (!formatted.papersize && config.output.papersize) {
    formatted.papersize = config.output.papersize;
  }
  
  // Add geometry if present in config or front matter
  if (formatted.geometry) {
    // Keep existing geometry from front matter
  } else if (config.output.geometry) {
    formatted.geometry = config.output.geometry;
  } else {
    // Add margin variables if not present and no geometry
    if (!formatted.margin_left) {
      formatted.margin_left = '2.5cm';
    }
    
    if (!formatted.margin_right) {
      formatted.margin_right = '2.5cm';
    }
    
    if (!formatted.margin_top) {
      formatted.margin_top = '3cm';
    }
    
    if (!formatted.margin_bottom) {
      formatted.margin_bottom = '3cm';
    }
  }
  
  // Add linkcolor if not present
  if (!formatted.linkcolor) {
    formatted.linkcolor = 'blue';
  }
  
  // Add toc settings if enabled
  if ((config.output.toc || formatted.toc === true) && !formatted.toc_depth) {
    formatted.toc_depth = config.output.tocDepth;
  }
  
  // Add header includes if needed
  if (formatted.header_includes) {
    // Keep existing header includes from front matter
  } else if (config.headerIncludes) {
    formatted.header_includes = config.headerIncludes;
  }
  
  // Add numbered sections if needed
  if (formatted.numbered === undefined && config.output.numbered) {
    formatted.numbered = true;
  }
  
  // Add document class if needed
  if (!formatted.documentclass && config.output.documentclass) {
    formatted.documentclass = config.output.documentclass;
  }
  
  // Add template specification if needed
  if (!formatted.template && config.output.template) {
    formatted.template = config.output.template;
  }
  
  // Add colorlinks if not present
  if (formatted.colorlinks === undefined) {
    formatted.colorlinks = true;
  }
  
  // Add table styling if not present
  if (formatted.tables === undefined && config.markdown.tableStyling) {
    formatted.tables = true;
    formatted.booktabs = true;
  }
  
  // Convert the object to YAML
  return objectToYaml(formatted);
}

module.exports = {
  formatFrontMatter,
  objectToYaml
};