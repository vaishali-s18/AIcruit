// InterviewSchedule.jsx - Professional Scheduling Center
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { jobs } from '../data/jobs';
import './InterviewSchedule.css';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { 
    y: -4,
    transition: { duration: 0.2 }
  }
};

function InterviewSchedule() {
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [interviewType, setInterviewType] = useState('phone');
  const [notes, setNotes] = useState('');
  const [scheduled, setScheduled] = useState(false);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  const getMinDate = () => {
    return format(addDays(new Date(), 1), 'yyyy-MM-dd');
  };

  const getMaxDate = () => {
    return format(addDays(new Date(), 60), 'yyyy-MM-dd');
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!selectedJob || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const jobData = jobs.find(j => j.id === selectedJob);
    const interview = {
      id: Date.now(),
      jobId: selectedJob,
      jobTitle: jobData.title,
      company: jobData.company,
      companyLogo: jobData.logo,
      date: selectedDate,
      time: selectedTime,
      type: interviewType,
      notes: notes,
      status: 'scheduled',
      scheduledAt: new Date().toISOString()
    };

    setScheduledInterviews([interview, ...scheduledInterviews]);
    setScheduled(true);
    setIsSubmitting(false);

    // Reset form
    setTimeout(() => {
      setSelectedJob('');
      setSelectedDate('');
      setSelectedTime('');
      setInterviewType('phone');
      setNotes('');
      setScheduled(false);
    }, 20000);
  };

  const cancelInterview = (id) => {
    setScheduledInterviews(scheduledInterviews.filter(i => i.id !== id));
  };

  const getDateDisplay = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return format(date, 'EEE, MMM d, yyyy');
  };

  const getTimeRemaining = (dateStr, timeStr) => {
    const interviewDateTime = new Date(`${dateStr} ${timeStr}`);
    const now = new Date();
    const diffHours = Math.floor((interviewDateTime - now) / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Past';
    if (diffHours < 24) return `${diffHours} hours remaining`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days remaining`;
  };

  const getInterviewTypeIcon = (type) => {
    switch(type) {
      case 'phone': return '📞';
      case 'video': return '🎥';
      case 'in-person': return '🏢';
      default: return '📅';
    }
  };

  const getInterviewTypeColor = (type) => {
    switch(type) {
      case 'phone': return '#10b981';
      case 'video': return '#0ea5e9';
      case 'in-person': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="interview-schedule-professional">
      <div className="scheduler-container">
        {/* Professional Header */}
        <header className="scheduler-header-clean">
           <div className="scheduler-breadcrumbs">
              <span className="crumb">Platform</span> <span className="sep">/</span> <span className="active">Interview Scheduler</span>
           </div>
           
           <div className="header-info-row">
              <div className="title-block">
                 <h1>Interview <span className="highlight-color">Scheduler</span></h1>
                 <p className="subtitle">Coordinate your upcoming interviews and technical discussions with recruiters.</p>
              </div>
              
              <div className="scheduler-stats-board glass-panel">
                 <div className="schedule-stat-node">
                    <span className="label">Scheduled</span>
                    <span className="value">{scheduledInterviews.length}</span>
                 </div>
                 <div className="schedule-stat-divider"></div>
                 <div className="schedule-stat-node">
                    <span className="label">Next 7 Days</span>
                    <span className="value highlight">
                      {scheduledInterviews.filter(i => {
                        const diff = (new Date(i.date) - new Date()) / (1000 * 60 * 60 * 24);
                        return diff >= 0 && diff <= 7;
                      }).length}
                    </span>
                 </div>
              </div>
           </div>
        </header>

        <motion.div 
          className="scheduler-main-grid"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Scheduling Form Card */}
          <motion.div 
            className="scheduler-form-panel glass-panel"
            variants={cardVariants}
          >
            <div className="form-header-clean">
              <h2>Schedule New Interview</h2>
              <p className="form-subtitle">Choose your preferred time slot for the selected position.</p>
            </div>
            
            <AnimatePresence>
              {scheduled && (
                <motion.div 
                  className="success-message-banner"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="success-icon">✅</span>
                  Successfully scheduled! Your recruiter has been notified.
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSchedule} className="scheduler-form">
              <div className="form-group full-width">
                <label className="input-label-clean">Select Job Position *</label>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  required
                  className="scheduler-select"
                >
                  <option value="">-- Choose a job position --</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} at {job.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="input-label-clean">Interview Date *</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                    className="scheduler-input"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label-clean">Preferred Time *</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="scheduler-select"
                  >
                    <option value="">-- Select time slot --</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="input-label-clean">Interview Type *</label>
                <div className="interview-type-grid">
                  {[
                    { value: 'phone', label: 'Phone', icon: '📞', color: '#10b981' },
                    { value: 'video', label: 'Video', icon: '🎥', color: '#0ea5e9' },
                    { value: 'in-person', label: 'In-Person', icon: '🏢', color: '#f59e0b' }
                  ].map(type => (
                    <label
                      key={type.value}
                      className={`type-option-card ${interviewType === type.value ? 'selected' : ''}`}
                      style={{
                        '--accent-color': type.color
                      }}
                    >
                      <input
                        type="radio"
                        value={type.value}
                        checked={interviewType === type.value}
                        onChange={(e) => setInterviewType(e.target.value)}
                      />
                      <span className="type-icon">{type.icon}</span>
                      <span className="type-label">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label className="input-label-clean">
                   Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention preparation requirements, links, or specific topics..."
                  rows="3"
                  className="scheduler-textarea"
                />
              </div>

              <button
                type="submit"
                className="btn-schedule-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
              </button>
            </form>
          </motion.div>

          {/* Scheduled Interviews List */}
          <motion.div 
            className="scheduled-interviews-pane"
            variants={cardVariants}
          >
            <div className="pane-header-clean">
              <h2>Upcoming Interviews</h2>
              {scheduledInterviews.length > 0 && (
                <span className="count-badge-minimal">
                  {scheduledInterviews.length} Total
                </span>
              )}
            </div>

            <div className="interviews-activity-list">
              <AnimatePresence mode="popLayout">
                {scheduledInterviews.length === 0 ? (
                  <motion.div 
                    className="empty-schedule-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="empty-icon-box">📅</div>
                    <p>No interviews scheduled yet</p>
                    <span>Use the form on the left to coordinate your first discussion.</span>
                  </motion.div>
                ) : (
                  scheduledInterviews.map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      className="interview-item-card glass-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="card-top-row">
                        <div className="job-info">
                          <h3>{interview.jobTitle}</h3>
                          <span className="company-text">{interview.company}</span>
                        </div>
                        <span 
                          className="type-badge-clean"
                          style={{
                            backgroundColor: `${getInterviewTypeColor(interview.type)}15`,
                            color: getInterviewTypeColor(interview.type)
                          }}
                        >
                          {getInterviewTypeIcon(interview.type)} {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                        </span>
                      </div>

                      <div className="card-details-grid">
                        <div className="detail-node">
                          <span className="lbl">Date</span>
                          <span className="val">{getDateDisplay(interview.date)}</span>
                        </div>
                        <div className="detail-node">
                          <span className="lbl">Time</span>
                          <span className="val">{interview.time}</span>
                        </div>
                        <div className="detail-node">
                          <span className="lbl">Remaining</span>
                          <span className="val highlight">{getTimeRemaining(interview.date, interview.time)}</span>
                        </div>
                      </div>

                      {interview.notes && (
                        <div className="card-notes-box">
                          <strong>Note:</strong> {interview.notes}
                        </div>
                      )}

                      <button
                        onClick={() => cancelInterview(interview.id)}
                        className="btn-cancel-minimal"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default InterviewSchedule;