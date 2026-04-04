import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Icons = {
  Upload: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>),
  Check: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>),
  Search: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>),
  Zap: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>),
  Users: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>),
  TrendingUp: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>),
};

function Landing() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user?.role === 'recruiter') { navigate('/executive/dashboard'); }
  }, [auth.user, navigate]);

  const handleHeroAction = (path, tab = 'login') => {
    if (auth.user) {
      navigate(path);
    } else {
      auth.openAuthModal(tab, path);
    }
  };

  const valueProps = [
    { icon: <Icons.Zap />, title: "AI-Powered Matching", desc: "Our advanced algorithms match your skills with the perfect job opportunities in seconds." },
    { icon: <Icons.TrendingUp />, title: "Career Growth", desc: "Get personalized insights and recommendations to help you scale your professional career." },
    { icon: <Icons.Users />, title: "Direct Access", desc: "Skip the line and get your profile seen by top recruiters and hiring managers globally." }
  ];

  const steps = [
    { num: "01", icon: <Icons.Upload />, title: "Upload Resume", desc: "Submit your resume to get started with our AI analysis." },
    { num: "02", icon: <Icons.Zap />, title: "Get Matched", desc: "Our AI finds the best roles that match your expertise." },
    { num: "03", icon: <Icons.Check />, title: "Apply Instantly", desc: "Review matches and apply to your dream jobs with one click." }
  ];

  const testimonials = [
    { name: "Sarah Jenkins", role: "Software Engineer", text: "AIcruit helped me find my current role at a tech firm in less than two weeks. The matching is incredibly accurate!" },
    { name: "Michael Chen", role: "Product Manager", text: "The AI analysis of my resume gave me great insights into which skills I should highlight for the roles I wanted." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="landing-premium">
      {/* Hero Section */}
      <section className="hero-premium">
        <div className="hero-video-wrapper">
          <video className="hero-video-bg" autoPlay loop muted playsInline>
            <source src="/videos/video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
          
          <div className="ambient-glow" style={{ top: '20%', left: '10%', width: '400px', height: '400px', opacity: 0.15 }}></div>
          <div className="ambient-glow" style={{ bottom: '10%', right: '5%', width: '600px', height: '600px', opacity: 0.1 }}></div>
        </div>

        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Find Your <span>Dream Job</span> <br /> With AI Matching
          </h1>
          <p className="hero-subtitle">
            Experience the next generation of professional matching. We decode your expertise to find roles that actually matter.
          </p>

          <div className="hero-actions">
            <button onClick={() => handleHeroAction('/upload-resume', 'signup')} className="btn-primary">Upload Resume</button>
            <button onClick={() => handleHeroAction('/jobs', 'login')} className="btn-secondary">Browse Jobs</button>
          </div>

          <p className="hero-trust-line">Trusted by thousands of professionals finding their dream careers.</p>
        </motion.div>
      </section>

      {/* Value Proposition */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Why Professionals Choose AIcruit</h2>
          <p className="section-subtitle">We combine cutting-edge technology with professional recruitment practices.</p>
        </div>
        <motion.div 
          className="value-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {valueProps.map((prop, i) => (
            <motion.div key={i} className="value-card" variants={itemVariants}>
              <div className="value-icon">{prop.icon}</div>
              <h3>{prop.title}</h3>
              <p>{prop.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to your next big career move.</p>
        </div>
        <div className="steps-container">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              className="step-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-icon-wrap">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Companies Hiring on AIcruit */}
      <section className="section companies-section">
        <div className="section-header">
          <h2 className="section-title">Top Companies Hiring on <span>AIcruit</span></h2>
          <p className="section-subtitle">Join the ranks of professionals hired by global industry leaders.</p>
        </div>
        
        <motion.div 
          className="company-grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { name: 'Google', icon: 'G' },
            { name: 'Amazon', icon: 'A' },
            { name: 'Microsoft', icon: 'M' },
            { name: 'Infosys', icon: 'I' },
            { name: 'TCS', icon: 'T' },
            { name: 'Accenture', icon: 'Ac' }
          ].map((company, i) => (
            <motion.div 
              key={i} 
              className="company-card"
              whileHover={{ y: -8, borderColor: 'var(--accent-primary)', boxShadow: '0 0 25px var(--accent-glow)' }}
            >
              <div className="company-logo-wrap">
                <div className="company-icon-circle">{company.icon}</div>
                <span className="company-name-text">{company.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">What Our Users Say</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              className="testimonial-card"
              whileHover={{ y: -5 }}
            >
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-user">
                <div className="user-avatar"></div>
                <div className="user-info">
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ textAlign: 'center', padding: '100px 2rem' }}>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
          <h2 className="section-title">Ready to Start Your Journey?</h2>
          <p className="section-subtitle" style={{ marginBottom: '3rem' }}>Join thousands of professionals finding their perfect career match.</p>
          <Link to="/signup" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}>Get Started Now</Link>
        </motion.div>
      </section>
    </div>
  );
}

export default Landing;