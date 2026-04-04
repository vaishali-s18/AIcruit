// Removed: import './StatCard.css';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="relative group overflow-hidden p-6 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] hover:border-blue-500/30 transition-all duration-700">
      {/* Decorative Glow */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full ${trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center text-blue-400 border border-white/[0.05] group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-700 shadow-inner">
          {icon}
        </div>
        <div className={`
          flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border
          ${trend === 'up' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' : 'bg-red-500/5 text-red-400 border-red-500/10'}
        `}>
          <span className="text-[11px] leading-none">{trend === 'up' ? '↗' : '↘'}</span>
          {trendValue}%
        </div>
      </div>
      
      <div className="space-y-1 relative z-10">
        <h3 className="text-3xl font-black text-white tracking-tighter group-hover:translate-x-1 transition-transform duration-700">{value}</h3>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      </div>

      {/* Visual Sparkline Placeholder */}
      <div className="mt-6 h-1 w-full bg-white/[0.02] rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: trend === 'up' ? '70%' : '30%' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute left-0 top-0 h-full rounded-full ${trend === 'up' ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500' : 'bg-gradient-to-r from-red-500/20 to-red-500'}`}
        />
      </div>
    </div>
  );
};

export default StatCard;
