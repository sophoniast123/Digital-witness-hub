import React, { useState, useRef } from 'react';
import { 
  generateFileHash, 
  generateTextHash, 
  verifyFileHash, 
  formatHash,
  generateHashCertificate 
} from '../utils/hashGenerator';
import './HashGenerator.css';

function HashGenerator() {
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hashCertificateInfo, setHashCertificateInfo] = useState(null);
  const fileInputRef = useRef(null);
  const hashCertificateInputRef = useRef(null);

  const handleHashCertificateUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Read the certificate file
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      
      // Extract hash from certificate using regex
      const hashMatch = content.match(/FULL HASH \(64 characters\):\s*([a-fA-F0-9]{64})/);
      const fileNameMatch = content.match(/FILE NAME:\s*(.+)/);
      const exhibitMatch = content.match(/EXHIBIT REFERENCE:\s*Exhibit ([A-Z]) \((\d+)\)/);
      
      if (hashMatch) {
        const extractedHash = hashMatch[1];
        setVerifyHash(extractedHash);
        setHashCertificateInfo({
          hash: extractedHash,
          fileName: fileNameMatch ? fileNameMatch[1].trim() : 'Unknown',
          exhibit: exhibitMatch ? exhibitMatch[1] : null,
          certificateLoaded: true
        });
        alert('✅ Hash certificate loaded successfully! Now upload the evidence file to verify.');
      } else {
        alert('❌ Could not extract hash from certificate file. Please ensure it\'s a valid hash certificate.');
      }
    };
    reader.readAsText(file);
  };

  const handleFileHash = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!verifyHash) {
      alert('⚠️ Please upload a hash certificate or enter a hash first before uploading the file to verify.');
      return;
    }

    setIsLoading(true);
    setVerifyResult(null);

    // Verify mode
    const result = await verifyFileHash(file, verifyHash);
    setVerifyResult(result);

    setIsLoading(false);
  };



  const resetForm = () => {
    setVerifyResult(null);
    setVerifyHash('');
    setHashCertificateInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (hashCertificateInputRef.current) {
      hashCertificateInputRef.current.value = '';
    }
  };

  return (
    <div className="hash-generator">
      <div className="hash-header">
        <h1>🔐 Evidence Verification System</h1>
        <p className="hash-subtitle">
          Verify the authenticity and integrity of your evidence files using cryptographic hashes
        </p>
      </div>

      <div className="hash-info-box">
        <h3>🔍 How Evidence Verification Works</h3>
        <p>When you report abuse and upload evidence, the system automatically generates <strong>cryptographic hashes</strong> (digital fingerprints).</p>
        <p><strong>Use this page to verify your evidence:</strong></p>
        <ul>
          <li>✅ Upload the hash certificate (.txt file) you received</li>
          <li>✅ Upload the original evidence file</li>
          <li>✅ System confirms if file is authentic or tampered</li>
          <li>✅ Perfect for verifying before submitting to authorities</li>
        </ul>
      </div>

      <div className="hash-content">
        {/* Verification Section */}
        <div className="hash-section">
          <h2>🔍 Verify Evidence File</h2>
          <p className="section-description">
            Verify that your evidence files haven't been modified since you generated the report
          </p>
          
          {(
            <>
              <div className="verify-certificate-upload">
                <h3>📄 Option 1: Upload Hash Certificate (Recommended)</h3>
                <p className="upload-description">
                  Upload the .txt certificate file that was generated with your evidence
                </p>
                <input
                  ref={hashCertificateInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleHashCertificateUpload}
                  id="certificate-input"
                  className="file-input"
                />
                <label htmlFor="certificate-input" className="certificate-upload-label">
                  <span className="upload-icon">📜</span>
                  <span className="upload-text">
                    Click to upload hash certificate (.txt file)
                  </span>
                </label>
                
                {hashCertificateInfo && hashCertificateInfo.certificateLoaded && (
                  <div className="certificate-loaded-info">
                    <h4>✅ Certificate Loaded Successfully</h4>
                    <p><strong>File Name:</strong> {hashCertificateInfo.fileName}</p>
                    {hashCertificateInfo.exhibit && (
                      <p><strong>Exhibit:</strong> {hashCertificateInfo.exhibit}</p>
                    )}
                    <p><strong>Hash Extracted:</strong> <code>{hashCertificateInfo.hash.substring(0, 16)}...</code></p>
                  </div>
                )}
              </div>

              <div className="verify-divider">
                <span>OR</span>
              </div>

              <div className="verify-input-group">
                <h3>✍️ Option 2: Manually Enter Hash</h3>
                <label htmlFor="verify-hash">Paste the expected hash:</label>
                <input
                  id="verify-hash"
                  type="text"
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  placeholder="Paste the 64-character SHA-256 hash here..."
                  className="verify-hash-input"
                />
              </div>
            </>
          )}

          <div className="file-upload-area">
            <h3 className="upload-step-title">📂 Step 2: Upload Evidence File to Verify</h3>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileHash}
              id="file-input"
              className="file-input"
            />
            <label htmlFor="file-input" className="file-upload-label">
              <span className="upload-icon">📤</span>
              <span className="upload-text">
                Click to select the evidence file
              </span>
              <span className="upload-hint">
                Upload the original file you want to verify
              </span>
            </label>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Verifying evidence file...</p>
          </div>
        )}

        {/* Verification Result */}
        {verifyResult && (
          <div className={`hash-result ${verifyResult.verified ? 'success' : 'error'}`}>
            <h3>
              {verifyResult.verified ? '✅ File Verified!' : '❌ Verification Failed'}
            </h3>
            
            {verifyResult.verified ? (
              <div className="verification-message">
                <p className="success-message">
                  <strong>The file is authentic and unmodified.</strong>
                </p>
                <p>
                  The generated hash matches the expected hash perfectly. 
                  This file has not been tampered with since the original hash was created.
                </p>
              </div>
            ) : (
              <div className="verification-message">
                <p className="error-message">
                  <strong>Warning: File does not match the expected hash!</strong>
                </p>
                <p>
                  The file may have been modified, corrupted, or is not the original file. 
                  Do not rely on this file for legal evidence.
                </p>
              </div>
            )}

            <div className="hash-comparison">
              <div className="hash-compare-row">
                <span className="compare-label">Generated Hash:</span>
                <code className="compare-hash">{formatHash(verifyResult.hash)}</code>
              </div>
              <div className="hash-compare-row">
                <span className="compare-label">Expected Hash:</span>
                <code className="compare-hash">{formatHash(verifyResult.expectedHash)}</code>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={resetForm} className="reset-button">
                🔄 Verify Another
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Usage Guide */}
      <div className="usage-guide">
        <h3>📚 How to Use Evidence Verification</h3>
        <div className="guide-grid">
          <div className="guide-item">
            <h4>1️⃣ Generate Evidence Report</h4>
            <p>
              Go to "Report Abuse" page and upload your evidence. When you generate 
              the report, hash certificates (.txt files) are automatically downloaded.
            </p>
          </div>
          <div className="guide-item">
            <h4>2️⃣ Store Files Together</h4>
            <p>
              Keep your original evidence files together with their hash certificates. 
              Both are needed for verification.
            </p>
          </div>
          <div className="guide-item">
            <h4>3️⃣ Verify Before Submission</h4>
            <p>
              Before submitting to police or court, use this page to verify your 
              evidence hasn't been corrupted or tampered with.
            </p>
          </div>
          <div className="guide-item">
            <h4>4️⃣ Legal Proceedings</h4>
            <p>
              Courts and law enforcement can use this same page to verify the 
              authenticity of your submitted evidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HashGenerator;
