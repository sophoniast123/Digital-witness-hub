# Digital Abuse Reporter - Ethiopia

A React application designed to help Ethiopian women and girls report digital abuse and learn about digital safety under Ethiopian law.

## Features

### 📝 Report Abuse Page
- Secure form for documenting digital abuse incidents
- Upload multiple screenshots as evidence
- **OCR (Optical Character Recognition)** automatically extracts text from images
- AI-powered text analysis that:
  - Classifies the type of abuse (cyberstalking, harassment, image-based abuse, etc.)
  - Determines severity level based on Ethiopian legal frameworks
  - Identifies key indicators
  - Provides tailored recommendations based on Ethiopian law
- Generates downloadable legal affidavit PDF with:
  - Formal sworn statement under Ethiopian law
  - Incident description and evidence attachments
  - Ethiopian Criminal Code and Computer Crime Proclamation references
  - Classification and analysis
  - Metadata (timestamps, document control number)
  - Recommended legal actions specific to Ethiopia

### 📚 Safety Education Quiz
- Interactive 10-question quiz covering:
  - Recognizing digital abuse
  - Responding to online threats
  - Protecting personal information
  - Understanding legal rights
  - Accessing support resources
- Immediate feedback with explanations
- Comprehensive results summary
- Important resource links

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Reporting Abuse
1. Navigate to the "Report Abuse" page
2. Enter your name
3. Describe the incident in detail
4. Upload screenshots/evidence (optional but recommended)
5. Click "Generate Legal Report"
6. The app will analyze your description and generate a downloadable PDF

### Taking the Quiz
1. Navigate to the "Safety Education" page
2. Answer each question by selecting an option
3. Click "Submit Answer" to see if you're correct
4. Read the explanation for each question
5. Complete all questions to see your results and access resources

## Technology Stack

- **React** - Frontend framework
- **React Router** - Navigation
- **jsPDF** - PDF generation
- **Tesseract.js** - OCR text extraction from images
- **CSS3** - Styling with responsive design

## Text Analysis & Ethiopian Legal Framework

The app uses keyword-based analysis to classify incidents and map them to Ethiopian law:
- **Cyberstalking** - Criminal Code Article 553
- **Harassment** - Criminal Code Article 553, 625
- **Image-based abuse** - Criminal Code Article 640, Computer Crime Proclamation
- **Impersonation** - Computer Crime Proclamation Article 8
- **Doxxing** - FDRE Constitution Article 26, Civil Code Book V
- **Threats of violence** - Criminal Code Article 564
- **Sexual harassment** - Criminal Code Article 625
- **Defamation** - Criminal Code Article 589

Severity levels: Low, Medium, High, Critical Priority

Legal references include:
- Criminal Code of Ethiopia (Proclamation No. 414/2004)
- Computer Crime Proclamation (No. 958/2016)
- Telecom Fraud Offences Proclamation (No. 761/2012)
- Ethiopian Civil Code (1960)
- FDRE Constitution (1995)

## Important Ethiopian Resources

- **Ethiopian Federal Police Cyber Crime Investigation Unit** - Report cybercrime incidents
- **Ministry of Women and Social Affairs** - Gender-based violence support and legal aid referrals
- **Ethiopian Women Lawyers Association (EWLA)** - Free legal aid and counseling for women
- **Association for Women's Sanctuary and Development (AWSAD)** - Shelter and support services
- **Ethiopian Communications Authority** - Report telecommunications harassment
- **Police Emergency:** 911 (in Addis Ababa and major cities)
- **Women and Children Affairs Office** - Available in all Woredas for local support
- **Justice and Legal System Research Institute** - Free legal aid services

## Privacy & Security

- All processing happens locally in your browser
- No data is sent to external servers
- Reports are generated and saved directly to your device
- No user data is stored by the application

## Contributing

This is a safety-focused application. Contributions should prioritize:
- User privacy and security
- Accessibility
- Trauma-informed design
- Accurate information about digital safety

## License

MIT License - Feel free to use and modify for educational and support purposes.

## Disclaimer

This application is for documentation and educational purposes only. It does not constitute legal advice under Ethiopian law. For legal matters, please consult with a licensed Ethiopian attorney, contact Ethiopian Women Lawyers Association (EWLA), or visit your local Women and Children Affairs Office. In case of immediate danger, contact Ethiopian Federal Police at 911 (in major cities) or your local Woreda/Kebele police station.
