# 🛡️ Digital Safety Hub - AI-Powered Evidence Documentation System

A comprehensive web application for documenting and verifying digital abuse evidence with cryptographic hash verification, AI-powered threat analysis, and OCR text extraction from social media screenshots.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple)](https://vitejs.dev/)

---

## 🌟 Key Features

### 🔐 Cryptographic Hash Verification
- **Automatic SHA-256 hash generation** for all evidence files
- **Hash certificates** (.txt files) for legal documentation
- **Evidence verification** - Prove files haven't been tampered with
- **Chain of custody** documentation
- **Court-admissible** proof of file integrity

### 🤖 AI-Powered Threat Analysis
- **Sentiment analysis** - Detects positive/negative/neutral tone
- **Mood detection** - Identifies anger, threats, aggression
- **Smart severity assessment** - Combines keywords + AI analysis
- **False positive reduction** - Context-aware threat detection
- **Powered by uClassify API**

### 📸 Advanced OCR Text Extraction
- **Social media optimized** - Works with Telegram, Instagram, WhatsApp, etc.
- **Dark mode support** - Handles dark theme screenshots
- **Text cleaning** - Filters noise, expands abbreviations
- **Threat term expansion** - Converts slang to analyzable text
- **Confidence scoring** - Quality indicators for extracted text

### 📄 Legal Documentation
- **PDF affidavit generation** with embedded hashes
- **Ethiopian law compliant** (Computer Crime Proclamation No. 958/2016)
- **Professional formatting** for court submission
- **Automatic evidence numbering** (Exhibit A, B, C, etc.)
- **Comprehensive analysis reports**

### 🎓 Safety Education
- **Interactive quiz** on digital safety
- **Legal information** about Ethiopian cyber laws
- **Abuse prevention** resources
- **Know your rights** education

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)
- uClassify API key (free tier - 1000 calls/day)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/digital-safety-hub.git
cd digital-safety-hub

# Install dependencies
npm install

# Create .env file with your API key
echo "VITE_UCLASSIFY_API_KEY=your_api_key_here" > .env

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Getting uClassify API Key

1. Sign up at https://www.uclassify.com/
2. Verify your email
3. Go to Dashboard → API Keys
4. Copy your "Read API Key"
5. Add to `.env` file

---

## 📦 Project Structure

```
digital-safety-hub/
├── src/
│   ├── components/
│   │   ├── ReportAbuse.jsx       # Main evidence reporting
│   │   ├── EducationQuiz.jsx     # Safety education
│   │   ├── HashGenerator.jsx     # Evidence verification
│   │   └── *.css                 # Component styles
│   ├── utils/
│   │   ├── textAnalyzer.js       # AI + keyword analysis
│   │   ├── hashGenerator.js      # SHA-256 hashing
│   │   ├── ocrTextCleaner.js     # OCR text processing
│   │   ├── imagePreprocessor.js  # Social media OCR enhancement
│   │   ├── uclassifyAPI.js       # AI sentiment/mood API (frontend)
│   │   └── pdfGenerator.js       # PDF report generation
│   ├── App.jsx                   # Main app component
│   └── index.jsx                 # Entry point
├── api/
│   └── uclassify.js              # Serverless proxy (avoids CORS)
├── .env                          # API keys (not in git)
├── .env.example                  # Template for .env
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
└── vercel.json                   # Deployment config
```

---

## 🎯 How It Works

### 1. Report Abuse & Upload Evidence
- Fill in incident details
- Upload screenshots/evidence (Telegram, Instagram, WhatsApp, etc.)
- System automatically:
  - ✅ Generates SHA-256 hash
  - ✅ Extracts text via OCR (optimized for social media)
  - ✅ Cleans and enhances text
  - ✅ Shows preview with confidence scores

### 2. AI Analysis
When you generate the report:
- **Keyword Analysis** - Detects explicit threats
- **Sentiment Analysis** - Positive/Negative/Neutral (uClassify)
- **Mood Detection** - Angry, threatening, aggressive, etc.
- **Combined Scoring** - Intelligent severity assessment


### 3. Download Evidence Package
You receive:
- **PDF Affidavit** - Complete legal document with analysis
- **Hash Certificates** - One .txt file per evidence image
- **Professional formatting** - Ready for police/court

### 4. Verify Evidence (Anytime Later)
- Go to "Verify Evidence" page
- Upload hash certificate (.txt file)
- Upload original evidence file
- System confirms: ✅ Authentic or ❌ Tampered

---


### Text Cleaning Pipeline

```
Raw OCR Output
    ↓
Remove Non-English Characters
    ↓
Fix OCR Errors (0→o, 1→i, |→I)
    ↓
Correct Word Mistakes (wh0→who, k1ll→kill)
    ↓
Expand Abbreviations (u→you, ur→your)
    ↓
Expand Threat Terms (kys→kill yourself)
    ↓
Translate Emoticons (:)→[happy])
    ↓
Clean Sentences & Normalize
    ↓
Filter Noise & Extract Meaningful Text
    ↓
Calculate Confidence Score
    ↓
Clean, Analyzable Text ✅
```

### AI Analysis Integration

