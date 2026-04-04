import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/auth';
import '../../pages/Auth.css';

function LoginForm({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await authService.login(email, password);
    
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
         <h1>Welcome Back</h1>
         <p>Sign in to your dashboard to continue</p>
      </div>

      <form onSubmit={handleLogin} className="auth-form-elite">
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

        <button type="submit" className="elite-auth-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <footer className="auth-footer">
         <p>
            New here? <button onClick={onSwitch} className="auth-link-btn">Create an Account</button>
         </p>
      </footer>
    </div>
  );
}

export default LoginForm;
