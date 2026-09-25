import React from 'react';
import { User, Home, Wrench, ShieldCheck, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './RoleSwitcher.css';

export default function RoleSwitcher() {
  const { currentRole, switchRole, currentUser, stats, resetDemoData } = useApp();

  const roles = [
    {
      id: 'guest',
      label: 'Guest',
      
      icon: User,
      badge: stats.upcomingStays > 0 ? `${stats.upcomingStays} Stay` : null
    },
    {
      id: 'owner',
      label: 'Owner',
      
      icon: Home,
      badge: stats.ownerPendingRequests > 0 ? `${stats.ownerPendingRequests} New` : null
    },
    {
      id: 'provider',
      label: 'Provider',
      
      subtitle: 'Coastal Services',
      icon: Wrench,
      badge: stats.providerActiveJobs > 0 ? `${stats.providerActiveJobs} Jobs` : null
    },
    {
      id: 'admin',
      label: 'Admin',
      
      icon: ShieldCheck,
      badge: stats.adminPendingApprovals > 0 ? `${stats.adminPendingApprovals}` : null
    }
  ];

  return (
    <div className="role-switcher-banner">
      <div className="role-switcher-container">
        <div className="role-switcher-left">
          <span className="role-switcher-tag">Prototype Simulation</span>
          <span className="role-switcher-desc">Switch roles to experience live cross-role workflow:</span>
        </div>

        <div className="role-switcher-buttons">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                className={`role-btn ${isActive ? 'active' : ''}`}
                onClick={() => switchRole(role.id)}
                title={`Switch to ${role.label}: ${role.name}`}
              >
                <Icon size={14} />
                <span className="role-btn-title">{role.label}</span>
                <span className="role-btn-name">({role.name.split(' ')[0]})</span>
                {role.badge && <span className="role-pill-badge">{role.badge}</span>}
              </button>
            );
          })}
        </div>

        <div className="role-switcher-right">
          <button
            type="button"
            className="role-reset-btn"
            onClick={resetDemoData}
            title="Reset prototype state to initial demo data"
          >
            <RefreshCw size={13} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
