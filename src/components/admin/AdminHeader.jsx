import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  User,
  Settings,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import './AdminHeader.css';

export default function AdminHeader({ onOpenSearch, onToggleMobileNav }) {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead, logout } = useApp();
  const { currentAdminRoleKey, setCurrentAdminRoleKey, rbacRoles, activeRoleConfig } = useAdmin();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();

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
        {/* RBAC Role Simulator Dropdown */}
        <div className="header-dropdown-wrap">
          <button
            type="button"
            className="admin-role-badge-btn"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifs(false);
              setShowUserMenu(false);
            }}
            title="Simulate Role (RBAC)"
          >
            <ShieldCheck size={14} className="role-shield-icon" />
            <span className="role-btn-name">{activeRoleConfig.name}</span>
            <ChevronDown size={13} />
          </button>

          {showRoleMenu && (
            <div className="admin-menu-dropdown animate-fade-in role-dropdown">
              <div className="dropdown-section-title">
                <span>SIMULATE RBAC ROLE</span>
              </div>
              <div className="role-options-list">
                {rbacRoles.map((role) => (
                  <button
                    key={role.roleKey}
                    type="button"
                    className={`role-select-item ${role.roleKey === currentAdminRoleKey ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentAdminRoleKey(role.roleKey);
                      setShowRoleMenu(false);
                    }}
                  >
                    <div className="role-select-info">
                      <span className="role-title">{role.name}</span>
                      <span className="role-desc">{role.description}</span>
                    </div>
                    {role.roleKey === currentAdminRoleKey && (
                      <CheckCircle size={15} className="role-check-icon" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="header-dropdown-wrap">
          <button
            type="button"
            className="admin-header-icon-btn"
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowRoleMenu(false);
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

        {/* User Profile Dropdown */}
        <div className="header-dropdown-wrap">
          <button
            type="button"
            className="admin-avatar-trigger"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifs(false);
              setShowRoleMenu(false);
            }}
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="admin-header-avatar" />
            <span className="admin-header-name">{currentUser.name.split(' ')[0]}</span>
            <ChevronDown size={13} className="avatar-chevron" />
          </button>

          {showUserMenu && (
            <div className="admin-menu-dropdown animate-fade-in user-dropdown-panel">
              <div className="user-dropdown-meta">
                <span className="user-full-name">{currentUser.name}</span>
                <span className="user-email-text">{currentUser.email}</span>
                <span className="user-role-badge">{activeRoleConfig.name}</span>
              </div>

              <div className="user-dropdown-links">
                <Link
                  to="/admin/profile"
                  className="user-menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={15} /> My Admin Profile
                </Link>
                <Link
                  to="/admin/settings"
                  className="user-menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={15} /> System Settings
                </Link>
                <Link
                  to="/"
                  className="user-menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <ExternalLink size={15} /> View Guest Marketplace
                </Link>
              </div>

              <div className="user-dropdown-divider" />

              <button
                type="button"
                className="user-menu-item logout"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          )}
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
