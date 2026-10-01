import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  Palmtree,
  Sparkles,
  ClipboardList,
  Wrench,
  MessageSquare,
  Bell,
  Home,
  Users,
  DollarSign,
  ShieldCheck,
  ArrowLeft,
  Briefcase,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../common/Badge';
import './DashboardSidebar.css';

export default function DashboardSidebar({
  isCollapsed: controlledCollapsed,
  onToggleCollapse: controlledToggle,
  isMobileOpen = false,
  onCloseMobile
}) {
  const { currentRole, currentUser, stats, logout } = useApp();
  const navigate = useNavigate();

  // Handle internal state if not controlled by parent layout
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    return localStorage.getItem('stayease_dashboard_sidebar_collapsed') === 'true';
  });

  const isCollapsed = isMobileOpen
    ? false
    : controlledCollapsed !== undefined
    ? controlledCollapsed
    : internalCollapsed;

  const handleToggleCollapse = () => {
    if (controlledToggle) {
      controlledToggle();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem('stayease_dashboard_sidebar_collapsed', String(next));
        return next;
      });
    }
  };

  const handleLinkClick = () => {
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  };

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

  const guestNav = [
    { label: 'Overview', path: '/guest/dashboard', icon: LayoutDashboard },
    { label: 'My Current Stay', path: '/guest/my-stay', icon: Palmtree },
    { label: 'My Bookings', path: '/guest/bookings', icon: CalendarCheck },
    { label: 'Concierge Menu', path: '/concierge', icon: Sparkles },
    { label: 'Concierge Requests', path: '/guest/requests', icon: ClipboardList, badge: stats.guestActiveRequests },
    { label: 'Report Maintenance', path: '/guest/maintenance', icon: Wrench },
    { label: 'Messages', path: '/guest/messages', icon: MessageSquare },
    { label: 'Profile', path: '/guest/profile', icon: User },
    { label: 'Explore Stays', path: '/explore', icon: Compass },
  ];

  const ownerNav = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Properties', path: '/owner/properties', icon: Home },
    { label: 'Reservations', path: '/owner/reservations', icon: CalendarCheck, badge: stats.upcomingStays },
    { label: 'Guest Concierge', path: '/owner/concierge', icon: Sparkles, badge: stats.ownerPendingRequests, badgeVariant: 'urgent' },
    { label: 'Maintenance', path: '/owner/maintenance', icon: Wrench, badge: stats.ownerOpenMaintenance },
    { label: 'Service Providers', path: '/owner/providers', icon: Users },
    { label: 'Earnings & Payouts', path: '/owner/earnings', icon: DollarSign },
    { label: 'Messages', path: '/owner/messages', icon: MessageSquare },
    { label: 'Profile', path: '/owner/profile', icon: User }
  ];

  const providerNav = [
    { label: 'Active Jobs & Queue', path: '/provider/dashboard', icon: Briefcase, badge: stats.providerActiveJobs, badgeVariant: 'urgent' },
    { label: 'Weekly Schedule', path: '/provider/schedule', icon: CalendarCheck },
    { label: 'Earnings & Payouts', path: '/provider/earnings', icon: DollarSign },
    { label: 'Messages', path: '/provider/messages', icon: MessageSquare },
    { label: 'Profile', path: '/provider/profile', icon: User }
  ];

  const adminNav = [
    { label: 'Operations Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Properties', path: '/admin/properties', icon: Home, badge: stats.adminPendingApprovals, badgeVariant: 'urgent' },
    { label: 'Owner Directory', path: '/admin/owners', icon: Users },
    { label: 'Staff Roster', path: '/admin/staff', icon: Briefcase },
    { label: 'Platform Reports', path: '/admin/reports', icon: ShieldCheck },
    { label: 'Profile', path: '/admin/profile', icon: User }
  ];

  const getNavItems = () => {
    switch (currentRole) {
      case 'owner':
        return ownerNav;
      case 'provider':
        return providerNav;
      case 'admin':
        return adminNav;
      default:
        return guestNav;
    }
  };

  const navItems = getNavItems();

  return (
    <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand-wrapper">
        <Link to="/" className="sidebar-brand" onClick={handleLinkClick}>
          <div className="sidebar-brand-icon">
            <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
              <rect width="32" height="32" rx="8" fill="#ED7014" />
              <path d="M16 7 C10 14 9 21 16 26 C23 21 22 14 16 7 Z" fill="#FFFFFF" />
              <path d="M16 11 L16 23" stroke="#ED7014" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="sidebar-brand-text">
              <span className="sidebar-title">StayEase</span>
              <span className="sidebar-portal-tag">{currentRole.toUpperCase()} PORTAL</span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          className="dashboard-collapse-toggle"
          onClick={handleToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* User profile card (Static display) */}
      {!isCollapsed && (
        <div
          className="sidebar-user-card"
          aria-disabled="true"
        >
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser.name}</div>
            <div className="sidebar-user-role">{currentUser.city || currentUser.company || 'India'}</div>
          </div>
        </div>
      )}

      {/* Scrollable Navigation Area */}
      <div className="sidebar-nav-scroll">
        <nav className="sidebar-nav">
          {!isCollapsed && <div className="sidebar-nav-label">MAIN NAVIGATION</div>}
          {isCollapsed && <div className="sidebar-nav-divider" />}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} className="sidebar-icon" />
                {!isCollapsed && <span className="sidebar-link-text">{item.label}</span>}
                {item.badge !== undefined && item.badge !== null && item.badge > 0 && !isCollapsed && (
                  <Badge
                    variant={item.badgeVariant || 'sage'}
                    size="sm"
                    className="sidebar-badge"
                  >
                    {item.badge}
                  </Badge>
                )}
                {item.badge !== undefined && item.badge !== null && item.badge > 0 && isCollapsed && (
                  <span className={`sidebar-dot-badge badge-${item.badgeVariant || 'sage'}`} />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom footer: logout */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout-btn"
          onClick={() => {
            logout();
            navigate('/');
          }}
          title={isCollapsed ? 'Log Out' : undefined}
          aria-label="Log Out"
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
