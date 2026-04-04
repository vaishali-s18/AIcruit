// Dashboard.jsx - Professional Candidate Portal
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/auth';
import { profile as fallbackProfile } from '../data/profile';
import { jobs } from '../data/jobs';
import JobCard from '../components/JobCard';
import SkillBadge from '../components/SkillBadge';
import './Dashboard.css';

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -4, transition: { duration: 0.2 } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  if (!user) return null; // Wait for navigation guard

  // Merge Live User with Fallback Profile for UI richness
  const userProfile = { 
    ...fallbackProfile, 
    name: user.name || user.email.split('@')[0], 
    email: user.email,
    role: user.role || 'Senior Professional' 
  };

  // Pull live applications and merge with database fallbacks
  const storedLiveApps = JSON.parse(localStorage.getItem('liveApplications') || '[]');
  
  // Filter live apps for this user
  const userLiveApps = storedLiveApps.filter(app => app.candidateEmail === user.email);
  
  const userApplications = [
    ...userLiveApps,
    ...userProfile.applications.filter(fallbackApp => 
      !userLiveApps.some(live => live.jobId === fallbackApp.jobId)
    )
  ];

  const matchedJobs = jobs.slice(0, 3);
  const displayedSkills = showAllSkills ? userProfile.skills : userProfile.skills.slice(0, 8);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'shortlisted': return 'var(--success-color)';
      case 'pending': return 'var(--warning-color)';
      case 'rejected': return 'var(--danger-color)';
      case 'accepted': return 'var(--primary-blue)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status.toLowerCase()) {
      case 'shortlisted': return 'var(--success-bg)';
      case 'pending': return 'var(--warning-bg)';
      case 'rejected': return 'var(--danger-bg)';
      case 'accepted': return 'rgba(79, 70, 229, 0.1)';
      case 'screening complete': return 'rgba(6, 182, 212, 0.1)';
      default: return 'var(--bg-secondary)';
    }
  };

  return (
    <motion.div 
      className="dashboard-page-personalized"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard-sidebar">
        {/* Profile Card - LIVE */}
        <motion.section 
          className="dashboard-card profile-card"
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <div className="profile-cover"></div>
          <div className="profile-header">
            <div className="avatar">
               {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="profile-info">
              <h1>{userProfile.name}</h1>
              <p className="headline">{user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : userProfile.headline}</p>
              <p className="location">📍 {userProfile.location}</p>
            </div>
            <button className="btn btn-outline edit-btn">Edit Profile</button>
          </div>
          
          <p className="bio">{userProfile.bio}</p>

          <div className="contact-info">
            <a href={`mailto:${user.email}`}>✉️ {user.email}</a>
            <a href="#">📱 {userProfile.phone}</a>
          </div>
        </motion.section>

        <motion.section className="dashboard-card profile-skills-section" variants={cardVariants}>
          <div className="card-header-clean">
            <h2><span className="header-icon">🛡️</span> Professional Skills</h2>
            <button className="add-skill-btn-minimal">+ Add Skill</button>
          </div>
          <div className="skills-list">
            <AnimatePresence>
              {displayedSkills.map((skill, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <SkillBadge skill={skill} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {userProfile.skills.length > 8 && (
            <button className="show-more-btn" onClick={() => setShowAllSkills(!showAllSkills)}>
              {showAllSkills ? 'Show Less' : `Show ${userProfile.skills.length - 8} More`}
            </button>
          )}
        </motion.section>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-main-grid">
          <motion.section className="dashboard-card experience-panel" variants={cardVariants}>
            <div className="card-header-clean">
              <h2><span className="header-icon">💼</span> Work Experience</h2>
              <button className="add-entry-btn">+ Add</button>
            </div>
            <div className="experience-list">
              {userProfile.experience.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <div className="item-header">
                    <h3>{exp.title}</h3>
                    <span className="company-badge">{exp.company}</span>
                  </div>
                  <p className="duration">📅 {exp.duration}</p>
                  <p className="description">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="dashboard-card education-panel" variants={cardVariants}>
            <div className="card-header-clean">
              <h2><span className="header-icon">🎓</span> Academic History</h2>
              <button className="add-entry-btn">+ Add</button>
            </div>
            <div className="education-list">
              {userProfile.education.map((edu) => (
                <div key={edu.id} className="timeline-item">
                  <div className="item-header">
                    <h3>{edu.degree}</h3>
                  </div>
                  <p className="school">{edu.school}</p>
                  <p className="year">{edu.year}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Mixed Applications Data Table */}
        <motion.section className="dashboard-card full-width-panel" variants={cardVariants}>
          <div className="card-header-clean">
            <h2><span className="header-icon">📋</span> Applied Jobs</h2>
            <button className="view-all-link">View History →</button>
          </div>
          <div className="applications-log-table">
            <table>
              <thead>
                <tr>
                  <th>Job Position</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {userApplications.map((app) => {
                    const job = jobs.find(j => j._id === app.jobId || j.id === app.jobId) || { title: 'Unknown Role', company: 'Unknown Company' };
                    const statusColor = getStatusColor(app.status);
                    const statusBgColor = getStatusBgColor(app.status);
                    return (
                      <tr key={app.id}>
                        <td className="job-title-cell">{job?.title}</td>
                        <td>{job?.company}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: statusBgColor, color: statusColor, borderColor: statusColor }}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="date-cell">{app.date}</td>
                      </tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section className="dashboard-card full-width-panel" variants={cardVariants}>
          <div className="card-header-clean">
            <h2><span className="header-icon">🌟</span> Recommended for You</h2>
            <Link to="/jobs" className="view-all-link-primary">All Roles →</Link>
          </div>
          <motion.div className="recommended-jobs-grid" variants={staggerContainer}>
            {matchedJobs.map((job) => (
              <Link to={`/job/${job._id || job.id}`} className="job-link" key={job._id || job.id}>
                <JobCard job={job} />
              </Link>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
}

export default Dashboard;