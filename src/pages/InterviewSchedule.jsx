import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobs } from '../data/jobs';
import { authService } from '../services/auth';
import './InterviewSchedule.css';

const INTERVIEW_SCRIPT = [
  "Welcome to the Aicruit Neural Screening Chamber. I am the autonomous assessment operative. To begin, please confirm your primary technical domain and years of active deployment.",
  "Understood. We are analyzing your profile for the '{jobTitle}' position. Could you describe a recent scalable architecture you designed, and the specific latency reduction you achieved?",
  "Intriguing. How do you handle asynchronous state synchronization across distributed micro-frontends?",
  "Excellent response. Finally, describe a critical system failure you encountered, and your exact methodology for executing a zero-downtime recovery.",
  "Processing your responses through our neural matrix..." // This is a system transition message
];

function InterviewSchedule() {
  const [selectedJob, setSelectedJob] = useState('');
  const [isScreening, setIsScreening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startScreening = (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    
    setIsScreening(true);
    const jobData = jobs.find(j => j.id === selectedJob);
    
    // Initial delay before AI speaks
    setTimeout(() => {
      triggerAIResponse(0, jobData.title);
    }, 1000);
  };

  const triggerAIResponse = (stepIndex, jobTitle = '') => {
    setIsTyping(true);
    
    // Simulate thinking time
    setTimeout(() => {
      let text = INTERVIEW_SCRIPT[stepIndex];
      // Note: we fetch job again if jobTitle wasn't provided since state might be stale in timeout closure without proper deps
      const currentJob = jobs.find(j => j.id === selectedJob);
      const titleToUse = jobTitle || currentJob?.title || 'the targeted';

      if (text.includes('{jobTitle}')) {
        text = text.replace('{jobTitle}', titleToUse);
      }

      setMessages(prev => [...prev, { id: Date.now(), type: 'ai', text }]);
      setIsTyping(false);
      setCurrentStep(stepIndex + 1);

      // If it was the final processing message, trigger completion
      if (stepIndex === INTERVIEW_SCRIPT.length - 1) {
        setTimeout(finalizeScreening, 3000);
      }
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || screeningComplete) return;

    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: inputValue }]);
    setInputValue('');
    
    if (currentStep < INTERVIEW_SCRIPT.length) {
      const jobData = jobs.find(j => j.id === selectedJob);
      triggerAIResponse(currentStep, jobData?.title);
    }
  };

  const finalizeScreening = () => {
    const finalScore = Math.floor(Math.random() * (98 - 85 + 1) + 85); // Random high score
    setConfidenceScore(finalScore);
    setScreeningComplete(true);
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      type: 'ai', 
      text: `Screening Terminated. Neural analysis complete. Candidate compatibility for this architecture is rated at ${finalScore}%. The executive team has been notified.` 
    }]);

    // Save to LocalStorage layer
    const currentUser = authService.getCurrentUser() || { name: 'Guest User', email: 'guest@aicruit.com' };
    const jobData = jobs.find(j => j.id === selectedJob) || { id: selectedJob, title: 'Unknown Job' };
    
    const applicationRecord = {
      id: `app-${Date.now()}`,
      jobId: jobData.id,
      candidateName: currentUser.name,
      candidateEmail: currentUser.email,
      role: currentUser.role || 'Senior Professional',
      matchScore: finalScore,
      skills: ["React", "Node.js", "System Architecture", "Leadership"], // Fallback skills
      status: 'Screening Complete',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const existingApps = JSON.parse(localStorage.getItem('liveApplications') || '[]');
    localStorage.setItem('liveApplications', JSON.stringify([applicationRecord, ...existingApps]));
  };

  const resetScreening = () => {
    setIsScreening(false);
    setMessages([]);
    setCurrentStep(0);
    setScreeningComplete(false);
    setInputValue('');
    setSelectedJob('');
  };

  return (
    <div className="ai-screen-container">
      <AnimatePresence mode="wait">
        {!isScreening ? (
          <motion.div 
            key="setup"
            className="ai-setup-chamber"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="chamber-header">
              <div className="pulsing-core"></div>
              <h1>AI Technical Screen</h1>
              <p>Initiate autonomous pre-screening protocols.</p>
            </div>

            <form onSubmit={startScreening} className="chamber-form">
              <div className="form-group">
                <label>Target Architecture (Position)</label>
                <select 
                  value={selectedJob} 
                  onChange={(e) => setSelectedJob(e.target.value)}
                  required
                >
                  <option value="">-- Connect to Job Protocol --</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} // {job.company}
                    </option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="btn-initiate" disabled={!selectedJob}>
                INITIATE PROTOCOL
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            className="ai-chat-chamber"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="chat-header-luxe">
              <div className="ai-identity">
                <div className="ai-avatar">
                  <div className="ai-core"></div>
                </div>
                <div className="ai-info">
                  <h3>Aicruit Autonomous Assessor</h3>
                  <span className="status-text blink">Live Neural Connection Active</span>
                </div>
              </div>
              {screeningComplete && (
                <div className="final-score-badge">
                  <span className="lbl">Match Confidence</span>
                  <span className="val">{confidenceScore}%</span>
                </div>
              )}
              <button className="btn-abort" onClick={resetScreening}>Abort</button>
            </div>

            <div className="chat-log-luxe custom-scrollbar">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, x: msg.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  className={`message-bubble ${msg.type}`}
                >
                  <div className="msg-content">{msg.text}</div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="message-bubble ai typing">
                  <div className="msg-content">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <form onSubmit={handleSendMessage} className={`input-form-luxe ${screeningComplete || currentStep === INTERVIEW_SCRIPT.length ? 'disabled' : ''}`}>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={screeningComplete ? "Session Terminated." : "Transmit response..."}
                  disabled={isTyping || screeningComplete || currentStep === INTERVIEW_SCRIPT.length}
                />
                <button 
                  type="submit" 
                  className="btn-transmit"
                  disabled={!inputValue.trim() || isTyping || screeningComplete || currentStep === INTERVIEW_SCRIPT.length}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InterviewSchedule;