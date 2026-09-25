import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  CalendarCheck,
  Palmtree,
  ClipboardList,
  MessageSquare,
  Bell,
  Star,
  Home,
  LayoutDashboard,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import './PublicNavbar.css';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentRole, currentUser, logout } = useApp();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  // Unauthenticated links
  const unauthenticatedLinks = [
    { label: 'Stays', path: '/explore' },
    { label: 'Concierge', path: '/concierge' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' }
  ];

  // Authenticated Guest links
  const guestLinks = [
    { label: 'Stays', path: '/explore' },
    { label: 'Concierge', path: '/concierge' },
    { label: 'My Stay', path: '/guest/stay' },
    { label: 'How It Works', path: '/how-it-works' }
  ];

  // Authenticated Owner links
  const ownerLinks = [
    { label: 'Dashboard', path: '/owner/dashboard' },
    { label: 'Properties', path: '/owner/properties' },
    { label: 'Reservations', path: '/owner/reservations' },
    { label: 'Concierge', path: '/owner/concierge' }
  ];

  // Authenticated Provider links
  const providerLinks = [
    { label: 'Dashboard', path: '/provider/dashboard' },
    { label: 'My Jobs', path: '/provider/jobs' },
    { label: 'Schedule', path: '/provider/schedule' },
    { label: 'Earnings', path: '/provider/earnings' }
  ];

  // Authenticated Admin links
  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Properties', path: '/admin/properties' },
    { label: 'Bookings', path: '/admin/bookings' },
    { label: 'Concierge', path: '/admin/concierge' }
  ];

  const currentNavLinks = !isAuthenticated
    ? unauthenticatedLinks
    : currentRole === 'owner'
      ? ownerLinks
      : currentRole === 'provider'
        ? providerLinks
        : currentRole === 'admin'
          ? adminLinks
          : guestLinks;

  const getDashboardPath = () => {
    switch (currentRole) {
      case 'owner':
        return '/owner/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/guest/dashboard';
    }
  };

  return (
    <header className="public-nav-header">
      <div className="container public-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
              <rect width="32" height="32" rx="8" fill="#ED7014" />
              <path d="M16 7 C10 14 9 21 16 26 C23 21 22 14 16 7 Z" fill="#FFFFFF" />
              <path d="M16 11 L16 23" stroke="#ED7014" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-title">StayEase</span>
            {isAuthenticated && currentRole !== 'guest' && (
              <span className="brand-badge">{currentRole.toUpperCase()} PORTAL</span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          {currentNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="nav-actions-cluster">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="login-link-btn">
               <span style={{color:"#ED7014"}}> Login / Register</span>
              </Link>
              {/* <Link to="/register?role=owner">
                <Button variant="outline" size="sm">
                  List Your Property
                </Button>
              </Link> */}
            </>
          ) : (
            <div className="profile-menu-container" ref={dropdownRef}>
              <button
                type="button"
                className="profile-pill-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-expanded={profileDropdownOpen}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="profile-pill-avatar"
                />
                <span className="profile-pill-name">{(currentUser?.name || 'User').split(' ')[0]}</span>
                <ChevronDown size={14} className={`chevron-icon ${profileDropdownOpen ? 'open' : ''}`} />
              </button>

              {/* Dropdown Menu (Section 53) */}
              {profileDropdownOpen && (
                <div className="profile-dropdown-menu animate-fade-in">
                  <div className="dropdown-user-header">
                    <span className="user-fullname">{currentUser.name}</span>
                    <span className="user-role-badge">{currentRole.toUpperCase()}</span>
                  </div>

                  <div className="dropdown-links-list">
                    {currentRole === 'guest' && (
                      <>
                        <Link
                          to="/guest/dashboard"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard size={15} />
                          <span>My Dashboard</span>
                        </Link>
                        <Link
                          to="/guest/bookings"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <CalendarCheck size={15} />
                          <span>My Bookings</span>
                        </Link>
                        <Link
                          to="/guest/stay"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Palmtree size={15} />
                          <span>My Stay</span>
                        </Link>
                        <Link
                          to="/guest/requests"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <ClipboardList size={15} />
                          <span>My Concierge Requests</span>
                        </Link>
                        <Link
                          to="/guest/messages"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <MessageSquare size={15} />
                          <span>Messages</span>
                        </Link>
                        <Link
                          to="/guest/reviews"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Star size={15} />
                          <span>Reviews</span>
                        </Link>
                        <Link
                          to="/guest/profile"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User size={15} />
                          <span>Profile</span>
                        </Link>
                      </>
                    )}

                    {currentRole === 'owner' && (
                      <>
                        <Link
                          to="/owner/dashboard"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard size={15} />
                          <span>Host Dashboard</span>
                        </Link>
                        <Link
                          to="/owner/properties"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Home size={15} />
                          <span>Properties</span>
                        </Link>
                        <Link
                          to="/owner/reservations"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <CalendarCheck size={15} />
                          <span>Reservations</span>
                        </Link>
                        <Link
                          to="/owner/concierge"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Sparkles size={15} />
                          <span>Concierge Requests</span>
                        </Link>
                        <Link
                          to="/owner/profile"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User size={15} />
                          <span>Profile</span>
                        </Link>
                      </>
                    )}

                    {currentRole === 'provider' && (
                      <>
                        <Link
                          to="/provider/dashboard"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Briefcase size={15} />
                          <span>My Jobs</span>
                        </Link>
                        <Link
                          to="/provider/schedule"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <CalendarCheck size={15} />
                          <span>Schedule</span>
                        </Link>
                        <Link
                          to="/provider/profile"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User size={15} />
                          <span>Profile</span>
                        </Link>
                      </>
                    )}

                    {currentRole === 'admin' && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="dropdown-item"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <ShieldCheck size={15} />
                          <span>Operations Dashboard</span>
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <div className="container mobile-drawer-content">
            <div className="mobile-drawer-links">
              <Link
                to="/"
                className="mobile-drawer-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {currentNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="mobile-drawer-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mobile-drawer-divider" />

              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="mobile-drawer-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  {/* <Link
                    to="/register?role=owner"
                    className="mobile-drawer-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List Your Property
                  </Link> */}
                </>
              ) : (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="mobile-drawer-link active-portal"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    className="mobile-drawer-link logout-item"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
