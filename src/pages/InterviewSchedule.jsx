import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { jobs as backupJobs } from '../data/jobs';
import { authService } from '../services/auth';
import './InterviewSchedule.css';

const INTERVIEW_SCRIPT = [
  "Welcome! I am your AI assistant for this interview. To start, please tell me about your technical background and total years of experience.",
  "Great. I am reviewing your profile for the '{jobTitle}' position. Could you describe a recent project where you designed a scalable system and how you improved its performance?",
  "That's interesting. How do you handle managing state in large applications?",
  "Thank you. Finally, tell me about a difficult technical problem you solved and how you fixed it.",
  "Analyzing your answers..."
];

function InterviewSchedule() {
  const location = useLocation();
  const [liveJobs, setLiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [isScreening, setIsScreening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  
  const messagesEndRef = useRef(null);

  // Fetch live jobs to match against incoming handover IDs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('/api/jobs');
        setLiveJobs(data);
      } catch (error) {
        console.warn('AI Interview API Warning: Falling back to local job archive.');
        setLiveJobs(backupJobs);
      }
    };
    fetchJobs();
  }, []);

  // Professional Handover Protocol: Detect application context and auto-initialize from state
  useEffect(() => {
    const contextJobId = location.state?.jobId;
    if (contextJobId && liveJobs.length > 0 && !isScreening) {
      const jobIdStr = String(contextJobId);
      const targetJob = liveJobs.find(j => String(j.id) === jobIdStr || String(j._id) === jobIdStr);
      
      if (targetJob) {
        setSelectedJob(targetJob.id || targetJob._id);
        setIsScreening(true);
        setTimeout(() => {
          triggerAIResponse(0, targetJob.title);
        }, 1000);
      }
    }
  }, [location.state, liveJobs, isScreening]);

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
    const jobData = liveJobs.find(j => String(j.id) === String(selectedJob) || String(j._id) === String(selectedJob));
    
    // Initial delay before AI speaks
    setTimeout(() => {
      triggerAIResponse(0, jobData?.title);
    }, 1000);
  };

  const triggerAIResponse = (stepIndex, jobTitle = '') => {
    if (stepIndex >= INTERVIEW_SCRIPT.length) return;
    setIsTyping(true);
    
    // Simulate thinking time
    setTimeout(() => {
      setIsTyping(false);
      let text = INTERVIEW_SCRIPT[stepIndex];
      
      // If title wasn't passed, try to fetch it from state data
      const currentJob = liveJobs.find(j => String(j.id) === String(selectedJob) || String(j._id) === String(selectedJob));
      const titleToUse = jobTitle || currentJob?.title || 'this position';

      if (text.includes('{jobTitle}')) {
        text = text.replace('{jobTitle}', titleToUse);
      }

      const nextMsg = {
        id: `ai-${Date.now()}-${Math.random()}`,
        type: 'ai',
        text
      };
      
      setMessages(prev => [...prev, nextMsg]);
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

    const userMsg = { id: `user-${Date.now()}`, type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    if (currentStep < INTERVIEW_SCRIPT.length) {
      const jobData = liveJobs.find(j => String(j.id) === String(selectedJob) || String(j._id) === String(selectedJob));
      triggerAIResponse(currentStep, jobData?.title);
    }
  };

  const finalizeScreening = () => {
    const finalScore = Math.floor(Math.random() * (98 - 85 + 1) + 85); // Random high score
    setConfidenceScore(finalScore);
    setScreeningComplete(true);

    const finalMessages = [
      ...messages,
      { 
        id: `ai-final-${Date.now()}`, 
        type: 'ai', 
        text: `Interview complete. Your evaluation is finished. Your match score for this position is ${finalScore}%. The hiring team has been notified.` 
      }
    ];

    setMessages(finalMessages);

    // Save to LocalStorage layer
    const currentUser = authService.getCurrentUser() || { name: 'Guest User', email: 'guest@aicruit.com' };
    const jobData = liveJobs.find(j => String(j.id) === String(selectedJob) || String(j._id) === String(selectedJob)) || { id: selectedJob, title: 'Unknown Job' };
    
    const applicationRecord = {
      id: `app-${Date.now()}`,
      jobId: jobData.id || jobData._id,
      candidateName: currentUser.name,
      candidateEmail: currentUser.email,
      role: currentUser.role || 'Senior Professional',
      matchScore: finalScore,
      skills: ["React", "Node.js", "System Architecture", "Leadership"], // Fallback skills
      status: 'Screening Complete',
      transcript: finalMessages,
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
    setConfidenceScore(0);
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
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="chamber-header">
              <div className="pulsing-core"></div>
              <h1>AI Interview</h1>
              <p>Start your automated technical screening.</p>
            </div>

            <form onSubmit={startScreening} className="chamber-form">
              <div className="form-group">
                <label>Target Architecture (Position)</label>
                <select 
                  value={selectedJob} 
                  onChange={(e) => setSelectedJob(e.target.value)}
                  required
                >
                  <option value="">-- Select a Job --</option>
                  {liveJobs.map(job => (
                    <option key={job.id || job._id} value={job.id || job._id}>
                      {job.title} // {job.company}
                    </option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="btn-initiate" disabled={!selectedJob}>
                START INTERVIEW
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
                  <h3>AI Hiring Assistant</h3>
                  <span className="status-text blink">Interview in Progress</span>
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

            <div className={`chat-input-area ${screeningComplete ? 'disabled' : ''}`}>
              <form onSubmit={handleSendMessage} className={`input-form-luxe ${screeningComplete ? 'disabled' : ''}`}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={screeningComplete ? "Evaluation finished..." : "Type your technical response..."}
                  disabled={isTyping || screeningComplete}
                />
                <button type="submit" className="btn-transmit" disabled={!inputValue.trim() || isTyping || screeningComplete}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
                  </svg>
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