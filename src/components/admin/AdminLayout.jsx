import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import GlobalSearchModal from './GlobalSearchModal';
import './AdminLayout.css';

function AdminLayoutInner({ children, noPadding = false }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('stayease_admin_sidebar_collapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('stayease_admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="admin-layout-root">
      {/* Desktop Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="admin-mobile-overlay animate-fade-simple"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="admin-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar
              isCollapsed={false}
              isMobileOpen={true}
              onCloseMobile={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="admin-layout-main">
        <AdminHeader
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileNav={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className={`admin-content-area ${noPadding ? 'no-padding' : ''}`}>
          {children}
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default function AdminLayout({ children, noPadding = false }) {
  return (
    <AdminLayoutInner noPadding={noPadding}>
      {children}
    </AdminLayoutInner>
  );
}
