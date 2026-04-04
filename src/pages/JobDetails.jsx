import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { jobs as backupJobs } from '../data/jobs';
import { parseResumeContent, screenResumeAgainstJob } from '../services/resumeParser';
import './JobDetails.css';

const Icons = {
  Location: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>),
  Briefcase: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>),
  Terminal: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>),
  Layers: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>),
  Zap: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>),
  Upload: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>),
};

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.warn('API Error: Falling back to local data protocol for role ID:', id);
        const localJob = backupJobs.find(j => j.id.toString() === id.toString());
        if (localJob) {
          setJob(localJob);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(savedJobs.includes(id));
  }, [id]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && job) {
      const reader = new FileReader();
      reader.onload = () => {
        const parsed = parseResumeContent(reader.result);
        let prog = 0;
        const interval = setInterval(() => {
          prog += 20;
          setUploadProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            const screening = screenResumeAgainstJob(parsed, job);
            setTimeout(() => {
              navigate('/resume-scan', { state: { resumeData: parsed, screeningResults: screening, jobData: job } });
            }, 600);
          }
        }, 150);
      };
      reader.readAsText(file);
    }
  }, [job, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    multiple: false 
  });

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    let newSavedJobs = isSaved ? savedJobs.filter(jId => jId !== id) : [...savedJobs, id];
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    setIsSaved(!isSaved);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsApplying(false);
    setShowApplyModal(false);
    // Success feedback could be more 'Cyber' too
  };

  if (loading) return (
     <div className="job-details-loading">
        <div className="professional-spinner"></div>
        <p>Loading job details...</p>
     </div>
  );

  if (!job) return (
    <div className="job-not-found">
       <h2>Job not found</h2>
       <p>We couldn't find the role you're looking for.</p>
       <Link to="/jobs" className="back-link">← Back to all jobs</Link>
    </div>
  );

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div className="job-profile-container">
      <div className="profile-top-bar">
        <div className="container-responsive">
          <nav className="page-breadcrumbs">
            <Link to="/jobs">Jobs</Link>
            <span className="sep">/</span>
            <span className="current">Job Details</span>
          </nav>
        </div>
      </div>

      <header className="job-hero-header container-responsive">
        <div className="hero-main-info">
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="company-info-block">
            <div className="company-logo-large">
               {job.company_image || "🏢"}
            </div>
            <div className="title-area">
               <h1>{job.title}</h1>
               <div className="company-tagline">
                  <span className="company-name">{job.company}</span>
                  <span className="divider">|</span>
                  <span className="location-text">📍 {job.location}</span>
               </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="hero-quick-actions">
            <button className={`save-job-btn ${isSaved ? 'saved' : ''}`} onClick={handleSaveJob}>
               {isSaved ? '🔖 Saved' : '📑 Save Job'}
            </button>
            <button className="apply-now-btn-primary" onClick={() => setShowApplyModal(true)}>
               Apply Now
            </button>
          </motion.div>
        </div>
      </header>

      <main className="job-details-grid container-responsive">
        {/* Main Content Area */}
        <section className="job-main-article">
           {/* Section 1: Resume Matcher */}
           <motion.section variants={fadeUp} custom={2} initial="hidden" animate="visible" className="article-block match-section glass-panel">
              <div className="section-head">
                 <h3>Check Your Match</h3>
                 <p>Upload your resume to see how well you align with this role.</p>
              </div>
              <div {...getRootProps()} className={`professional-upload-area ${isDragActive ? 'drag-active' : ''}`}>
                 <input {...getInputProps()} />
                 {uploadProgress > 0 && uploadProgress < 100 ? (
                    <div className="progress-container">
                       <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                       </div>
                       <span className="progress-text">Analyzing profile: {uploadProgress}%</span>
                    </div>
                 ) : (
                    <div className="upload-prompt">
                       <Icons.Upload />
                       <div className="upload-text">
                          <span className="primary-text">Upload Resume</span>
                          <span className="secondary-text">PDF, DOCX or TXT</span>
                       </div>
                    </div>
                 )}
              </div>
           </motion.section>

           <motion.section variants={fadeUp} custom={3} initial="hidden" animate="visible" className="article-block glass-panel">
              <div className="section-head">
                 <h3>Job Description</h3>
              </div>
              <div className="section-content">
                 <p className="description-text">{job.description}</p>
              </div>
           </motion.section>

           <motion.section variants={fadeUp} custom={4} initial="hidden" animate="visible" className="article-block glass-panel">
              <div className="section-head">
                 <h3>Required Skills</h3>
              </div>
              <div className="section-content">
                 <div className="skills-cloud">
                    {(job.requirements?.skills || []).map((skill, i) => (
                       <span key={i} className="skill-pill-clean">
                          {skill}
                       </span>
                    ))}
                    {job.requirements?.experience && (
                       <span className="skill-pill-clean exp">
                          {job.requirements.experience}yr+ Experience Required
                       </span>
                    )}
                 </div>
              </div>
           </motion.section>

           <motion.section variants={fadeUp} custom={5} initial="hidden" animate="visible" className="article-block glass-panel">
              <div className="section-head">
                 <h3>Benefits</h3>
              </div>
              <div className="section-content">
                 <ul className="benefits-checklist">
                    {(job.benefits || []).map((benefit, i) => (
                       <li key={i}>
                          <span className="check-icon">✓</span>
                          {benefit}
                       </li>
                    ))}
                 </ul>
              </div>
           </motion.section>
        </section>

        {/* Sidebar: Role Summary */}
        <aside className="job-summary-sidebar">
          <motion.section variants={fadeUp} custom={6} initial="hidden" animate="visible" className="sidebar-card glass-panel sticky-top">
             <h4>Job Summary</h4>
             <div className="info-row">
                <div className="info-icon"><Icons.Location /></div>
                <div className="info-meta">
                   <span className="label">Location</span>
                   <span className="value">{job.location}</span>
                </div>
             </div>
             <div className="info-row">
                <div className="info-icon"><Icons.Zap /></div>
                <div className="info-meta">
                   <span className="label">Salary</span>
                   <span className="value highlight-val">{job.salary}</span>
                </div>
             </div>
             <div className="info-row">
                <div className="info-icon"><Icons.Layers /></div>
                <div className="info-meta">
                   <span className="label">Type</span>
                   <span className="value">{job.type}</span>
                </div>
             </div>
             <div className="info-row">
                <div className="info-icon"><Icons.Briefcase /></div>
                <div className="info-meta">
                   <span className="label">Level</span>
                   <span className="value">{job.level || 'Mid-Senior level'}</span>
                </div>
             </div>
             
             <div className="posted-meta">
                <span>Posted {job.posted}</span>
             </div>

             <button className="apply-now-btn-primary full-width" onClick={() => setShowApplyModal(true)}>
                Apply for this job
             </button>
          </motion.section>
        </aside>
      </main>

      {/* New Application Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div 
            className="professional-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div 
              className="professional-modal glass-panel"
              initial={{ scale: 0.95, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 40 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header-clean">
                 <h2>Apply for this Position</h2>
                 <p>Submitting your application to <strong>{job.company}</strong></p>
                 <button className="close-modal-btn" onClick={() => setShowApplyModal(false)}>✕</button>
              </div>
              <form onSubmit={handleApplySubmit} className="professional-form">
                 <div className="form-fields">
                    <div className="input-field">
                       <label>Full Name</label>
                       <input type="text" placeholder="e.g. John Doe" required />
                    </div>
                    <div className="input-field">
                       <label>Email Address</label>
                       <input type="email" placeholder="e.g. john@example.com" required />
                    </div>
                 </div>
                 <div className="input-field">
                    <label>Cover Letter / Message</label>
                    <textarea rows="4" placeholder="Briefly introduce yourself and why you're a great fit..."></textarea>
                 </div>
                 <button type="submit" className="apply-now-btn-primary wide" disabled={isApplying}>
                   {isApplying ? 'Submitting Application...' : 'Submit Application'}
                 </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default JobDetails;