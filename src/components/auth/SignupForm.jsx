import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/auth';
import '../../pages/Auth.css';

function SignupForm({ onSuccess, onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await authService.signup(name, email, password, role);
    
    if (result.success) {
      if (onSuccess) onSuccess(result.user);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-box-inner">
      <div className="auth-logo">
         <span className="logo-icon">🎯</span>
         <span className="logo-text">AIcruit</span>
      </div>

      <div className="auth-header">
         <h1>Create Your Account</h1>
         <p>Join our professional network</p>
      </div>

      <form onSubmit={handleSignup} className="auth-form-elite">
        <AnimatePresence mode="wait">
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
          <label><span>👤</span> Full Name</label>
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
          <label><span>📧</span> Email Address</label>
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
          <label><span>🔒</span> Password</label>
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
           <label><span>🛡️</span> I am a</label>
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <footer className="auth-footer">
         <p>
            Already Registered? <button onClick={onSwitch} className="auth-link-btn">Login Here</button>
         </p>
      </footer>
    </div>
  );
}

export default SignupForm;
