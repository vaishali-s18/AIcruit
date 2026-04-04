import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/auth';
import './Auth.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Logic Fix: Await the async service call & sync parameters
    const result = await authService.signup(name, email, password, role);
    
    if (result.success) {
      if (result.user.role === 'recruiter') {
        navigate('/executive/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-box glass-vibe-c"
        initial={{ opacity: 0, scale: 0.95, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="auth-logo">
           <span className="logo-icon">🎯</span>
           <span className="logo-text">AIcruit</span>
        </div>

        <div className="auth-header">
           <h1>Build Your Future Matrix</h1>
           <p>Join our elite network of professionals</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form-elite">
          <AnimatePresence>
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="form-group">
            <label><span>👤</span> Full Legal Name</label>
            <input
              type="text"
              className="ops-input-field"
              placeholder="John Doe..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><span>📧</span> Email Vector</label>
            <input
              type="email"
              className="ops-input-field"
              placeholder="operator@aicruit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><span>🔒</span> Keycode (Password)</label>
            <input
              type="password"
              className="ops-input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
             <label><span>🛡️</span> Operator Class</label>
             <div className="role-selector-modern">
                <button 
                  type="button" 
                  className={`role-btn ${role === 'candidate' ? 'active' : ''}`}
                  onClick={() => setRole('candidate')}
                >
                   Candidate
                </button>
                <button 
                  type="button" 
                  className={`role-btn ${role === 'recruiter' ? 'active' : ''}`}
                  onClick={() => setRole('recruiter')}
                >
                   Executive
                </button>
             </div>
          </div>

          <button type="submit" className="elite-auth-btn" disabled={loading}>
            {loading ? 'Initializing Future...' : 'Initialize Access'}
          </button>
        </form>

        <footer className="auth-footer">
           <p>
              Already Registered? <Link to="/login" className="auth-link">Return to Portal</Link>
           </p>
        </footer>
      </motion.div>
    </div>
  );
}

export default Signup;