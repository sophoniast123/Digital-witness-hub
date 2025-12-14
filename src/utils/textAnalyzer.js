// AI-powered text analysis for digital abuse classification
import { comprehensiveAnalysis } from './uclassifyAPI.js';

export const analyzeText = async (description) => {
  const text = description.toLowerCase();
  
  // Define keywords for different types of abuse
  const categories = {
    cyberstalking: {
      keywords: ['follow', 'track', 'watching', 'monitoring', 'everywhere', 'stalking', 'obsessed', 'won\'t leave me alone'],
      severity: 'high'
    },
    harassment: {
      keywords: ['harass', 'bully', 'threaten', 'intimidate', 'insult', 'abuse', 'attack', 'won\'t stop'],
      severity: 'high'
    },
    imageBasedAbuse: {
      keywords: ['nude photo', 'nude picture', 'nude image', 'nude video', 'intimate photo', 'intimate picture', 'intimate image', 'intimate video', 'revenge porn', 'naked photo', 'naked picture', 'sexual photo', 'sexual picture', 'sexual image', 'sexual video', 'private photo', 'private picture', 'without consent', 'without permission', 'leaked photo', 'leaked image', 'leaked video', 'exposed photo', 'exposed image', 'shared my photo', 'shared my picture', 'posted my photo', 'posted my picture', 'nude'],
      severity: 'critical'
    },
    impersonation: {
      keywords: ['fake account', 'pretend', 'impersonate', 'fake profile', 'identity', 'posing as'],
      severity: 'high'
    },
    doxxing: {
      keywords: ['address', 'phone number', 'personal information', 'dox', 'location', 'exposed my'],
      severity: 'critical'
    },
    threats: {
      keywords: ['kill', 'hurt', 'harm', 'violence', 'attack', 'threaten', 'going to', 'will hurt', 'will find you', 'watch your back'],
      severity: 'critical'
    },
    sexualHarassment: {
      keywords: ['sexual', 'inappropriate', 'explicit', 'unwanted advances', 'creep', 'pervert', 'rape'],
      severity: 'high'
    },
    cyberbullying: {
      keywords: ['rumor', 'lie', 'gossip', 'defame', 'humiliate', 'embarrass', 'mock', 'make fun'],
      severity: 'medium'
    }
  };

  // Count keyword matches
  let detectedCategories = [];
  let allKeywords = [];
  let maxSeverity = 'low';

  for (const [category, data] of Object.entries(categories)) {
    const matches = data.keywords.filter(keyword => text.includes(keyword));
    if (matches.length > 0) {
      detectedCategories.push(category);
      allKeywords.push(...matches);
      
      // Update severity level
      if (data.severity === 'critical') {
        maxSeverity = 'critical';
      } else if (data.severity === 'high' && maxSeverity !== 'critical') {
        maxSeverity = 'high';
      } else if (data.severity === 'medium' && maxSeverity === 'low') {
        maxSeverity = 'medium';
      }
    }
  }

  // Determine primary category
  let primaryCategory = 'General Online Abuse';
  if (detectedCategories.length > 0) {
    // Convert camelCase to readable format
    primaryCategory = detectedCategories[0]
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Get AI-powered sentiment and mood analysis from uClassify
  let aiAnalysis = null;
  try {
    console.log('🔍 Starting AI analysis for text:', description.substring(0, 100) + '...');
    aiAnalysis = await comprehensiveAnalysis(description);
    console.log('✅ AI Analysis complete:', aiAnalysis);
  } catch (error) {
    console.error('❌ uClassify API unavailable, using keyword analysis only:', error);
  }

  // Adjust severity based on AI sentiment and mood
  const adjustedSeverity = adjustSeverityWithAI(maxSeverity, aiAnalysis, detectedCategories);

  // Generate recommendations based on severity and category
  const recommendations = generateRecommendations(adjustedSeverity, detectedCategories);

  return {
    category: primaryCategory,
    severity: adjustedSeverity,
    keywords: [...new Set(allKeywords)].slice(0, 8), // Unique keywords, max 8
    detectedTypes: detectedCategories,
    recommendations,
    aiAnalysis: aiAnalysis, // Include AI analysis results
    timestamp: new Date().toISOString()
  };
};

/**
 * Adjust severity level based on AI sentiment and mood analysis
 */
const adjustSeverityWithAI = (keywordSeverity, aiAnalysis, categories) => {
  if (!aiAnalysis || !aiAnalysis.success) {
    return keywordSeverity;
  }

  let adjustedSeverity = keywordSeverity;
  
  // Get sentiment and mood data
  const sentiment = aiAnalysis.sentiment;
  const mood = aiAnalysis.mood;

  // Highly negative sentiment increases severity
  if (sentiment.success && sentiment.sentiment === 'negative') {
    if (sentiment.confidence >= 90) {
      // Very strong negative sentiment
      if (adjustedSeverity === 'medium') adjustedSeverity = 'high';
      if (adjustedSeverity === 'low') adjustedSeverity = 'medium';
    } else if (sentiment.confidence >= 75) {
      // Strong negative sentiment
      if (adjustedSeverity === 'low') adjustedSeverity = 'medium';
    }
  }

  // Threatening or aggressive mood increases severity
  if (mood.success && mood.topMoods) {
    const threateningMoods = ['angry', 'aggressive', 'hostile', 'threatening', 'violent'];
    const hasThreateningMood = mood.topMoods.some(m => 
      threateningMoods.some(tm => m.mood.toLowerCase().includes(tm)) && m.probability >= 70
    );

    if (hasThreateningMood) {
      if (adjustedSeverity === 'medium') adjustedSeverity = 'high';
      if (adjustedSeverity === 'high') adjustedSeverity = 'critical';
      if (adjustedSeverity === 'low') adjustedSeverity = 'medium';
    }
  }

  // Positive sentiment with threat keywords might be sarcasm or false positive
  if (sentiment.success && sentiment.sentiment === 'positive' && sentiment.confidence >= 70) {
    // If we detected threats but sentiment is positive, might be false positive
    if (categories.includes('threats') && keywordSeverity === 'critical') {
      // Downgrade slightly, might be figurative language
      adjustedSeverity = 'high';
    }
  }

  return adjustedSeverity;
};

const generateRecommendations = (severity, categories) => {
  const recommendations = [];

  // Critical legal documentation - always first
  recommendations.push('Preserve and document all electronic evidence immediately, including screenshots with visible timestamps, URLs, usernames, and metadata for potential use in legal proceedings');

  // Severity-based legal recommendations under Ethiopian law
  if (severity === 'critical') {
    recommendations.push('File an immediate police report with the Ethiopian Federal Police Cyber Crime Investigation Unit or your local Woreda/Kebele police station and request an official case number and incident documentation');
    recommendations.push('Consult with a licensed Ethiopian attorney specializing in cybercrime, criminal law, or women\'s rights to explore remedies under the Criminal Code (Proclamation 414/2004) and Computer Crime Proclamation (No. 958/2016)');
    recommendations.push('Petition the relevant Ethiopian court for a protection order or injunction pursuant to available legal remedies under Ethiopian criminal and civil procedure');
    recommendations.push('Contact the Ministry of Women and Social Affairs or Regional Women\'s Affairs Offices for support, guidance, and referral to legal aid services');
  } else if (severity === 'high') {
    recommendations.push('File a formal police report at your local police station to establish an official record and obtain incident documentation for potential criminal prosecution');
    recommendations.push('Seek legal counsel to evaluate potential claims under Ethiopian Criminal Code (harassment, stalking, defamation, threats) and Computer Crime Proclamation provisions');
    recommendations.push('Consider pursuing civil remedies under the Ethiopian Civil Code (Book V - Obligations arising from Torts) for damages and injunctive relief');
  } else if (severity === 'medium') {
    recommendations.push('Consider filing a police report to create an official record of the harassment pattern and establish documentation for potential escalation');
    recommendations.push('Consult with an Ethiopian attorney regarding potential civil remedies, cease-and-desist letters, and available legal protections');
  }

  // Category-specific legal recommendations under Ethiopian law
  if (categories.includes('imageBasedAbuse')) {
    recommendations.push('Report the content immediately to platform administrators and the Ethiopian Federal Police Cyber Crime Unit for potential prosecution under Computer Crime Proclamation No. 958/2016');
    recommendations.push('Document potential violations of Criminal Code Article 640 (sexual offenses), Article 589 (defamation), and Computer Crime Proclamation provisions regarding data interference and illegal content distribution');
    recommendations.push('Contact women\'s rights organizations such as the Association for Women\'s Sanctuary and Development (AWSAD) or Ethiopian Women Lawyers Association (EWLA) for legal support and counseling');
  }

  if (categories.includes('cyberstalking')) {
    recommendations.push('Document the pattern of conduct for potential prosecution under Criminal Code Article 553 (harassment and stalking) and Computer Crime Proclamation No. 958/2016');
    recommendations.push('Implement comprehensive digital security measures including changing passwords, enabling two-factor authentication, and reviewing privacy settings on all social media platforms');
    recommendations.push('Consider changing mobile phone numbers and notifying Ethio Telecom or other service providers of the harassment to request assistance with call/message blocking');
  }

  if (categories.includes('threats')) {
    recommendations.push('Preserve all threatening communications as potential evidence of Criminal Code Article 564 (intimidation and threat) violations, which carry penalties of up to three years imprisonment');
    recommendations.push('Cease all contact with the perpetrator and maintain detailed records of any attempts at communication to establish a pattern of criminal conduct');
    recommendations.push('Notify workplace security, educational institution administrators, family members, and local community leaders (Kebele officials) of potential safety concerns');
    recommendations.push('Request immediate police protection if threats suggest imminent harm or danger to your physical safety');
  }

  if (categories.includes('doxxing')) {
    recommendations.push('Submit formal takedown requests to websites and platforms hosting your personal information, citing violations of FDRE Constitution Article 26 (right to privacy)');
    recommendations.push('File complaints with the Ethiopian Communications Authority regarding unauthorized disclosure of personal information and violation of data protection principles');
    recommendations.push('Consider pursuing civil remedies under Ethiopian Civil Code Book V for invasion of privacy and unauthorized use of personal information');
  }

  if (categories.includes('impersonation')) {
    recommendations.push('Report identity theft and impersonation to platforms immediately with government-issued identification (Ethiopian ID card or passport) as verification');
    recommendations.push('File a criminal complaint under Computer Crime Proclamation Article 8 (computer-related fraud and identity theft) which provides for imprisonment and fines');
    recommendations.push('Consider civil claims under Ethiopian Civil Code for defamation (if false statements made), misappropriation of identity, and tortious harm');
  }

  if (categories.includes('harassment') || categories.includes('sexualHarassment')) {
    recommendations.push('Maintain detailed chronological logs of all harassing communications for potential prosecution under Criminal Code Article 553 (harassment) and Article 625 (sexual harassment if applicable)');
    recommendations.push('Report conduct to platform administrators and consider filing complaints with the Ethiopian Communications Authority for telecommunications-based harassment');
  }

  // General legal and protective measures
  if (!recommendations.some(r => r.includes('Block') || r.includes('block'))) {
    recommendations.push('Block the perpetrator on all digital platforms (Facebook, Telegram, TikTok, etc.) and implement technical measures to prevent further contact');
  }

  if (!recommendations.some(r => r.includes('support') || r.includes('Women'))) {
    recommendations.push('Contact Ethiopian victim support organizations including Ministry of Women and Social Affairs hotlines, Ethiopian Women Lawyers Association (EWLA), Association for Women\'s Sanctuary and Development (AWSAD), or Addis Ababa Women\'s Affairs Bureau');
  }

  if (!recommendations.some(r => r.includes('mental health') || r.includes('psychological'))) {
    recommendations.push('Seek psychological support and counseling from qualified mental health professionals or psychosocial support services to document emotional and psychological harm for potential civil claims');
  }

  // Ethiopian-specific resources
  if (!recommendations.some(r => r.includes('legal aid'))) {
    recommendations.push('Access free legal aid services through Justice and Legal System Research Institute, Ethiopian Women Lawyers Association, or regional legal aid centers for assistance with filing complaints and navigating the legal system');
  }

  // Remove duplicates and limit to most relevant
  return [...new Set(recommendations)].slice(0, 12);
};

export default analyzeText;
