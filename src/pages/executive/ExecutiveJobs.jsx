import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useExecutive } from '../../context/ExecutiveContext';
import PostJobModal from '../../components/executive/PostJobModal';
import { mockExecutiveJobs } from '../../data/mockRecruiterData';
// Removed: import './ExecutiveJobs.css';

const ExecutiveJobs = () => {
  const { searchTerm } = useExecutive();
  const [jobs, setJobs] = useState(mockExecutiveJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitJob = (jobData) => {
    if (editingJob) {
      // Update existing job
      setJobs(jobs.map(j => j.id === editingJob.id ? { ...j, ...jobData } : j));
    } else {
      // Create new job
      const jobWithId = {
        ...jobData,
        id: `job-${jobs.length + 1}`,
        applicantsCount: 0,
        matchRate: 0,
        status: 'Active',
        postedDate: new Date().toISOString().split('T')[0]
      };
      setJobs([jobWithId, ...jobs]);
    }
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      setJobs(jobs.filter(j => j.id !== jobId));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="space-y-8">
      {/* Pipeline Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
            Job Management
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Postings</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
            Track, edit, and manage your active job openings and recruitment requirements in real-time.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button 
            className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-blue-400 transition-colors uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-500/10"
            onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
          >
            <span className="text-xl font-light">+</span> Post New Job
          </button>
        </motion.div>
      </header>

      {/* Jobs Inventory Table */}
      <section className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Job Position</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Applicants</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avg. Match</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Posted Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? filteredJobs.map((job, idx) => (
                <motion.tr 
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0"
                >
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="text-white font-black text-sm group-hover:text-blue-400 transition-colors">{job.title}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{job.location} • {job.type}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-white/5 text-sm font-black text-white group-hover:border-blue-500/30 transition-all">
                      {job.applicantsCount}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[80px] h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${job.matchRate}%` }}></div>
                      </div>
                      <span className="text-[11px] font-black text-blue-400">{job.matchRate}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`
                      inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                      ${job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-white/5'}
                    `}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-bold text-[11px] uppercase tracking-widest">{job.postedDate}</td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                       <Link 
                        to={`/executive/candidates/${job.id}`} 
                        className="px-4 py-2 bg-slate-800 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                       >
                         Review
                       </Link>
                       <button onClick={() => handleEditClick(job)} className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all">⚙️</button>
                       <button onClick={() => handleDeleteJob(job.id)} className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-red-950 text-red-400 rounded-xl transition-all">🗑️</button>
                     </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No positions matching "{searchTerm}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <PostJobModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmitJob}
        initialData={editingJob}
      />
    </div>
  );
};

export default ExecutiveJobs;
