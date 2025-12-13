// uClassify API Integration
// Provides sentiment analysis and mood detection for better threat assessment
// Routes through Vercel serverless function to avoid CORS issues

// API Configuration - use serverless function endpoint
const API_ENDPOINT = '/api/uclassify';

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


  console.log('🤖 Calling uClassify Sentiment API...');

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        classifier: 'sentiment'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse response
    const classifications = data[0].classification;
    
    // Find the sentiment with highest probability
    let maxProb = 0;
    let sentiment = 'neutral';
    
    for (const [key, value] of Object.entries(classifications)) {
      if (value > maxProb) {
        maxProb = value;
        sentiment = key;
      }
    }

    const result = {
      success: true,
      sentiment: sentiment, // 'positive', 'negative', or 'neutral'
      confidence: Math.round(maxProb * 100),
      raw: classifications
    };

    console.log('✅ uClassify Sentiment Result:', result);
    return result;
  } catch (error) {
    console.error('❌ uClassify Sentiment API Error:', error.response?.data || error.message);
    console.error('Full error:', error);
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


  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        classifier: 'mood'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse response
    const classifications = data[0].classification;
    
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


  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        classifier: 'language'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse response
    const classifications = data[0].classification;
    
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
