# 🔐 Evidence Hash Verification Workflow

## Complete Chain of Custody Solution

This system provides a complete cryptographic chain of custody for digital evidence, ensuring files remain tamper-proof and verifiable for legal proceedings.

---

## 🎯 How It Works

### **Step 1: Report Abuse & Upload Evidence**

When you report abuse and upload evidence files:

1. Navigate to **"Report Abuse"** page
2. Fill in your information and incident description
3. **Upload screenshots/evidence files**
4. The system automatically:
   - ✅ Generates SHA-256 hash for each file
   - ✅ Performs OCR text extraction
   - ✅ Shows hash preview in the interface
   - ✅ Indicates certificate will be downloaded

### **Step 2: Generate Report**

When you click **"Generate Legal Report"**:

The system creates and downloads:

#### 📄 **PDF Report** (`Affidavit_Digital_Abuse_[ID].pdf`)
- Complete legal affidavit
- All evidence exhibits embedded
- **SHA-256 hash printed for each exhibit**
- OCR extracted text
- Legal recommendations

#### 📜 **Hash Certificates** (`.txt` files - one per evidence file)
- `Hash_Certificate_Exhibit_A_[filename].txt`
- `Hash_Certificate_Exhibit_B_[filename].txt`
- And so on...

Each certificate contains:
- Exhibit reference (A, B, C, etc.)
- File name, size, and type
- Full SHA-256 hash (64 characters)
- Formatted hash (for readability)
- Verification instructions
- Legal significance explanation
- Timestamp of generation

---

## 🔍 Step 3: Verify Evidence Authenticity

### **Option A: Upload Hash Certificate (Recommended)**

1. Navigate to **"Hash Generator"** page
2. Click **"Verify Hash"** mode
3. **Upload the `.txt` certificate file**
   - System automatically extracts the hash
   - Shows exhibit information
   - Confirms certificate loaded ✅
4. **Upload the original evidence file**
5. System compares and verifies:
   - ✅ **Match** = File is authentic and unmodified
   - ❌ **No Match** = File has been tampered with

### **Option B: Manual Hash Entry**

1. Navigate to **"Hash Generator"** page
2. Click **"Verify Hash"** mode
3. Open the certificate `.txt` file
4. Copy the 64-character hash
5. Paste it into the verification field
6. Upload the evidence file
7. System verifies authenticity

---

## 📊 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    EVIDENCE COLLECTION                       │
│                                                              │
│  User uploads evidence → System generates SHA-256 hash       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   DOCUMENTATION PHASE                        │
│                                                              │
│  Generate Report Button Clicked                             │
│  ├─ Creates PDF with embedded evidence + hashes             │
│  └─ Downloads hash certificate (.txt) for each file         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     STORAGE PHASE                            │
│                                                              │
│  Store Together:                                             │
│  ├─ Original evidence files (images, screenshots, etc.)     │
│  ├─ PDF Report (Affidavit)                                  │
│  └─ Hash certificate files (.txt)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   VERIFICATION PHASE                         │
│                  (Any time in the future)                    │
│                                                              │
│  1. Upload hash certificate (.txt) to Hash Generator         │
│  2. Upload original evidence file                            │
│  3. System verifies: Match = Authentic ✅                    │
│                     No Match = Tampered ❌                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Use Cases

### **1. Police Report Submission**
```
Evidence Package to Submit:
├─ Affidavit_Digital_Abuse_[ID].pdf
├─ Original_Screenshot_1.png
├─ Hash_Certificate_Exhibit_A_Original_Screenshot_1.png.txt
├─ Original_Screenshot_2.jpg
└─ Hash_Certificate_Exhibit_B_Original_Screenshot_2.jpg.txt
```

### **2. Court Proceedings**
- Present PDF affidavit with embedded hashes
- Provide original evidence files
- Include hash certificates
- Court can verify authenticity using Hash Generator

### **3. Evidence Archival**
- Store all files together
- Years later, verify files haven't been corrupted
- Prove chain of custody maintained

---

## 🔬 Technical Details

