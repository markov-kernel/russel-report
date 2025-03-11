const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

/**
 * Extract image paths from markdown content
 * @param {string} content - Markdown content
 * @returns {Array<string>} Array of image paths
 */
function extractImagePaths(content) {
  const imagePaths = [];
  
  // Match Markdown image syntax: ![alt text](path/to/image.jpg)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
  let match;
  
  while ((match = markdownImageRegex.exec(content)) !== null) {
    const imagePath = match[1].split(' ')[0]; // Handle cases with title: ![alt](path "title")
    imagePaths.push(imagePath);
  }
  
  // Match HTML image tags: <img src="path/to/image.jpg" />
  const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/g;
  
  while ((match = htmlImageRegex.exec(content)) !== null) {
    imagePaths.push(match[1]);
  }
  
  return imagePaths;
}

/**
 * Optimize an image using sharp
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to write optimized image
 * @param {Object} options - Optimization options
 * @returns {Promise<void>}
 */
async function optimizeImage(inputPath, outputPath, options = {}) {
  const { quality = 85, format = null } = options;
  
  try {
    // Create a sharp instance
    let image = sharp(inputPath);
    
    // Get image metadata
    const metadata = await image.metadata();
    
    // Determine output format based on input or specified format
    const outputFormat = format || metadata.format || 'jpeg';
    
    // Apply appropriate compression based on format
    if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      image = image.jpeg({ quality });
    } else if (outputFormat === 'png') {
      image = image.png({ quality });
    } else if (outputFormat === 'webp') {
      image = image.webp({ quality });
    }
    
    // Write the output file
    await image.toFile(outputPath);
  } catch (error) {
    throw new Error(`Failed to optimize image ${inputPath}: ${error.message}`);
  }
}

/**
 * Process images in a markdown file
 * @param {string} markdownPath - Path to markdown file
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
async function processImages(markdownPath, config) {
  try {
    const content = await fs.readFile(markdownPath, 'utf8');
    const imagePaths = extractImagePaths(content);
    const markdownDir = path.dirname(markdownPath);
    
    // Create cache directory if it doesn't exist
    const cacheDir = path.join(config.paths.cacheDir, 'images');
    await fs.ensureDir(cacheDir);
    
    // Process each image
    for (const relativePath of imagePaths) {
      // Skip external images (URLs)
      if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        continue;
      }
      
      // Resolve absolute path
      const imagePath = path.resolve(markdownDir, relativePath);
      
      // Skip if image doesn't exist
      if (!fs.existsSync(imagePath)) {
        console.warn(`Image not found: ${imagePath}`);
        continue;
      }
      
      // Generate cache filename
      const imageExt = path.extname(imagePath).toLowerCase();
      const imageBasename = path.basename(imagePath, imageExt);
      const cacheFilename = `${imageBasename}_optimized${imageExt}`;
      const cachePath = path.join(cacheDir, cacheFilename);
      
      // Optimize image and save to cache
      await optimizeImage(imagePath, cachePath, {
        quality: 90
      });
    }
  } catch (error) {
    throw new Error(`Failed to process images: ${error.message}`);
  }
}

/**
 * Process all assets in a markdown file
 * @param {string} markdownPath - Path to markdown file
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
async function processAssets(markdownPath, config) {
  try {
    // Process images
    await processImages(markdownPath, config);
    
    // Add additional asset processing here (videos, files, etc.)
  } catch (error) {
    throw new Error(`Failed to process assets: ${error.message}`);
  }
}

module.exports = {
  processAssets,
  processImages,
  optimizeImage,
  extractImagePaths
};