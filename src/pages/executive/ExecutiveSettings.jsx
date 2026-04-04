import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
// Removed: import './ExecutiveSettings.css';

const ExecutiveSettings = () => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    company: '',
    avatar: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        role: user.role || 'Senior Talent Acquisition Lead',
        company: user.company || 'Quantum Tech Industries',
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
      });
    }
  }, [user]);

  const [protocols, setProtocols] = useState({
    matchSensitivity: 85,
    autoScreening: true,
    instantMatchAlerts: true,
    candidateVerification: true,
  });

  const [governance, setGovernance] = useState({
    emailNotifications: true,
    realTimeActivity: true,
    mfaEnabled: true,
    sessionPersistence: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await updateProfile(profile);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="pb-8 border-b border-white/5">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
            Platform Settings
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Configuration</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-2xl leading-relaxed">
            Manage your recruiter profile, matching logic, and hiring preferences for the Aicruit ecosystem.
          </p>
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-6 p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            {message.text}
          </motion.div>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Section 1: Personal Profile */}
        <section className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-xl border border-blue-500/20">👤</div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Recruiter Profile</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="space-y-4">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/5 p-1 bg-slate-900">
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
              </div>
              <button className="w-full py-2.5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Change Photo
              </button>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})} 
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium focus:border-blue-500/50 outline-none transition-all shadow-inner" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Role</label>
                <input 
                  type="text" 
                  value={profile.role} 
                  onChange={(e) => setProfile({...profile, role: e.target.value})} 
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium focus:border-blue-500/50 outline-none transition-all shadow-inner" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Matching Logic */}
        <section className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-xl border border-cyan-500/20">🎯</div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Matching Engine</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Matching Sensitivity</label>
                  <p className="text-xs text-slate-400">Minimum AI score required for "Top Match" status.</p>
                </div>
                <span className="text-2xl font-black text-cyan-400">{protocols.matchSensitivity}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="95" 
                value={protocols.matchSensitivity} 
                onChange={(e) => setProtocols({...protocols, matchSensitivity: e.target.value})} 
                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-slate-950/50 rounded-3xl border border-white/5">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Automated Screening</h4>
                  <p className="text-[11px] text-slate-500">Enable AI-driven initial mapping for all incoming candidate profiles.</p>
                </div>
                <button 
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${protocols.autoScreening ? 'bg-blue-600' : 'bg-slate-800'}`}
                  onClick={() => setProtocols({...protocols, autoScreening: !protocols.autoScreening})}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${protocols.autoScreening ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-950/50 rounded-3xl border border-white/5">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Deep Verification</h4>
                  <p className="text-[11px] text-slate-500">Trigger additional AI validation layers for highly-matched candidates.</p>
                </div>
                <button 
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${protocols.candidateVerification ? 'bg-blue-600' : 'bg-slate-800'}`}
                  onClick={() => setProtocols({...protocols, candidateVerification: !protocols.candidateVerification})}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${protocols.candidateVerification ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Security & Governance */}
        <section className="xl:col-span-2 bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-xl border border-emerald-500/20">🛡️</div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Governance & Security</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-6 bg-slate-950/20 rounded-3xl border border-white/5 hover:bg-white/[0.02] transition-all">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Real-Time Feed</h4>
                <p className="text-[11px] text-slate-500">Display instant applicant event notifications.</p>
              </div>
              <button 
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${governance.realTimeActivity ? 'bg-emerald-500' : 'bg-slate-800'}`}
                onClick={() => setGovernance({...governance, realTimeActivity: !governance.realTimeActivity})}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${governance.realTimeActivity ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-950/20 rounded-3xl border border-white/5 hover:bg-white/[0.02] transition-all">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">2FA Activation</h4>
                <p className="text-[11px] text-slate-500">Add an extra layer of biometric/MFA security.</p>
              </div>
              <button 
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${governance.mfaEnabled ? 'bg-emerald-500' : 'bg-slate-800'}`}
                onClick={() => setGovernance({...governance, mfaEnabled: !governance.mfaEnabled})}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${governance.mfaEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              disabled={isSaving}
              onClick={handleSave}
              className={`px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all ${
                isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing Update...
                </div>
              ) : (
                'Save Platform Profile'
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExecutiveSettings;
