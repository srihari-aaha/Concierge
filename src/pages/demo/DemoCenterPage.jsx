import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  User, Home, Wrench, ShieldCheck, RefreshCw, CheckCircle2,
  ArrowRight, ExternalLink, Sparkles, Compass, AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './DemoCenterPage.css';

export default function DemoCenterPage() {
  const navigate = useNavigate();
  const { currentRole, currentUser, login, resetDemoData, showToast } = useApp();

  const handleRoleSelect = (role, path) => {
    login(role);
    if (path) {
      navigate(path);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo bookings, concierge requests, tickets, and messages to initial seed data?')) {
      resetPrototypeData();
      showToast('All demo data has been restored to factory seed state.', 'info');
    }
  };

  const personas = [
    {
      role: 'guest',

      tag: 'Bengaluru Traveler',
      desc: 'Guest with active upcoming reservation STY-2026-00124 at Palm Grove Retreat, Candolim Goa.',
      icon: User,
      badge: 'Guest Role',
      defaultPath: '/guest/dashboard',
      subLinks: [
        { label: 'My Stay (Keyless & Wi-Fi)', path: '/guest/stay' },
        { label: 'Reservations', path: '/guest/bookings' },
        { label: 'Concierge Orders', path: '/guest/requests' },
        { label: 'Maintenance Issues', path: '/guest/maintenance' }
      ]
    },
    {
      role: 'owner',
      name: 'Owner',
      tag: 'Villa Host & Investor',
      desc: 'Owner of Palm Grove Retreat (Goa) & Ocean Breeze Villa (Pondicherry). Manages bookings & providers.',
      icon: Home,
      badge: 'Host Role',
      defaultPath: '/owner/dashboard',
      subLinks: [
        { label: 'My Properties', path: '/owner/properties' },
        { label: 'Reservations', path: '/owner/reservations' },
        { label: 'Concierge Approval', path: '/owner/concierge' },
        { label: 'Provider Management', path: '/owner/providers' },
        { label: 'Financial Earnings', path: '/owner/earnings' }
      ]
    },
    {
      role: 'provider',
      name: 'Provider',
      tag: 'Coastal Mobility & Express Maintenance',
      desc: 'Verified service partner providing airport transfers, express repair, and private chef coordination.',
      icon: Wrench,
      badge: 'Partner Role',
      defaultPath: '/provider/dashboard',
      subLinks: [
        { label: 'Active Jobs & Dispatch', path: '/provider/jobs' },
        { label: 'Schedule Calendar', path: '/provider/schedule' },
        { label: 'Payouts & Earnings', path: '/provider/earnings' }
      ]
    },
    {
      role: 'admin',
      name: 'Ananya Deshmukh',
      tag: 'Platform Operations Lead',
      desc: 'Full platform oversight, provider onboarding audits, dispute settlement, and transaction telemetry.',
      icon: ShieldCheck,
      badge: 'Admin Role',
      defaultPath: '/admin/dashboard',
      subLinks: [
        { label: 'Operations Dashboard', path: '/admin/dashboard' },
        { label: 'Audit Log & Telemetry', path: '/admin/dashboard' }
      ]
    }
  ];

  const scenarios = [
    {
      num: 1,
      title: 'Guest Concierge Ordering Flow',
      steps: 'Log in as Priya → Open Concierge Marketplace → Select "Goa Airport Luxury Innova Transfer" → Confirm with mock UPI → Track live order status in My Stay.'
    },
    {
      num: 2,
      title: 'Owner Request Approval & Provider Dispatch',
      steps: 'Switch to Vikram (Owner) → Go to Concierge Operations → Review Priya\'s pending request → Approve and assign to Provider (Coastal Mobility).'
    },
    {
      num: 3,
      title: 'Service Provider Job Execution',
      steps: 'Switch to Ramesh (Provider) → Open Active Jobs → Accept assignment → Mark "In-Progress" with estimated arrival → Mark "Completed" with completion note.'
    },
    {
      num: 4,
      title: 'Guest Verified Review Submission',
      steps: 'Switch back to Priya (Guest) → Open Concierge Orders → Verify "Completed" badge → Submit 5-star rating with category feedback.'
    },
    {
      num: 5,
      title: 'Maintenance Ticket Escalation Flow',
      steps: 'Priya files AC maintenance ticket with photo → Vikram receives alert and dispatches Ramesh → Ramesh resolves on site.'
    }
  ];

  return (
    <div className="demo-page animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="demo-header">
          <div className="demo-badge-wrap">
            <span className="demo-eval-pill">EVALUATOR & DEVELOPER CONTROL</span>
          </div>
          <h1 className="demo-title">StayEase Interactive Test Suite</h1>
          <p className="demo-subtitle">
            Seamlessly test and evaluate multi-role workflows across Guest, Property Host, Service Provider, and Admin
            without altering production URLs.
          </p>

          <div className="demo-action-bar">
            <div className="demo-status">
              <span className="status-indicator active" />
              <span>Current Session: <strong>{currentUser?.name}</strong> ({currentRole.toUpperCase()})</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw size={14} />
              Reset Demo Seed Data
            </Button>
          </div>
        </div>

        {/* 4 Persona Cards */}
        <h2 className="demo-section-title">One-Click Persona Switcher</h2>
        <div className="demo-personas-grid">
          {personas.map((p) => {
            const Icon = p.icon;
            const isCurrent = currentRole === p.role;
            return (
              <div key={p.role} className={`demo-persona-card ${isCurrent ? 'active' : ''}`}>
                <div className="persona-card-header">
                  <div className="persona-icon-box">
                    <Icon size={22} />
                  </div>
                  <div className="persona-meta">
                    <h3 className="persona-name">{p.name}</h3>
                    <span className="persona-tag">{p.tag}</span>
                  </div>
                  <Badge variant={isCurrent ? 'success' : 'default'} size="sm">
                    {p.badge}
                  </Badge>
                </div>

                <p className="persona-desc">{p.desc}</p>

                <div className="persona-actions">
                  <Button
                    variant={isCurrent ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onClick={() => handleRoleSelect(p.role, p.defaultPath)}
                  >
                    {isCurrent ? 'Enter Dashboard' : `Switch to ${p.name.split(' ')[0]}`}
                    <ArrowRight size={14} />
                  </Button>
                </div>

                <div className="persona-quicklinks">
                  <span className="quicklinks-label">Quick Subpages:</span>
                  <div className="quicklinks-list">
                    {p.subLinks.map((sl, idx) => (
                      <button
                        key={idx}
                        className="sublink-btn"
                        onClick={() => handleRoleSelect(p.role, sl.path)}
                      >
                        {sl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended Walkthrough Scenarios */}
        <div className="demo-scenarios-section">
          <h2 className="demo-section-title">End-to-End Evaluation Scenarios</h2>
          <div className="scenarios-list">
            {scenarios.map((sc) => (
              <div key={sc.num} className="scenario-item">
                <div className="scenario-number">
                  <span>0{sc.num}</span>
                </div>
                <div className="scenario-content">
                  <h4 className="scenario-title">{sc.title}</h4>
                  <p className="scenario-steps">{sc.steps}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Navigation Shortcuts */}
        <div className="demo-public-shortcuts">
          <h3 className="public-shortcuts-title">Public Hospitality Pages</h3>
          <div className="public-links-grid">
            <button className="pub-btn" onClick={() => navigate('/')}>Home / Landing</button>
            <button className="pub-btn" onClick={() => navigate('/explore')}>Stays Discovery</button>
            <button className="pub-btn" onClick={() => navigate('/property/prop-1')}>Palm Grove Villa Detail</button>
            <button className="pub-btn" onClick={() => navigate('/concierge')}>Concierge Marketplace</button>
            <button className="pub-btn" onClick={() => navigate('/how-it-works')}>How It Works</button>
            <button className="pub-btn" onClick={() => navigate('/faq')}>Guest & Host FAQs</button>
            <button className="pub-btn" onClick={() => navigate('/contact')}>24/7 Concierge Hotline</button>
            <button className="pub-btn" onClick={() => navigate('/login')}>Login & Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
