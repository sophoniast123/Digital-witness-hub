// OCR Text Cleaning and Enhancement Utility
// Improves OCR output by filtering, cleaning, and making text more analyzable

/**
 * Clean and enhance OCR extracted text
 * @param {string} rawText - Raw text from OCR
 * @returns {string} - Cleaned and enhanced text
 */
export const cleanOCRText = (rawText) => {
  if (!rawText || rawText.trim().length === 0) {
    return '';
  }

  let text = rawText;

  // Step 1: Remove non-English characters (keep only English letters, numbers, and basic punctuation)
  // Allows: a-z, A-Z, 0-9, spaces, and common punctuation (.,!?;:'"@#$%&*()-)
  text = text.replace(/[^a-zA-Z0-9\s.,!?;:'"@#$%&*()\-_+=\/\\[\]{}|<>~`]/g, ' ');

  // Step 2: Fix common OCR errors
  text = fixCommonOCRErrors(text);

  // Step 3: Remove excessive whitespace and normalize spaces
  text = text.replace(/\s+/g, ' ');

  // Step 4: Remove lines with too few characters (likely noise)
  const lines = text.split('\n').filter(line => line.trim().length >= 3);
  text = lines.join('\n');

  // Step 5: Fix sentence boundaries
  text = fixSentenceBoundaries(text);

  // Step 6: Remove repeated characters (OCR artifacts like "!!!!!!!" → "!")
  text = text.replace(/(.)\1{3,}/g, '$1$1'); // Max 2 repetitions

  // Step 7: Capitalize first letter of sentences
  text = capitalizeSentences(text);

  // Step 8: Remove standalone single characters (except 'a', 'I')
  text = text.replace(/\b[b-hj-z]\b/gi, ' ');

  // Step 9: Final cleanup
  text = text.trim();
  text = text.replace(/\s+/g, ' '); // Final whitespace normalization

  return text;
};

/**
 * Fix common OCR character recognition errors
 */
const fixCommonOCRErrors = (text) => {
  const corrections = {
    // Common OCR mistakes: wrong character → correct character
    '0': 'o',  // Zero to O (context-dependent, handled below)
    '1': 'l',  // One to l (in some contexts)
    '|': 'I',  // Pipe to I
    '@': 'a',  // When @ appears incorrectly
    '©': 'c',
    '®': 'r',
    '™': 'tm',
    '§': 's',
    'µ': 'u',
    '¢': 'c',
    '£': 'L',
    '¥': 'Y',
    '€': 'E',
  };

  // Apply contextual corrections
  let corrected = text;

  // Fix common word-level errors
  const wordCorrections = {
    // Common misspellings from OCR
    'wh0': 'who',
    'y0u': 'you',
    'y0ur': 'your',
    'w1ll': 'will',
    'w1th': 'with',
    'th1s': 'this',
    'th1nk': 'think',
    'k1ll': 'kill',
    'c0me': 'come',
    'l0ve': 'love',
    'l0ok': 'look',
    'g0': 'go',
    'g0ing': 'going',
    'd0': 'do',
    'd0ing': 'doing',
    'n0': 'no',
    'n0t': 'not',
    's0': 'so',
    't0': 'to',
    'f0r': 'for',
    'y0': 'yo',
    'u r': 'you are',
    'ur': 'your',
    'u': 'you', // Common texting abbreviation
    'r': 'are', // When standalone
    'b4': 'before',
    '2day': 'today',
    '2night': 'tonight',
    '4get': 'forget',
    'cuz': 'because',
    'bcuz': 'because',
    'plz': 'please',
    'pls': 'please',
    'thx': 'thanks',
    'thnx': 'thanks',
    'gonna': 'going to',
    'wanna': 'want to',
    'gotta': 'got to',
    'dunno': 'do not know',
    'kinda': 'kind of',
    'sorta': 'sort of',
  };

  // Apply word-level corrections (case-insensitive)
  for (const [wrong, right] of Object.entries(wordCorrections)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, right);
  }

  return corrected;
};

/**
 * Fix sentence boundaries and punctuation
 */
const fixSentenceBoundaries = (text) => {
  // Ensure space after punctuation
  text = text.replace(/([.!?])([A-Z])/g, '$1 $2');
  
  // Fix missing spaces after commas
  text = text.replace(/,([A-Za-z])/g, ', $1');
  
  // Remove space before punctuation
  text = text.replace(/\s+([.,!?;:])/g, '$1');
  
  return text;
};

/**
 * Capitalize first letter of sentences
 */
const capitalizeSentences = (text) => {
  // Capitalize first character
  text = text.charAt(0).toUpperCase() + text.slice(1);
  
  // Capitalize after sentence endings
  text = text.replace(/([.!?]\s+)([a-z])/g, (match, punctuation, letter) => {
    return punctuation + letter.toUpperCase();
  });
  
  return text;
};

/**
 * Extract meaningful phrases and sentences from OCR text
 * Filters out noise and keeps only coherent text
 */
export const extractMeaningfulText = (text) => {
  if (!text || text.trim().length === 0) {
    return '';
  }

  // Split into sentences
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  
  // Filter meaningful sentences
  const meaningful = sentences.filter(sentence => {
    // Must have at least 3 words
    const wordCount = sentence.split(/\s+/).length;
    if (wordCount < 3) return false;
    
    // Must have at least 50% English letters
    const letterCount = (sentence.match(/[a-zA-Z]/g) || []).length;
    const ratio = letterCount / sentence.length;
    if (ratio < 0.5) return false;
    
    // Must contain at least one common English word
    const commonWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'you', 'i', 'me', 'my', 'your', 'he', 'she', 'they', 'we', 'it', 'to', 'from', 'with', 'for', 'on', 'at', 'in', 'and', 'or', 'but', 'not', 'will', 'can', 'have', 'has', 'had'];
    const lowerSentence = sentence.toLowerCase();
    const hasCommonWord = commonWords.some(word => lowerSentence.includes(` ${word} `) || lowerSentence.startsWith(`${word} `) || lowerSentence.endsWith(` ${word}`));
    
    return hasCommonWord;
  });
  
  return meaningful.join('. ') + (meaningful.length > 0 ? '.' : '');
};

