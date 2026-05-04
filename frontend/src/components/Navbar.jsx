import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { LogOut, GraduationCap, User, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markAsRead();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <GraduationCap size={28} color="#00f0ff" />
        <span>Mario School</span>
      </div>
      
      <div className="nav-links">
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <div className="notification-bell-container" onClick={toggleNotifications}>
            <Bell size={22} color={unreadCount > 0 ? "#00f0ff" : "#8b92a5"} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>

          <div className={`notification-dropdown ${showNotifications ? 'active' : ''}`}>
            <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--bg-tertiary)', fontWeight: '700' }}>
              Notifications
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif._id} className="notification-item">
                  <div className="notification-title">{notif.Title}</div>
                  <div className="notification-message">{notif.Message}</div>
                  <span className="notification-time">
                    {formatDistanceToNow(new Date(notif.CreatedAt), { addSuffix: true })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} />
          {user?.name}
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