### **SHA-256 Algorithm**
- **256-bit cryptographic hash function**
- Industry standard for digital forensics
- Used by: FBI, Interpol, courts worldwide
- Properties:
  - Deterministic (same file = same hash)
  - Collision-resistant (virtually impossible to fake)
  - One-way function (can't reverse-engineer)
  - Avalanche effect (1 bit change = completely different hash)

### **Hash Generation Process**
```javascript
1. User uploads file
2. File read as binary (ArrayBuffer)
3. Web Crypto API: crypto.subtle.digest('SHA-256', data)
4. Result converted to hexadecimal (64 characters)
5. Hash displayed and saved in certificate
```

### **Verification Process**
```javascript
1. Load certificate → Extract stored hash
2. Upload evidence file → Generate new hash
3. Compare: storedHash === newHash
4. Result: Match (authentic) or No Match (tampered)
```

---

## 🇪🇹 Ethiopian Legal Context

### **Applicable Laws**

#### **Computer Crime Proclamation No. 958/2016**
- Article 27: Electronic evidence admissibility
- Requires proof of data integrity
- Hash certificates provide this proof

#### **Criminal Code of Ethiopia**
- Article 459-461: Perjury provisions
- Hash proves evidence hasn't been fabricated

#### **FDRE Constitution Article 26**
- Right to privacy
- Secure evidence handling required
- Hash verification ensures privacy maintained

### **Submission to Authorities**

When submitting to **Ethiopian Federal Police Cyber Crime Unit**:

1. ✅ Submit PDF affidavit
2. ✅ Include original evidence files
3. ✅ Attach hash certificates
4. ✅ Explain: "Hash certificates prove evidence integrity"
5. ✅ Demonstrate verification at Hash Generator page

---

## ⚠️ Important Best Practices

### **DO:**
- ✅ **Store hash certificates with evidence files**
- ✅ **Keep backup copies in multiple locations**
- ✅ **Verify files before submission to authorities**
- ✅ **Include hash info when filing reports**
- ✅ **Verify immediately if you suspect tampering**

### **DON'T:**
- ❌ **Don't modify evidence files after hash generation**
- ❌ **Don't lose hash certificates**
- ❌ **Don't crop, resize, or edit images**
- ❌ **Don't separate certificates from evidence files**

---

## 🎓 Example Scenario

### **Sarah's Case: Online Harassment**

**Day 1 - Evidence Collection:**
```
Sarah takes screenshots of harassing messages
- screenshot_1.png
- screenshot_2.png
- screenshot_3.png
```

**Day 1 - Report Generation:**
```
Sarah uses Digital Safety Hub:
1. Reports abuse with description
2. Uploads 3 screenshots
3. System generates hashes automatically
4. Downloads:
   - Affidavit_Digital_Abuse_DAR-1234567890-ABC123XYZ.pdf
   - Hash_Certificate_Exhibit_A_screenshot_1.png.txt
   - Hash_Certificate_Exhibit_B_screenshot_2.png.txt
   - Hash_Certificate_Exhibit_C_screenshot_3.png.txt
```

**Day 1 - Storage:**
```
Sarah stores in secure folder:
Evidence_Package/
├─ Affidavit_Digital_Abuse_DAR-1234567890-ABC123XYZ.pdf
├─ screenshot_1.png
├─ Hash_Certificate_Exhibit_A_screenshot_1.png.txt
├─ screenshot_2.png
├─ Hash_Certificate_Exhibit_B_screenshot_2.png.txt
├─ screenshot_3.png
└─ Hash_Certificate_Exhibit_C_screenshot_3.png.txt
```

**Day 30 - Police Submission:**
```
Before submission, Sarah verifies:
1. Opens Hash Generator → Verify Hash mode
2. Uploads Hash_Certificate_Exhibit_A_screenshot_1.png.txt
3. Uploads screenshot_1.png
4. ✅ Verified! File authentic
5. Repeats for all exhibits
6. Submits entire package to police with confidence
```

**Day 180 - Court Hearing:**
```
Defense lawyer questions evidence authenticity:
1. Prosecutor demonstrates Hash Generator
2. Uploads certificate from Day 1
3. Uploads screenshot from Day 1
4. ✅ Hash matches perfectly
5. Proves file hasn't been altered in 180 days
6. Court accepts evidence as authentic
```

---

## 🔗 Integration Points

### **Report Abuse Page**
- Automatic hash generation on file upload
- Visual confirmation in preview
- Hash included in PDF report
- Separate certificate downloads

### **Hash Generator Page**
- Generate hashes for any file
- Verify with certificate upload
- Manual hash entry option
- Download standalone certificates

### **Complete Chain of Custody**
```
Evidence → Hash → Certificate → Storage → Verification → Legal Use
```

---

## 📞 Support & Resources

### **For Users:**
- Hash Generator page has built-in instructions
- Each certificate includes verification steps
- Usage guide on Hash Generator page

### **For Legal Professionals:**
- SHA-256 is internationally recognized
- Admissible in Ethiopian courts
- Standard in digital forensics
- Can verify using any SHA-256 tool (not just this app)

### **For Law Enforcement:**
- Certificates clearly labeled by exhibit
- Easy verification process
- Professional documentation format
- Compliant with Ethiopian law requirements

---

## 🎯 Key Takeaways

1. **Every evidence file gets a unique hash** (digital DNA)
2. **Hash certificates downloaded automatically** with PDF
3. **Verification is simple**: Upload certificate + file
4. **Legal significance**: Proves evidence integrity in court
5. **Ethiopian law compliant**: Meets Computer Crime Proclamation requirements

---

**Remember:** Hash = Digital Seal of Authenticity

*One tiny change to the file → Completely different hash*

*Same file → Always same hash*

*This is mathematics, not magic!*
