import { motion } from 'framer-motion';
import StatCard from '../../components/executive/StatCard';
// Removed: import './ExecutiveAnalytics.css';

const ExecutiveAnalytics = () => {
  const stats = [
    { title: 'Avg. Match Accuracy', value: '94.2%', icon: '🎯', trend: 'up', trendValue: 4 },
    { title: 'Hiring Velocity', value: '14 Days', icon: '⚡', trend: 'up', trendValue: 15 },
    { title: 'Talent Pool Size', value: '2.4k', icon: '📈', trend: 'up', trendValue: 8 },
    { title: 'Screening Efficiency', value: '98.8%', icon: '🛡️', trend: 'up', trendValue: 0.5 },
  ];

  const matchDistribution = [
    { range: '90-100%', count: 45, color: 'bg-cyan-500' },
    { range: '80-89%', count: 120, color: 'bg-blue-500' },
    { range: '70-79%', count: 85, color: 'bg-violet-500' },
    { range: '<70%', count: 32, color: 'bg-slate-800' },
  ];

  return (
    <div className="space-y-10">
      <header className="pb-8 border-b border-white/5 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">
            Recruitment Insights
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Talent <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Analytics</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-2xl leading-relaxed">
            Comprehensive data visualization of your recruitment funnel and candidate matching performance in real-time.
          </p>
        </motion.div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Match Score Distribution</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Distribution across active postings</p>
          </div>
          <div className="p-8 space-y-6">
            {matchDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <span className="w-20 text-[11px] font-black text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-widest">{item.range}</span>
                <div className="flex-1 h-3 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className={`h-full ${item.color} shadow-[0_0_15px_rgba(34,211,238,0.2)]`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / 150) * 100}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-black text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Conversion Funnel</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Efficiency metrics from discovery to hire</p>
          </div>
          <div className="p-8 space-y-3">
             {[
               { label: 'Prospective', count: '2.4k', width: '100%', color: 'from-blue-600 to-blue-400', op: '1' },
               { label: 'AI Screened', count: '840', width: '75%', color: 'from-blue-500 to-indigo-500', op: '0.8' },
               { label: 'Shortlisted', count: '124', width: '50%', color: 'from-indigo-600 to-violet-600', op: '0.6' },
               { label: 'Hired', count: '12', width: '25%', color: 'from-violet-600 to-fuchsia-600', op: '0.4' }
             ].map((stage, idx) => (
               <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className="relative group h-14"
               >
                 <div 
                  className={`absolute left-1/2 -translate-x-1/2 h-full rounded-2xl bg-gradient-to-r ${stage.color} flex items-center justify-between px-8 border border-white/10 shadow-2xl transition-transform group-hover:scale-[1.02]`}
                  style={{ width: stage.width }}
                 >
                   <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{stage.label}</span>
                   <span className="text-sm font-black text-white">{stage.count}</span>
                 </div>
               </motion.div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExecutiveAnalytics;
