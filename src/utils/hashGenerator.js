// Cryptographic Fingerprint Generator
// Generates SHA-256 hashes for files - think of it as "digital DNA"
// One tiny change → completely different hash

/**
 * Generate SHA-256 hash from a file
 * @param {File} file - The file to hash
 * @returns {Promise<Object>} Hash result with hex string and metadata
 */
export const generateFileHash = async (file) => {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Generate SHA-256 hash using Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    
    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return {
      hash: hashHex,
      algorithm: 'SHA-256',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      timestamp: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      fileName: file.name
    };
  }
};

/**
 * Generate SHA-256 hash from text/string content
 * @param {string} text - The text to hash
 * @returns {Promise<Object>} Hash result with hex string
 */
export const generateTextHash = async (text) => {
  try {
    // Convert text to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return {
      hash: hashHex,
      algorithm: 'SHA-256',
      textLength: text.length,
      timestamp: new Date().toISOString(),
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate hash for multiple files
 * @param {FileList|Array<File>} files - Files to hash
 * @returns {Promise<Array>} Array of hash results
 */
export const generateBatchHashes = async (files) => {
  const fileArray = Array.from(files);
  const hashPromises = fileArray.map(file => generateFileHash(file));
  return await Promise.all(hashPromises);
};

/**
 * Verify if a file matches a given hash
 * @param {File} file - The file to verify
 * @param {string} expectedHash - The expected hash to compare against
 * @returns {Promise<Object>} Verification result
 */
export const verifyFileHash = async (file, expectedHash) => {
  const result = await generateFileHash(file);
  
  if (!result.success) {
    return {
      verified: false,
      error: result.error
    };
  }
  
  const matches = result.hash.toLowerCase() === expectedHash.toLowerCase();
  
  return {
    verified: matches,
    hash: result.hash,
    expectedHash: expectedHash,
    fileName: file.name,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format hash for display (with spacing for readability)
 * @param {string} hash - The hash string to format
 * @returns {string} Formatted hash
 */
export const formatHash = (hash) => {
  if (!hash) return '';
  // Insert space every 8 characters for readability
  return hash.match(/.{1,8}/g).join(' ');
};

/**
 * Generate a hash certificate (formatted text for documentation)
 * @param {Object} hashResult - Result from generateFileHash
 * @returns {string} Formatted certificate text
 */
export const generateHashCertificate = (hashResult) => {
  if (!hashResult.success) {
    return `Hash Generation Failed\nError: ${hashResult.error}`;
  }
  
  const certificate = `
═══════════════════════════════════════════════════════
           CRYPTOGRAPHIC FINGERPRINT CERTIFICATE
═══════════════════════════════════════════════════════

File Name:      ${hashResult.fileName}
File Size:      ${formatFileSize(hashResult.fileSize)}
File Type:      ${hashResult.fileType || 'Unknown'}
Algorithm:      ${hashResult.algorithm}
Generated:      ${new Date(hashResult.timestamp).toLocaleString()}

SHA-256 Hash (Digital Fingerprint):
${formatHash(hashResult.hash)}

Full Hash:
${hashResult.hash}

═══════════════════════════════════════════════════════
NOTE: This cryptographic hash serves as a unique digital
fingerprint. Any modification to the file, no matter how
small, will result in a completely different hash value.
This can be used to verify file integrity and authenticity.
═══════════════════════════════════════════════════════
  `.trim();
  
  return certificate;
};

/**
 * Helper function to format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default {
  generateFileHash,
  generateTextHash,
  generateBatchHashes,
  verifyFileHash,
  formatHash,
  generateHashCertificate
};
