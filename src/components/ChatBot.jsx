import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatBot.css';

const AI_RESPONSES = {
  hi: "Hello! I'm your Aicruit Assistant. How can I help you optimize your career path today?",
  job: "I can help you find the perfect role. Try checking the 'AI Matching' page for your top 90%+ compatibility matches!",
  match: "Our deterministic matching algorithm analyzes 40+ data points including your skills, experience, and historical placement trends.",
  resume: "Your resume is currently rated 'Elite'. I suggest adding more quantitative metrics (e.g., 'Reduced latency by 40%') to hit 95% match rates.",
  help: "You can ask me about available jobs, your resume status, or how to improve your match scores!",
  default: "That's an interesting question. I'm currently processing that request using our neural trajectory engine. Is there anything else about your career path I can clarify?"
};

const Icons = {
  Bot: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle></svg>),
  Send: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>),
  Close: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>)
};

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: "Welcome back! I've analyzed 240 new roles since your last visit. Want to see your top matches?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('hi') || lowerInput.includes('hello')) return AI_RESPONSES.hi;
    if (lowerInput.includes('job') || lowerInput.includes('role')) return AI_RESPONSES.job;
    if (lowerInput.includes('match') || lowerInput.includes('score')) return AI_RESPONSES.match;
    if (lowerInput.includes('resume') || lowerInput.includes('cv')) return AI_RESPONSES.resume;
    if (lowerInput.includes('help')) return AI_RESPONSES.help;
    return AI_RESPONSES.default;
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    // Simulate thinking
    setIsTyping(true);
    setTimeout(() => {
      const responseText = getAIResponse(userMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (text) => {
    setInputValue(text);
    // Use a small timeout so the input updates before handling
    setTimeout(() => {
      const userMsg = { id: Date.now(), type: 'user', text };
      setMessages(prev => [...prev, userMsg]);
      setInputValue('');
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: getAIResponse(text) }]);
        setIsTyping(false);
      }, 1000);
    }, 50);
  };

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-window"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="status-dot"></div>
                <div>
                  <h3>Aicruit Core</h3>
                  <span>Neural Assistant • Online</span>
                </div>
              </div>
              <button className="close-chat" onClick={() => setIsOpen(false)}>
                <Icons.Close />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`msg msg-${msg.type}`}
                >
                  {msg.text}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="msg msg-ai typing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              )}
              
              {!isTyping && messages.length < 5 && (
                <div className="quick-actions">
                  <button className="action-btn" onClick={() => handleQuickAction("Top Matches")}>🚀 Top Matches</button>
                  <button className="action-btn" onClick={() => handleQuickAction("Resume Check")}>📄 Resume Check</button>
                  <button className="action-btn" onClick={() => handleQuickAction("Help")}>💡 Help</button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-bar" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Ask trajectory..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button className="send-btn" disabled={!inputValue.trim()}>
                <Icons.Send />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <Icons.Close /> : <Icons.Bot />}
      </motion.button>
    </div>
  );
}

export default ChatBot;
