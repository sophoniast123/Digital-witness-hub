import React, { useState } from 'react';
import './EducationQuiz.css';

const quizQuestions = [
  {
    id: 1,
    question: "Someone you don't know sends you a friend request and immediately starts asking personal questions. What should you do?",
    options: [
      "Answer their questions to be polite",
      "Ignore the request and block them",
      "Accept but don't respond",
      "Share some information but not all"
    ],
    correct: 1,
    explanation: "Never share personal information with strangers online. It's best to ignore suspicious requests and block users who make you uncomfortable. Your safety comes first."
  },
  {
    id: 2,
    question: "An ex-partner threatens to share intimate photos of you online. What is this called and what should you do?",
    options: [
      "Ignore it, they're probably bluffing",
      "Negotiate with them to prevent it",
      "It's image-based abuse - report to Ethiopian Federal Police and platform immediately",
      "Delete your social media accounts"
    ],
    correct: 2,
    explanation: "This is a serious crime under Ethiopian law (Criminal Code Article 640 and Computer Crime Proclamation). Document everything, report to the platform and Ethiopian Federal Police Cyber Crime Unit immediately, contact Ethiopian Women Lawyers Association (EWLA) for legal support, and seek counseling. Do not negotiate with the perpetrator."
  },
  {
    id: 3,
    question: "Someone is repeatedly sending you unwanted messages despite you asking them to stop. This is:",
    options: [
      "Just annoying but not serious",
      "Cyberstalking/harassment - document and report it under Ethiopian law",
      "Normal online behavior",
      "Something you should handle privately"
    ],
    correct: 1,
    explanation: "Persistent unwanted contact is cyberstalking/harassment under Ethiopian Criminal Code Article 553. Document all messages with screenshots including dates and times, block the person, report to the platform, and file a police report at your local Woreda/Kebele police station if it continues."
  },
  {
    id: 4,
    question: "What should you do FIRST when experiencing online harassment?",
    options: [
      "Respond and tell them to stop",
      "Delete everything to make it go away",
      "Document it with screenshots including dates/times/URLs",
      "Tell all your friends about it"
    ],
    correct: 2,
    explanation: "Always document first! Take screenshots with visible dates, times, and URLs. This evidence is crucial for reporting to platforms, authorities, or legal action. Never delete evidence."
  },
  {
    id: 5,
    question: "Someone creates a fake profile pretending to be you and posts harmful content. What should you do?",
    options: [
      "Create another fake profile to expose them",
      "Report to the platform with your Ethiopian ID, document everything, and file a police report",
      "Just ignore it until it goes away",
      "Try to figure out who it is yourself"
    ],
    correct: 1,
    explanation: "Impersonation is a crime under Ethiopian Computer Crime Proclamation Article 8 (identity theft and fraud). Report to the platform immediately with your Ethiopian ID card or passport as verification, document all fake content with screenshots, and file a criminal complaint with the Ethiopian Federal Police Cyber Crime Unit."
  },
  {
    id: 6,
    question: "What information should you NEVER share publicly on social media?",
    options: [
      "Your favorite movies and hobbies",
      "Your home address, phone number, workplace, or daily routines",
      "Photos of your pets",
      "Your opinions on current events"
    ],
    correct: 1,
    explanation: "Never share information that could help someone locate you physically. This includes addresses, phone numbers, workplace details, school locations, and daily routines/patterns."
  },
  {
    id: 7,
    question: "A stranger online offers you money or gifts in exchange for photos or personal information. This is:",
    options: [
      "A great opportunity",
      "Online grooming/exploitation - report immediately and block",
      "Harmless if you're an adult",
      "Something to consider carefully"
    ],
    correct: 1,
    explanation: "This is a red flag for online grooming, exploitation, or trafficking. Never accept gifts or money from strangers online in exchange for any content or information. Report immediately."
  },
  {
    id: 8,
    question: "What's the best way to protect your accounts from being hacked?",
    options: [
      "Use the same password everywhere so you remember it",
      "Use strong, unique passwords and enable two-factor authentication",
      "Share your password with trusted friends for backup",
      "Write passwords in your phone notes"
    ],
    correct: 1,
    explanation: "Always use strong, unique passwords for each account and enable two-factor authentication (2FA). Consider using a password manager. Never share passwords or reuse them."
  },
  {
    id: 9,
    question: "Someone posts lies about you online to damage your reputation. This is called:",
    options: [
      "Just drama - not a real problem",
      "Defamation - illegal under Ethiopian Criminal Code Article 589",
      "Freedom of speech - they can say what they want",
      "Something you have to accept"
    ],
    correct: 1,
    explanation: "False statements that damage your reputation constitute defamation under Ethiopian Criminal Code Article 589, punishable by fine or imprisonment. Document everything with screenshots, report to platforms, file a police report, and consult with Ethiopian Women Lawyers Association (EWLA) or a private attorney for potential civil damages."
  },
  {
    id: 10,
    question: "If you're experiencing digital abuse in Ethiopia, who should you tell?",
    options: [
      "Keep it to yourself to avoid drama",
      "Only your online friends",
      "Trusted friends/family, police, Women's Affairs Office, EWLA, and support organizations",
      "No one - handle it alone"
    ],
    correct: 2,
    explanation: "Never suffer in silence. Tell trusted people in your life, report to platforms, contact your local police or Women and Children Affairs Office, reach out to Ethiopian Women Lawyers Association (EWLA), Ministry of Women and Social Affairs, or AWSAD for support. You deserve help and protection under Ethiopian law."
  }
];

function EducationQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const handleAnswerSelect = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    
    setAnsweredQuestions([...answeredQuestions, {
      question: quizQuestions[currentQuestion].question,
      correct: isCorrect,
      userAnswer: selectedAnswer,
      correctAnswer: quizQuestions[currentQuestion].correct
    }]);

    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
    setAnsweredQuestions([]);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) return "Perfect! You're well-informed about digital safety!";
    if (percentage >= 80) return "Great job! You have strong knowledge of digital safety.";
    if (percentage >= 60) return "Good effort! Review the explanations to strengthen your knowledge.";
    return "Keep learning! Digital safety is crucial - review all explanations carefully.";
  };

  if (completed) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2 className="quiz-title">Quiz Complete!</h2>
          <div className="results-summary">
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/ {quizQuestions.length}</span>
              </div>
              <p className="score-message">{getScoreMessage()}</p>
            </div>

            <div className="results-details">
              <h3>Your Answers:</h3>
              {answeredQuestions.map((item, index) => (
                <div key={index} className={`result-item ${item.correct ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    <span className="result-icon">{item.correct ? '✓' : '✗'}</span>
                    <span className="result-question">Question {index + 1}</span>
                  </div>
                  <p className="result-text">{item.question}</p>
                </div>
              ))}
            </div>

            <div className="resources">
              <h3>Important Resources in Ethiopia:</h3>
              <ul>
                <li><strong>Ethiopian Federal Police Cyber Crime Unit:</strong> Report cybercrime incidents</li>
                <li><strong>Ministry of Women and Social Affairs:</strong> Gender-based violence support and legal aid referrals</li>
                <li><strong>Ethiopian Women Lawyers Association (EWLA):</strong> Free legal aid and counseling for women</li>
                <li><strong>Association for Women's Sanctuary and Development (AWSAD):</strong> Shelter and support services</li>
                <li><strong>Ethiopian Communications Authority:</strong> Report telecommunications harassment</li>
                <li><strong>Police Emergency Number:</strong> 911 (in Addis Ababa and major cities)</li>
                <li><strong>Women and Children Affairs Office:</strong> Available in all Woredas for local support</li>
                <li><strong>Justice and Legal System Research Institute:</strong> Free legal aid services</li>
              </ul>
            </div>

            <button onClick={handleRestart} className="btn btn-primary">
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2 className="quiz-title">Digital Safety Education</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
          <p className="progress-text">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
        </div>

        <div className="question-section">
          <h3 className="question-text">{question.question}</h3>
          
          <div className="options-list">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  selectedAnswer === index ? 'selected' : ''
                } ${
                  showExplanation && index === question.correct ? 'correct' : ''
                } ${
                  showExplanation && selectedAnswer === index && index !== question.correct ? 'incorrect' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="explanation">
              <h4>Explanation:</h4>
              <p>{question.explanation}</p>
            </div>
          )}

          <div className="quiz-actions">
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="btn btn-primary"
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNext} className="btn btn-primary">
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationQuiz;
