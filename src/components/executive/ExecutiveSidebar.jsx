import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
// Removed: import './ExecutiveSidebar.css';

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);

const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const ExecutiveSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleDrawer = () => setIsOpen(!isOpen);

  const sections = [
    {
      title: 'Workspace',
      items: [
        { path: '/executive/dashboard', label: 'Overview', icon: <DashboardIcon /> },
        { path: '/executive/jobs', label: 'Positions', icon: <BriefcaseIcon /> },
        { path: '/executive/candidates', label: 'Applicants', icon: <UsersIcon /> },
      ]
    },
    {
      title: 'Systems',
      items: [
        { path: '/executive/analytics', label: 'Analytics', icon: <ChartIcon /> },
        { path: '/executive/settings', label: 'Settings', icon: <SettingsIcon /> },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className={`fixed bottom-6 right-6 z-[2000] md:hidden w-14 h-14 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center overflow-hidden group ${
          isOpen ? 'bg-slate-900 border border-white/10' : 'bg-gradient-to-br from-blue-600 to-violet-600 shadow-blue-500/40'
        }`} 
        onClick={toggleDrawer}
      >
        <div className="relative w-6 h-6 flex flex-col justify-between">
          <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[11px]' : ''}`}></span>
          <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[11px]' : ''}`}></span>
        </div>
      </button>

      <aside className={`
        fixed top-0 left-0 h-full w-[260px] bg-black/60 backdrop-blur-2xl border-r border-white-[0.03] 
        flex flex-col z-[1001] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Subtle Glowing Seam */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.1)]"></div>
        
        {/* Logo Section */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-6 relative group">
             <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-xl tracking-tighter">A</span>
            </div>
            <span className="text-xl font-black text-white tracking-widest leading-none">AICRUIT</span>
          </div>
          <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-slate-400 text-[8px] font-black uppercase tracking-[.25em] shadow-inner flex items-center gap-2 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
            Recruiter Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">{section.title}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-500 group relative overflow-hidden
                        ${isActive 
                          ? 'text-white' 
                          : 'text-slate-500 hover:text-slate-300'}
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl pointer-events-none"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        >
                          <div className="absolute left-0 top-3 bottom-3 w-[2.5px] bg-gradient-to-b from-blue-500 to-violet-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
                        </motion.div>
                      )}
                      
                      <span className={`relative z-10 transition-all duration-500 ${isActive ? 'text-blue-400 scale-110' : 'group-hover:text-blue-400 group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span className="relative z-10 text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        {/* Footer Support */}
        <div className="px-5 py-8 mt-auto z-10">
          <div className="p-5 rounded-[2rem] bg-gradient-to-br from-blue-500/[0.03] to-violet-500/[0.03] border border-white/5 space-y-4 relative overflow-hidden group/support">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/support:opacity-100 transition-opacity duration-700"></div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-tight">Terminal Help</p>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">System diagnostics & live officer support.</p>
            <button className="w-full py-3.5 bg-white text-slate-950 hover:bg-blue-400 transition-all duration-500 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/5 active:scale-95">
              Contact Support
            </button>
          </div>
        </div>

        {/* User Profile Hook */}
        <div className="p-4 border-t border-white/[0.03] bg-black/20">
          <Link 
            to="/executive/settings" 
            className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-white/[0.03] transition-all group border border-transparent hover:border-white/5"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-900 group-hover:border-blue-500/30 transition-all">
               <img 
                src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 'admin'}`} 
                alt="Profile" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
              />
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white truncate uppercase tracking-widest mb-0.5">{user?.name || 'Recruiter'}</p>
              <p className="text-[8px] font-black text-slate-600 truncate uppercase tracking-tighter leading-none group-hover:text-blue-500 transition-colors">Portal Admin</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] md:hidden" 
          onClick={toggleDrawer}
        ></motion.div>
      )}
    </>
  );
};

export default ExecutiveSidebar;
