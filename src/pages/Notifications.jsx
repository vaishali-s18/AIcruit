import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../services/auth";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    
    // Simulate Notification Fetch
    setTimeout(() => {
      const data = [
        { id: 1, type: "match", title: "Job Match Found", message: "Senior DevOps role aligns with your profile and core skills.", jobId: 1, timestamp: new Date(Date.now() - 3600000), read: false, icon: "🎯", color: "#0ea5e9", match: 95 },
        { id: 2, type: "interview", title: "Interview Scheduled", message: "Tech Corp has accepted your application. An interview has been scheduled.", timestamp: new Date(Date.now() - 72000000), read: false, icon: "📅", color: "#8b5cf6" },
        { id: 3, type: "system", title: "Profile Update", message: "Security parameters updated. New skill assessment tests are now available.", timestamp: new Date(Date.now() - 172800000), read: false, icon: "🛡️", color: "#0d9488" },
        { id: 4, type: "match", title: "Profile Visibility", message: "Your profile visibility has increased in the Lead Engineering sector.", jobId: "rec", timestamp: new Date(Date.now() - 259200000), read: true, icon: "📈", color: "#10b981", match: 88 }
      ];
      setNotifications(data);
      setReadNotifications(data.filter(n => n.read).map(n => n.id));
      setIsLoading(false);
    }, 1000);
  }, [user, navigate]);

  const markAsRead = (id) => {
    setReadNotifications([...readNotifications, id]);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(allIds);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteIndex = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id)).length;

  const filtered = activeFilter === "unread" 
    ? notifications.filter(n => !readNotifications.includes(n.id))
    : activeFilter === "read" 
    ? notifications.filter(n => readNotifications.includes(n.id))
    : notifications;

  return (
    <div className="notifications-page-professional">
      <div className="activity-container">
        <header className="activity-header-clean">
           <div className="activity-breadcrumbs">
              <span className="crumb">Platform</span> <span className="sep">/</span> <span className="active">Notifications</span>
           </div>
           
           <div className="header-info-row">
              <div className="title-block">
                 <h1>Recent <span className="highlight-color">Activity</span></h1>
                 <p className="subtitle">Detailed history of your application status and job matches.</p>
              </div>
              
              <div className="activity-stats-board glass-panel">
                 <div className="activity-stat-node">
                    <span className="label">Total Alerts</span>
                    <span className="value">{notifications.length}</span>
                 </div>
                 <div className="activity-stat-divider"></div>
                 <div className="activity-stat-node">
                    <span className="label">Unread</span>
                    <span className="value highlight">{unreadCount}</span>
                 </div>
                 <div className="activity-stat-divider"></div>
                 <button className="mark-all-btn-link" onClick={markAllAsRead}>Mark All as Read</button>
              </div>
           </div>

           <div className="activity-tabs-row">
              {["all", "unread", "read"].map(f => (
                <button 
                  key={f}
                  className={`activity-tab-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f === 'all' ? 'All Activity' : f === 'unread' ? 'Unread Only' : 'Past Archive'}
                </button>
              ))}
           </div>
        </header>

        <main className="activity-feed-content">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="activity-loader">
                 <div className="activity-spinner"></div>
                 <p>Fetching your activity feed...</p>
              </div>
            ) : filtered.length > 0 ? (
                <div className="activity-list-container">
                  {filtered.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      className={`activity-item-card glass-panel ${readNotifications.includes(item.id) ? 'status-read' : 'status-unread'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="item-icon-box" style={{ background: `${item.color}15`, color: item.color }}>
                         <span className="icon-main">{item.icon}</span>
                      </div>

                      <div className="item-content-payload">
                         <div className="payload-top-row">
                            <div className="payload-title-group">
                               <h3>{item.title}</h3>
                               {item.match && (
                                 <span className="match-score-badge">
                                    {item.match}% Match
                                 </span>
                               )}
                            </div>
                            <span className="payload-meta-time">{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                         <p className="item-message-text">{item.message}</p>
                         
                         <div className="item-action-footer">
                            {item.jobId && (
                              <Link to={item.jobId === 'rec' ? '/recommendations' : `/job/${item.jobId}`} className="view-detail-btn-clean">View Details →</Link>
                            )}
                            {!readNotifications.includes(item.id) && (
                              <button className="mark-read-btn-minimal" onClick={() => markAsRead(item.id)}>Mark as Read</button>
                            )}
                            <button className="delete-item-btn-minimal" onClick={() => deleteIndex(item.id)}>🗑️</button>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            ) : (
               <div className="empty-activity-state">
                  <div className="empty-icon-box">📡</div>
                  <h3>No New Activity</h3>
                  <p>Your notification history is currently up to date.</p>
               </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Notifications;