import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
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

        {/* User Mini Profile (Static display across logins) */}
        <div className="header-profile header-profile-static" aria-disabled="true">
          <div className="header-profile-text">
            <span className="header-user-name">{currentUser.name}</span>
            <span className="header-user-role">{currentRole.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
