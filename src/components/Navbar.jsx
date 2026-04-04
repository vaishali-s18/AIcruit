import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
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
                relative px-3 py-1.5 text-[13px] font-semibold tracking-tight transition-all duration-300
                text-slate-400 hover:text-white bg-transparent border-none cursor-pointer
              `}
            >
              {link.label}
            </button>
          ) : (
            <Link 
              to={link.path} 
              className={`
                relative px-3 py-1.5 text-[13px] font-semibold tracking-tight transition-all duration-300
                ${location.pathname === link.path ? 'text-white' : 'text-slate-400 hover:text-white'}
              `} 
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center h-full">
        
        {/* Logo Section */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center group" onClick={closeMobileMenu}>
            <span className="font-bold text-lg tracking-tight text-white uppercase">AICRUIT</span>
            {isRecruiter && (
              <span className="ml-2 px-1.5 py-0.5 bg-blue-500/10 text-[9px] font-bold tracking-widest text-blue-400 rounded-md border border-blue-500/20 uppercase">
                REC
              </span>
            )}
          </Link>

          {/* Desktop Navigation - Centered Style */}
          <ul className="hidden lg:flex items-center gap-4 list-none">
            {renderNavLinks()}
          </ul>
        </div>

        <div className="flex items-center gap-6">
          {!user ? (
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => openAuthModal('login')} className="text-[13px] font-semibold text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">Log in</button>
              <button onClick={() => openAuthModal('signup')} className="px-5 py-2 bg-white text-black rounded-lg font-bold text-[13px] hover:bg-slate-200 transition-colors cursor-pointer border-none shadow-xl shadow-white/5">Get Started</button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 group px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 border-none bg-transparent cursor-pointer"
              >
                <span className="text-[14px] font-medium text-slate-200 group-hover:text-white transition-colors">{user.name}</span>
                <span className={`text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[1010]"
                  >
                    <div className="flex flex-col p-1.5">
                      <Link 
                        to={isRecruiter ? '/executive/dashboard' : '/dashboard'} 
                        className="px-3 py-2 text-[13px] text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 flex items-center gap-3 no-underline list-none"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="px-3 py-2 text-[13px] text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 flex items-center gap-3 no-underline list-none"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        👤 Profile
                      </Link>
                      <div className="h-px bg-white/5 my-1.5 mx-2"></div>
                      <button 
                        onClick={handleLogout} 
                        className="px-3 py-2 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-all duration-200 text-left border-none bg-transparent cursor-pointer flex items-center gap-3"
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
            <span className={`w-6 h-0.5 bg-white transition-all ${showMobileMenu ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${showMobileMenu ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${showMobileMenu ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            className="fixed inset-0 bg-slate-950 z-[1001] flex flex-col items-center justify-center lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col items-center gap-8 list-none text-center p-0">
              <li className="mb-4">
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Main Menu</span>
              </li>
              {renderNavLinks(true)}
              {user ? (
                <>
                  <div className="h-px w-20 bg-white/10 my-2"></div>
                  <li><Link to="/dashboard" className="text-lg font-medium text-slate-300" onClick={closeMobileMenu}>Dashboard</Link></li>
                  <li><Link to="/profile" className="text-lg font-medium text-slate-300" onClick={closeMobileMenu}>Profile</Link></li>
                  <li><button onClick={handleLogout} className="text-lg font-bold text-red-500 bg-transparent border-none">Sign Out</button></li>
                </>
              ) : (
                <div className="flex flex-col gap-6 pt-10 border-t border-white/10 w-full px-12">
                  <li><button onClick={() => { openAuthModal('login'); closeMobileMenu(); }} className="text-[15px] font-bold text-slate-400 bg-transparent border-none">Log in</button></li>
                  <li><button onClick={() => { openAuthModal('signup'); closeMobileMenu(); }} className="w-full py-4 bg-white text-black rounded-xl font-bold text-[15px]">Get Started</button></li>
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
