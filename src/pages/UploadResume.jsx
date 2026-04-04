// UploadResume.jsx - Enhanced with Modern UI
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { parseResumeContent, screenResumeAgainstJob } from '../services/resumeParser';
import { authService } from '../services/auth';
import { jobs } from '../data/jobs';
import './UploadResume.css';

function UploadResume() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedJob, setSelectedJob] = useState(jobs[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isGeneralScan, setIsGeneralScan] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('resumeFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.name) setName(data.name);
      if (data.email) setEmail(data.email);
      if (data.phone) setPhone(data.phone);
    }
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    if (name || email || phone) {
      localStorage.setItem('resumeFormData', JSON.stringify({ name, email, phone }));
    }
  }, [name, email, phone]);

  // Effect to handle "Skip" submission
  useEffect(() => {
    if (isGeneralScan && !selectedJob) {
      const syntheticEvent = { preventDefault: () => {} };
      handleSubmit(syntheticEvent);
    }
  }, [isGeneralScan, selectedJob]);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (!resume) errors.resume = 'Please upload your resume';
    if (!selectedJob) errors.job = 'Please select a job position';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({ ...formErrors, resume: 'File size must be less than 5MB' });
        return;
      }
      
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
        setFormErrors({ ...formErrors, resume: 'Please upload a PDF, DOCX, or TXT file' });
        return;
      }
      
      setResume(file);
      setFormErrors({ ...formErrors, resume: null });

      // AI Pre-filling logic
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsed = parseResumeContent(text);
        if (parsed.contact.email) setEmail(parsed.contact.email);
        if (parsed.contact.phone) setPhone(parsed.contact.phone);
        
        // Simple name extraction (first line if it looks like a name)
        const firstLine = text.split('\n')[0]?.trim();
        if (firstLine && firstLine.length < 50 && !firstLine.includes('@')) {
          setName(firstLine);
        }

        // Auto-advance to Step 2
        setTimeout(() => setCurrentStep(2), 800);
      };
      reader.readAsText(file);
    }
  }, [formErrors]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 5242880,
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.form-group.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target.result;
        
        // Parse resume
        const parsedResume = parseResumeContent(fileContent);
        parsedResume.name = name;
        parsedResume.contact = {
          email: email,
          phone: phone
        };
        parsedResume.fileName = resume.name;

        // Screen against selected job
        const selectedJobData = jobs.find(j => j.id === parseInt(selectedJob));
        const screeningResults = screenResumeAgainstJob(parsedResume, selectedJobData);

        clearInterval(progressInterval);
        setUploadProgress(100);
        setShowSuccessAnimation(true);

        // Update user profile if logged in
        if (authService.isLoggedIn()) {
          authService.updateProfile({
            skills: parsedResume.skills,
            experience: parsedResume.yearsExperience
          }).then(res => {
            if (res.success) {
              console.log('Profile updated automatically with parsed data');
            }
          }).catch(err => {
            console.error('Failed to auto-update profile:', err);
          });
        }
        
        setTimeout(() => {
          setSubmitted(true);
          setLoading(false);
          
          if (isGeneralScan) {
            setAnalysisResult(parsedResume);
            setCurrentStep(4); // New step for general results
          } else {
            navigate('/resume-scan', {
              state: {
                resumeData: parsedResume,
                screeningResults: screeningResults,
                jobData: selectedJobData
              }
            });
          }
        }, 1000);
      } catch (error) {
        console.error('Error parsing resume:', error);
        setFormErrors({ ...formErrors, resume: 'Error processing resume. Please try again.' });
        setLoading(false);
        clearInterval(progressInterval);
      }
    };

    reader.onerror = () => {
      setFormErrors({ ...formErrors, resume: 'Error reading file. Please try again.' });
      setLoading(false);
      clearInterval(progressInterval);
    };

    reader.readAsText(resume);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!name || !email || !phone)) {
      setFormErrors({ ...formErrors, step1: 'Please fill in all personal information' });
      return;
    }
    setFormErrors({ ...formErrors, step1: null });
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="upload-page-premium">
      <div className="page-background-glow"></div>
      
      {/* Header / Hero Section */}
      <header className="upload-hero">
        <div className="container">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="badge-icon">✨</span>
            <span className="badge-text">AI-POWERED RECRUITMENT</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Find Your Next <span className="gradient-text">Dream Job</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            Upload your resume and let our advanced AI match you with premium roles from top companies worldwide.
          </motion.p>
        </div>
      </header>

      <main className="upload-main-content container">
        <div className="upload-card-wrapper">
          {/* Progress Steps (Enhanced) */}
          <motion.div 
            className="steps-stepper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className={`step-node ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'done' : ''}`}>
              <div className="node-circle">{currentStep > 1 ? '✓' : '1'}</div>
              <span>Upload</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step-node ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'done' : ''}`}>
              <div className="node-circle">{currentStep > 2 ? '✓' : '2'}</div>
              <span>Personal</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step-node ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'done' : ''}`}>
              <div className="node-circle">3</div>
              <span>Find Jobs</span>
            </div>

          </motion.div>

          <form onSubmit={handleSubmit} className="upload-interactive-form">
          {/* Step 1: Upload Resume (Moved to First) */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                className="form-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>
                  <span className="section-icon">📄</span>
                  Upload Your Resume
                </h2>
                <p className="section-description">
                  Upload your resume in PDF, DOCX, or TXT format (Max 5MB)
                </p>

                <div className={`upload-area ${isDragActive ? 'drag-active' : ''} ${resume ? 'has-file' : ''}`}>
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    {!resume ? (
                      <div className="dropzone-content">
                        <div className="upload-icon">📄</div>
                        <h3>Drag & Drop Your Resume</h3>
                        <p>or click to browse</p>
                        <div className="file-types">
                          <span>PDF</span>
                          <span>DOCX</span>
                          <span>TXT</span>
                        </div>
                      </div>
                    ) : (
                      <div className="file-preview">
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                          <h4>{resume.name}</h4>
                          <p>{(resume.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button 
                          type="button"
                          className="remove-file"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResume(null);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {formErrors.resume && (
                  <div className="error-message">{formErrors.resume}</div>
                )}

                <div className="form-actions">
                  <motion.button
                    type="button"
                    className="next-btn"
                    onClick={handleNextStep}
                    disabled={!resume}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Confirm & Continue
                    <span className="btn-arrow">→</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Personal Information (Confirmation) */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                className="form-section"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>
                  <span className="section-icon">👤</span>
                  Personal Information
                </h2>

                <p className="section-description">
                  We've pre-filled some details from your resume. Please verify or update them.
                </p>
                
                <div className={`form-group ${formErrors.name ? 'error' : ''}`}>
                  <label>
                    <span className="label-icon">📝</span>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                </div>

                <div className={`form-group ${formErrors.email ? 'error' : ''}`}>
                  <label>
                    <span className="label-icon">📧</span>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>

                <div className={`form-group ${formErrors.phone ? 'error' : ''}`}>
                  <label>
                    <span className="label-icon">📱</span>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={formErrors.phone ? 'error' : ''}
                  />
                  {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                </div>

                <div className="form-actions">
                  <motion.button
                    type="button"
                    className="back-btn"
                    onClick={handlePrevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    type="button"
                    className="next-btn"
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next: Job Matching
                    <span className="btn-arrow">→</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Job Selection */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                className="form-section"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>
                  <span className="section-icon">💼</span>
                  Select Job Position
                </h2>
                <p className="section-description">
                  Choose a job to see how well you match.
                </p>


                <div className={`form-group ${formErrors.job ? 'error' : ''}`}>
                  <label>Job Position *</label>
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="job-select"
                  >
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title} at {job.company} • {job.level} • {job.location}
                      </option>
                    ))}
                  </select>
                  {formErrors.job && <span className="error-message">{formErrors.job}</span>}
                </div>

                {/* Job Preview (Added Back) */}
                {selectedJob && (
                  <motion.div 
                    className="job-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="job-preview-details">
                      <div className="preview-item">
                        <span className="preview-icon">📍</span>
                        <span>{jobs.find(j => j.id === parseInt(selectedJob))?.location}</span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-icon">📊</span>
                        <span>{jobs.find(j => j.id === parseInt(selectedJob))?.level}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="form-actions">
                  <motion.button
                    type="button"
                    className="back-btn"
                    onClick={handlePrevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ← Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? "Processing..." : "Find My Matches →"}
                  </motion.button>
                </div>

                <div className="skip-selection">
                  <button 
                    type="button" 
                    className="skip-btn"
                    onClick={() => {
                      setIsGeneralScan(true);
                      setSelectedJob('');
                      // The form will be submitted via the useEffect below
                    }}
                  >
                    Skip & View Profile Analysis
                  </button>
                </div>
              </motion.div>
            )}
            {/* Step 4: General Analysis Results */}
            {currentStep === 4 && analysisResult && (
              <motion.div
                key="step4"
                className="form-section profile-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="results-header">
                  <span className="success-icon">✓</span>
                  <h2>Profile Successfully Analyzed</h2>
                </div>

                <div className="profile-data-grid">
                  <div className="data-section">
                    <h3><span className="icon">⚡</span> Skills Extracted</h3>
                    <div className="skills-wrap">
                      {analysisResult.skills?.map((skill, i) => (
                        <span key={i} className="skill-tag-luxe">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="data-section">
                    <h3><span className="icon">💼</span> Experience Summary</h3>
                    {analysisResult.experience?.map((exp, i) => (
                      <div key={i} className="experience-item-luxe">
                        <strong>{exp.role}</strong> at {exp.company}
                        <p>{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions results-actions">
                  <button 
                    type="button" 
                    className="btn-outline" 
                    onClick={() => navigate('/jobs')}
                  >
                    Browse Best Matches
                  </button>
                  <button 
                    type="button" 
                    className="next-btn" 
                    onClick={() => navigate('/recommendations')}
                  >
                    Get Detailed Insights →
                  </button>
                </div>
                
                <div style={{ marginTop: '2rem' }}>
                   <button 
                     type="button" 
                     className="back-link" 
                     onClick={() => {
                       setCurrentStep(1);
                       setAnalysisResult(null);
                       setResume(null);
                     }}
                   >
                     Upload Another Resume
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        </div>

        {/* Features / Why AICRUIT Section */}
        <section className="upload-features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Verified Profiles</h3>
            <p>Our AI validates your experience and skills, making you a top choice for recruiters.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Quick Apply</h3>
            <p>Skip the long forms. Match your resume and apply to premium roles in one click.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Job Matching</h3>
            <p>We only show you roles that match your career level and experience.</p>
          </div>
        </section>

        {/* Benefits Section */}
        <motion.div 
          className="upload-benefits-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="benefits-columns">
            <div className="benefit-item">
              <span className="icon">✅</span>
              <p>AI-Powered Skills Alignment</p>
            </div>
            <div className="benefit-item">
              <span className="icon">✅</span>
              <p>Direct Access to Top Tech Firms</p>
            </div>
            <div className="benefit-item">
              <span className="icon">✅</span>
              <p>Encrypted & Secure Data Handling</p>
            </div>
          </div>
        </motion.div>

        {/* Data Privacy Notice */}
        <footer className="upload-privacy-footer">
          <div className="privacy-bar">
            <span className="privacy-icon">🔒</span>
            <p>Your privacy is our priority. Your data is encrypted and never shared without explicit consent. 
              <a href="#"> Learn more about our privacy policy.</a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default UploadResume;