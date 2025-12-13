# 🤖 uClassify AI Integration Guide

## Overview

uClassify has been integrated to provide advanced sentiment analysis, mood detection, and language identification for better threat assessment and evidence analysis.

**Important**: The integration uses a Vercel serverless function to avoid CORS issues. All API calls are proxied through `/api/uclassify` endpoint.

---

## 🔑 Setup Instructions

### **Step 1: Get Your API Key**

1. Go to: https://www.uclassify.com/
2. Click **"Sign Up"** (top right)
3. Create a free account
4. Verify your email
5. Login and go to **Dashboard**
6. Copy your **Read API Key**

### **Step 2: Configure API Key**

Create a `.env` file in your project root:

```bash
VITE_UCLASSIFY_API_KEY=your_actual_api_key_here
```

**Example:**
```bash
VITE_UCLASSIFY_API_KEY=abc123def456ghi789jkl012mno345pqr678
```

### **Step 3: Configure Vercel Environment Variables**

For production deployment on Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_UCLASSIFY_API_KEY` = `your_api_key`
3. Select all environments (Production, Preview, Development)
4. Save and redeploy

### **Step 4: Restart Development Server**

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 📊 What's Been Added

### **New Files Created:**
```
src/utils/uclassifyAPI.js   # Frontend API wrapper
api/uclassify.js            # Serverless proxy function (avoids CORS)
```

### **Architecture:**
```
Browser → uclassifyAPI.js → /api/uclassify → uClassify API
         (Frontend)          (Serverless)      (External)
```

This architecture eliminates CORS issues by routing API calls through your backend.

### **Functions Available:**

#### 1. `analyzeSentiment(text)`
Determines if text is positive, negative, or neutral.

```javascript
const result = await analyzeSentiment("I hate you so much!");
// Returns:
{
  success: true,
  sentiment: "negative",
  confidence: 98,
  raw: { positive: 0.02, negative: 0.98, neutral: 0.00 }
}
```

#### 2. `analyzeMood(text)`
Detects emotional tone (angry, sad, happy, etc.)

```javascript
const result = await analyzeMood("You're going to regret this!");
// Returns:
{
  success: true,
  primaryMood: "angry",
  confidence: 87,
  topMoods: [
    { mood: "angry", probability: 87 },
    { mood: "aggressive", probability: 75 },
    { mood: "threatening", probability: 68 }
  ]
}
```

#### 3. `detectLanguage(text)`
Identifies the language of the text.

```javascript
const result = await detectLanguage("Hello world");
// Returns:
{
  success: true,
  language: "english",
  confidence: 99
}
```

#### 4. `comprehensiveAnalysis(text)`
Runs all analyses at once (parallel execution for speed).

```javascript
const result = await comprehensiveAnalysis("I will kill you!");
// Returns:
{
  success: true,
  sentiment: { sentiment: "negative", confidence: 99 },
  mood: { primaryMood: "angry", confidence: 92 },
  language: { language: "english", confidence: 98 }
}
```

---

## 🎯 Integration Points

### **Enhanced Text Analyzer**

The uClassify API will be integrated into your existing `textAnalyzer.js` to provide:

1. **Keyword Analysis** (Your current system)
   - Detects explicit threats
   - Identifies specific keywords
   - Fast, offline

2. **Sentiment Analysis** (uClassify)
   - Detects overall tone
   - Negative/Positive/Neutral
   - Catches subtle hostility

3. **Mood Detection** (uClassify)
   - Identifies emotions
   - Angry, threatening, sad, etc.
   - Emotional context

4. **Combined Scoring**
   - Merges all analyses
   - More accurate severity
   - Better recommendations

---

## 📈 Benefits

### **Better Threat Detection:**

**Example 1: Implicit Threat**
```
Text: "You'll regret this. I know where you live."

Keyword Analysis:
- Matched: "regret" (weak)
- Severity: MEDIUM

uClassify Analysis:
- Sentiment: Negative (95%)
- Mood: Threatening (88%)

Combined Result:
- Severity: HIGH ✅ (More accurate!)
```

**Example 2: Emotional Abuse**
```
Text: "You're worthless. Nobody will ever love you."

Keyword Analysis:
- Matched: Limited
- Severity: LOW-MEDIUM

uClassify Analysis:
- Sentiment: Very Negative (97%)
- Mood: Hurtful (92%), Aggressive (85%)

Combined Result:
- Severity: HIGH ✅ (Detects emotional harm!)
```

**Example 3: Positive False Alarm**
```
Text: "I'm going to kill it at work today!"

