// SkillAssessment.jsx - Professional Testing Center
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/auth';
import './SkillAssessment.css';

const skillTests = [
  {
    id: 1, name: 'JavaScript Patterns', duration: '15 mins', difficulty: 'Beginner', difficultyColor: '#0ea5e9', icon: '📘', score: 0,
    questions: [
      { id: 1, question: 'What is the correct way to declare a variable in modern JS?', options: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'Both let and const'], correct: 3, explanation: 'Modern JS uses let and const for block-scoping.' },
      { id: 2, question: 'What does JSON stand for?', options: ['JavaScript Object Notation', 'Java Syntax Object Notation', 'JavaScript Online Notation', 'Just Object Notation'], correct: 0, explanation: 'JSON is the standard data interchange format.' }
    ]
  },
  {
    id: 2, name: 'React Architecture', duration: '20 mins', difficulty: 'Intermediate', difficultyColor: '#0d9488', icon: '⚛️', score: 0,
    questions: [
      { id: 1, question: 'Which hook is used for complex state logic?', options: ['useState', 'useEffect', 'useReducer', 'useMemo'], correct: 2, explanation: 'useReducer is preferred for complex state management.' },
      { id: 2, question: 'What is the purpose of React.memo()?', options: ['To memoize a function', 'To memoize a component', 'To save state to disk', 'To speed up network requests'], correct: 1, explanation: 'React.memo() prevents unnecessary re-renders of components.' }
    ]
  },
  {
    id: 3, name: 'Python Core Concepts', duration: '25 mins', difficulty: 'Intermediate', difficultyColor: '#0d9488', icon: '🐍', score: 0,
    questions: [
      { id: 1, question: 'Which library is standard for data manipulation?', options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'], correct: 1, explanation: 'Pandas is the primary library for dataframes and manipulation.' },
      { id: 2, question: 'What is a lambda function?', options: ['A named function', 'An anonymous function', 'A recursive function', 'A class method'], correct: 1, explanation: 'Lambda functions are small, anonymous functions in Python.' }
    ]
  },
  {
    id: 4, name: 'DevOps & Infrastructure', duration: '30 mins', difficulty: 'Advanced', difficultyColor: '#f43f5e', icon: '☁️', score: 0,
    questions: [
      { id: 1, question: 'What is Infrastructure as Code (IaC)?', options: ['Writing manuals for servers', 'Managing infrastructure through config files', 'Using custom hardware', 'None of the above'], correct: 1, explanation: 'IaC allows managing and provisioning through machine-readable definition files.' },
      { id: 2, question: 'Which tool is primarily for container orchestration?', options: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'], correct: 1, explanation: 'Kubernetes is the industry standard for orchestrating containers.' }
    ]
  },
  {
    id: 5, name: 'System Design Patterns', duration: '30 mins', difficulty: 'Advanced', difficultyColor: '#f43f5e', icon: '🏗️', score: 0,
    questions: [
      { id: 1, question: 'What is vertical scaling?', options: ['Adding more machines', 'Adding more power to existing machine', 'Adding a load balancer', 'Using a CDN'], correct: 1, explanation: 'Vertical scaling (Scaling Up) means adding more CPU/RAM to a single server.' },
      { id: 2, question: 'What is the CAP theorem?', options: ['Consistency, Availability, Partition Tolerance', 'Caching, Availability, Peering', 'Cloud, APIs, Performance', 'None of the above'], correct: 0, explanation: 'CAP theorem states a distributed system can only provide two of the three.' }
    ]
  },
  {
    id: 6, name: 'Professional EQ', duration: '20 mins', difficulty: 'Intermediate', difficultyColor: '#0d9488', icon: '🤝', score: 0,
    questions: [
      { id: 1, question: 'How should you provide feedback to a team member?', options: ['Publicly in a meeting', 'Privately with specific examples', 'Send an anonymous email', 'Don\'t give feedback'], correct: 1, explanation: 'Effective feedback is private, constructive, and based on specific observations.' },
      { id: 2, question: 'What is active listening?', options: ['Hearing words while working', 'Paying full attention and reflecting back', 'Interrupting with solutions', 'Recording the conversation'], correct: 1, explanation: 'Active listening involve fully concentrating and responding to the speaker.' }
    ]
  }
];

function SkillAssessment() {
  const [tests, setTests] = useState(skillTests);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [completedTests, setCompletedTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (user && user.completedTests) setCompletedTests(user.completedTests);
  }, [user]);

  const handleSelectTest = (test) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedTest(test); setCurrentQuestion(0); setUserAnswers({}); setShowResults(false); setShowExplanation(false); setIsLoading(false);
    }, 400);
  };

  const handleAnswerSelect = (optionIndex) => {
    if (userAnswers[currentQuestion] !== undefined) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion]: optionIndex }));
    setShowExplanation(true);
  };

  const handleSubmitTest = () => {
    let score = 0;
    selectedTest.questions.forEach((q, idx) => { if (userAnswers[idx] === q.correct) score++; });
    const percentage = Math.round((score / selectedTest.questions.length) * 100);
    const updatedTest = { ...selectedTest, score: percentage };
    setSelectedTest(updatedTest); setShowResults(true);

    if (user) {
      const testResult = { testId: selectedTest.id, testName: selectedTest.name, score: percentage, date: new Date().toISOString() };
      const updatedList = [...completedTests.filter(t => t.testId !== selectedTest.id), testResult];
      setCompletedTests(updatedList);
      authService.updateProfile(user.id, { completedTests: updatedList });
    }
  };

  if (!selectedTest) {
    const avgScore = completedTests.length > 0 ? Math.round(completedTests.reduce((acc, curr) => acc + curr.score, 0) / completedTests.length) : 0;

    return (
      <div className="skill-assessment-profile">
        <div className="assessment-container">
          <header className="assessment-header-clean">
             <nav className="assessment-breadcrumbs">
                <span className="crumb">Platform</span>
                <span className="sep">/</span>
                <span className="active">Skill Assessment</span>
             </nav>
             <div className="header-info-row">
                <div className="title-block">
                   <h1>Skill <span className="highlight-blue">Assessment</span></h1>
                   <p className="subtitle">Verify your technical proficiency with industry-standard tests.</p>
                </div>
                <div className="stats-board glass-panel">
                   <div className="stat-node">
                      <span className="label">Average Score</span>
                      <span className="value highlight">{avgScore}%</span>
                   </div>
                   <div className="stat-separator"></div>
                   <div className="stat-node">
                      <span className="label">Tests Completed</span>
                      <span className="value">{completedTests.length}</span>
                   </div>
                </div>
             </div>
          </header>

          <div className="assessment-gallery-grid">
            {tests.map((test, index) => {
              const completed = completedTests.find(ct => ct.testId === test.id);
              return (
                <motion.div 
                  key={test.id} 
                  className={`assessment-test-card glass-panel ${completed ? 'completed' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="card-top-info">
                     <div className="test-icon-box" style={{ background: `${test.difficultyColor}15`, color: test.difficultyColor }}>
                        {test.icon}
                     </div>
                     <span className="difficulty-label" style={{ color: test.difficultyColor }}>{test.difficulty}</span>
                  </div>
                  
                  <h3>{test.name}</h3>
                  <div className="test-card-meta">
                     <span className="meta-item">⏱️ {test.duration}</span>
                     <span className="meta-item">📝 {test.questions.length} Questions</span>
                  </div>

                  {completed && (
                    <div className="completed-badge-card">
                       <span className="score-txt">Score: {completed.score}%</span>
                    </div>
                  )}

                  <button className="start-test-btn-primary" onClick={() => handleSelectTest(test)}>
                     {completed ? 'Retake Test' : 'Start Test'}
                     <span className="arrow-icon">→</span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Test View Logic
  const question = selectedTest.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedTest.questions.length) * 100;

  return (
    <div className="skill-testing-mode">
      <div className="test-interface-container glass-panel">
         {showResults ? (
           <motion.div className="results-scorecard-clean" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="results-circle-indicator">
                 <span className="results-score-big">{selectedTest.score}%</span>
              </div>
              <h2>Test {selectedTest.score >= 70 ? 'Passed' : 'Incomplete'}</h2>
              <p className="results-hint">{selectedTest.score >= 70 ? 'Your skills have been successfully verified and added to your profile.' : 'You may need more preparation to reach the standard proficiency.'}</p>
              <div className="results-action-row">
                 <button className="btn-done-primary" onClick={() => setSelectedTest(null)}>Finish & Save</button>
                 {selectedTest.score < 70 && <button className="btn-retry-secondary" onClick={() => handleSelectTest(selectedTest)}>Try Again</button>}
              </div>
           </motion.div>
         ) : (
           <>
              <header className="test-interface-header">
                 <button className="exit-test-link" onClick={() => setSelectedTest(null)}>← Exit Test</button>
                 <div className="test-progress-container">
                    <div className="test-progress-fill" style={{ width: `${progress}%` }}></div>
                 </div>
                 <span className="test-progress-text">Question {currentQuestion + 1} of {selectedTest.questions.length}</span>
              </header>

              <div className="test-question-content">
                 <h3 className="question-text">{question.question}</h3>
                 <div className="answer-options-grid">
                    {question.options.map((opt, idx) => (
                       <button 
                         key={idx} 
                         className={`answer-option-btn ${userAnswers[currentQuestion] === idx ? (idx === question.correct ? 'correct' : 'incorrect') : ''}`}
                         onClick={() => handleAnswerSelect(idx)}
                         disabled={userAnswers[currentQuestion] !== undefined}
                       >
                          <span className="option-label">{String.fromCharCode(65 + idx)}</span>
                          <span className="option-text">{opt}</span>
                       </button>
                    ))}
                 </div>

                 <AnimatePresence>
                    {showExplanation && (
                      <motion.div className="explanation-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                         <strong>Explanation:</strong> {question.explanation}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <footer className="test-interface-footer">
                 <button 
                  className="test-nav-btn prev" 
                  disabled={currentQuestion === 0} 
                  onClick={() => { setCurrentQuestion(prev => prev - 1); setShowExplanation(false); }}
                 >Previous</button>
                 
                 {currentQuestion < selectedTest.questions.length - 1 ? (
                   <button 
                    className="test-nav-btn next-primary" 
                    disabled={userAnswers[currentQuestion] === undefined} 
                    onClick={() => { setCurrentQuestion(prev => prev + 1); setShowExplanation(false); }}
                   >Next Question</button>
                 ) : (
                   <button 
                    className="test-nav-btn submit-primary" 
                    disabled={userAnswers[currentQuestion] === undefined} 
                    onClick={handleSubmitTest}
                   >Submit Test</button>
                 )}
              </footer>
           </>
         )}
      </div>
    </div>
  );
}

export default SkillAssessment;