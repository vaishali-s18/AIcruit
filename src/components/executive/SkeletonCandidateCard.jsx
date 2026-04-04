const SkeletonCandidateCard = () => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-slate-800 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-5 bg-slate-800 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
        </div>
        <div className="w-16 h-16 bg-slate-800 rounded-full"></div>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="h-4 bg-slate-800 rounded w-full"></div>
        <div className="h-4 bg-slate-800 rounded w-5/6"></div>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-6 w-16 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="h-9 w-24 bg-slate-800 rounded-lg"></div>
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-slate-800 rounded-lg"></div>
          <div className="h-9 w-24 bg-slate-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCandidateCard;
