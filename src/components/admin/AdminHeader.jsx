import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import './AdminHeader.css';

export default function AdminHeader({ onOpenSearch, onToggleMobileNav }) {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="admin-header">
      {/* Left: Mobile trigger & Search trigger */}
      <div className="admin-header-left">
        {onToggleMobileNav && (
          <button
            type="button"
            className="admin-mobile-menu-btn"
            onClick={onToggleMobileNav}
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Global Search Input Button */}
        <button
          type="button"
          className="admin-global-search-btn"
          onClick={onOpenSearch}
          title="Search anything (Ctrl + K)"
        >
          <Search size={16} className="search-btn-icon" />
          <span className="search-btn-text">Search properties, guests, reservations, requests...</span>
          <kbd className="search-kbd-hint">Ctrl K</kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="admin-header-right">


        {/* Notifications Bell */}
        <div className="header-dropdown-wrap">
          <button
            type="button"
            className="admin-header-icon-btn"
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowUserMenu(false);
            }}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="header-notif-pill">{unreadCount}</span>}
          </button>

          {showNotifs && (
            <div className="admin-menu-dropdown animate-fade-in notif-dropdown-panel">
              <div className="notif-dropdown-header">
                <div>
                  <span className="notif-box-title">System Notifications</span>
                  <span className="notif-box-subtitle">{unreadCount} unread updates</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notif-mark-read-all"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-items-scroll">
                {notifications.length === 0 ? (
                  <div className="notif-empty-box">No new operational alerts.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-entry ${!n.read ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(n.id)}
                    >
                      <div className="notif-entry-top">
                        <span className="notif-entry-title">{n.title}</span>
                        <span className="notif-entry-time">{n.time}</span>
                      </div>
                      <p className="notif-entry-msg">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <Link
                to="/admin/communications"
                className="notif-dropdown-footer-link"
                onClick={() => setShowNotifs(false)}
              >
                Open Communications Center & Broadcasts →
              </Link>
            </div>
          )}
        </div>

        {/* Help / Guide */}
        <button
          type="button"
          className="admin-header-icon-btn"
          onClick={() => setShowHelpModal(true)}
          title="Admin Operational Guide & Hotkeys"
          aria-label="Help Guide"
        >
          <HelpCircle size={18} />
        </button>

        {/* User Profile (Static display across logins) */}
        <div className="admin-avatar-trigger admin-avatar-static" aria-disabled="true">
          <img src={currentUser.avatar} alt={currentUser.name} className="admin-header-avatar" />
          <span className="admin-header-name">{currentUser.name.split(' ')[0]}</span>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="help-modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="help-modal-card animate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h3 className="help-modal-title">StayEase Admin Operations Guide</h3>
              <button
                type="button"
                className="help-close-btn"
                onClick={() => setShowHelpModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="help-modal-body">
              <div className="help-section">
                <h4>Quick Hotkeys</h4>
                <div className="help-hotkey-row">
                  <kbd>Ctrl + K</kbd>
                  <span>Open Global Search across properties, reservations, guests, and staff</span>
                </div>
                <div className="help-hotkey-row">
                  <kbd>Esc</kbd>
                  <span>Close any active drawer or modal dialog</span>
                </div>
              </div>

              <div className="help-section">
                <h4>Core Workflows</h4>
                <ul className="help-list">
                  <li><strong>Properties:</strong> Approve newly submitted villas, edit amenities, manage seasonal rates, or suspend listings.</li>
                  <li><strong>Reservations:</strong> Inspect active stays, check guests in/out, modify party details, or process policy refunds.</li>
                  <li><strong>Concierge Dispatch:</strong> Assign local providers to airport transfers, in-villa chefs, or escalate delayed requests.</li>
                  <li><strong>Operations:</strong> Monitor room turnover deadlines, assign housekeeping staff, and track emergency repairs.</li>
                  <li><strong>RBAC Simulator:</strong> Use the top-bar role selector to test permissions for Super Admin, Finance, Concierge, or Support.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
