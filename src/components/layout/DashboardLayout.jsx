import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import MobileBottomNav from './MobileBottomNav';
import './DashboardLayout.css';

export default function DashboardLayout({ title, subtitle, children, noPadding }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Sidebar for desktop */}
      <DashboardSidebar />

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
            <DashboardSidebar />
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
