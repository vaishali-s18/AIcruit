import { useState, useEffect } from 'react';
import './PostJobModal.css';

const PostJobModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    skills: '',
    experience: '3-5 years',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : initialData.skills || ''
      });
    } else {
      setFormData({
        title: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        skills: '',
        experience: '3-5 years',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <header className="modal-header">
          <h2>{initialData ? 'Edit Job Posting' : 'Post New Job'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>
        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="form-grid">
            <div className="form-group full">
              <label>Job Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. Senior Frontend Engineer" 
                required 
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                name="location" 
                placeholder="e.g. Remote, SF" 
                required 
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label>Salary Range</label>
              <input 
                type="text" 
                name="salary" 
                placeholder="e.g. $100k - $130k" 
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Experience Required</label>
              <select name="experience" value={formData.experience} onChange={handleChange}>
                <option>0-2 years</option>
                <option>3-5 years</option>
                <option>5-8 years</option>
                <option>8+ years</option>
              </select>
            </div>
            <div className="form-group full">
              <label>Required Skills (comma separated)</label>
              <input 
                type="text" 
                name="skills" 
                placeholder="React, Node.js, TypeScript" 
                required 
                value={formData.skills}
                onChange={handleChange}
              />
              <small className="ai-hint">🤖 AI will use these skills to match candidates.</small>
            </div>
            <div className="form-group full">
              <label>Job Description</label>
              <textarea 
                name="description" 
                rows="4" 
                placeholder="Describe the role and responsibilities..." 
                required
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              {initialData ? 'Update Job' : 'Post Job'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;
