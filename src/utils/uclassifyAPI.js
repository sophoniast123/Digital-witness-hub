// uClassify API Integration
// Provides sentiment analysis and mood detection for better threat assessment

import axios from 'axios';

// API Configuration
const UCLASSIFY_API_KEY = import.meta.env.VITE_UCLASSIFY_API_KEY || '';
const UCLASSIFY_BASE_URL = 'https://api.uclassify.com/v1';

/**
 * Analyze sentiment of text (Positive/Negative/Neutral)
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Sentiment analysis result
 */
export const analyzeSentiment = async (text) => {
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: 'No text provided',
      sentiment: 'neutral',
      confidence: 0
    };
  }

  if (!UCLASSIFY_API_KEY) {
    console.warn('uClassify API key not configured. Skipping sentiment analysis.');
    return {
      success: false,
      error: 'API key not configured',
      sentiment: 'unknown',
      confidence: 0
    };
  }

  try {
    const response = await axios.post(
      `${UCLASSIFY_BASE_URL}/uclassify/sentiment/classify`,
      {
        texts: [text]
      },
      {
        headers: {
          'Authorization': `Token ${UCLASSIFY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse response
    const classifications = response.data[0].classification;
    
    // Find the sentiment with highest probability
    let maxProb = 0;
    let sentiment = 'neutral';
    
    for (const [key, value] of Object.entries(classifications)) {
      if (value > maxProb) {
        maxProb = value;
        sentiment = key;
      }
    }

    return {
      success: true,
      sentiment: sentiment, // 'positive', 'negative', or 'neutral'
      confidence: Math.round(maxProb * 100),
      raw: classifications
    };
  } catch (error) {
    console.error('uClassify Sentiment API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
      sentiment: 'unknown',
      confidence: 0
    };
  }
};

/**
 * Analyze mood/emotions in text
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Mood analysis result
 */
export const analyzeMood = async (text) => {
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: 'No text provided',
      mood: 'unknown',
      confidence: 0
    };
  }

  if (!UCLASSIFY_API_KEY) {
    console.warn('uClassify API key not configured. Skipping mood analysis.');
    return {
      success: false,
      error: 'API key not configured',
      mood: 'unknown',
      confidence: 0
    };
  }

  try {
    const response = await axios.post(
      `${UCLASSIFY_BASE_URL}/uclassify/mood/classify`,
      {
        texts: [text]
      },
      {
        headers: {
          'Authorization': `Token ${UCLASSIFY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse response
    const classifications = response.data[0].classification;
    
    // Find the mood with highest probability
    let maxProb = 0;
    let primaryMood = 'neutral';
    
    for (const [key, value] of Object.entries(classifications)) {
      if (value > maxProb) {
        maxProb = value;
        primaryMood = key;
      }
    }

    // Get top 3 moods
    const sortedMoods = Object.entries(classifications)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood, prob]) => ({
        mood,
        probability: Math.round(prob * 100)
      }));

    return {
      success: true,
      primaryMood: primaryMood,
      confidence: Math.round(maxProb * 100),
      topMoods: sortedMoods,
      raw: classifications
    };
  } catch (error) {
    console.error('uClassify Mood API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
      mood: 'unknown',
      confidence: 0
    };
  }
};

/**
 * Detect language of text
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Language detection result
 */
export const detectLanguage = async (text) => {
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: 'No text provided',
      language: 'unknown',
      confidence: 0
    };
  }

  if (!UCLASSIFY_API_KEY) {
    console.warn('uClassify API key not configured. Skipping language detection.');
    return {
      success: false,
      error: 'API key not configured',
      language: 'unknown',
      confidence: 0
    };
  }

  try {
    const response = await axios.post(
      `${UCLASSIFY_BASE_URL}/uclassify/language/classify`,
      {
        texts: [text]
      },
      {
        headers: {
          'Authorization': `Token ${UCLASSIFY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse response
    const classifications = response.data[0].classification;
    
    // Find the language with highest probability
    let maxProb = 0;
    let language = 'unknown';
    
    for (const [key, value] of Object.entries(classifications)) {
      if (value > maxProb) {
        maxProb = value;
        language = key;
      }
    }

    return {
      success: true,
      language: language,
      confidence: Math.round(maxProb * 100),
      raw: classifications
    };
  } catch (error) {
    console.error('uClassify Language API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
      language: 'unknown',
      confidence: 0
    };
  }
};

/**
 * Comprehensive text analysis using multiple uClassify classifiers
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Complete analysis results
 */
export const comprehensiveAnalysis = async (text) => {
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: 'No text provided'
    };
  }

  // Run all analyses in parallel for speed
  const [sentimentResult, moodResult, languageResult] = await Promise.all([
    analyzeSentiment(text),
    analyzeMood(text),
    detectLanguage(text)
  ]);

  return {
    success: sentimentResult.success || moodResult.success || languageResult.success,
    sentiment: sentimentResult,
    mood: moodResult,
    language: languageResult,
    timestamp: new Date().toISOString()
  };
};

export default {
  analyzeSentiment,
  analyzeMood,
  detectLanguage,
  comprehensiveAnalysis
};
