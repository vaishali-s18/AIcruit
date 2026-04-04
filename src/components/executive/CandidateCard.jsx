// Removed: import './CandidateCard.css';

const CandidateCard = ({ candidate, onStatusChange, onViewProfile }) => {
  const isShortlisted = candidate.status === 'Shortlisted';
  const isRejected = candidate.status === 'Rejected';

  const getMatchColor = (score) => {
    if (score >= 90) return '--success-color';
    if (score >= 75) return '--primary-cyan';
    return '--warning-color';
  };

  return (
    <div className={`
      group relative overflow-hidden p-7 flex flex-col gap-6 transition-all duration-500
      bg-slate-900/40 backdrop-blur-2xl border rounded-[2rem] hover:-translate-y-2
      ${candidate.matchScore >= 90 
        ? 'border-cyan-500/30' 
        : 'border-white/5'}
      ${isShortlisted ? 'bg-emerald-500/5 border-emerald-500/30' : ''}
      ${isRejected ? 'opacity-40 grayscale' : ''}
      hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
      ${candidate.matchScore >= 90 ? 'hover:shadow-cyan-500/10' : 'hover:shadow-indigo-500/10'}
    `}>
      {/* Background Glow */}
      {candidate.matchScore >= 90 && (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-500"></div>
      )}

      <div className="flex items-center gap-5 z-10">
        <div className="relative w-20 h-20">
          <img 
            src={candidate.avatar} 
            alt={candidate.name} 
            className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-xl"
          />
          {candidate.matchScore >= 90 && (
            <span className="absolute -bottom-2 -right-3 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-cyan-500/40">
              Top Match
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black text-white hover:text-cyan-400 transition-colors truncate">{candidate.name}</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">
            {candidate.role} <span className="mx-2 text-slate-700">•</span> {candidate.experience}
          </p>
        </div>

        <div className="w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <path 
              className="stroke-slate-800" 
              strokeWidth="3" 
              fill="none" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
            />
            <path 
              className="transition-all duration-1000 ease-out"
              strokeDasharray={`${candidate.matchScore}, 100`}
              strokeLinecap="round"
              strokeWidth="3.5"
              stroke={candidate.matchScore >= 90 ? '#22d3ee' : candidate.matchScore >= 75 ? '#8b5cf6' : '#f59e0b'}
              fill="none" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
            />
            <text x="18" y="22" className="fill-white text-[10px] font-black text-center" textAnchor="middle" transform="rotate(90 18 18)">
              {candidate.matchScore}%
            </text>
          </svg>
        </div>
      </div>
      
      <div className="space-y-4 z-10 flex-1 flex flex-col">
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 italic opacity-80 group-hover:opacity-100 transition-opacity">
          "{candidate.summary}"
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {candidate.skills.slice(0, 4).map(skill => (
            <span key={skill} className="px-3 py-1.5 bg-slate-800/50 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 text-[10px] font-bold rounded-lg transition-all duration-300">
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-lg uppercase tracking-tight">
              +{candidate.skills.length - 4} Matches
            </span>
          )}
        </div>
      </div>

      <footer className="pt-6 border-t border-white/5 flex items-center justify-between gap-4 z-10">
        <button 
          className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
          onClick={() => onViewProfile(candidate)}
        >
          View Profile
        </button>
        <div className="flex gap-2">
           <button 
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
               isRejected 
               ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
               : 'bg-white/5 text-red-400 hover:bg-red-500/10 border border-white/5'
             }`}
             onClick={() => onStatusChange(candidate.id, isRejected ? 'Applied' : 'Rejected')}
           >
             {isRejected ? 'Undo' : 'Reject'}
           </button>
           <button 
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
               isShortlisted 
               ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
               : 'bg-white/5 text-emerald-400 hover:bg-emerald-500/10 border border-white/5'
             }`}
             onClick={() => onStatusChange(candidate.id, isShortlisted ? 'Applied' : 'Shortlisted')}
           >
             {isShortlisted ? 'Shortlisted' : 'Shortlist'}
           </button>
        </div>
      </footer>
    </div>
  );
};

export default CandidateCard;
