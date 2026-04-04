import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
// Removed: import './Navbar.css';

const LogoSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="logo-svg">
    <path d="M20 5L35 30H5L20 5Z" stroke="var(--primary-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="18" r="4" fill="var(--primary-purple)" fillOpacity="0.6" className="pulse-logo" />
  </svg>
);

function Navbar({ isAuthPage }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => { 
    logout(); 
    setShowMobileMenu(false);
    navigate('/login'); 
  };

  const isRecruiter = user?.role === 'recruiter';
  const isExecutiveRoute = location.pathname.startsWith('/executive');

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const closeMobileMenu = () => setShowMobileMenu(false);

  const navLinks = [
    ...(!isRecruiter && !isExecutiveRoute ? [
      { path: '/jobs', label: 'Job' }, 
      { path: '/skill-assessment', label: 'Assessment', disabled: !user },
      { path: '/interview-schedule', label: 'AI Screen', disabled: !user },
      { path: '/recommendations', label: 'AI Match', disabled: !user },
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
          <Link 
            to={link.path} 
            className={`
              relative px-1 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300
              ${link.disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'hover:text-white'}
              ${location.pathname === link.path ? 'text-white' : 'text-slate-400'}
            `} 
            onClick={closeMobileMenu}
          >
            {link.label}
            {location.pathname === link.path && !isMobile && (
              <motion.div 
                layoutId="nav-glow" 
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-400 border-b border-white/10 ${scrolled ? 'bg-slate-950/80 backdrop-blur-3xl py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center h-full">
        
        <Link to="/" className="flex items-center group" onClick={closeMobileMenu}>
          <LogoSVG />
          <span className="ml-3 font-black text-xl tracking-[0.15em] text-white">AICRUIT</span>
          {isRecruiter && (
            <span className="ml-2 text-[10px] font-bold tracking-[0.2em] text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity uppercase">
              Recruiter
            </span>
          )}
        </Link>
        
        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-12 list-none">
          {renderNavLinks()}
        </ul>

        <div className="flex items-center gap-6">
          {!user ? (
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Log in</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform uppercase tracking-wider">Get Started</Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-white/10">
               <div className="relative w-10 h-10 group cursor-pointer">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl opacity-50 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative w-full h-full bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center font-black text-blue-400 group-hover:text-white transition-colors">
                    {user.name.charAt(0)}
                  </div>
               </div>
               <div className="flex flex-col bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-xl border border-white/10">
                  <span className="text-[11px] font-bold text-white truncate max-w-[100px]">{user.name}</span>
                  <button onClick={handleLogout} className="text-[9px] font-black text-blue-400 hover:text-red-400 text-left uppercase tracking-widest transition-colors">Sign Out</button>
               </div>
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
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[1001] flex items-center justify-center lg:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <ul className="flex flex-col items-center gap-10 list-none text-center">
              {renderNavLinks(true)}
              {user ? (
                <li>
                  <button onClick={handleLogout} className="text-xl font-black text-red-400 uppercase tracking-[0.2em] hover:text-red-300 transition-colors">Sign Out</button>
                </li>
              ) : (
                <div className="flex flex-col gap-6 pt-10 border-t border-white/10 w-full">
                  <li><Link to="/login" className="text-lg font-bold text-slate-400 uppercase tracking-widest" onClick={closeMobileMenu}>Log in</Link></li>
                  <li><Link to="/signup" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20" onClick={closeMobileMenu}>Get Started</Link></li>
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