```javascript
// Hybrid analysis combining keywords + AI
const analysis = await analyzeText(text);

// Returns:
{
  keywords: ["kill", "hurt", "find you"],
  sentiment: { sentiment: "negative", confidence: 95 },
  mood: { 
    primaryMood: "threatening",
    topMoods: [
      { mood: "angry", probability: 87 },
      { mood: "threatening", probability: 92 },
      { mood: "aggressive", probability: 75 }
    ]
  },
  severity: "CRITICAL", // Adjusted based on AI + keywords
  recommendations: [...]
}
```

### Cryptographic Hashing

```javascript
// SHA-256 hash generation using Web Crypto API
const hashBuffer = await crypto.subtle.digest('SHA-256', fileData);
const hash = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

// Result: 64-character hex string
// Example: a1b2c3d4e5f6a7b8c9d0e1f2...
```

**Properties:**
- Same file → Same hash (always)
- Change 1 bit → Completely different hash
- Impossible to reverse-engineer original from hash
- Court-accepted standard worldwide

---

## 🇪🇹 Ethiopian Law Compliance

### Applicable Laws

**Computer Crime Proclamation No. 958/2016**
- Article 27: Electronic evidence admissibility
- Hash certificates provide required proof of data integrity

**Criminal Code of Ethiopia**
- Articles 459-461: Perjury provisions
- Hash verification prevents evidence falsification

**FDRE Constitution Article 26**
- Right to privacy protection
- Secure, local processing (no server uploads)

### Submission to Authorities

**Ethiopian Federal Police Cyber Crime Unit:**
1. Submit PDF affidavit
2. Include original evidence files
3. Attach hash certificates
4. Demonstrate verification process

**Courts accept:**
- SHA-256 hash certificates
- PDF documentation
- AI analysis reports
- OCR text extraction

---

## 🎨 User Interface

### Analysis Results Display

```
🤖 AI-Enhanced Analysis Complete

Classification: Physical Threats
Severity Level: CRITICAL

🔐 Hash Generated:
a1b2c3d4e5f6a7b8... ✅ Certificate will be downloaded

📝 Extracted Text: [85% CONFIDENCE]
"I will kill you. You better watch out..."

Keywords Detected:
kill  hurt  watch out  threaten

Recommended Actions:
• Immediately report to police
• Document all communications
• Seek legal protection
```

---

## 📊 API Usage

### uClassify Free Tier
- **1,000 API calls per day**
- Each report uses 3 calls (sentiment + mood + language)
- **~500 reports per day capacity**
- More than sufficient for most use cases

### Rate Limiting
If API limit exceeded:
- Falls back to keyword-only analysis
- App continues working normally
- Logs warning in console

---

## 🧪 Testing

### Test OCR with Social Media Screenshots

1. Take screenshots from:
   - Telegram (light & dark mode)
   - Instagram DMs (stories, posts)
   - WhatsApp chats
   - Facebook Messenger
   - Twitter DMs

2. Upload to Report Abuse

3. Check:
   - ✅ Text extracted correctly
   - ✅ Confidence score shown
   - ✅ Dark mode handled properly
   - ✅ Colored backgrounds processed

### Test AI Analysis

```javascript
// Test threatening message
"I'm going to find you and kill you"
Expected: Negative sentiment, Threatening mood, CRITICAL

// Test emotional abuse
"You're worthless, nobody loves you"
Expected: Negative sentiment, Hurtful mood, HIGH

// Test false positive
"I'm going to kill it at work today!"
Expected: Positive sentiment, Excited mood, LOW
```

### Test Hash Verification

1. Upload image → Generate report
2. Download PDF + hash certificate
3. Go to Verify Evidence
4. Upload certificate + original image
5. Result: ✅ Verified

6. Edit image slightly
7. Upload certificate + edited image
8. Result: ❌ Tampered (detected!)

---

## 🛠️ Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📚 Documentation

- **README.md** (this file) - Complete overview
- **QUICK_START.md** - Fast setup guide
- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **HASH_VERIFICATION_WORKFLOW.md** - Hash system workflow
- **UCLASSIFY_INTEGRATION_GUIDE.md** - AI integration details
- **ETHIOPIAN_LAW_GUIDE.md** - Legal context

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

---

## 🎯 Roadmap

### Planned Features
- [ ] OCR Enhancement for Social Media
- [ ] Multi-language support (Amharic, Tigrinya)
- [ ] Voice message transcription
- [ ] Video evidence processing
- [ ] Encrypted evidence storage
- [ ] Direct police submission integration
- [ ] Mobile app (React Native)
- [ ] Blockchain evidence timestamping

---

## ⚠️ Important Notes

### Privacy & Security
- ✅ All OCR and hashing happens **locally in browser**
- ✅ No files uploaded to servers
- ✅ Hash generation uses native Web Crypto API
- ✅ User privacy protected
- ✅ Evidence stays on user's device

### Legal Disclaimer
This tool is for documentation purposes. It does not constitute legal advice. Always consult with legal professionals and appropriate authorities.

---

**Made with 💚 for Digital Safety & Justice**

*Empowering victims to document abuse and seek justice through technology*

---
