import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './JobFilter.css';

function JobFilter({ onFilterChange }) {
  const [expandedSection, setExpandedSection] = useState('type');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (onFilterChange) {
      onFilterChange(name, value);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="job-filter-ops">
      <header className="filter-ops-header">
        <div className="header-top">
           <h3>Parameters</h3>
           <button className="reset-ops-btn">Reset</button>
        </div>
        <div className="filter-search-box">
           <span className="search-icon">🔍</span>
           <input 
              type="text" 
              placeholder="Search Role..." 
              name="keyword"
              onChange={handleChange}
           />
        </div>
      </header>

      <div className="filter-sections-stack">
        {/* Engagement Type */}
        <div className="filter-section-panel">
           <button 
              className={`section-toggle-btn ${expandedSection === 'type' ? 'active' : ''}`}
              onClick={() => toggleSection('type')}
           >
              <span>Engagement Type</span>
              <span className="chevron">{expandedSection === 'type' ? '−' : '+'}</span>
           </button>
           <AnimatePresence>
              {expandedSection === 'type' && (
                <motion.div 
                   className="section-body"
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                >
                   <div className="radio-group-modern">
                      {['All Types', 'Full-Time', 'Part-Time', 'Contract', 'Remote'].map(type => (
                         <label key={type} className="radio-item-modern">
                            <input 
                               type="radio" 
                               name="type" 
                               value={type === 'All Types' ? '' : type.toLowerCase()} 
                               onChange={handleChange}
                               defaultChecked={type === 'All Types'}
                            />
                            <span className="radio-pill">{type}</span>
                         </label>
                      ))}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Global Location */}
        <div className="filter-section-panel">
           <button 
              className={`section-toggle-btn ${expandedSection === 'location' ? 'active' : ''}`}
              onClick={() => toggleSection('location')}
           >
              <span>Geospatial Vector</span>
              <span className="chevron">{expandedSection === 'location' ? '−' : '+'}</span>
           </button>
           <AnimatePresence>
              {expandedSection === 'location' && (
                <motion.div 
                   className="section-body"
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                >
                   <select className="ops-select-modern" name="location" onChange={handleChange}>
                      <option value="">Global Network</option>
                      <option value="Remote">Remote Operations</option>
                      <option value="Bangalore">Bangalore (Tech Hub)</option>
                      <option value="Hyderabad">Hyderabad (Matrix)</option>
                      <option value="USA">USA Territory</option>
                   </select>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Level Vector */}
        <div className="filter-section-panel">
           <button 
              className={`section-toggle-btn ${expandedSection === 'level' ? 'active' : ''}`}
              onClick={() => toggleSection('level')}
           >
              <span>Seniority Matrix</span>
              <span className="chevron">{expandedSection === 'level' ? '−' : '+'}</span>
           </button>
           <AnimatePresence>
              {expandedSection === 'level' && (
                <motion.div 
                   className="section-body"
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                >
                   <div className="checkbox-grid-modern">
                      {['Entry', 'Intermediate', 'Senior', 'Lead', 'Executive'].map(lvl => (
                         <label key={lvl} className="checkbox-item-modern">
                            <input type="checkbox" name="level" value={lvl} onChange={handleChange} />
                            <span className="check-box-fake"></span>
                            <span className="lvl-label">{lvl}</span>
                         </label>
                      ))}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      <div className="sidebar-ad-premium">
         <div className="ad-content">
            <span className="ad-badge">AI INSIGHT</span>
            <p>Your profile alignment is currently <strong>Top 5%</strong> for Senior Engineering roles.</p>
         </div>
      </div>
    </div>
  );
}

export default JobFilter;