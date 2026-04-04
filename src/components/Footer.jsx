import './Footer.css';

const Icons = {
  LinkedIn: () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>),
  Twitter: () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.464-2.464l6.768-6.768"></path></svg>),
  GitHub: () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>)
};

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>AIcruit</h3>
          <p>The next generation of recruitment. Connect with elite opportunities driven by frictionless, deterministic matching algorithms.</p>
        </div>
        <div className="footer-section">
          <h4>Platform</h4>
          <ul>
            <li><a href="/jobs">Explore Jobs</a></li>
            <li><a href="/skill-assessment">Assessments</a></li>
            <li><a href="/recommendations">AI Matching</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="/dashboard">User Dashboard</a></li>
            <li><a href="/notifications">Alerts & Status</a></li>
            <li><a href="/upload-resume">Upload Vector</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Social Trajectory</h4>
          <div className="social-links">
            <a href="#" aria-label="LinkedIn"><Icons.LinkedIn /></a>
            <a href="#" aria-label="Twitter"><Icons.Twitter /></a>
            <a href="#" aria-label="GitHub"><Icons.GitHub /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 AIcruit. Optimized for the future of work.</p>
      </div>
    </footer>
  );
}

export default Footer;
