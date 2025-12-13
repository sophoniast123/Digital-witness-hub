# Installation & Running Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```
   
   If you encounter any peer dependency issues, try:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the Application**
   ```bash
   npm run dev
   ```
   
   The app will automatically open in your browser at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## What You'll See

### Home Page - Report Abuse
- A form to report digital abuse incidents
- Fields for name and detailed description
- File upload for screenshots/evidence
- Upon submission, the app will:
  - Analyze the description text
  - Classify the type of abuse
  - Determine severity level
  - Generate a downloadable PDF report

### Education Quiz Page
- Interactive quiz with 10 questions
- Topics cover digital safety, recognizing abuse, and protective actions
- Instant feedback with explanations
- Results summary with important resources

## Troubleshooting

### If npm install fails:
- Make sure you have Node.js 14+ installed
- Try clearing npm cache: `npm cache clean --force`
- Delete node_modules and try again: `rm -rf node_modules && npm install`

### If the app doesn't start:
- Check that port 3000 is available
- Try: `npm start -- --port 3001` to use a different port

## Testing the Features

### Testing Report Generation:
1. Go to the "Report Abuse" page
2. Enter a name: "Test User"
3. Enter a description with keywords like: "Someone is stalking me online, sending threatening messages and won't leave me alone"
4. Upload a screenshot (any image file)
5. Click "Generate Legal Report"
6. A PDF will download with the analysis

### Testing the Quiz:
1. Go to the "Safety Education" page
2. Answer the quiz questions
3. Review explanations after each answer
4. Complete all questions to see results

## Project Structure

```
digital-abuse-reporter/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ReportAbuse.js
│   │   ├── ReportAbuse.css
│   │   ├── EducationQuiz.js
│   │   └── EducationQuiz.css
│   ├── utils/
│   │   ├── textAnalyzer.js
│   │   └── pdfGenerator.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Features Explained

### AI Text Analysis
The `textAnalyzer.js` identifies:
- **Cyberstalking**: Following, tracking, monitoring patterns
- **Harassment**: Bullying, threats, intimidation
- **Image-based abuse**: Revenge porn, photo leaks
- **Impersonation**: Fake accounts, identity theft
- **Doxxing**: Address/personal info exposure
- **Threats**: Violence, harm
- **Sexual harassment**: Unwanted advances, explicit content
- **Cyberbullying**: Rumors, defamation, humiliation

### PDF Generation
The `pdfGenerator.js` creates a professional legal document with:
- Report metadata (date, ID)
- Reporter information
- Incident classification and analysis
- Full description
- Embedded screenshots
- Recommended actions
- Important legal notices

## Browser Compatibility

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- Mobile browsers: ✓ Responsive design

## Privacy Notice

All processing happens locally in your browser:
- No data sent to servers
- No tracking or analytics
- Reports saved directly to your device
- No user data stored by the application
