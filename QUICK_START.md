# ⚡ Quick Start Guide - Digital Safety Hub

Get up and running in 5 minutes!

---

## 🚀 Fast Setup

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/digital-safety-hub.git
cd digital-safety-hub

# Install dependencies
npm install
```

### Step 2: Get API Key (2 minutes)

1. Go to: https://www.uclassify.com/
2. Click "Sign Up" (free account)
3. Verify your email
4. Dashboard → API Keys
5. Copy your "Read API Key"

### Step 3: Configure & Run (1 minute)

```bash
# Create .env file
echo "VITE_UCLASSIFY_API_KEY=your_api_key_here" > .env

# Start development server
npm run dev
```

**Done!** Open http://localhost:5173 in your browser.

---

## 🎯 Quick Test

### Test 1: Report Abuse (30 seconds)

1. Click "Report Abuse"
2. Enter: Name, Email, Description
3. Upload a screenshot (try Telegram/Instagram screenshot!)
4. Click "Generate Legal Report"
5. **Downloads:**
   - PDF affidavit
   - Hash certificate(s)

### Test 2: AI Analysis (30 seconds)

Upload evidence with threatening text:
```
"I'm going to find you and hurt you!"
```

**Results:**
- Keywords: find, hurt
- 😠 Sentiment: Negative (95%)
- 😡 Mood: Threatening (92%), Angry (87%)
- Severity: CRITICAL

### Test 3: Verify Evidence (30 seconds)

1. Go to "Verify Evidence" page
2. Upload hash certificate (.txt file from Test 1)
3. Upload original screenshot
4. Result: ✅ **File Verified!**

---

## 📦 What You Get

### Features Working Out of the Box:

✅ **Report Abuse** - Document incidents with evidence
✅ **OCR Text Extraction** - From social media screenshots
✅ **AI Analysis** - Sentiment + Mood detection
✅ **Hash Generation** - SHA-256 for all evidence
✅ **PDF Reports** - Legal affidavits
✅ **Evidence Verification** - Tamper detection
✅ **Safety Education** - Quiz on digital safety

---

## 🔧 Common Issues

### Issue: "API key not configured"
**Fix:** Make sure `.env` file exists with correct key:
```bash
VITE_UCLASSIFY_API_KEY=your_actual_key_here
```
Then restart: `npm run dev`

### Issue: OCR not extracting text
**Fix:** 
- Make sure screenshot is clear
- Try light mode screenshots first
- Dark mode requires preprocessing (automatic)
- Check console for errors

### Issue: Port already in use
**Fix:**
```bash
# Use different port
npm run dev -- --port 3000
```

---

## 📱 Supported Screenshots

Works great with:
- ✅ Telegram (light & dark mode)
- ✅ Instagram DMs, Stories, Posts
- ✅ WhatsApp chats
- ✅ Facebook Messenger
- ✅ Twitter/X DMs
- ✅ Any mobile screenshot

---

## 🎓 Next Steps

1. **Read full docs:** [README.md](README.md)
2. **Deploy to Vercel:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. **Learn about hashing:** [HASH_VERIFICATION_WORKFLOW.md](HASH_VERIFICATION_WORKFLOW.md)
4. **Understand AI:** [UCLASSIFY_INTEGRATION_GUIDE.md](UCLASSIFY_INTEGRATION_GUIDE.md)

---

## 💡 Pro Tips

### Tip 1: Test with Real Screenshots
Take actual screenshots from Telegram/Instagram to see the OCR magic!

### Tip 2: Try Dark Mode
Upload dark mode screenshots - the system auto-detects and processes them.

### Tip 3: Verify Everything
Always verify evidence before submitting to authorities using "Verify Evidence" page.

### Tip 4: Keep Certificates Safe
Hash certificates are as important as the evidence files - store together!

---

## 🆘 Need Help?

- **Full README:** Comprehensive guide
- **Issues:** GitHub Issues page
- **API Docs:** https://www.uclassify.com/docs/

---

**You're all set! Start documenting abuse evidence with confidence. 🛡️**
