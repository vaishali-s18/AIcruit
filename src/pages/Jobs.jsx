import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

import JobCard from '../components/JobCard';
import JobFilterPills from '../components/JobFilterPills';
import { jobs as localJobs } from '../data/jobs';
import './Jobs.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({ keyword: '', type: '', location: '' });
  const [activeTab, setActiveTab] = useState('All');

  const trendingTags = ['React', 'Node.js', 'Python', 'DevOps', 'UI/UX', 'Remote'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/api/jobs');
        if (data && data.length > 0) {
          setJobs(data);
          setFilteredJobs(data);
        } else {
          setJobs(localJobs);
          setFilteredJobs(localJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs, falling back to local data:', error);
        setJobs(localJobs);
        setFilteredJobs(localJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    let result = [...jobs];
    
    if (newFilters.keyword.trim() !== '') {
      const lower = newFilters.keyword.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(lower) || 
        job.company.toLowerCase().includes(lower) ||
        job.location.toLowerCase().includes(lower) ||
        job.category?.toLowerCase().includes(lower) ||
        (job.requirements?.skills && job.requirements.skills.some(s => s.toLowerCase().includes(lower)))
      );
    } 
    
    if (newFilters.type !== '') {
      const lower = newFilters.type.toLowerCase();
      result = result.filter(job => 
        job.category?.toLowerCase() === lower ||
        job.title?.toLowerCase().includes(lower) ||
        (job.requirements?.skills && job.requirements.skills.some(s => s.toLowerCase().includes(lower))) ||
        job.type?.toLowerCase().includes(lower.replace('-', ' '))
      );
    }
    
    if (newFilters.location !== '') {
      result = result.filter(job => job.location.toLowerCase().includes(newFilters.location.toLowerCase()));
    }
    
    setFilteredJobs(result);
  };

  const handleTrendingClick = (tag) => {
    handleFilterChange('keyword', tag);
  };

  return (
    <div className="jobs-page-minimal">
      <div className="matrix-overlay"></div>
      <div className="page-header-bg"></div>
      
      <div className="jobs-container">
        <header className="jobs-hero-section">
           <motion.div 
             className="hud-status-bar"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5 }}
           >
             <div className="status-pulse"></div>
             Live Job Listings
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, ease: "easeOut" }}
           >
              Find your next <span className="blue-accent">Job Opening</span>
           </motion.h1>
           
           <motion.p 
             className="hero-subtitle-text"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3, duration: 0.8 }}
           >
              Explore opportunities that match your expertise and passion.
           </motion.p>

           <div className="search-focus-area">
              <JobFilterPills onFilterChange={handleFilterChange} />
           </div>
        </header>

        <main className="jobs-content-area card">
            <div className="results-toolbar-clean">
                <div className="result-stats">
                   <span className="count-badge">{filteredJobs.length}</span>
                   <span className="stats-label">Jobs Found</span>
                </div>

              <div className="results-actions">
                 <div className="sort-control">
                    <span className="sort-label">Sort by:</span>
                    <select className="sort-select">
                       <option>Latest</option>
                       <option>Most Relevant</option>
                    </select>
                 </div>
                 <div className="layout-toggle">
                    <button 
                      className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      Grid
                    </button>
                    <button 
                      className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      List
                    </button>
                 </div>
              </div>
           </div>

           {loading ? (
             <div className="jobs-loading-minimal">
                <div className="spinner-circle"></div>
                <p>Browsing opportunities...</p>
             </div>
           ) : (
             <motion.div 
               className={`jobs-grid-layout ${viewMode === 'list' ? 'list-mode' : ''}`}
               layout
             >
               <AnimatePresence mode='popLayout'>
                 {filteredJobs.length > 0 ? (
                   filteredJobs.map((job) => (
                     <motion.div 
                       key={job._id || job.id}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 0.2 }}
                       layout
                     >
                       <JobCard job={job} />
                     </motion.div>
                   ))
                 ) : (
                   <div className="jobs-null-state-clean">
                      <div className="null-icon-minimal">🚫</div>
                      <h3>No jobs found</h3>
                      <p>Try adjusting your search keywords or filters to find more opportunities.</p>
                      <button className="clear-all-btn" onClick={() => handleFilterChange('keyword', '')}>Clear all filters</button>
                   </div>
                 )}
               </AnimatePresence>
             </motion.div>
           )}
        </main>
      </div>
    </div>
  );
}

export default Jobs;
