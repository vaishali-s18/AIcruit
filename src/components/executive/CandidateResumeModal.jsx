import { motion, AnimatePresence } from 'framer-motion';
import CandidateProfileHeader from './CandidateProfileHeader';
import './CandidateResumeModal.css';

const CandidateResumeModal = ({ candidate, isOpen, onClose }) => {
  if (!isOpen || !candidate) return null;

  return (
    <AnimatePresence>
      <div className="resume-modal-overlay" onClick={onClose}>
        <motion.div 
          className="resume-modal-content glass-card-luxe"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-resume-btn" onClick={onClose}>✕</button>
          
          <CandidateProfileHeader candidate={candidate} />

          <div className="resume-layout-luxe">
            <aside className="resume-sidebar-luxe">
               <div className="resume-contact-luxe">
                 <h3>Contact Integrity</h3>
                 <p>📧 {candidate.name.toLowerCase().replace(' ', '.')}@talent.hub</p>
                 <p>📱 +1 (555) 012-9482</p>
                 <p>📍 {candidate.location || 'Remote, Global'}</p>
               </div>
               <div className="resume-skills-luxe">
                 <h3>AI-Extracted Skills</h3>
                 <div className="skill-cloud-luxe">
                   {candidate.skills.map(skill => (
                     <span key={skill} className="skill-tag-luxe active">{skill}</span>
                   ))}
                 </div>
               </div>

               <div className="match-analysis-luxe">
                  <h3>AI Calibration</h3>
                  <div className="match-score-pill">
                    <span className="score">{candidate.matchScore}%</span>
                    <span className="label">System Match</span>
                  </div>
               </div>
            </aside>

            <main className="resume-main-luxe">
              <section className="resume-section-luxe">
                <div className="ai-summary-box-luxe">
                  <div className="ai-badge-luxe">AI STRATEGIC SUMMARY</div>
                  <p>{candidate.summary}</p>
                </div>
              </section>

              <section className="resume-section-luxe">
                <h2>Strategic Experience</h2>
                <div className="experience-timeline-luxe">
                   <div className="exp-item-luxe">
                      <div className="exp-marker-luxe"></div>
                      <div className="exp-content-luxe">
                        <div className="exp-header-luxe">
                          <h3>Senior Systems Architect</h3>
                          <span>2021 — PRESENT</span>
                        </div>
                        <p className="company-luxe">Quantum Dynamics Corp</p>
                        <ul>
                          <li>Orchestrated sub-second matching protocols for high-fidelity talent pipelines.</li>
                          <li>Scaled neural architecture to handle 10k+ concurrent data nodes.</li>
                          <li>Collaborated with executive stakeholders on strategic AI alignment.</li>
                        </ul>
                      </div>
                   </div>
                   <div className="exp-item-luxe">
                      <div className="exp-marker-luxe"></div>
                      <div className="exp-content-luxe">
                        <div className="exp-header-luxe">
                          <h3>Lead Full-Stack Strategist</h3>
                          <span>2018 — 2021</span>
                        </div>
                        <p className="company-luxe">Nexus Unified Systems</p>
                        <ul>
                          <li>Transitioned legacy infrastructure to a modern cinematic React environment.</li>
                          <li>Implemented glassmorphic design systems across global enterprise modules.</li>
                          <li>Reduced deployment latency by 45% through predictive buffer mapping.</li>
                        </ul>
                      </div>
                   </div>
                </div>
              </section>

              <section className="resume-section-luxe">
                <h2>Scholastic Integrity</h2>
                <div className="edu-item-luxe">
                   <h3>M.S. in Neural Computation</h3>
                   <p>Stanford University • High Honors</p>
                </div>
              </section>
            </main>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CandidateResumeModal;
