import React, { useState } from 'react';
import { generatePDF } from '../utils/pdfGenerator';
// import { analyzeText } from '../utils/textAnalyzer';

import { generateFileHash } from '../utils/hashGenerator';
import { processOCRText } from '../utils/ocrTextCleaner';
import { preprocessSocialMediaScreenshot, detectSocialMediaScreenshot } from '../utils/imagePreprocessor';
import Tesseract from 'tesseract.js';
import './ReportAbuse.css';


const SYSTEM_PROMPT = `
You are an impartial text-classification system.

Your sole task is to analyze the provided text and classify whether it contains:
- abuse,
- harassment,
- threats,
- hate speech,
- sexual misconduct,
- coercion or intimidation,
- or other harmful or inappropriate behavior.

You must remain neutral, factual, and objective.
Do not assume intent beyond the text.

Respond in JSON with:
- classification
- explanation
- confidence (low | medium | high)
`;

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": window.location.origin,
    "X-Title": "Digital Safety Hub",
  },
   dangerouslyAllowBrowser: true ,
});


export async function analyzeText(text) {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text }
      ],
    });

    const content = completion?.choices?.[0]?.message?.content;

    if (!content) {
      // Don't throw - return a structured fallback so callers can handle gracefully
      console.warn('Empty AI response from chat completion');
      return {
        classification: 'unknown',
        explanation: 'Empty AI response',
        confidence: 'low'
      };
    }

    try {
      // If model responds with JSON, parse and return it
      return JSON.parse(content.trim());
    } catch {
      // Otherwise return a best-effort shape
      return {
        classification: 'unknown',
        explanation: content,
        confidence: 'low'
      };
    }

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      classification: "unknown",
      explanation: "AI analysis failed.",
      confidence: "low",
    };
  }
}



