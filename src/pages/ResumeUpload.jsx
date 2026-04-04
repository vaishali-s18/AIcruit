// ResumeUpload.jsx - Enhanced with Modern UI
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import './ResumeUpload.css';

function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or DOCX file');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5242880,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Simulate parsed resume data
      const mockParsedData = {
        fileName: file.name,
        skills: ['React', 'JavaScript', 'Node.js', 'Python', 'AWS'],
        experience: [
          { company: 'Tech Corp', role: 'Frontend Developer', duration: '2022-Present', description: 'Developed React applications' }
        ],
        education: [
          { degree: 'B.Tech in Computer Science', institution: 'University Name', year: '2022', grade: '8.5 CGPA' }
        ],
        certifications: ['AWS Certified Developer', 'React Advanced'],
        projects: [
          { name: 'AI Recruitment System', description: 'Full-stack application with AI matching', technologies: ['React', 'Node.js', 'MongoDB'] }
        ],
        contact: {
          email: 'user@example.com',
          phone: '+1234567890',
          location: 'New York, NY'
        }
      };
      
      setParsedData(mockParsedData);
      setUploadComplete(true);
      setUploading(false);
      
      // Save to localStorage
      localStorage.setItem('resumeData', JSON.stringify(mockParsedData));
      localStorage.setItem('resumeUploaded', 'true');
    }, 2000);
  };

  const handleAnalyzeSkills = () => {
    // Save skills to localStorage for recommendations
    if (parsedData && parsedData.skills) {
      localStorage.setItem('userSkills', JSON.stringify(parsedData.skills));
      navigate('/recommendations');
    }
  };

  const handleViewJobs = () => {
    navigate('/jobs');
  };

  const handleUploadAnother = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setParsedData(null);
    setError('');
  };

  return (
    <div className="resume-upload-page">
      <div className="resume-upload-container">
        {/* Header */}
        <motion.div 
          className="upload-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-badge">
            <span className="badge-icon">📄</span>
            <span className="badge-text">AI-Powered Resume Parsing</span>
          </div>
          <h1>
            <span className="gradient-text">Upload Your</span> Resume
          </h1>
          <p>Let our AI analyze your resume and find the perfect job matches</p>
        </motion.div>

        {/* Upload Area */}
        {!uploadComplete ? (
          <motion.div
            className="upload-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'drag-active' : ''} ${file ? 'file-selected' : ''}`}
            >
              <input {...getInputProps()} />
              
              {!file ? (
                <div className="dropzone-content">
                  <div className="upload-icon">📄</div>
                  <h3>Drag & Drop Your Resume</h3>
                  <p>or click to browse</p>
                  <div className="file-types">
                    <span>PDF</span>
                    <span>DOCX</span>
                  </div>
                  <p className="file-size">Max file size: 5MB</p>
                </div>
              ) : (
                <div className="file-preview">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <h4>{file.name}</h4>
                    <p>{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button 
                    className="remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setError('');
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="error-icon">⚠️</span>
                {error}
              </motion.div>
            )}

            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p>AI is analyzing your resume... {uploadProgress}%</p>
              </div>
            )}

            <motion.button
              className="upload-btn"
              onClick={handleUpload}
              disabled={!file || uploading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {uploading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <span>Upload & Analyze</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          /* Parsed Resume Data */
          <motion.div 
            className="parsed-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="results-header">
              <div className="success-badge">
                <span className="success-icon">✓</span>
                Resume Successfully Analyzed!
              </div>
              <button className="upload-another" onClick={handleUploadAnother}>
                Upload Another
              </button>
            </div>

            {/* Skills Section */}
            {parsedData?.skills && (
              <div className="parsed-section">
                <h3>
                  <span className="section-icon">⚡</span>
                  Detected Skills
                </h3>
                <div className="skills-grid">
                  {parsedData.skills.map((skill, idx) => (
                    <motion.span 
                      key={idx} 
                      className="skill-badge"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {parsedData?.experience && parsedData.experience.length > 0 && (
              <div className="parsed-section">
                <h3>
                  <span className="section-icon">💼</span>
                  Work Experience
                </h3>
                {parsedData.experience.map((exp, idx) => (
                  <div key={idx} className="experience-card">
                    <div className="exp-header">
                      <h4>{exp.role}</h4>
                      <span className="company">{exp.company}</span>
                    </div>
                    <p className="duration">📅 {exp.duration}</p>
                    <p className="description">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {parsedData?.education && parsedData.education.length > 0 && (
              <div className="parsed-section">
                <h3>
                  <span className="section-icon">🎓</span>
                  Education
                </h3>
                {parsedData.education.map((edu, idx) => (
                  <div key={idx} className="education-card">
                    <h4>{edu.degree}</h4>
                    <p className="institution">{edu.institution}</p>
                    <p className="year">{edu.year} • {edu.grade}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Section */}
            {parsedData?.projects && parsedData.projects.length > 0 && (
              <div className="parsed-section">
                <h3>
                  <span className="section-icon">🚀</span>
                  Projects
                </h3>
                {parsedData.projects.map((project, idx) => (
                  <div key={idx} className="project-card">
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <motion.button
                className="analyze-btn"
                onClick={handleAnalyzeSkills}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>🎯</span>
                Get AI Recommendations
              </motion.button>
              <motion.button
                className="jobs-btn"
                onClick={handleViewJobs}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>🔍</span>
                Browse Jobs
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div 
          className="features-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3>What our AI can extract</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📝</div>
              <h4>Skills</h4>
              <p>Technical and soft skills</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💼</div>
              <h4>Experience</h4>
              <p>Work history and roles</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎓</div>
              <h4>Education</h4>
              <p>Degrees and certifications</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <h4>Projects</h4>
              <p>Portfolio and achievements</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ResumeUpload;