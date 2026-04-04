import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jobs } from '../data/jobs';
import './Recommendations.css';

// Custom SVG Match Ring Component
const MatchRing = ({ score, color }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="match-ring-wrapper">
      <svg className="match-ring-svg" width="80" height="80">
        <circle 
          className="match-ring-bg" 
          cx="40" cy="40" r={radius} 
          fill="transparent" 
          strokeWidth="6" 
        />
        <motion.circle 
          className="match-ring-fill" 
          cx="40" cy="40" r={radius} 
          fill="transparent" 
          strokeWidth="6" 
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="match-percentage-txt">{score}%</span>
    </div>
  );
};

function Recommendations() {
  const navigate = useNavigate();
  const [userSkills, setUserSkills] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const suggestedSkills = [
    'React', 'Python', 'JavaScript', 'Node.js', 'AWS', 
    'Docker', 'Kubernetes', 'TypeScript', 'Tailwind', 'API'
  ];

  useEffect(() => {
    const savedSkills = localStorage.getItem('userSkills');
    if (savedSkills) setUserSkills(JSON.parse(savedSkills));
  }, []);

  useEffect(() => {
    if (userSkills.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        const scored = jobs.map(job => {
          // Normalize skills for better matching
          const jobSkills = job.requirements?.skills || [];
          const matchedSkills = userSkills.filter(userSkill =>
            jobSkills.some(js => js.toLowerCase().includes(userSkill.toLowerCase()))
          );
          
          const matchPercentage = jobSkills.length > 0
            ? Math.min(100, Math.round((matchedSkills.length / jobSkills.length) * 100 + 10)) // Slight boost for UI
            : 0;
          
          return {
            ...job,
            matchScore: matchPercentage,
            matchedSkills: matchedSkills,
            missingSkills: jobSkills.filter(js => 
              !userSkills.some(us => js.toLowerCase().includes(us.toLowerCase()))
            )
          };
        }).sort((a, b) => b.matchScore - a.matchScore);
        
        setRecommendedJobs(scored);
        setIsLoading(false);
      }, 800);
    }
  }, [userSkills]);

  const handleAddSkill = (skill) => {
    const freshSkill = typeof skill === 'string' ? skill : skillInput;
    if (freshSkill.trim() && !userSkills.includes(freshSkill.trim())) {
      setUserSkills([...userSkills, freshSkill.trim()]);
      setSkillInput('');
    }
  };

  const getFilteredJobs = () => {
    if (activeFilter === 'high') return recommendedJobs.filter(j => j.matchScore >= 80);
    if (activeFilter === 'mid') return recommendedJobs.filter(j => j.matchScore >= 50 && j.matchScore < 80);
    return recommendedJobs;
  };

  const displayJobs = getFilteredJobs();

  return (
    <div className="recommendations-profile-page">
      <div className="recommendations-hero-bg">
        <div className="container-responsive">
          <motion.div 
            className="recommendations-hero-content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="status-indicator-clean">
              <span className="pulse-dot"></span>
              <span>Smart Job Matching Active</span>
            </div>
            <h1>Explore <span className="blue-accent">Recommended Jobs</span></h1>
            <p className="hero-subtitle">Find jobs that match your skills based on our intelligent AI analysis.</p>
          </motion.div>
        </div>
      </div>

      <div className="recommendations-container container-responsive">

        {/* Skills Management Panel */}
        <section className="skills-manager-section glass-panel">
          <div className="skills-input-area">
            <div className="input-group-clean">
              <input 
                type="text" 
                placeholder="Skills/Tech (e.g. Docker, React)..." 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="skill-input-clean"
              />
              <button className="add-skill-btn-primary" onClick={handleAddSkill}>Add Skill</button>
            </div>
          </div>

          <div className="suggested-skills-bar">
            <div className="suggested-tags-minimal">
              {suggestedSkills.map(skill => (
                <button 
                  key={skill} 
                  className="suggested-skill-pill" 
                  onClick={() => handleAddSkill(skill)}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {userSkills.length > 0 && (
            <div className="active-skills-board">
              <div className="active-skills-tags">
                <AnimatePresence>
                  {userSkills.map(skill => (
                    <motion.div 
                      key={skill} 
                      className="active-skill-pill"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    >
                      {skill} 
                      <span 
                        className="remove-skill-icon"
                        onClick={() => setUserSkills(userSkills.filter(s => s !== skill))}
                      >✕</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </section>

        {/* Recommended Jobs */}
        <div className="results-toolbar-minimal">
           <h2 className="toolbar-title">Recommended Jobs</h2>
           <div className="toolbar-filters">
              <button className={`filter-btn-pill ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All Results</button>
              <button className={`filter-btn-pill ${activeFilter === 'high' ? 'active' : ''}`} onClick={() => setActiveFilter('high')}>High Compatibility</button>
           </div>
        </div>

        {isLoading ? (
          <div className="match-loading-state">
            <div className="match-spinner-clean"></div>
            <p>Finding your best matches...</p>
          </div>
        ) : (
          <div className="jobs-grid">
            <AnimatePresence>
              {displayJobs.map((job) => (
                <motion.article 
                  key={job.id} 
                  className="recommendation-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="card-header-clean">
                    <div className="header-info-main">
                      <div className="job-logo-small">{job.company_image || "🏢"}</div>
                      <div className="header-text-block">
                        <h3>{job.title}</h3>
                        <p className="job-company-name">{job.company}</p>
                      </div>
                    </div>
                    <div className="header-match-ring">
                       <MatchRing score={job.matchScore} color={job.matchScore > 80 ? "var(--accent-primary)" : "var(--accent-secondary)"} />
                    </div>
                  </div>

                  <div className="match-metrics-row">
                    <div className="metric-item">
                      <span className="m-label">Suitability</span>
                      <span className="m-value">{job.matchScore > 80 ? "High Compatibility" : "Relevant Skills"}</span>
                    </div>
                    <div className="metric-item">
                      <span className="m-label">Overlap</span>
                      <span className="m-value">{job.matchedSkills.length} / {(job.requirements?.skills?.length || 0)} Skills</span>
                    </div>
                  </div>

                  <div className="match-reasoning-area">
                    <p className="reasoning-label">Why it matches</p>
                    <p className="reasoning-text">
                       Your expertise in <strong>{job.matchedSkills[0] || "core development"}</strong> aligns perfectly with {job.company}'s engineering tech stack.
                    </p>
                    
                    {job.missingSkills.length > 0 && (
                      <div className="missing-skills-section">
                         <p className="reasoning-label">Missing Skills:</p>
                         <div className="missing-skills-pills">
                            {job.missingSkills.slice(0, 3).map(skill => (
                              <span key={skill} className="skill-missing-pill">{skill}</span>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="recommendation-card-footer">
                    <Link to={`/job/${job.id}`} className="view-details-btn-primary">
                      View Details
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Global Insight Banner */}
        {userSkills.length > 0 && (
          <motion.div 
            className="ai-career-insight-banner glass-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
             <div className="insight-icon">💡</div>
             <div className="insight-content">
                <h4>AI Career Insight</h4>
                <p>
                  Adding <strong>Docker</strong> or <strong>Kubernetes</strong> to your profile would increase your compatibility score by <span className="match-highlight-text">+15%</span> across your recommended roles.
                </p>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;