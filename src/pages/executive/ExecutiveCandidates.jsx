import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useExecutive } from '../../context/ExecutiveContext';
import CandidateCard from '../../components/executive/CandidateCard';
import CandidateResumeModal from '../../components/executive/CandidateResumeModal';
import SkeletonCandidateCard from '../../components/executive/SkeletonCandidateCard';
import { mockCandidates } from '../../data/mockRecruiterData';
// Removed: import './ExecutiveCandidates.css';

const ExecutiveCandidates = () => {
  const { jobId } = useParams();
  const { searchTerm } = useExecutive();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    const timer = setTimeout(() => {
      
      // Pull live applications
      const liveApps = JSON.parse(localStorage.getItem('liveApplications') || '[]');
      
      // Format them to match existing Candidates schema
      const liveCandidates = liveApps.map(app => ({
        id: app.id,
        jobId: app.jobId,
        name: app.candidateName,
        role: app.role,
        experience: 'New Applicant', // Not strictly tracked in form yet
        skills: app.skills,
        matchScore: app.matchScore,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidateName)}&background=0D8ABC&color=fff`,
        status: 'Active Screened',
        summary: `Strategic neural analysis complete. Candidate achieved a confidence score of ${app.matchScore}% during autonomous screening.`,
      }));

      // Merge and remove duplicates (if a mock and live conflict, prioritizing live is tough without shared keys, but we'll just prepend live)
      setCandidates([...liveCandidates, ...mockCandidates]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (candidateId, newStatus) => {
    setCandidates(prev => prev.map(c => 
      c.id === candidateId ? { ...c, status: newStatus } : c
    ));
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cand.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (jobId && cand.jobId !== jobId) return false;
    if (filter === 'All') return true;
    if (filter === 'Top Match') return cand.matchScore >= 90;
    if (filter === 'Shortlisted') return cand.status === 'Shortlisted';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
            Candidate Pipeline
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Applicants</span> 
            {jobId && <span className="text-slate-600 ml-4 font-light text-3xl">#job-{jobId}</span>}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
            Review and manage candidates using AI-driven matching scores and professional metrics.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex p-1 bg-slate-900/50 backdrop-blur-3xl rounded-2xl border border-white/5 w-fit h-fit"
        >
          {['All', 'Top Match', 'Shortlisted'].map(f => (
            <button 
              key={f}
              className={`
                px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                ${filter === f 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 hover:text-slate-300'}
              `}
              onClick={() => setFilter(f)}
            >
              {f === 'All' ? 'All Applications' : f === 'Top Match' ? 'Top Profiles' : 'Shortlisted'}
            </button>
          ))}
        </motion.div>
      </header>

      {/* Candidates Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-20">
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Loading Skeletons
            [1, 2, 3, 4, 5, 6].map(i => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SkeletonCandidateCard />
              </motion.div>
            ))
          ) : (
            filteredCandidates.map(candidate => (
              <motion.div
                key={candidate.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <CandidateCard 
                  candidate={candidate} 
                  onStatusChange={handleStatusChange}
                  onViewProfile={handleViewProfile}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {!loading && filteredCandidates.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-20 bg-slate-900/20 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-4xl border border-white/5 opacity-50">📂</div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">No candidates found</h3>
              <p className="text-slate-500 max-w-sm">Try adjusting your search filters or check back later for new applicant profiles.</p>
            </div>
          </motion.div>
        )}
      </section>

      <CandidateResumeModal 
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ExecutiveCandidates;
