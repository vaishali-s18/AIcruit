import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const LogoSVG = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="logo-svg">
    <path d="M20 5L35 30H5L20 5Z" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="18" r="4" fill="#8b5cf6" fillOpacity="0.6" className="pulse-logo-hybrid" />
  </svg>
);

function Navbar({ isAuthPage }) {
  const { user, logout, openAuthModal } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => { 
    logout(); 
    setShowMobileMenu(false);
    setIsProfileOpen(false);
    navigate('/login'); 
  };

  const isRecruiter = user?.role === 'recruiter';
  const isExecutiveRoute = location.pathname.startsWith('/executive');

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const closeMobileMenu = () => setShowMobileMenu(false);

  const navLinks = [
    ...(!isRecruiter && !isExecutiveRoute ? [
      { path: '/jobs', label: 'Job', protected: true }, 
      { path: '/skill-assessment', label: 'Assessment', protected: true },
      { path: '/interview-schedule', label: 'AI Interview', protected: true },
      { path: '/recommendations', label: 'Job Matches', protected: true },
    ] : []),
    ...(isRecruiter || isExecutiveRoute ? [
      { path: '/executive/dashboard', label: 'Overview' },
      { path: '/executive/jobs', label: 'Postings' },
      { path: '/executive/candidates', label: 'Candidates' },
    ] : [])
  ];

  const renderNavLinks = (isMobile = false) => (
    <>
      {navLinks.map((link) => (
        <li key={link.path}>
          {!user && link.protected ? (
            <button
              onClick={() => {
                closeMobileMenu();
                openAuthModal('login', link.path);
              }}
              className={`
                relative px-4 py-2 text-[13px] font-bold tracking-[0.1em] transition-all duration-300
                text-slate-400 hover:text-white bg-transparent border-none cursor-pointer uppercase
              `}
            >
              {link.label}
            </button>
          ) : (
            <Link 
              to={link.path} 
              className={`
                relative px-4 py-2 text-[13px] font-bold tracking-[0.1em] transition-all duration-300 uppercase
                ${location.pathname === link.path ? 'text-white' : 'text-slate-400 hover:text-white'}
              `} 
              onClick={closeMobileMenu}
            >
              {link.label}
              {location.pathname === link.path && !isMobile && (
                <motion.div 
                  layoutId="nav-glow-hybrid" 
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] shadow-[0_0_15px_rgba(14,165,233,0.6)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          )}
        </li>
      ))}
    </>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'bg-slate-950/60 backdrop-blur-3xl border-b border-white/10 py-3 shadow-[0_10px_50px_rgba(0,0,0,0.6)]' : 'bg-transparent py-6'}`}>
      <div className="max-w-[1400px] mx-auto px-10 flex justify-between items-center h-full">
        
        {/* Logo Section */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center group" onClick={closeMobileMenu}>
            <LogoSVG />
            <span className="ml-3 font-black text-xl tracking-[0.15em] text-white uppercase group-hover:text-[#0ea5e9] transition-colors">AICRUIT</span>
            {isRecruiter && (
              <span className="ml-3 px-2 py-0.5 bg-[#0ea5e9]/10 text-[9px] font-black tracking-[0.2em] text-[#0ea5e9] rounded-md border border-[#0ea5e9]/20 uppercase">
                REC
              </span>
            )}
          </Link>

          {/* Desktop Navigation - Centered Hybrid Style */}
          <ul className="hidden lg:flex items-center gap-2 list-none">
            {renderNavLinks()}
          </ul>
        </div>

        <div className="flex items-center gap-8">
          {!user ? (
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => openAuthModal('login')} className="text-[13px] font-bold text-slate-400 hover:text-white transition-colors bg-transparent border-none uppercase tracking-widest cursor-pointer">Log in</button>
              <button 
                onClick={() => openAuthModal('signup')} 
                className="px-6 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white rounded-xl font-bold text-[13px] shadow-lg shadow-[#0ea5e9]/20 hover:scale-105 transition-all uppercase tracking-wider cursor-pointer border-none"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 group px-4 py-2 rounded-xl transition-all duration-300 border-none bg-transparent cursor-pointer hover:bg-white/5"
              >
                <div className="flex flex-col items-end mr-1">
                   <span className="text-[14px] font-bold text-slate-200 group-hover:text-white transition-colors">{user.name}</span>
                </div>
                <span className={`text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-[#0ea5e9]' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-3 w-56 bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[1010]"
                  >
                    <div className="flex flex-col p-2">
                       <div className="px-4 py-3 border-b border-white/5 mb-2">
                          <p className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-widest mb-1">Authenticated</p>
                          <p className="text-[13px] font-medium text-white truncate">{user.email || user.name}</p>
                       </div>
                      <Link 
                        to={isRecruiter ? '/executive/dashboard' : '/dashboard'} 
                        className="px-4 py-2.5 text-[13px] font-bold text-slate-400 hover:text-white hover:bg-[#0ea5e9]/10 rounded-lg transition-all duration-200 flex items-center gap-3 no-underline list-none uppercase tracking-wide group/item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="group-hover/item:scale-125 transition-transform">📊</span> {isRecruiter ? 'Overview' : 'My Dashboard'}
                      </Link>
                      <div className="h-px bg-white/5 my-2 mx-1"></div>
                      <button 
                        onClick={handleLogout} 
                        className="px-4 py-2.5 text-[13px] font-bold text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all duration-200 text-left border-none bg-transparent cursor-pointer flex items-center gap-3 uppercase tracking-wide"
                      >
                        🚪 Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Hamburger Icon */}
          <button className={`lg:hidden flex flex-col gap-1.5 p-2 ${showMobileMenu ? 'group' : ''}`} onClick={toggleMobileMenu}>
            <span className={`w-6 h-0.5 bg-white transition-all ${showMobileMenu ? 'rotate-45 translate-y-2 bg-[#0ea5e9]' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${showMobileMenu ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${showMobileMenu ? '-rotate-45 -translate-y-2 bg-[#0ea5e9]' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[1001] flex flex-col items-center justify-center lg:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <ul className="flex flex-col items-center gap-8 list-none text-center p-0">
              <li className="mb-6">
                <span className="text-[#0ea5e9] text-[12px] font-black uppercase tracking-[0.3em]">HURON_INTERFACE</span>
              </li>
              {renderNavLinks(true)}
              {user ? (
                <>
                  <div className="h-px w-32 bg-white/10 my-4"></div>
                  <li><Link to="/dashboard" className="text-xl font-bold text-slate-300 hover:text-white uppercase tracking-widest" onClick={closeMobileMenu}>Dashboard</Link></li>
                  <li><Link to="/profile" className="text-xl font-bold text-slate-300 hover:text-white uppercase tracking-widest" onClick={closeMobileMenu}>Profile</Link></li>
                  <li><button onClick={handleLogout} className="text-xl font-black text-red-500 bg-transparent border-none uppercase tracking-widest mt-4">Log Out</button></li>
                </>
              ) : (
                <div className="flex flex-col gap-8 pt-10 border-t border-white/10 w-full px-12">
                  <li><button onClick={() => { openAuthModal('login'); closeMobileMenu(); }} className="text-[16px] font-black text-slate-400 bg-transparent border-none uppercase tracking-widest">Access Portal</button></li>
                  <li><button onClick={() => { openAuthModal('signup'); closeMobileMenu(); }} className="w-full py-5 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white rounded-2xl font-black text-[16px] uppercase tracking-[0.2em] shadow-xl shadow-[#0ea5e9]/20">Initialize</button></li>
                </div>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