function ReportAbuse() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    screenshots: []
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState({});
  const [debugInfo, setDebugInfo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setOcrProcessing(true);
    
    const filePromises = files.map(async (file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageData = event.target.result;
          
          // Generate SHA-256 hash for the file
          let hashResult = null;
          try {
            hashResult = await generateFileHash(file);
          } catch (error) {
            console.error('Hash Generation Error:', error);
          }
          
          // Perform OCR on the image with enhanced preprocessing for social media
          let extractedText = '';
          let processedText = null;
          try {
            // Create temporary image to check dimensions
            const tempImg = new Image();
            await new Promise((resolve) => {
              tempImg.onload = resolve;
              tempImg.src = imageData;
            });

            // Detect if this is a social media screenshot
            const isSocialMedia = detectSocialMediaScreenshot(tempImg.width, tempImg.height);
            
            // Preprocess image for better OCR (especially for dark mode and social media)
            let processedImageData = imageData;
            if (isSocialMedia) {
              console.log('Social media screenshot detected, applying enhanced preprocessing...');
              processedImageData = await preprocessSocialMediaScreenshot(imageData);
            }

            // Enhanced OCR configuration
            const result = await Tesseract.recognize(
              processedImageData,
              'eng',
              {
                logger: (m) => {
                  if (m.status === 'recognizing text') {
                    setOcrProgress(prev => ({
                      ...prev,
                      [file.name]: Math.round(m.progress * 100)
                    }));
                  }
                },
                // Advanced Tesseract configuration for better accuracy
                tessedit_pageseg_mode: Tesseract.PSM.AUTO,
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?;:\'"@#$%&*()-_+=/<>[]{}|~`',
                preserve_interword_spaces: '1',
              }
            );
            
            // Get raw OCR text
            const rawText = result.data.text.trim();
            
            // Process and clean the OCR text
            processedText = processOCRText(rawText);
            
            // Use the enhanced text as the final extracted text
            extractedText = processedText.final;
            
          } catch (error) {
            console.error('OCR Error:', error);
            extractedText = '';
            processedText = null;
          }
          
          resolve({
            name: file.name,
            data: imageData,
            type: file.type,
            extractedText: extractedText,
            ocrConfidence: processedText ? processedText.confidence : 0,
            ocrProcessed: processedText,
            hashResult: hashResult,
            originalFile: file
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const screenshots = await Promise.all(filePromises);
    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, ...screenshots]
    }));
    setOcrProcessing(false);
    setOcrProgress({});
  };

  const removeScreenshot = (index) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Combine description with all extracted text from images
    const allExtractedText = formData.screenshots
      .map(s => s.extractedText)
      .filter(text => text && text.length > 0)
      .join('\n\n');
    
    const combinedText = formData.description + (allExtractedText ? '\n\nExtracted from images:\n' + allExtractedText : '');

    // Log and expose OCR extracted text for debugging
    const extractedPreview = formData.screenshots.map(s => ({
      name: s.name,
      length: s.extractedText ? s.extractedText.length : 0,
      preview: s.extractedText ? s.extractedText.slice(0, 400) : ''
    }));
    console.info('Combined text (first 500 chars):', combinedText.slice(0, 500));
    console.info('Extracted text preview per image:', extractedPreview);
    setDebugInfo({ combinedTextPreview: combinedText.slice(0, 1000), extractedPreview });

    // Analyze the combined description and OCR text (now async with AI)
    const rawAnalysis = await analyzeText(combinedText);

    // Normalize analysis shape so downstream code (UI + PDF) has expected fields
    const normalizedAnalysis = {
      category: rawAnalysis.category ?? rawAnalysis.classification ?? 'General Online Abuse',
      severity: rawAnalysis.severity ?? (rawAnalysis.confidence === 'high' ? 'high' : 'low'),
      keywords: Array.isArray(rawAnalysis.keywords) ? rawAnalysis.keywords : [],
      detectedTypes: Array.isArray(rawAnalysis.detectedTypes) ? rawAnalysis.detectedTypes : [],
      recommendations: Array.isArray(rawAnalysis.recommendations) ? rawAnalysis.recommendations : [],
      aiAnalysis: rawAnalysis.aiAnalysis ?? rawAnalysis,
      timestamp: rawAnalysis.timestamp ?? new Date().toISOString()
    };

    setAnalysis(normalizedAnalysis);

    // Generate PDF with combined text and normalized analysis
    const pdfFileName = await generatePDF({
      ...formData,
      combinedText: combinedText
    }, normalizedAnalysis);

    // Generate and download hash certificates for each image
    if (formData.screenshots.length > 0) {
      formData.screenshots.forEach((screenshot, index) => {
        if (screenshot.hashResult && screenshot.hashResult.success) {
          downloadHashCertificate(screenshot.hashResult, index + 1);
        }
      });
    }

    setLoading(false);
  };

  const downloadHashCertificate = (hashResult, exhibitNumber) => {
    const certificate = `
═══════════════════════════════════════════════════════════════
              EVIDENCE INTEGRITY CERTIFICATE
         CRYPTOGRAPHIC HASH VERIFICATION DOCUMENT
═══════════════════════════════════════════════════════════════

EXHIBIT REFERENCE:        Exhibit ${String.fromCharCode(64 + exhibitNumber)} (${exhibitNumber})
FILE NAME:                ${hashResult.fileName}
FILE SIZE:                ${(hashResult.fileSize / 1024).toFixed(2)} KB
FILE TYPE:                ${hashResult.fileType}
HASH ALGORITHM:           ${hashResult.algorithm}
GENERATED:                ${new Date(hashResult.timestamp).toLocaleString()}

───────────────────────────────────────────────────────────────
SHA-256 CRYPTOGRAPHIC HASH (Digital Fingerprint):
───────────────────────────────────────────────────────────────

${formatHashForDisplay(hashResult.hash)}

FULL HASH (64 characters):
${hashResult.hash}

═══════════════════════════════════════════════════════════════
                    VERIFICATION INSTRUCTIONS
═══════════════════════════════════════════════════════════════

To verify this evidence file has not been tampered with:

1. Navigate to the Hash Generator page in the Digital Safety Hub
2. Click "Verify Hash" mode
3. Upload this certificate file (.txt) or paste the hash above
4. Upload the original evidence file
5. System will confirm if file is authentic and unmodified

═══════════════════════════════════════════════════════════════
                       LEGAL SIGNIFICANCE
═══════════════════════════════════════════════════════════════

This cryptographic hash serves as a unique digital fingerprint for
the evidence file. It is generated using the SHA-256 algorithm, a
cryptographically secure one-way function widely accepted in legal
and forensic contexts.

KEY PROPERTIES:
• Deterministic: Same file always produces same hash
• Collision-resistant: Virtually impossible for two different files
  to produce the same hash
• Tamper-evident: Any modification to the file, no matter how small,
  will result in a completely different hash value
• One-way: Cannot reverse-engineer original file from hash

LEGAL APPLICATIONS:
This hash certificate provides:
- Proof of evidence integrity under Ethiopian Computer Crime 
  Proclamation No. 958/2016
- Chain of custody documentation for legal proceedings
- Verification mechanism for Ethiopian Federal Police Cyber Crime Unit
- Admissible evidence of file authenticity in court

═══════════════════════════════════════════════════════════════
                         IMPORTANT NOTES
═══════════════════════════════════════════════════════════════

⚠ PRESERVE THIS CERTIFICATE: Store this file together with the
   original evidence file. Both are required for verification.

⚠ DO NOT MODIFY: Any changes to the original file will make this
   certificate invalid for verification purposes.

⚠ MULTIPLE COPIES: Keep backup copies of both the evidence file
   and this certificate in separate secure locations.

⚠ LEGAL SUBMISSION: Include both the evidence file and this hash
   certificate when submitting evidence to authorities or court.

═══════════════════════════════════════════════════════════════
Document Control Number: HASH-${Date.now()}
Generated by: Digital Safety Hub - Evidence Verification System
Jurisdiction: Federal Democratic Republic of Ethiopia
═══════════════════════════════════════════════════════════════
`.trim();

    const blob = new Blob([certificate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hash_Certificate_Exhibit_${String.fromCharCode(64 + exhibitNumber)}_${hashResult.fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatHashForDisplay = (hash) => {
    // Format hash with spacing every 8 characters for readability
    return hash.match(/.{1,8}/g).join(' ');
  };

  const getConfidenceClass = (confidence) => {
    if (confidence >= 80) return 'high';
    if (confidence >= 60) return 'medium';
    return 'low';
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      screenshots: []
    });
    setAnalysis(null);
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h2 className="report-title">Report Digital Abuse</h2>
        <p className="report-subtitle">
          Your safety matters. Fill out this form to document digital abuse or harassment.
          All information will be compiled into a legal document for your records.
        </p>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description of Incident *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please describe what happened in detail. Include dates, times, platform names, usernames, and any relevant context..."
              required
              rows="8"
              className="form-textarea"
            />
            <p className="form-hint">
              Include: What happened? When? Where (platform)? Who was involved? How did it make you feel?
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="screenshots">Attach Screenshots/Evidence</label>
            <input
              type="file"
              id="screenshots"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="form-file-input"
            />
            <p className="form-hint">
              Please attach screenshots of messages, posts, or any digital evidence. Multiple files accepted.
            </p>
          </div>

          {ocrProcessing && (
            <div className="ocr-processing">
              <p>🔍 Extracting text from images using OCR...</p>
              {Object.entries(ocrProgress).map(([name, progress]) => (
                <div key={name} className="ocr-progress-item">
                  <span className="ocr-filename">{name}</span>
                  <div className="ocr-progress-bar">
                    <div 
                      className="ocr-progress-fill" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="ocr-percentage">{progress}%</span>
                </div>
              ))}
            </div>
          )}

          {formData.screenshots.length > 0 && (
            <div className="screenshots-preview">
              <h4>Attached Files ({formData.screenshots.length})</h4>
              <div className="screenshot-grid">
                {formData.screenshots.map((screenshot, index) => (
                  <div key={index} className="screenshot-item">
                    <img src={screenshot.data} alt={`Screenshot ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                    <p className="screenshot-name">{screenshot.name}</p>
                    {screenshot.hashResult && screenshot.hashResult.success && (
                      <div className="hash-info">
                        <p className="hash-info-label">🔐 Hash Generated:</p>
                        <p className="hash-info-value" title={screenshot.hashResult.hash}>
                          {screenshot.hashResult.hash.substring(0, 16)}...
                        </p>
                        <p className="hash-info-note">✅ Certificate will be downloaded</p>
                      </div>
                    )}
                    {screenshot.extractedText && (
                      <div className="extracted-text">
                        <p className="extracted-text-label">
                          📝 Extracted Text:
                          {screenshot.ocrConfidence && (
                            <span className={`confidence-badge ${getConfidenceClass(screenshot.ocrConfidence)}`}>
                              {screenshot.ocrConfidence}% confidence
                            </span>
                          )}
                        </p>
                        <p className="extracted-text-content">{screenshot.extractedText}</p>
                      </div>
                    )}
                    {!screenshot.extractedText && screenshot.extractedText !== '' && (
                      <p className="no-text-found">No text detected in image</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Generating Report...' : 'Generate Legal Report'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-secondary"
            >
              Reset Form
            </button>
          </div>
        </form>

        {debugInfo && (
          <div className="debug-panel">
            <h4>🧾 OCR & Combined Text Debug</h4>
            <p><strong>Combined Text (preview):</strong></p>
            <pre className="debug-combined">{debugInfo.combinedTextPreview}</pre>
            <p><strong>Per-file Extracted Text Preview:</strong></p>
            <ul>
              {debugInfo.extractedPreview.map((e, i) => (
                <li key={i}><strong>{e.name}</strong> — {e.length} chars — "{e.preview}{e.length > 400 ? '...' : ''}"</li>
              ))}
            </ul>
          </div>
        )}

        {analysis && (
          <div className="analysis-result">
            <h3>🤖 AI-Enhanced Analysis Complete</h3>
            <div className="analysis-card">
              <div className="analysis-item">
                <strong>Classification:</strong>
                <span className={`badge badge-${analysis?.severity ?? 'low'}`}>
                  {analysis?.category ?? analysis?.classification ?? 'Unknown'}
                </span>
              </div>
              <div className="analysis-item">
                {/* Severity level is displayed via classification badge above. */}
              </div>
              
              <div className="analysis-item">
                <strong>Keywords Detected:</strong>
                <div className="keywords">
                  {(analysis?.keywords || []).map((keyword, idx) => (
                    <span key={idx} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
              {((analysis?.aiAnalysis && analysis.aiAnalysis.explanation) || analysis?.explanation) && (
                <div className="analysis-item">
                  <strong>AI Notes:</strong>
                  <p className="ai-explanation">{analysis.aiAnalysis?.explanation ?? analysis?.explanation}</p>
                </div>
              )}
              <div className="analysis-item">
                <strong>Recommended Actions:</strong>
                <ul className="recommendations">
                  {(analysis?.recommendations || []).map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="success-message">
              ✓ Your legal report has been downloaded. Keep it in a safe place for your records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportAbuse;
