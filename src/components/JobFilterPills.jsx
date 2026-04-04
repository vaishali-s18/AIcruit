import { useState } from 'react';
import './JobFilterPills.css';

const JobFilterPills = ({ onFilterChange }) => {
  const [activeTab, setActiveTab] = useState('All');
  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'Design', 'DevOps', 'Mobile'];

  const handleTabClick = (category) => {
    setActiveTab(category);
    onFilterChange('type', category === 'All' ? '' : category);
  };

  return (
    <div className="filter-pills-bar">
      <div className="pills-container">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-pill ${activeTab === category ? 'active' : ''}`}
            onClick={() => handleTabClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="search-mini-bar">
         <span className="search-icon">🔍</span>
         <input 
           type="text" 
           placeholder="Search jobs by title or company..." 
           onChange={(e) => onFilterChange('keyword', e.target.value)}
         />
      </div>
    </div>
  );
};

export default JobFilterPills;
