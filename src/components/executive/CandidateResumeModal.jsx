import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CandidateProfileHeader from './CandidateProfileHeader';
import './CandidateResumeModal.css';

const CandidateResumeModal = ({ candidate, isOpen, onClose, onStatusChange }) => {
  const resumeRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Temporarily hide the close button during capture
      const closeBtn = document.querySelector('.close-resume-btn');
      if (closeBtn) closeBtn.style.display = 'none';

      // Capture the styled DOM node as an image
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // Higher scale for better resolution
        useCORS: true, 
        backgroundColor: '#020617', // Match the dark theme background
      });

      // Restore the close button
      if (closeBtn) closeBtn.style.display = 'block';

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions (A4 format)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Trigger automatic direct download
      pdf.save(`${candidate.name.replace(/\s+/g, '_')}_CV.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="resume-modal-overlay" onClick={onClose}>
        <motion.div 
          className="resume-modal-content glass-card-luxe"
          ref={resumeRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-resume-btn" onClick={onClose}>✕</button>
          
          <CandidateProfileHeader 
            candidate={candidate} 
            onDownload={handleDownloadPDF} 
            isDownloading={isGeneratingPDF} 
          />

          <div className="resume-layout-centralized">
            <main className="resume-main-centered">
              {/* Quick Info Ribbon */}
              <div className="resume-ribbon-centered">
                <div className="ribbon-item">
                  <span className="label">Match Score</span>
                  <span className="value highlight">{candidate.matchScore}%</span>
                </div>
                <div className="ribbon-item">
                  <span className="label">Location</span>
                  <span className="value">{candidate.location || 'Remote'}</span>
                </div>
                <div className="ribbon-item">
                  <span className="label">Contact</span>
                  <span className="value">📧 {candidate.name.toLowerCase().replace(' ', '.')}@talent.hub</span>
                </div>
              </div>

              <section className="resume-section-centered">
                <div className="ai-summary-box-luxe">
                  <div className="ai-badge-luxe">AI STRATEGIC SUMMARY</div>
                  <p>{candidate.summary}</p>
                </div>
              </section>

              <section className="resume-section-centered">
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

              <section className="resume-section-centered">
                <h2>Core Expertise</h2>
                <div className="skill-cloud-centralized">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="skill-tag-luxe active">{skill}</span>
                  ))}
                </div>
              </section>

              <section className="resume-section-centered">
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
