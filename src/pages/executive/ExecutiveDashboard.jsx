import { useState } from 'react';
import { mockRecruiterStats, mockRecentActivity, mockCandidates } from '../../data/mockRecruiterData';
import { useExecutive } from '../../context/ExecutiveContext';
import { motion } from 'framer-motion';
import StatCard from '../../components/executive/StatCard';
import PostJobModal from '../../components/executive/PostJobModal';

const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

const ExecutiveDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchTerm } = useExecutive();

  const handlePostJob = (jobData) => {
    console.log('Posting job from dashboard:', jobData);
    setIsModalOpen(false);
  };

  const filteredCandidates = mockCandidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topCandidates = [...filteredCandidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  const filteredActivity = mockRecentActivity.filter(a => 
    a.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Cinematic Dashboard Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-white/[0.03]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.25em]">Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
            Recruitment <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">Dashboard</span>
          </h1>
          <div className="flex items-center gap-6 text-slate-500 text-[11px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Syncing
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-2.5">
              <span className="text-slate-300">Candidates:</span> 
              <span className="text-white">Active</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            className="group relative px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all overflow-hidden flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 group-hover:text-white transition-colors">Post Position</span>
            <span className="relative z-10 text-lg group-hover:text-white group-hover:rotate-90 transition-all duration-500">+</span>
          </button>
        </motion.div>
      </header>

      {/* Stats Board */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
          title="Active Postings" 
          value={mockRecruiterStats.totalJobs} 
          icon={<BriefcaseIcon />} 
          trend="up" 
          trendValue={12} 
        />
        <StatCard 
          title="Total Candidates" 
          value={mockRecruiterStats.activeApplicants} 
          icon={<UsersIcon />} 
          trend="up" 
          trendValue={5} 
        />
        <StatCard 
          title="Shortlisted" 
          value={mockRecruiterStats.shortlisted} 
          icon={<StarIcon />} 
          trend="up" 
          trendValue={8} 
        />
        <StatCard 
          title="AI Match Rate" 
          value={`${mockRecruiterStats.averageMatchScore}%`} 
          icon={<TargetIcon />} 
          trend="down" 
          trendValue={2} 
        />
      </section>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Activity Stream */}
        <section className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Recent Activity</h2>
            <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">See all events</button>
          </div>
          
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 space-y-8">
            {filteredActivity.length > 0 ? filteredActivity.map((activity, idx) => (
              <motion.div 
                key={activity.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-6 group"
              >
                <div className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                    activity.type === 'Internal' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {activity.type === 'Internal' ? <StarIcon /> : <UsersIcon />}
                  </div>
                  {idx !== mockRecentActivity.length - 1 && <div className="w-px flex-1 bg-white/[0.05] my-2"></div>}
                </div>
                
                <div className="flex-1 pb-8 group-last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors cursor-pointer">{activity.user}</h4>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{activity.time}</span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed mb-3">
                    Expressed interest in <span className="text-slate-200">{activity.job}</span> position
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                      {activity.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-20 text-center space-y-4">
                <div className="text-4xl">🔍</div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No activity nodes found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </section>

        {/* Priority Radar */}
        <section className="xl:col-span-4 space-y-6">
          <div className="px-2">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Top Matches</h2>
          </div>
          
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-6 space-y-3">
            {topCandidates.length > 0 ? topCandidates.map((candidate, idx) => (
              <motion.div 
                key={candidate.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-slate-800 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-black text-white truncate">{candidate.name}</h4>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{candidate.role}</p>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-black text-blue-400 mb-1">{candidate.matchScore}%</div>
                  <div className="w-12 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${candidate.matchScore}%` }}></div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-10 text-center py-10">
                <p className="text-slate-600 font-bold uppercase tracking-tighter text-[9px]">No matching candidates</p>
              </div>
            )}
            
            <div className="pt-4">
              <button className="w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white hover:text-black transition-all duration-500 shadow-lg">
                View All Candidates
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white space-y-4 shadow-2xl shadow-blue-900/20">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
               <TargetIcon />
             </div>
             <div>
               <h4 className="text-lg font-black tracking-tight mb-1">AI Recommendation</h4>
               <p className="text-blue-100 text-xs leading-relaxed font-medium">
                 Your matching algorithm has been optimized. 24 new candidates aligned with your role requirements.
               </p>
             </div>
             <button className="w-full py-3 bg-black/20 hover:bg-black/30 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
               Review matches
             </button>
          </div>
        </section>
      </div>
        
      <PostJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handlePostJob} 
      />
    </div>
  );
};

export default ExecutiveDashboard;
