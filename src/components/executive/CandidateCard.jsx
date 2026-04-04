import './CandidateCard.css';

const CandidateCard = ({ candidate, onStatusChange, onViewProfile }) => {
  const isShortlisted = candidate.status === 'Shortlisted';
  const isRejected = candidate.status === 'Rejected';
  const isHighMatch = candidate.matchScore >= 90;

  return (
    <div className={`candidate-card-luxe ${isHighMatch ? 'high-match' : ''} ${isShortlisted ? 'shortlisted' : ''} ${isRejected ? 'rejected' : ''}`}>
      {/* Background Banner */}
      <div className="card-banner-luxe">
        <div className="banner-glow-luxe"></div>
      </div>

      <div className="card-body-luxe">
        <div className="card-header-luxe">
          <div className="avatar-wrapper-luxe" onClick={() => onViewProfile(candidate)}>
            <img 
              src={candidate.avatar} 
              alt={candidate.name} 
              className="avatar-img-luxe"
            />
            {isHighMatch && (
              <span className="top-match-tag">Top Match</span>
            )}
          </div>

          <div className="match-score-luxe">
            <svg viewBox="0 0 36 36" className="circular-chart-luxe">
              <path className="circle-bg-luxe" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                className="circle-luxe"
                strokeDasharray={`${candidate.matchScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{ stroke: isHighMatch ? '#22d3ee' : candidate.matchScore >= 75 ? '#8b5cf6' : '#f59e0b' }}
              />
              <text x="18" y="20.35" className="percentage-luxe">{candidate.matchScore}%</text>
            </svg>
          </div>
        </div>

        <div className="candidate-identity-luxe" onClick={() => onViewProfile(candidate)}>
          <h3 className="candidate-name-luxe">{candidate.name}</h3>
          <p className="candidate-meta-luxe">
            {candidate.role} <span className="dot">•</span> {candidate.experience}
          </p>
        </div>
        
        <p className="candidate-summary-luxe">
          "{candidate.summary}"
        </p>

        <div className="candidate-skills-luxe">
          {candidate.skills.slice(0, 3).map(skill => (
            <span key={skill} className="skill-pill-luxe">{skill}</span>
          ))}
          {candidate.skills.length > 3 && (
            <span className="skill-pill-more">+{candidate.skills.length - 3}</span>
          )}
        </div>

        <footer className="card-footer-luxe">
          <button className="btn-view-luxe" onClick={() => onViewProfile(candidate)}>
            Profile Detail
          </button>
          
          <div className="action-buttons-luxe">
            <button 
              className={`btn-action-luxe reject ${isRejected ? 'active' : ''}`}
              onClick={() => onStatusChange(candidate.id, isRejected ? 'Applied' : 'Rejected')}
              title={isRejected ? 'Undo Reject' : 'Reject Applicant'}
            >
              {isRejected ? '↩' : '✕'}
            </button>
            <button 
              className={`btn-action-luxe shortlist ${isShortlisted ? 'active' : ''}`}
              onClick={() => onStatusChange(candidate.id, isShortlisted ? 'Applied' : 'Shortlisted')}
              title={isShortlisted ? 'Unshortlist' : 'Shortlist Applicant'}
            >
              {isShortlisted ? '★' : '☆'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CandidateCard;
