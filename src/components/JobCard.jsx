import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './JobCard.css';

function JobCard({ job }) {
  const [isSaved, setIsSaved] = useState(false);

  // Safe Access for requirements
  const skills = job.requirements?.skills || 
                 (Array.isArray(job.requirements) ? job.requirements : []);

  // Only show the badge if a real match calculation has been performed
  const matchScore = job.matchScore;
  const isHighMatch = matchScore && matchScore >= 90;

  return (
    <motion.div 
      className={`professional-job-card ${isHighMatch ? 'match-highlight' : ''}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="card-header">
          <div className="company-logo-box">
             {job.company_image || "🏢"}
          </div>
          {matchScore && (
            <div className="match-badge-minimal">
               <span className="match-percentage">{matchScore}% Match</span>
            </div>
          )}
      </div>

      <div className="card-body">
          <div className="job-meta" data-match={matchScore ? `${matchScore}% Match` : ''}>
             <span className="company-name-text">{job.company}</span>
             <span className="post-date">Posted {job.posted || 'recently'}</span>
          </div>
          
          <h3 className="job-title-text">{job.title}</h3>
          
          <div className="job-info-pills">
             <span className="info-pill">📍 {job.location}</span>
             <span className="info-pill">💼 {job.type}</span>
             <span className="info-pill salary">💰 {job.salary || '$120k+'}</span>
          </div>

          <div className="skill-tags">
             {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-tag-minimal">
                   {skill}
                </span>
             ))}
             {skills.length > 3 && (
                <span className="skill-tag-minimal more">+{skills.length - 3}</span>
             )}
          </div>
      </div>

      <footer className="card-footer-actions">
          <Link to={`/job/${job._id || job.id}`} className="apply-btn-primary">
             Apply Now
          </Link>
          <button 
            className={`save-btn-minimal ${isSaved ? 'saved' : ''}`}
            onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }}
            title={isSaved ? "Saved" : "Save Job"}
          >
            {isSaved ? "🔖" : "📑"}
          </button>
       </footer>
    </motion.div>
  );
}

export default JobCard;