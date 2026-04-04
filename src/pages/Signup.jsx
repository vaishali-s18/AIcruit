import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SignupForm from '../components/auth/SignupForm';
import './Auth.css';

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-box glass-vibe-c"
        initial={{ opacity: 0, scale: 0.95, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <SignupForm 
          onSuccess={() => navigate('/')} 
          onSwitch={() => navigate('/login')} 
        />
      </motion.div>
    </div>
  );
}

export default Signup;