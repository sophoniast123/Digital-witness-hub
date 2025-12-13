# 🔍 OCR Feature Guide - Text Extraction from Images

## Overview

The Digital Abuse Reporter now includes **Optical Character Recognition (OCR)** technology that automatically extracts text from uploaded screenshots and images. This powerful feature helps capture evidence from:

- Screenshots of threatening messages
- Text conversations on social media
- Email screenshots
- SMS/WhatsApp messages
- Any image containing text

---

## 🎯 How OCR Works

### Technology Used:
**Tesseract.js** - Industry-standard open-source OCR engine that runs directly in your browser

### What It Does:
1. **Automatically scans** each uploaded image
2. **Extracts all readable text** from the image
3. **Displays extracted text** under each image preview
4. **Combines the text** with your description for AI analysis
5. **Includes extracted text** in the generated PDF report

---

## 📸 How to Use OCR

### Step-by-Step:

#### 1. Upload Images
- Click "Attach Screenshots/Evidence"
- Select one or multiple images
- Supported formats: JPG, PNG, WEBP, BMP

#### 2. OCR Processing
You'll see a **progress indicator**:
```
🔍 Extracting text from images using OCR...
screenshot1.png [████████░░] 80%
screenshot2.png [██████████] 100%
```

#### 3. View Extracted Text
Under each image preview, you'll see:
- **📝 Extracted Text:** with the recognized text displayed
- Text is shown in a blue-bordered box
- Scrollable if text is long

#### 4. Analysis
- Extracted text is **automatically combined** with your description
- AI analyzes **both your written description AND extracted text**
- More comprehensive threat detection

#### 5. PDF Report
The generated PDF includes:
- Your written description
- All extracted text from images (labeled as "Extracted from images:")
- Each image with its extracted text shown separately
- Section: "Text Extracted from Image (OCR)"

---

## 💡 Best Practices for OCR

### For Best Results:

✅ **Image Quality:**
- Use clear, high-resolution images
- Avoid blurry or low-quality screenshots
- Ensure text is readable to human eye

✅ **Text Visibility:**
- Make sure text is not too small
- Avoid images with poor lighting
- Dark text on light background works best

✅ **Language:**
- Currently optimized for **English text**
- Can recognize Latin alphabet characters
- Numbers and special characters supported

✅ **Screenshot Tips:**
- Take full screenshots, not cropped
- Include context (timestamps, usernames)
- Capture entire conversation threads

---

## 🔍 What OCR Can Extract

### ✅ Successfully Extracts:
- **Social media messages** (Facebook, Instagram, Twitter/X)
- **Messaging apps** (Telegram, WhatsApp, Signal)
- **Email screenshots** (Gmail, Outlook, Yahoo)
- **SMS text messages**
- **Comments and posts**
- **Usernames and timestamps**
- **URLs and links**
- **Profile names**
- **Text overlays on images**

### ⚠️ Limitations:
- Handwritten text (limited accuracy)
- Stylized fonts (may have errors)
- Very small text (might be missed)
- Text in images (like memes with text overlays)
- Non-Latin scripts (not optimized)
- Extremely blurry images

---

## 📊 OCR Processing Time

### Typical Processing Times:
- **Small image (< 500KB):** 3-5 seconds
- **Medium image (500KB - 2MB):** 5-10 seconds
- **Large image (> 2MB):** 10-20 seconds
- **Multiple images:** Processed in parallel

### Progress Indicator:
- Real-time percentage shown (0% - 100%)
- File name displayed for each image
- Visual progress bar

---

## 🎨 User Interface

### OCR Processing Display:
```
┌─────────────────────────────────────────┐
│ 🔍 Extracting text from images using   │
│     OCR...                              │
│                                         │
│ screenshot1.png [████████░░] 80%       │
│ screenshot2.png [██████░░░░] 60%       │
└─────────────────────────────────────────┘
```

### Extracted Text Display:
```
┌─────────────────────────────────────────┐
│ [Image Preview]                         │
│ screenshot1.png                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📝 Extracted Text:                  │ │
│ │ ----------------------------------- │ │
│ │ I will share your photos unless    │ │
│ │ you do what I say. You have 24hrs  │ │
│ │ or everyone will see them.         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### No Text Found:
```
┌─────────────────────────────────────────┐
│ [Image Preview]                         │
│ photo.jpg                               │
│ No text detected in image               │
└─────────────────────────────────────────┘
```

---

## 🤖 How OCR Enhances AI Analysis

### Before OCR:
- AI only analyzed your written description
- Limited to what you manually typed
- Might miss important keywords in screenshots

### After OCR:
- AI analyzes **description + extracted text from ALL images**
- Captures exact threatening language from screenshots
- Identifies keywords you might not have mentioned
- More accurate severity classification
- Better legal recommendations

### Example:

**Your Description:**
> "My ex sent me threatening messages"

**Extracted from Screenshot:**
> "I will share your intimate photos with everyone you know unless you meet me tonight. I know where you live and work."

**Combined Analysis:**
- Detects: Image-based abuse threat, intimidation, stalking
- Severity: **CRITICAL** (not just "medium")
- Legal refs: Criminal Code Art. 564, 640, Computer Crime Proclamation
- Recommendations: Immediate police report, Ethiopian Federal Police Cyber Crime Unit

---

## 📄 OCR in PDF Report

### Section III - Detailed Factual Narrative:
```
The Complainant provides the following sworn testimony...

