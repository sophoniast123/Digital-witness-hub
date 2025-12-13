import { jsPDF } from 'jspdf';

export const generatePDF = async (formData, analysis) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addWrappedText = (text, x, y, maxWidth, lineHeight = 6, align = 'left') => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, { align });
    return y + (lines.length * lineHeight);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - margin - 15) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper to add bordered section
  const addSection = (title) => {
    checkPageBreak(20);
    doc.setFillColor(240, 240, 245);
    doc.rect(margin - 2, yPosition - 2, contentWidth + 4, 10, 'F');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 30, 60);
    doc.text(title, margin + 2, yPosition + 5);
    yPosition += 12;
  };

  const reportId = `DAR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const reportDate = new Date();
  const formattedDate = reportDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = reportDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });

  // ===== HEADER - FORMAL LETTERHEAD =====
  doc.setFillColor(25, 35, 75);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('AFFIDAVIT OF DIGITAL ABUSE', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('FORMAL INCIDENT DOCUMENTATION REPORT', pageWidth / 2, 27, { align: 'center' });
  
  doc.setFontSize(9);
  doc.text('Pursuant to Digital Evidence Preservation and Cybercrime Documentation', pageWidth / 2, 35, { align: 'center' });

  yPosition = 55;

  // ===== DOCUMENT CONTROL INFORMATION =====
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('DOCUMENT CONTROL NUMBER:', margin, yPosition);
  doc.setFont(undefined, 'normal');
  doc.text(reportId, margin + 75, yPosition);
  yPosition += 6;

  doc.setFont(undefined, 'bold');
  doc.text('DATE OF DOCUMENTATION:', margin, yPosition);
  doc.setFont(undefined, 'normal');
  doc.text(`${formattedDate} at ${formattedTime}`, margin + 75, yPosition);
  yPosition += 6;

  doc.setFont(undefined, 'bold');
  doc.text('JURISDICTION:', margin, yPosition);
  doc.setFont(undefined, 'normal');
  doc.text('Federal Democratic Republic of Ethiopia', margin + 75, yPosition);
  yPosition += 6;

  doc.setFont(undefined, 'bold');
  doc.text('CLASSIFICATION:', margin, yPosition);
  doc.setFont(undefined, 'normal');
  doc.text('CONFIDENTIAL - SENSITIVE PERSONAL INFORMATION', margin + 75, yPosition);
  yPosition += 12;

  // Separator line
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // ===== DECLARATION OF COMPLAINANT =====
  addSection('I. DECLARATION OF COMPLAINANT');
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  
  const declaration = `I, the undersigned, ${formData.name}, hereinafter referred to as "the Complainant" or "the Affected Party," do hereby solemnly declare and affirm under oath that the information contained within this sworn documentation is true, accurate, and complete to the best of my knowledge, information, and belief. This affidavit is executed voluntarily and without coercion for the purpose of establishing a formal record of digital harassment, abuse, and/or cyber-related misconduct pursuant to the laws of the Federal Democratic Republic of Ethiopia.`;
  
  yPosition = addWrappedText(declaration, margin, yPosition, contentWidth, 5.5);
  yPosition += 8;

  doc.setFont(undefined, 'bold');
  doc.text('COMPLAINANT IDENTIFICATION:', margin, yPosition);
  yPosition += 6;
  doc.setFont(undefined, 'normal');
  doc.text(`Full Legal Name: ${formData.name}`, margin + 5, yPosition);
  yPosition += 6;
  doc.text(`Date of Statement: ${formattedDate}`, margin + 5, yPosition);
  yPosition += 10;

  // ===== INCIDENT CLASSIFICATION =====
  addSection('II. PRELIMINARY INCIDENT CLASSIFICATION AND ANALYSIS');
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  const analysisIntro = 'Pursuant to preliminary content analysis and assessment of reported facts, the following classification has been determined based on applicable legal frameworks, including but not limited to the Criminal Code of Ethiopia (Proclamation No. 414/2004), Computer Crime Proclamation (Proclamation No. 958/2016), and relevant provisions governing cyber harassment, stalking, and digital abuse:';
  yPosition = addWrappedText(analysisIntro, margin, yPosition, contentWidth, 5.5);
  yPosition += 8;

  // Classification table
  const tableData = [
    { label: 'Primary Classification:', value: analysis.category.toUpperCase() },
    { label: 'Threat Assessment Level:', value: `${analysis.severity.toUpperCase()} PRIORITY` },
    { label: 'Incident Category:', value: analysis.detectedTypes.length > 0 ? analysis.detectedTypes.map(t => t.replace(/([A-Z])/g, ' $1').trim()).join(', ').toUpperCase() : 'GENERAL DIGITAL ABUSE' }
  ];

  tableData.forEach(item => {
    doc.setFont(undefined, 'bold');
    doc.text(item.label, margin + 5, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition = addWrappedText(item.value, margin + 60, yPosition, contentWidth - 60, 5.5);
    yPosition += 6;
  });

  if (analysis.keywords.length > 0) {
    yPosition += 2;
    doc.setFont(undefined, 'bold');
    doc.text('Evidentiary Keywords Identified:', margin + 5, yPosition);
    yPosition += 6;
    doc.setFont(undefined, 'normal');
    const keywords = analysis.keywords.join('; ').toLowerCase();
    yPosition = addWrappedText(keywords, margin + 8, yPosition, contentWidth - 8, 5.5);
    yPosition += 8;
  }

  // ===== DETAILED NARRATIVE =====
  addSection('III. DETAILED FACTUAL NARRATIVE OF INCIDENT(S)');
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  const narrativeIntro = 'The Complainant provides the following sworn testimony regarding the circumstances, context, and particulars of the alleged digital abuse incident(s). This narrative constitutes a contemporaneous account of events as experienced and witnessed by the Complainant:';
  yPosition = addWrappedText(narrativeIntro, margin, yPosition, contentWidth, 5.5);
  yPosition += 8;

  // Use combined text if available (includes OCR extracted text)
  const narrativeText = formData.combinedText || formData.description;
  
  doc.setFillColor(250, 250, 252);
  const descHeight = doc.splitTextToSize(narrativeText, contentWidth - 8).length * 5.5 + 8;
  
  checkPageBreak(descHeight + 10);
  doc.rect(margin, yPosition - 4, contentWidth, descHeight, 'F');
  doc.setDrawColor(180, 180, 190);
  doc.rect(margin, yPosition - 4, contentWidth, descHeight);
  
  doc.setFont(undefined, 'italic');
  yPosition = addWrappedText(narrativeText, margin + 4, yPosition, contentWidth - 8, 5.5);
  yPosition += 10;

  // ===== LEGAL IMPLICATIONS =====
  addSection('IV. APPLICABLE LEGAL FRAMEWORKS AND STATUTES');
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  const legalText = 'The conduct described herein may constitute violations of various provisions under Ethiopian law, including but not limited to:';
  yPosition = addWrappedText(legalText, margin, yPosition, contentWidth, 5.5);
  yPosition += 6;

  const statutes = [
    'Criminal Code of Ethiopia, Proclamation No. 414/2004, Article 553 - Harassment and Stalking',
    'Criminal Code of Ethiopia, Article 564 - Intimidation and Threat',
    'Criminal Code of Ethiopia, Article 589 - Defamation',
    'Computer Crime Proclamation No. 958/2016, Article 5 - Illegal Access and Interception',
    'Computer Crime Proclamation No. 958/2016, Article 6 - Data Interference',
    'Computer Crime Proclamation No. 958/2016, Article 8 - Computer-Related Fraud and Identity Theft',
    'Telecom Fraud Offences Proclamation No. 761/2012',
    'Civil Code of Ethiopia (1960), Book V - Obligations arising from Torts and Unjust Enrichment',
    'FDRE Constitution, Article 26 - Right to Privacy and protection from unlawful interference'
  ];

  statutes.forEach(statute => {
    checkPageBreak(8);
    doc.text('•', margin + 5, yPosition);
    yPosition = addWrappedText(statute, margin + 10, yPosition, contentWidth - 10, 5.5);
    yPosition += 5;
  });
  yPosition += 5;

  // ===== RECOMMENDED ACTIONS =====
  addSection('V. RECOMMENDED LEGAL AND PROTECTIVE ACTIONS');
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  const recIntro = 'Based upon the severity classification and nature of the reported conduct, the following actions are recommended to preserve evidence, ensure personal safety, and pursue appropriate legal remedies:';
  yPosition = addWrappedText(recIntro, margin, yPosition, contentWidth, 5.5);
  yPosition += 8;

  analysis.recommendations.forEach((rec, index) => {
    checkPageBreak(15);
    doc.setFont(undefined, 'bold');
    doc.text(`${index + 1}.`, margin + 5, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition = addWrappedText(rec, margin + 12, yPosition, contentWidth - 12, 5.5);
    yPosition += 6;
  });
  yPosition += 5;

  // ===== EVIDENTIARY DOCUMENTATION =====
  if (formData.screenshots.length > 0) {
    addSection('VI. SUPPORTING EVIDENTIARY MATERIALS');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    const evidenceIntro = `The Complainant has provided ${formData.screenshots.length} (${formData.screenshots.length === 1 ? 'one' : formData.screenshots.length}) exhibit(s) consisting of digital screenshots, images, or other documentary evidence in support of the allegations contained herein. Each exhibit is incorporated by reference and forms an integral part of this sworn statement:`;
    yPosition = addWrappedText(evidenceIntro, margin, yPosition, contentWidth, 5.5);
    yPosition += 10;

    for (let i = 0; i < formData.screenshots.length; i++) {
      const screenshot = formData.screenshots[i];
      
      checkPageBreak(120);

      doc.setFont(undefined, 'bold');
      doc.text(`EXHIBIT ${String.fromCharCode(65 + i)}:`, margin + 5, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(screenshot.name, margin + 25, yPosition);
      yPosition += 6;
      
      doc.setFont(undefined, 'italic');
      doc.setFontSize(8);
      doc.text(`Attachment Date: ${formattedDate} | File Type: ${screenshot.type}`, margin + 5, yPosition);
      yPosition += 6;
      
      // Add cryptographic hash if available
      if (screenshot.hashResult && screenshot.hashResult.success) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(8);
        doc.setTextColor(39, 174, 96);
        doc.text('🔐 CRYPTOGRAPHIC HASH (SHA-256):', margin + 5, yPosition);
        yPosition += 5;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(232, 245, 233);
        
        const hashFormatted = screenshot.hashResult.hash.match(/.{1,8}/g).join(' ');
        const hashLines = doc.splitTextToSize(hashFormatted, contentWidth - 20);
        const hashBlockHeight = hashLines.length * 4 + 6;
        
        checkPageBreak(hashBlockHeight + 10);
        doc.rect(margin + 5, yPosition - 2, contentWidth - 10, hashBlockHeight, 'F');
        doc.setDrawColor(39, 174, 96);
        doc.rect(margin + 5, yPosition - 2, contentWidth - 10, hashBlockHeight);
        
        yPosition = addWrappedText(hashFormatted, margin + 8, yPosition + 2, contentWidth - 16, 4);
        
        doc.setFont(undefined, 'italic');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('Note: Hash certificate (.txt) file downloaded separately for verification', margin + 8, yPosition + 2);
        yPosition += 8;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
      }
      
      // Add extracted text if available
      if (screenshot.extractedText && screenshot.extractedText.trim().length > 0) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(8);
        doc.text('Text Extracted from Image (OCR):', margin + 5, yPosition);
        yPosition += 5;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.setFillColor(245, 248, 255);
        
        const textLines = doc.splitTextToSize(screenshot.extractedText, contentWidth - 20);
        const textBlockHeight = textLines.length * 4 + 6;
        
        checkPageBreak(textBlockHeight + 10);
        doc.rect(margin + 5, yPosition - 2, contentWidth - 10, textBlockHeight, 'F');
        doc.setDrawColor(180, 180, 200);
        doc.rect(margin + 5, yPosition - 2, contentWidth - 10, textBlockHeight);
        
        yPosition = addWrappedText(screenshot.extractedText, margin + 8, yPosition + 2, contentWidth - 16, 4);
        yPosition += 6;
      }
      
      doc.setFontSize(9);
      yPosition += 2;

      try {
        const maxImageWidth = contentWidth - 10;
        const maxImageHeight = 110;
        
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        doc.rect(margin + 5, yPosition, maxImageWidth, maxImageHeight);
        
        doc.addImage(
          screenshot.data,
          'JPEG',
          margin + 5,
          yPosition,
          maxImageWidth,
          maxImageHeight,
          undefined,
          'FAST'
        );
        
        yPosition += maxImageHeight + 5;
      } catch (error) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.text('[Digital evidence attachment - image format not supported for embedding]', margin + 10, yPosition);
        yPosition += 10;
      }

      if (i < formData.screenshots.length - 1) {
        doc.addPage();
        yPosition = margin + 10;
      } else {
        yPosition += 10;
      }
    }
  }

  // ===== VERIFICATION AND ATTESTATION =====
  checkPageBreak(70);
  addSection('VII. VERIFICATION AND ATTESTATION');
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  const attestation = `I solemnly declare under oath and affirmation pursuant to the laws of the Federal Democratic Republic of Ethiopia that the foregoing is true and correct to the best of my knowledge, information, and belief. I understand that making false statements in this affidavit may constitute perjury and other offences punishable under the Criminal Code of Ethiopia, Proclamation No. 414/2004, Articles 459-461.`;
  yPosition = addWrappedText(attestation, margin, yPosition, contentWidth, 5.5);
  yPosition += 12;

  doc.text('Executed on:', margin, yPosition);
  doc.setFont(undefined, 'bold');
  doc.text(`${formattedDate}`, margin + 30, yPosition);
  yPosition += 10;

  doc.setFont(undefined, 'normal');
  doc.text('_________________________________________', margin, yPosition);
  yPosition += 6;
  doc.setFontSize(8);
  doc.text('Signature of Complainant', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.text('Name:', margin, yPosition);
  doc.setFont(undefined, 'bold');
  doc.text(formData.name, margin + 15, yPosition);
  yPosition += 15;

  // ===== LEGAL DISCLAIMERS =====
  checkPageBreak(60);
  doc.setFillColor(255, 250, 240);
  doc.rect(margin - 2, yPosition - 2, contentWidth + 4, 50, 'F');
  doc.setDrawColor(200, 150, 100);
  doc.setLineWidth(1);
  doc.rect(margin - 2, yPosition - 2, contentWidth + 4, 50);
  
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(100, 60, 0);
  doc.text('IMPORTANT LEGAL NOTICES AND DISCLAIMERS', margin + 2, yPosition + 4);
  yPosition += 10;
  
  doc.setFont(undefined, 'normal');
  doc.setTextColor(80, 50, 0);
  
  const disclaimers = [
    'CONFIDENTIALITY: This document contains sensitive personal information protected under Article 26 of the FDRE Constitution and should be maintained in strict confidence. Unauthorized disclosure may be prohibited by law.',
    'PRESERVATION OF EVIDENCE: This report should be preserved as potential evidence in criminal or civil proceedings. Do not alter, destroy, or modify this document as it may constitute destruction of evidence under Ethiopian law.',
    'LEGAL ADVICE: This document does not constitute legal advice. Consult with a licensed Ethiopian attorney or legal professional for guidance specific to your circumstances and applicable Ethiopian law.',
    'LAW ENFORCEMENT: Present this documentation to the Ethiopian Federal Police, Cyber Crime Investigation Unit, or relevant Woreda/Kebele police authorities when filing a formal complaint.',
    'LEGAL REMEDIES: Seek legal counsel promptly to understand your rights under Ethiopian Criminal Code, Computer Crime Proclamation, and Civil Code. Various limitation periods may apply to civil and criminal actions.',
    'WOMEN\'S AFFAIRS: Contact the Ministry of Women and Social Affairs or local Women\'s Affairs Offices for additional support and guidance on gender-based digital violence.'
  ];

  disclaimers.forEach(disclaimer => {
    yPosition = addWrappedText(disclaimer, margin + 2, yPosition, contentWidth - 4, 4.5);
    yPosition += 2;
  });

  // ===== PAGE FOOTERS =====
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'italic');
    
    // Footer line
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    doc.text(
      `Document ID: ${reportId}`,
      margin,
      pageHeight - 10
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      'CONFIDENTIAL',
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Save the PDF
  const fileName = `Affidavit_Digital_Abuse_${reportId}.pdf`;
  doc.save(fileName);

  return fileName;
};

export default generatePDF;