/**
 * Enhance text for better AI analysis
 * Expands abbreviations, normalizes slang, makes text more formal
 */
export const enhanceForAIAnalysis = (text) => {
  if (!text || text.trim().length === 0) {
    return '';
  }

  let enhanced = text;

  // Expand common threatening/abusive abbreviations
  const threatAbbreviations = {
    'kys': 'kill yourself',
    'stfu': 'shut the fuck up',
    'gtfo': 'get the fuck out',
    'kms': 'kill myself',
    'smh': 'shaking my head',
    'wtf': 'what the fuck',
    'af': 'as fuck',
    'asf': 'as fuck',
    'lmao': 'laughing my ass off',
    'lmfao': 'laughing my fucking ass off',
    'omg': 'oh my god',
    'omfg': 'oh my fucking god',
    'ffs': 'for fucks sake',
    'jfc': 'jesus fucking christ',
    'pos': 'piece of shit',
    'sob': 'son of a bitch',
    'mf': 'motherfucker',
    'mofo': 'motherfucker',
    'bitch': 'bitch', // Keep as is for analysis
    'hoe': 'whore',
    'slut': 'slut', // Keep as is for analysis
    'whore': 'whore', // Keep as is for analysis
  };

  // Apply abbreviation expansion (case-insensitive, word boundaries)
  for (const [abbrev, full] of Object.entries(threatAbbreviations)) {
    const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
    enhanced = enhanced.replace(regex, full);
  }

  // Normalize l33t speak (common in harassment)
  const leetSpeak = {
    '4': 'a',
    '3': 'e',
    '1': 'i',
    '0': 'o',
    '7': 't',
    '5': 's',
    '8': 'b',
    '9': 'g',
  };

  // Expand emojis and emoticons to their meaning (helps AI understand context)
  const emoticons = {
    ':)': 'happy',
    ':(': 'sad',
    ':D': 'laughing',
    ';)': 'winking',
    ':P': 'sticking tongue out',
    'xD': 'laughing hard',
    ':/': 'confused',
    ':|': 'neutral',
    ':o': 'surprised',
    ':*': 'kiss',
    '<3': 'heart',
    '</3': 'broken heart',
  };

  for (const [emoticon, meaning] of Object.entries(emoticons)) {
    const escaped = emoticon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    enhanced = enhanced.replace(regex, ` [${meaning}] `);
  }

  // Clean up extra spaces
  enhanced = enhanced.replace(/\s+/g, ' ').trim();

  return enhanced;
};

/**
 * Complete OCR processing pipeline
 * Applies all cleaning, filtering, and enhancement steps
 */
export const processOCRText = (rawText) => {
  if (!rawText || rawText.trim().length === 0) {
    return {
      cleaned: '',
      meaningful: '',
      enhanced: '',
      final: '',
      confidence: 0
    };
  }

  // Step 1: Clean the raw OCR text
  const cleaned = cleanOCRText(rawText);

  // Step 2: Extract meaningful sentences
  const meaningful = extractMeaningfulText(cleaned);

  // Step 3: Enhance for AI analysis
  const enhanced = enhanceForAIAnalysis(meaningful);

  // Step 4: Calculate confidence score
  const confidence = calculateTextConfidence(enhanced);

  return {
    cleaned,
    meaningful,
    enhanced,
    final: enhanced, // Use enhanced version as final output
    confidence
  };
};

/**
 * Calculate confidence score for OCR text quality
 * Returns a score from 0-100
 */
const calculateTextConfidence = (text) => {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  let score = 100;

  // Penalize very short text
  if (text.length < 10) score -= 30;
  else if (text.length < 20) score -= 15;

  // Check word count
  const words = text.split(/\s+/);
  if (words.length < 3) score -= 20;
  else if (words.length < 5) score -= 10;

  // Check for proper capitalization
  const sentences = text.split(/[.!?]+/);
  const capitalizedSentences = sentences.filter(s => {
    const trimmed = s.trim();
    return trimmed.length > 0 && trimmed[0] === trimmed[0].toUpperCase();
  });
  if (capitalizedSentences.length < sentences.length * 0.7) score -= 10;

  // Check letter-to-total ratio (should be mostly letters)
  const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
  const ratio = letterCount / text.length;
  if (ratio < 0.5) score -= 20;
  else if (ratio < 0.7) score -= 10;

  // Bonus for common English words
  const commonWords = ['the', 'you', 'i', 'me', 'my', 'your', 'is', 'are', 'was', 'were', 'will', 'can', 'to', 'from'];
  const lowerText = text.toLowerCase();
  const commonWordCount = commonWords.filter(word => lowerText.includes(word)).length;
  score += Math.min(commonWordCount * 2, 20);

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
};

export default {
  cleanOCRText,
  extractMeaningfulText,
  enhanceForAIAnalysis,
  processOCRText,
  calculateTextConfidence
};
