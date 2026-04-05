import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useExecutive } from '../../context/ExecutiveContext';
import { motion, AnimatePresence } from 'framer-motion';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ExecutiveHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useExecutive();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const commands = [
    { id: 'cmd-post', title: 'Post New Position', icon: '➕', keywords: ['post', 'job', 'new', 'add'], action: () => navigate('/executive/jobs') },
    { id: 'cmd-dash', title: 'Go to Dashboard', icon: '📊', keywords: ['dash', 'home', 'overview'], action: () => navigate('/executive/dashboard') },
    { id: 'cmd-cand', title: 'View Candidates', icon: '👥', keywords: ['cand', 'app', 'view', 'people'], action: () => navigate('/executive/candidates') },
    { id: 'cmd-set', title: 'Portal Settings', icon: '⚙️', keywords: ['set', 'pref', 'conf'], action: () => navigate('/executive/settings') },
    { id: 'cmd-out', title: 'Sign Out / Lock', icon: '🔓', keywords: ['sign', 'out', 'lock', 'exit'], action: handleLogout },
  ];

  const filteredCommands = searchTerm.length > 1 
    ? commands.filter(c => c.keywords.some(k => k.includes(searchTerm.toLowerCase())) || c.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const getPageTitle = (path) => {
    if (path.includes('/dashboard')) return 'Overview';
    if (path.includes('/jobs')) return 'Positions';
    if (path.includes('/candidates')) return 'Applicants';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/settings')) return 'Settings';
    return 'Executive Portal';
  };

  return (
    <header className="w-full px-6 md:px-10 py-4 bg-black/40 backdrop-blur-xl border-b border-white/[0.03] transition-all duration-300">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
             <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)] animate-pulse"></div>
             <p className="text-[9px] font-black text-blue-500/80 uppercase tracking-[.3em]">Recruiter</p>
             <span className="text-slate-700 text-[9px]">/</span>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-[.3em]">Portal</p>
          </div>
          <motion.h2 
            key={location.pathname}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-black text-white tracking-tight"
          >
            {getPageTitle(location.pathname)}
          </motion.h2>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300">
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Search candidates, jobs..." 
            value={searchTerm}
            onFocus={() => setShowSearchResults(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchResults(true);
            }}
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl py-2.5 pl-12 pr-12 text-sm font-medium text-slate-200 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(59,130,246,0.05)] transition-all placeholder:text-slate-600"
          />
          
          <AnimatePresence>
            {showSearchResults && searchTerm.length > 0 && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                >
                  {filteredCommands.length > 0 && (
                    <div className="px-3 py-2 border-b border-white/5 bg-blue-500/5">
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Actions</p>
                    </div>
                  )}
                  {filteredCommands.map(cmd => (
                    <button 
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setSearchTerm('');
                        setShowSearchResults(false);
                      }}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 text-left transition-colors group/cmd"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-lg border border-white/10 group-hover/cmd:border-blue-500/30 transition-all font-bold text-sm">
                        {cmd.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-black text-white group-hover/cmd:text-blue-400 transition-colors uppercase tracking-widest leading-none mb-1">{cmd.title}</p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter transition-colors leading-none">Quick Link</p>
                      </div>
                      <span className="text-slate-500 text-[10px]">⏎</span>
                    </button>
                  ))}
                  
                  <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Data Filtering</p>
                  </div>
                  <div className="px-4 py-3 text-xs font-medium text-slate-400 italic">
                    Searching for "{searchTerm}"...
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-12 flex items-center text-slate-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-600 tracking-tighter">
              ⌘K
            </span>
          </div>
        </div>

        {/* Global Intelligence & Identity */}
        <div className="flex items-center gap-6">
          
          {/* Notifications */}
          <button className="relative group p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-300">
            <BellIcon />
            <div className="absolute top-2.5 right-2.5 flex items-center justify-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full border-2 border-black relative z-10"></span>
              <span className="absolute w-3.5 h-3.5 bg-blue-500/40 rounded-full animate-ping z-0"></span>
            </div>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-4 border-l border-white/10 group focus:outline-none"
            >
              <div className="flex flex-col text-right hidden lg:flex justify-center">
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">
                  {user?.name || 'Recruiter'}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter transition-colors leading-none">
                  Online
                </span>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative w-9 h-9 bg-slate-900 rounded-lg overflow-hidden border border-white/10 shadow-xl flex items-center justify-center text-slate-500">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl px-2 py-2"
                  >
                    <Link 
                      to="/executive/settings" 
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <SettingsIcon /> View Settings
                    </Link>
                    <div className="h-px bg-white/5 my-1 mx-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group/logout"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/logout:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </header>
  );
};

export default ExecutiveHeader;