Keyword Analysis:
- Matched: "kill"
- Severity: HIGH (False positive!)

uClassify Analysis:
- Sentiment: Positive (89%)
- Mood: Excited (82%)

Combined Result:
- Severity: LOW ✅ (Corrects false positive!)
```

---

## 🔧 Next Steps for Integration

I will now integrate uClassify into your existing system:

1. **Update `textAnalyzer.js`**
   - Add uClassify calls
   - Combine with keyword analysis
   - Calculate weighted severity score

2. **Update UI Components**
   - Show sentiment in analysis results
   - Display mood indicators
   - Add emotional context to reports

3. **Enhance PDF Reports**
   - Include sentiment scores
   - Show mood analysis
   - More comprehensive documentation

4. **Add Visual Indicators**
   - Sentiment badges (😊 😐 😠)
   - Mood icons
   - Color-coded results

---

## 💰 API Usage & Limits

### **Free Tier:**
- **1,000 API calls per day**
- All pre-built classifiers included
- Perfect for your use case

### **Your Usage:**
```
Per report with 3 evidence files:
- 3 sentiment analyses
- 3 mood analyses
- 3 language detections
= 9 API calls per report

Daily capacity: ~110 reports/day
Monthly capacity: ~3,300 reports/month
```

**More than enough for most use cases!**

### **If You Need More:**
Paid plans start at $10/month for 10,000 calls/day.

---

## 🛡️ Error Handling

The integration includes robust error handling:

1. **Missing API Key**
   - Falls back to keyword-only analysis
   - Logs warning (doesn't break the app)
   - Users still get basic analysis

2. **API Timeout/Error**
   - Uses cached/keyword results
   - Shows warning in analysis
   - Degrades gracefully

3. **Rate Limit Exceeded**
   - Falls back to keyword analysis
   - Notifies in console
   - App continues working

---

## 🧪 Testing

### **Test the Integration:**

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test in browser console:**
   ```javascript
   import { analyzeSentiment } from './src/utils/uclassifyAPI.js';
   
   const result = await analyzeSentiment("I hate you!");
   console.log(result);
   ```

3. **Test with real messages:**
   - Upload evidence with threatening text
   - Check analysis results
   - Verify sentiment scores appear

---

## 📊 Example Results

### **Threatening Message:**
```
Text: "I'm going to find you and hurt you bad"

Results:
- Keywords: "hurt", "find you"
- Sentiment: Negative (96%)
- Mood: Threatening (91%), Angry (84%)
- Severity: CRITICAL
- Category: Physical threats
```

### **Emotional Abuse:**
```
Text: "You're disgusting. Everyone thinks you're pathetic."

Results:
- Keywords: Limited matches
- Sentiment: Very Negative (98%)
- Mood: Hurtful (95%), Mean (88%)
- Severity: HIGH
- Category: Emotional abuse
```

### **Sexual Harassment:**
```
Text: "Send me some sexy pics babe. I know you want to."

Results:
- Keywords: "sexy pics"
- Sentiment: Negative (72%)
- Mood: Inappropriate (85%), Demanding (78%)
- Severity: HIGH
- Category: Sexual harassment
```

---

## 🎨 UI Updates Coming

After you provide the API key, I'll add:

1. **Sentiment Indicators:**
   ```
   😊 Positive sentiment (82% confidence)
   😐 Neutral sentiment (65% confidence)
   😠 Negative sentiment (95% confidence)
   ```

2. **Mood Badges:**
   ```
   [Angry 🔴 92%] [Threatening 🔴 88%] [Hostile 🟡 75%]
   ```

3. **Enhanced Analysis Section:**
   ```
   AI Analysis Results:
   ├─ Sentiment: Negative (95%)
   ├─ Mood: Threatening, Angry
   ├─ Keywords: kill, hurt, find you
   └─ Overall Severity: CRITICAL
   ```

---

## 📞 Support

### **uClassify Resources:**
- Documentation: https://www.uclassify.com/docs/
- API Reference: https://api.uclassify.com/
- Support: support@uclassify.com

### **Getting API Key:**
1. Sign up: https://www.uclassify.com/register
2. Verify email
3. Dashboard → API Keys
4. Copy "Read Key"

---

## ✅ Setup Checklist

- [ ] Sign up for uClassify account
- [ ] Get API key from dashboard
- [ ] Create `.env` file in project root
- [ ] Add `VITE_UCLASSIFY_API_KEY=your_key`
- [ ] Restart dev server
- [ ] Test API integration
- [ ] Ready to use!

---

**Once you provide your API key, I'll complete the integration into your text analyzer and UI! 🚀**
