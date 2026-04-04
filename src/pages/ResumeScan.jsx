import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './ResumeScan.css';

const Icons = {
  Target: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg>),
  Zap: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>),
  User: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>),
  Mail: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>),
  Phone: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>),
};

const QuantumScoreGauge = ({ score }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="quantum-gauge-container">
      <svg className="gauge-svg" viewBox="0 0 200 200">
        <circle 
          className="gauge-bg" 
          cx="100" cy="100" r={radius} 
        />
        <motion.circle 
          className="gauge-fill" 
          cx="100" cy="100" r={radius} 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div className="gauge-content">
        <motion.span 
          className="score-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="score-label">Match Integrity</span>
      </div>
    </div>
  );
};

function ResumeScan() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!location.state) {
      navigate('/upload-resume');
      return;
    }
    setData(location.state);
  }, [location, navigate]);

  if (!data) return <div className="loading-protocol">Initializing Neural Scan...</div>;

  const { resumeData, screeningResults, jobData } = data;
  const isNoMatch = (screeningResults?.overallScore || 0) < 30;

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    })
  };

  if (isNoMatch) {
    return (
      <div className="resume-scan-premium mismatch-alert-active">
        <div className="scan-noise-overlay"></div>
        <div className="alert-radial-glow"></div>
        
        <header className="scan-header-luxe container-responsive">
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="scan-badge alert">
            Strategic Non-Alignment Detected
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible" className="alert-text">
            Profile <span className="text-glow-red">Mismatch</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="scan-subtitle">
            Current neural indices indicate a <span className="highlight-alert">Critical Lack of Alignment</span> for this role's tactical requirements.
          </motion.p>
        </header>

        <main className="scan-dashboard-grid container-responsive">
          <motion.section 
            variants={fadeUp} custom={3} initial="hidden" animate="visible"
            className="dashboard-card primary-vector glass-card-luxe alert-border"
          >
            <div className="card-header">
               <Icons.Target />
               <h3>Strategic Alignment Failure</h3>
            </div>
            <div className="mismatch-node-container">
               <div className="mismatch-pulse-node">
                  <span className="mismatch-x">✕</span>
               </div>
               <div className="mismatch-score">
                  <span className="score-val">{screeningResults?.overallScore}%</span>
                  <span className="score-lbl">NON-ALIGNED</span>
               </div>
            </div>
          </motion.section>

          <motion.section 
            variants={fadeUp} custom={4} initial="hidden" animate="visible"
            className="dashboard-card glass-card-luxe"
          >
            <div className="card-header">
               <Icons.Zap />
               <h3>Mismatch Diagnostics</h3>
            </div>
            <p className="mismatch-reason">
              Your profile does not currently match the core skill nodes or experience trajectories required for the <strong>{jobData?.title}</strong> role at this time.
            </p>
            <div className="required-matrix-header">Essential Skill Nodes Missing:</div>
            <div className="skill-node-container">
              {screeningResults?.missingSkills?.slice(0, 5).map((skill, idx) => (
                <span key={idx} className="skill-node-luxe missing">
                  <span className="node-status">⚠</span> {skill}
                </span>
              ))}
            </div>
          </motion.section>

          <motion.div 
            variants={fadeUp} custom={5} initial="hidden" animate="visible"
            className="action-command-bar"
          >
            <button className="btn-outline-luxe" onClick={() => navigate('/upload-resume')}>
               Recalibrate Profile
            </button>
            <button className="btn-premium alert-btn" onClick={() => navigate('/jobs')}>
               Explore Alternative Vectors →
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="resume-scan-premium">
      <div className="scan-noise-overlay"></div>
      
      <header className="scan-header-luxe container-responsive">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="scan-badge">
          Neural Profile Analysis Protocol v2.4
        </motion.div>
        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible">
          Strategic Match <span className="text-glow">Diagnostics</span>
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="scan-subtitle">
          Trajectory alignment report for <span className="highlight-job">{jobData?.title || 'Strategic Role'}</span>
        </motion.p>
      </header>

      <main className="scan-dashboard-grid container-responsive">
        {/* Overall Match - Primary Vector */}
        <motion.section 
          variants={fadeUp} custom={3} initial="hidden" animate="visible"
          className="dashboard-card primary-vector glass-card-luxe"
        >
          <div className="card-header">
             <Icons.Target />
             <h3>Overall Precision Score</h3>
          </div>
          <QuantumScoreGauge score={screeningResults?.overallScore || 0} />
          <div className="match-status-pill">
            {screeningResults?.overallScore > 80 ? 'Elite Alignment Detected' : 'Strategic Re-alignment Recommended'}
          </div>
        </motion.section>

        {/* Identity Vector - Parsed DNA */}
        <motion.section 
          variants={fadeUp} custom={4} initial="hidden" animate="visible"
          className="dashboard-card identity-vector glass-card-luxe"
        >
          <div className="card-header">
             <Icons.User />
             <h3>Strategic Identity Vector</h3>
          </div>
          <div className="identity-data-list">
             <div className="identity-row">
               <Icons.User />
               <div className="data-meta">
                 <span className="label">Candidate Key</span>
                 <span className="value">{resumeData?.name}</span>
               </div>
             </div>
             <div className="identity-row">
               <Icons.Mail />
               <div className="data-meta">
                 <span className="label">Communications Hub</span>
                 <span className="value">{resumeData?.contact?.email}</span>
               </div>
             </div>
             <div className="identity-row">
               <Icons.Phone />
               <div className="data-meta">
                 <span className="label">Encryption Link</span>
                 <span className="value">{resumeData?.contact?.phone}</span>
               </div>
             </div>
          </div>
          <div className="file-dna-badge">
             <span className="dna-label">FILE DNA:</span>
             <span className="dna-value">{resumeData?.fileName}</span>
          </div>
        </motion.section>

        {/* Skill Matrix - Neural Nodes */}
        <motion.section 
          variants={fadeUp} custom={5} initial="hidden" animate="visible"
          className="dashboard-card skill-matrix glass-card-luxe"
        >
          <div className="card-header">
             <Icons.Zap />
             <h3>Skill Alignment Matrix</h3>
          </div>
          
          <div className="skill-group-luxe">
            <h4 className="group-title">Matched Nodes</h4>
            <div className="skill-node-container">
              {screeningResults?.matchedSkills?.map((skill, idx) => (
                <motion.span 
                  key={`matched-${idx}`} 
                  className="skill-node-luxe matched"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <span className="node-status">✓</span> {skill}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="skill-group-luxe">
            <h4 className="group-title">Expansion Domains (Missing)</h4>
            <div className="skill-node-container">
              {screeningResults?.missingSkills?.map((skill, idx) => (
                <motion.span 
                  key={`missing-${idx}`} 
                  className="skill-node-luxe missing"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <span className="node-status">✗</span> {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Strategic Command Bar */}
        <motion.div 
          variants={fadeUp} custom={6} initial="hidden" animate="visible"
          className="action-command-bar"
        >
          <button className="btn-outline-luxe" onClick={() => navigate('/upload-resume')}>
            Recalibrate Profile
          </button>
          <button className="btn-premium wide-btn" onClick={() => navigate(`/job/${jobData?.id}`)}>
            Launch Application Protocol →
          </button>
        </motion.div>
      </main>
    </div>
  );
}

export default ResumeScan;

