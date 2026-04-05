import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './AuthModal.css';

function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, setAuthModalTab, intendedPath } = useAuth();
  const navigate = useNavigate();

  if (!isAuthModalOpen) return null;

  const handleSuccess = () => {
    if (intendedPath) {
      navigate(intendedPath);
    }
    closeAuthModal();
  };

  return (
    <AnimatePresence>
      <div className="auth-modal-overlay" onClick={closeAuthModal}>
        <motion.div 
          className="auth-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="auth-modal-glow"></div>
          
          <button className="auth-modal-close" onClick={closeAuthModal}>
            ✕
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={authModalTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {authModalTab === 'login' ? (
                <LoginForm 
                  onSuccess={handleSuccess} 
                  onSwitch={() => setAuthModalTab('signup')} 
                />
              ) : (
                <SignupForm 
                  onSuccess={handleSuccess} 
                  onSwitch={() => setAuthModalTab('login')} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


export default AuthModal;
