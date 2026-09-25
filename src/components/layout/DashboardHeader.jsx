import React, { useState } from 'react';
import { Bell, Check, Sparkles, User, ExternalLink, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Badge from '../common/Badge';
import './DashboardHeader.css';

export default function DashboardHeader({ title, subtitle, onToggleMobileNav }) {
  const { currentRole, currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter notifications for this user / role
  const userNotifs = notifications.filter(
    (n) => n.userId === currentUser.id || n.role === currentRole
  );
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  const getProfilePath = () => {
    switch (currentRole) {
      case 'owner':
        return '/owner/profile';
      case 'provider':
        return '/provider/profile';
      case 'admin':
        return '/admin/profile';
      default:
        return '/guest/profile';
    }
  };

  const profilePath = getProfilePath();

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        {onToggleMobileNav && (
          <button
            type="button"
            className="mobile-header-menu-btn"
            onClick={onToggleMobileNav}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1 className="dashboard-header-title">{title || `Welcome, ${(currentUser?.name || 'User').split(' ')[0]}`}</h1>
          {subtitle && <p className="dashboard-header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="dashboard-header-right">
        {/* Active stay badge for Guest */}
        {currentRole === 'guest' && (
          <Link to="/guest/my-stay" className="header-stay-pill">
            <span className="stay-pulse-dot" />
            <span className="stay-pill-text">Upcoming: <strong>Palm Grove Villa</strong></span>
          </Link>
        )}

        {/* Notifications Bell */}
        <div className="header-notif-wrapper">
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="notif-dropdown animate-fade-in">
              <div className="notif-header">
                <div className="notif-header-title">
                  <span>Notifications</span>
                  {unreadCount > 0 && <Badge variant="sage" size="sm">{unreadCount} unread</Badge>}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notif-mark-all"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {userNotifs.length === 0 ? (
                  <div className="notif-empty">No notifications at the moment.</div>
                ) : (
                  userNotifs.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(n.id)}
                    >
                      <div className="notif-item-header">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-time">{n.time}</span>
                      </div>
                      <p className="notif-item-message">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        <Link to={profilePath} className="header-profile" title="View Profile">
          <img src={currentUser.avatar} alt={currentUser.name} className="header-avatar" />
          <div className="header-profile-text">
            <span className="header-user-name">{currentUser.name}</span>
            <span className="header-user-role">{currentRole.toUpperCase()}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
