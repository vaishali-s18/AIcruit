import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import UploadResume from './pages/UploadResume';
import Dashboard from './pages/Dashboard';
import ResumeScan from './pages/ResumeScan';
import Recommendations from './pages/Recommendations';
import InterviewSchedule from './pages/InterviewSchedule';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SkillAssessment from './pages/SkillAssessment';
import Notifications from './pages/Notifications';
import ExecutiveDashboard from './pages/executive/ExecutiveDashboard';
import ExecutiveJobs from './pages/executive/ExecutiveJobs';
import ExecutiveCandidates from './pages/executive/ExecutiveCandidates';
import ExecutiveAnalytics from './pages/executive/ExecutiveAnalytics';
import ExecutiveSettings from './pages/executive/ExecutiveSettings';
import ExecutiveLayout from './components/layouts/ExecutiveLayout';
import ChatBot from './components/ChatBot';
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className={`app-container ${isAuthPage ? 'auth-mode-active' : ''}`}>
      {!location.pathname.startsWith('/executive') && <Navbar isAuthPage={isAuthPage} />}
      <AuthModal />
      <main className="main-content">
          <Routes>
            {/* Public Access Routes - Now only landing and Auth */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Platform Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/upload-resume" element={<UploadResume />} />
              <Route path="/resume-scan" element={<ResumeScan />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/interview-schedule" element={<InterviewSchedule />} />
              <Route path="/skill-assessment" element={<SkillAssessment />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Executive (Recruiter) Routes - Nested in ExecutiveLayout */}
              <Route path="/executive" element={<ExecutiveLayout />}>
                <Route path="dashboard" element={<ExecutiveDashboard />} />
                <Route path="jobs" element={<ExecutiveJobs />} />
                <Route path="candidates" element={<ExecutiveCandidates />} />
                <Route path="candidates/:jobId" element={<ExecutiveCandidates />} />
                <Route path="analytics" element={<ExecutiveAnalytics />} />
                <Route path="settings" element={<ExecutiveSettings />} />
              </Route>
            </Route>
          </Routes>
        </main>
        {!isAuthPage && !location.pathname.startsWith('/executive') && <ChatBot />}
        {!isAuthPage && !location.pathname.startsWith('/executive') && <Footer />}
      </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;