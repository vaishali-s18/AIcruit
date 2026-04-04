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
  Cpu: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>),
};

const DataStream = () => {
  const [columns, setColumns] = useState([]);
  
  useEffect(() => {
    const keywords = ['ANALYZING', 'MATCH_FOUND', 'RESUME_PARSED', 'SEARCHING', 'ALGORITHM', 'JOBS_LOADED', 'QUALIFIED'];
    const cols = Array.from({ length: 15 }).map((_, i) => ({
      left: `${(i * 7) + 2}%`,
      delay: Math.random() * 20,
      content: keywords[Math.floor(Math.random() * keywords.length)]
    }));
    setColumns(cols);
  }, []);

  return (
    <div className="data-stream-bg">
      {columns.map((col, i) => (
        <div key={i} className="stream-column" style={{ left: col.left, animationDelay: `${-col.delay}s` }}>
          {col.content} • {col.content} • {col.content}
        </div>
      ))}
    </div>
  );
};

const SystemHUD = () => (
  <motion.div 
    className="system-hud-bar"
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 1, duration: 0.8 }}
  >
    <div className="status-active">
      <div className="status-dot"></div>
      AI ANALYSIS: ACTIVE
    </div>
    <div className="system-meta">SYSTEM: ONLINE // CLOUD_SYNCED</div>
    <div className="system-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</div>
  </motion.div>
);


const QuantumScoreGauge = ({ score }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="quantum-gauge-container">
      <svg className="gauge-svg" viewBox="0 0 200 200">
        <circle className="gauge-ring-outer" cx="100" cy="100" r={radius + 10} />
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
        <span className="score-label">Match Score</span>
      </div>
      <div className="confidence-indicator">MATCH PROBABILITY: HIGH</div>

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

  if (!data) return <div className="loading-protocol">Analyzing your resume...</div>;

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
            Profile Mismatch Detected
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible" className="alert-text">
            Resume <span className="text-glow-red">Mismatch</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="scan-subtitle">
            Our analysis shows that your profile may not be a match for this specific role's requirements.
          </motion.p>
        </header>

        <main className="scan-dashboard-grid container-responsive">
          <motion.section 
            variants={fadeUp} custom={3} initial="hidden" animate="visible"
            className="dashboard-card primary-vector glass-card-luxe alert-border"
          >
            <div className="card-header">
               <Icons.Target />
               <h3>Match Results</h3>
            </div>
            <div className="mismatch-node-container">
               <div className="mismatch-pulse-node">
                  <span className="mismatch-x">✕</span>
               </div>
               <div className="mismatch-score">
                  <span className="score-val">{screeningResults?.overallScore}%</span>
                  <span className="score-lbl">LOW MATCH</span>
               </div>
            </div>
          </motion.section>

          <motion.section 
            variants={fadeUp} custom={4} initial="hidden" animate="visible"
            className="dashboard-card glass-card-luxe"
          >
            <div className="card-header">
               <Icons.Zap />
               <h3>Why you didn't match</h3>
            </div>
            <p className="mismatch-reason">
              Your profile currently doesn't align with the key skills or experience needed for the <strong>{jobData?.title}</strong> role.
            </p>
            <div className="required-matrix-header">Missing Skills:</div>
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
               Try Another Resume
            </button>
            <button className="btn-premium alert-btn" onClick={() => navigate('/jobs')}>
               Browse Other Jobs
            </button>
            <button className="btn-outline-luxe dev-override" onClick={() => navigate(`/job/${jobData?.id}`)}>
               Continue Anyway (Demo Mode)
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="resume-scan-premium">
      <div className="scan-noise-overlay"></div>
      <div className="laser-scan-line"></div>
      <DataStream />
      <SystemHUD />
      
      <header className="scan-header-luxe container-responsive">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="scan-badge">
          AI Resume Analysis Results
        </motion.div>
        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible">
          Analysis <span className="text-glow">Complete</span>
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="scan-subtitle">
          Detailed match report for <span className="highlight-job">{jobData?.title || 'this role'}</span>
        </motion.p>
      </header>


      <main className="scan-dashboard-grid container-responsive">
        <motion.section 
          variants={fadeUp} custom={3} initial="hidden" animate="visible"
          className="dashboard-card primary-vector glass-card-luxe"
        >
          <div className="card-header">
             <Icons.Cpu />
             <h3>Overall Match Score</h3>
          </div>
          <QuantumScoreGauge score={screeningResults?.overallScore || 0} />
          <div className="match-status-pill">
            {screeningResults?.overallScore > 80 ? 'Perfect match for this role!' : 'Some skills are missing'}
          </div>
        </motion.section>

        {/* Identity Vector - Parsed DNA */}
        <motion.section 
          variants={fadeUp} custom={4} initial="hidden" animate="visible"
          className="dashboard-card identity-vector glass-card-luxe"
        >
          <div className="card-header">
             <Icons.User />
             <h3>Contact Information</h3>
          </div>

          <div className="identity-data-list">
              <div className="identity-row">
                <Icons.User />
                <div className="data-meta">
                  <span className="label">Full Name</span>
                  <span className="value">{resumeData?.name}</span>
                </div>
              </div>
              <div className="identity-row">
                <Icons.Mail />
                <div className="data-meta">
                  <span className="label">Email Address</span>
                  <span className="value">{resumeData?.contact?.email}</span>
                </div>
              </div>
              <div className="identity-row">
                <Icons.Phone />
                <div className="data-meta">
                  <span className="label">Phone Number</span>
                  <span className="value">{resumeData?.contact?.phone}</span>
                </div>
              </div>
           </div>
           <div className="file-dna-badge">
              <span className="dna-label">FILE NAME:</span>
              <span className="dna-value">{resumeData?.fileName}</span>
           </div>
        </motion.section>

        <motion.section 
          variants={fadeUp} custom={5} initial="hidden" animate="visible"
          className="dashboard-card skill-matrix glass-card-luxe"
        >
          <div className="card-header">
             <Icons.Zap />
             <h3>Matched & Missing Skills</h3>
          </div>

          
          <div className="skill-group-luxe">
            <h4 className="group-title">Skills you have</h4>
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
            <h4 className="group-title">Skills to improve</h4>
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

        <motion.div 
          variants={fadeUp} custom={6} initial="hidden" animate="visible"
          className="action-command-bar"
        >
          <button className="btn-outline-luxe" onClick={() => navigate('/upload-resume')}>
            Try Another Resume
          </button>
          <button className="btn-premium wide-btn" onClick={() => navigate(`/job/${jobData?.id}`)}>
            Start AI Interview →
          </button>
        </motion.div>
      </main>
    </div>
  );
}

export default ResumeScan;

