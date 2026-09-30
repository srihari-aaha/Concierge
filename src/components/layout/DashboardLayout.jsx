import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import MobileBottomNav from './MobileBottomNav';
import './DashboardLayout.css';

export default function DashboardLayout({ title, subtitle, children, noPadding }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('stayease_dashboard_sidebar_collapsed') === 'true';
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('stayease_dashboard_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className={`dashboard-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar for desktop */}
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Mobile drawer overlay for sidebar */}
      {mobileNavOpen && (
        <div
          className="dashboard-mobile-drawer-overlay animate-fade-simple"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            className="dashboard-mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar
              isCollapsed={false}
              isMobileOpen={true}
              onCloseMobile={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
        />
        <main className={noPadding ? 'dashboard-content-body dashboard-content-no-pad' : 'dashboard-content-body'}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
