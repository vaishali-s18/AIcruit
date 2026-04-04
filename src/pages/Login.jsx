import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/auth';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Logic Fix: Await the async service call
    const result = await authService.login(email, password);
    
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="auth-logo">
           <span className="logo-icon">🎯</span>
           <span className="logo-text">AIcruit</span>
        </div>

        <div className="auth-header">
           <h1>Welcome back, Professional</h1>
           <p>Access your matrix and continue your journey</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form-elite">
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
            <label><span>📧</span> Email Address</label>
            <input
              type="email"
              className="ops-input-field"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><span>🔒</span> Password Key</label>
            <input
              type="password"
              className="ops-input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="elite-auth-btn" disabled={loading}>
            {loading ? 'Synchronizing Portal...' : 'Access Portal'}
          </button>
        </form>

        <footer className="auth-footer">
           <p>
              New here? <Link to="/signup" className="auth-link">Build Your Future Matrix</Link>
           </p>
        </footer>
      </motion.div>
    </div>
  );
}

export default Login;