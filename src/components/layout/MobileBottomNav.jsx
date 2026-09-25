import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Palmtree,
  Sparkles,
  ClipboardList,
  MessageSquare,
  Home,
  LayoutDashboard,
  CalendarCheck,
  Briefcase,
  Wrench
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const { currentRole, stats } = useApp();

  const guestTabs = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'My Stay', path: '/guest/my-stay', icon: Palmtree },
    { label: 'Concierge', path: '/concierge', icon: Sparkles },
    { label: 'Requests', path: '/guest/requests', icon: ClipboardList, badge: stats.guestActiveRequests },
    { label: 'Messages', path: '/guest/messages', icon: MessageSquare }
  ];

  const ownerTabs = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Properties', path: '/owner/properties', icon: Home },
    { label: 'Concierge', path: '/owner/concierge', icon: Sparkles, badge: stats.ownerPendingRequests },
    { label: 'Bookings', path: '/owner/reservations', icon: CalendarCheck },
    { label: 'Messages', path: '/owner/messages', icon: MessageSquare }
  ];

  const providerTabs = [
    { label: 'Jobs', path: '/provider/dashboard', icon: Briefcase, badge: stats.providerActiveJobs },
    { label: 'Schedule', path: '/provider/schedule', icon: CalendarCheck },
    { label: 'Messages', path: '/provider/messages', icon: MessageSquare }
  ];

  const adminTabs = [
    { label: 'Metrics', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Properties', path: '/admin/properties', icon: Home, badge: stats.adminPendingApprovals },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Concierge', path: '/admin/concierge', icon: Sparkles }
  ];

  const tabs =
    currentRole === 'owner'
      ? ownerTabs
      : currentRole === 'provider'
      ? providerTabs
      : currentRole === 'admin'
      ? adminTabs
      : guestTabs;

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) => `mobile-tab-item ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-tab-icon-wrap">
                <Icon size={19} />
                {tab.badge !== undefined && tab.badge !== null && tab.badge > 0 && (
                  <span className="mobile-tab-badge">{tab.badge}</span>
                )}
              </div>
              <span className="mobile-tab-label">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
