import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReportAbuse from './components/ReportAbuse.jsx';
import EducationQuiz from './components/EducationQuiz.jsx';
import HashGenerator from './components/HashGenerator.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="logo">Digital Safety Hub</h1>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Report Abuse</Link>
              </li>
              <li className="nav-item">
                <Link to="/education" className="nav-link">Safety Education</Link>
              </li>
              <li className="nav-item">
                <Link to="/hash" className="nav-link">Verify Evidence</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ReportAbuse />} />
          <Route path="/education" element={<EducationQuiz />} />
          <Route path="/hash" element={<HashGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
