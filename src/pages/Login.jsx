import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import './Auth.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-box glass-vibe-c"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <LoginForm 
          onSuccess={() => navigate('/')} 
          onSwitch={() => navigate('/signup')} 
        />
      </motion.div>
    </div>
  );
}

export default Login;