[Your written description]

Extracted from images:
[Screenshot 1 text]

[Screenshot 2 text]
```

### Section VI - Supporting Evidentiary Materials:
```
EXHIBIT A: screenshot1.png
Attachment Date: December 15, 2024 | File Type: image/png

Text Extracted from Image (OCR):
┌─────────────────────────────────────────┐
│ I will ruin your life if you leave me. │
│ Everyone will see those photos.         │
│ You have no idea what I'm capable of.  │
└─────────────────────────────────────────┘

[Image displayed below]
```

---

## 🔒 Privacy & Security

### Your Privacy is Protected:

✅ **All OCR processing happens locally in your browser**
- No images uploaded to external servers
- No text sent to cloud services
- Complete privacy maintained

✅ **Tesseract.js runs client-side**
- Open-source software
- No tracking or analytics
- No data collection

✅ **Extracted text stays on your device**
- Only saved in the PDF you download
- Not stored by the application
- Under your complete control

---

## 🛠️ Technical Details

### OCR Engine:
- **Tesseract.js** v4.0+
- Based on Google's Tesseract OCR
- Trained on millions of text samples
- Accuracy: ~85-95% for clear images

### Processing:
- Runs in Web Workers (non-blocking)
- Parallel processing for multiple images
- Progressive loading with status updates
- Error handling for failed extractions

### Browser Compatibility:
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Modern mobile browsers

---

## 🐛 Troubleshooting

### Issue: "OCR taking too long"
**Solutions:**
- Use smaller image files (compress if needed)
- Process fewer images at once
- Ensure good internet connection (for initial load)
- Try refreshing the page

### Issue: "Text not extracted correctly"
**Solutions:**
- Use higher quality screenshots
- Ensure text is clearly visible
- Avoid heavily compressed images
- Try different screenshot method

### Issue: "No text detected"
**Possible Reasons:**
- Image contains no text
- Text too small or blurry
- Image is a photo, not screenshot
- Text in non-Latin script

### Issue: "Wrong text extracted"
**Explanation:**
- OCR may misread similar characters (0/O, l/1)
- Stylized fonts can confuse OCR
- You can manually edit in description field

---

## 📈 Benefits of OCR Feature

### For Users:
1. **Saves Time** - No need to manually type screenshot text
2. **More Accurate** - Captures exact threatening language
3. **Better Evidence** - Text + image together
4. **Comprehensive** - Nothing missed in analysis
5. **Professional** - PDF includes both text and images

### For Legal Proceedings:
1. **Verbatim Evidence** - Exact words from perpetrator
2. **Timestamped** - OCR preserves visible timestamps
3. **Contextual** - Username and platform information
4. **Verifiable** - Text matches visible image

### For Ethiopian Law Enforcement:
1. **Clear Documentation** - Easy to read and understand
2. **Searchable** - Text can be searched in documents
3. **Analysis-Ready** - Keywords already extracted
4. **Court-Admissible** - Professional format

---

## 🌟 Real-World Example

### Scenario:
Ethiopian woman receives threatening messages on Telegram

### Without OCR:
```
User uploads 3 screenshots
User types: "He sent me threats"
AI Analysis: Medium severity harassment
```

### With OCR:
```
User uploads 3 screenshots
OCR extracts:
  Screenshot 1: "I will kill you if you tell anyone"
  Screenshot 2: "I have your nude photos ready to share"
  Screenshot 3: "I know where your mother lives in Addis"

Combined with description
AI Analysis: CRITICAL severity
  - Threats (Art. 564)
  - Image-based abuse (Art. 640)
  - Intimidation
  
Recommendations:
  - Immediate Ethiopian Federal Police report
  - EWLA legal support
  - Protection order
  - Criminal complaint
```

**Result:** More accurate classification, better legal guidance, stronger evidence package

---

## 🎓 Educational Value

OCR teaches users:
- Importance of **screenshot documentation**
- **Exact language** matters in legal cases
- How to properly **capture digital evidence**
- **Timestamping** is crucial
- **Context** improves analysis

---

## 🔮 Future Enhancements

Planned improvements:
1. **Multi-language OCR** (Amharic, Oromo, Tigrinya)
2. **Handwriting recognition**
3. **Batch processing optimization**
4. **Text correction suggestions**
5. **Automatic translation** for mixed-language content

---

## 📞 Need Help?

If OCR is not working as expected:
1. Check your browser console for errors
2. Try using a different browser
3. Ensure images are valid formats
4. Contact Ethiopian Women Lawyers Association (EWLA) for technical assistance

---

## ✅ Summary

**OCR adds powerful text extraction to your evidence documentation:**

✅ Automatic text recognition from screenshots  
✅ Real-time progress tracking  
✅ Extracted text displayed under images  
✅ Combined analysis (description + OCR text)  
✅ Complete privacy (local processing)  
✅ PDF includes both text and images  
✅ Enhanced AI classification  
✅ Better legal recommendations  
✅ Stronger evidence for Ethiopian authorities  

**Your evidence is now more comprehensive, accurate, and legally sound!**

---

*Powered by Tesseract.js OCR Technology*
