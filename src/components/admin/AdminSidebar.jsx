import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Users,
  UserCheck,
  CreditCard,
  Star,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import './AdminSidebar.css';

export default function AdminSidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  const { currentUser, properties, conciergeRequests, maintenanceTickets, notifications, logout } = useApp();
  const { currentAdminRoleKey, activeRoleConfig, paymentTransactions } = useAdmin();
  const navigate = useNavigate();

  // Action badge counts
  const pendingApprovalsCount = properties.filter((p) => p.status === 'pending_approval').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const failedPaymentsCount = paymentTransactions.filter((t) => t.status === 'failed' || t.status === 'disputed').length;

  const navSections = [
    {
      title: 'OPERATIONS & CORE',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        {
          label: 'Properties',
          path: '/admin/properties',
          icon: Home,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
          badgeVariant: 'urgent'
        }
      ]
    },
    {
      title: 'PEOPLE & FINANCE',
      items: [
        { label: 'Owner Directory', path: '/admin/owners', icon: Users },
        { label: 'Staff & Team', path: '/admin/staff', icon: UserCheck },
        {
          label: 'Payments & Ledger',
          path: '/admin/payments',
          icon: CreditCard,
          badge: failedPaymentsCount > 0 ? failedPaymentsCount : null,
          badgeVariant: 'urgent'
        },
        { label: 'Review Moderation', path: '/admin/reviews', icon: Star }
      ]
    },
    {
      title: 'INTELLIGENCE & SYSTEM',
      items: [
        {
          label: 'Communications',
          path: '/admin/communications',
          icon: Bell,
          badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
          badgeVariant: 'info'
        },
        { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
        { label: 'Platform Settings', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const handleLinkClick = () => {
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="admin-sidebar-header">
        <Link to="/admin/dashboard" className="admin-brand-link" onClick={handleLinkClick}>
          <div className="admin-brand-icon">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <rect width="32" height="32" rx="8" fill="#ED7014" />
              <path d="M16 7 C10 14 9 21 16 26 C23 21 22 14 16 7 Z" fill="#FFFFFF" />
              <path d="M16 11 L16 23" stroke="#ED7014" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="admin-brand-text">
              <span className="brand-name">StayEase</span>
              <span className="brand-badge">ADMIN CONTROL</span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          className="admin-collapse-toggle"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* User profile card (Above navigation, matching other portals) */}
      <Link
        to="/admin/profile"
        className="admin-user-card"
        title={`View Profile - ${currentUser.name} (${activeRoleConfig.name})`}
        onClick={handleLinkClick}
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="admin-user-avatar"
        />
        {!isCollapsed && (
          <div className="admin-user-meta">
            <span className="admin-user-name">{currentUser.name}</span>
            <span className="admin-role-tag">{activeRoleConfig.name}</span>
          </div>
        )}
      </Link>

      {/* Nav List */}
      <div className="admin-sidebar-scroll">
        {navSections.map((section) => (
          <div key={section.title} className="admin-nav-group">
            {!isCollapsed && <span className="nav-group-title">{section.title}</span>}
            {isCollapsed && <div className="nav-group-divider" />}

            <div className="nav-group-items">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive ? 'active' : ''}`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="nav-item-icon" />
                    {!isCollapsed && <span className="nav-item-label">{item.label}</span>}

                    {item.badge && !isCollapsed && (
                      <span className={`nav-item-badge badge-${item.badgeVariant || 'default'}`}>
                        {item.badge}
                      </span>
                    )}

                    {item.badge && isCollapsed && (
                      <span className={`nav-item-dot-badge badge-${item.badgeVariant || 'default'}`} />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-logout-button"
          onClick={() => {
            logout();
            navigate('/');
          }}
          title="Sign out of StayEase Admin"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
