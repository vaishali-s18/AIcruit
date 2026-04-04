// JobCard.jsx - Enhanced with Modern UI
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './JobCard.css';

function JobCard({ job, viewMode = 'grid' }) {
  const [isSaved, setIsSaved] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if job is saved
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(savedJobs.includes(job.id));

    // Generate random match score (in real app, this would come from AI matching)
    const score = Math.floor(Math.random() * 30) + 65; // 65-95% match
    setMatchScore(score);
  }, [job.id]);

  const handleSaveJob = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    let newSavedJobs;
    
    if (isSaved) {
      newSavedJobs = savedJobs.filter(id => id !== job.id);
    } else {
      newSavedJobs = [...savedJobs, job.id];
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    setIsSaved(!isSaved);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#6366f1';
    return '#f59e0b';
  };

  const formatSalary = (salary) => {
    if (typeof salary === 'string') return salary;
    if (salary >= 100000) return `$${(salary / 1000).toFixed(0)}k`;
    return `$${salary.toLocaleString()}`;
  };

  const getDaysAgo = (dateString) => {
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (viewMode === 'list') {
    // List View Layout
    return (
      <motion.div
        className="job-card-list"
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="job-card-list-content">
          <div className="job-card-list-main">
            <div className="company-icon-list">
              {job.company_image || job.company.charAt(0)}
            </div>
            
            <div className="job-info-list">
              <div className="job-header-list">
                <h3 className="job-title-list">{job.title}</h3>
                {matchScore && (
                  <div 
                    className="match-score-badge"
                    style={{ backgroundColor: `${getMatchScoreColor(matchScore)}20`, color: getMatchScoreColor(matchScore) }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <span className="match-icon">🎯</span>
                    {matchScore}% Match
                    {showTooltip && (
                      <span className="tooltip">AI predicted match score</span>
                    )}
                  </div>
                )}
              </div>
              
              <p className="company-name-list">{job.company}</p>
              
              <div className="job-meta-list">
                <span className="meta-tag">📍 {job.location}</span>
                <span className="meta-tag">💼 {job.type}</span>
                <span className="meta-tag">📊 {job.level}</span>
                <span className="meta-tag salary">💰 {formatSalary(job.salary)}</span>
              </div>
              
              <p className="job-description-list">
                {job.description?.substring(0, 120)}...
              </p>
              
              <div className="skills-list-list">
                {job.requirements?.slice(0, 4).map((skill, idx) => (
                  <span key={idx} className="skill-tag-list">
                    {skill}
                  </span>
                ))}
                {(job.requirements?.length || 0) > 4 && (
                  <span className="skill-tag-list more">
                    +{job.requirements.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="job-actions-list">
            <div className="job-footer-list">
              <span className="posted-date">📅 {getDaysAgo(job.posted)}</span>
              <div className="action-buttons">
                <motion.button
                  className={`save-btn-list ${isSaved ? 'saved' : ''}`}
                  onClick={handleSaveJob}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={isSaved ? 'Remove from saved' : 'Save job'}
                >
                  {isSaved ? '❤️' : '🤍'}
                </motion.button>
                <motion.button
                  className="apply-btn-list"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Now →
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View Layout (Original Card Style)
  return (
    <motion.div
      className="job-card"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="job-card-content">
        {/* Header with Company Icon and Save Button */}
        <div className="card-header">
          <div className="company-icon">
            {job.company_image || job.company.charAt(0)}
          </div>
          <motion.button
            className={`save-button ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveJob}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            {isSaved ? '❤️' : '🤍'}
          </motion.button>
        </div>

        {/* Job Title and Company */}
        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.company}</p>
        </div>

        {/* Match Score Badge */}
        {matchScore && (
          <div 
            className="match-score"
            style={{ backgroundColor: `${getMatchScoreColor(matchScore)}15` }}
          >
            <span className="match-score-icon">🎯</span>
            <span 
              className="match-score-value"
              style={{ color: getMatchScoreColor(matchScore) }}
            >
              {matchScore}% Match
            </span>
          </div>
        )}

        {/* Job Details */}
        <div className="job-details">
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span className="detail-text">{job.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">💼</span>
            <span className="detail-text">{job.type}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📊</span>
            <span className="detail-text">{job.level}</span>
          </div>
          <div className="detail-item salary">
            <span className="detail-icon">💰</span>
            <span className="detail-text">{formatSalary(job.salary)}</span>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="skills-section">
          <div className="skills-container">
            {job.requirements?.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
              </span>
            ))}
            {(job.requirements?.length || 0) > 3 && (
              <span className="skill-tag more">
                +{job.requirements.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer with Posted Date and Apply Button */}
        <div className="card-footer">
          <span className="posted-date">
            📅 {getDaysAgo(job.posted)}
          </span>
          <motion.button
            className="apply-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Now
            <span className="button-arrow">→</span>
          </motion.button>
        </div>

        {/* Featured Badge */}
        {job.featured && (
          <div className="featured-badge">
            ⭐ Featured
          </div>
        )}

        {/* Urgent Badge */}
        {getDaysAgo(job.posted) === 'Yesterday' && (
          <div className="urgent-badge">
            🔥 New
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default JobCard;