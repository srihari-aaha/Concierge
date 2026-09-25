import React from 'react';
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
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../common/Badge';
import './DashboardSidebar.css';

export default function DashboardSidebar() {
  const { currentRole, currentUser, stats, logout } = useApp();
  const navigate = useNavigate();

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
    { label: 'Platform Metrics', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Property Approvals', path: '/admin/properties', icon: Home, badge: stats.adminPendingApprovals, badgeVariant: 'urgent' },
    { label: 'All Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Concierge Operations', path: '/admin/concierge', icon: Sparkles },
    { label: 'Provider Network', path: '/admin/providers', icon: Users },
    { label: 'Maintenance Log', path: '/admin/maintenance', icon: Wrench },
    { label: 'System Reports', path: '/admin/reports', icon: ShieldCheck },
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
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand-wrapper">
        <Link to="/" className="sidebar-brand">
          <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
            <rect width="32" height="32" rx="8" fill="#ED7014" />
            <path d="M16 7 C10 14 9 21 16 26 C23 21 22 14 16 7 Z" fill="#FFFFFF" />
            <path d="M16 11 L16 23" stroke="#ED7014" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div className="sidebar-brand-text">
            <span className="sidebar-title">StayEase</span>
            <span className="sidebar-portal-tag">{currentRole.toUpperCase()} PORTAL</span>
          </div>
        </Link>
      </div>

      {/* User profile card */}
      <Link to={profilePath} className="sidebar-user-card" title="View Profile">
        <img src={currentUser.avatar} alt={currentUser.name} className="sidebar-user-avatar" />
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{currentUser.name}</div>
          <div className="sidebar-user-role">{currentUser.city || currentUser.company || 'India'}</div>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">MAIN NAVIGATION</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} className="sidebar-icon" />
              <span className="sidebar-link-text">{item.label}</span>
              {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                <Badge
                  variant={item.badgeVariant || 'sage'}
                  size="sm"
                  className="sidebar-badge"
                >
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom footer: back link + logout */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout-btn"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogOut size={15} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
