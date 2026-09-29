import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  Users,
  CalendarCheck,
  Sparkles,
  UserCheck,
  CreditCard,
  ArrowRight,
  X,
  CornerDownLeft
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import './GlobalSearchModal.css';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { searchAll } = useAdmin();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = searchAll(query);
  const hasResults =
    results.properties.length > 0 ||
    results.guests.length > 0 ||
    results.reservations.length > 0 ||
    results.concierge.length > 0 ||
    results.staff.length > 0 ||
    results.payments.length > 0;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="search-backdrop animate-fade-simple" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-input-header">
          <Search size={18} className="search-icon-head" />
          <input
            ref={inputRef}
            type="text"
            className="search-input-field"
            placeholder="Search properties, guests, reservations, concierge, staff, payments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="search-esc-badge">ESC</kbd>
          )}
        </div>

        {/* Results Body */}
        <div className="search-results-body">
          {!query.trim() ? (
            <div className="search-quick-links">
              <span className="search-section-label">QUICK MODULE NAVIGATION</span>
              <div className="search-quick-grid">
                <button
                  type="button"
                  className="quick-nav-pill"
                  onClick={() => handleSelect('/admin/properties')}
                >
                  <Home size={15} /> All Properties
                </button>
                <button
                  type="button"
                  className="quick-nav-pill"
                  onClick={() => handleSelect('/admin/reservations')}
                >
                  <CalendarCheck size={15} /> Reservations
                </button>
                <button
                  type="button"
                  className="quick-nav-pill"
                  onClick={() => handleSelect('/admin/concierge')}
                >
                  <Sparkles size={15} /> Concierge Queue
                </button>
                <button
                  type="button"
                  className="quick-nav-pill"
                  onClick={() => handleSelect('/admin/operations')}
                >
                  Housekeeping & Maintenance
                </button>
                <button
                  type="button"
                  className="quick-nav-pill"
                  onClick={() => handleSelect('/admin/guests')}
                >
                  <Users size={15} /> Guests Directory
                </button>
                <button
                  type="button"
                  className="quick-nav-pill"
                  onClick={() => handleSelect('/admin/payments')}
                >
                  <CreditCard size={15} /> Payments & Ledgers
                </button>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="search-no-results">
              <p>No results found matching "<strong>{query}</strong>"</p>
              <span>Try searching for property name, guest, reservation ID, or staff role.</span>
            </div>
          ) : (
            <div className="search-sections-list">
              {/* Properties */}
              {results.properties.length > 0 && (
                <div className="search-result-group">
                  <div className="group-title">
                    <Home size={14} /> Properties ({results.properties.length})
                  </div>
                  {results.properties.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="search-item"
                      onClick={() => handleSelect(`/admin/properties?id=${p.id}`)}
                    >
                      <div className="search-item-info">
                        <span className="search-item-primary">{p.name}</span>
                        <span className="search-item-secondary">
                          {p.location} • ₹{p.pricePerNight?.toLocaleString('en-IN')}/night • {p.status.toUpperCase()}
                        </span>
                      </div>
                      <ArrowRight size={14} className="search-item-arrow" />
                    </div>
                  ))}
                </div>
              )}

              {/* Reservations */}
              {results.reservations.length > 0 && (
                <div className="search-result-group">
                  <div className="group-title">
                    <CalendarCheck size={14} /> Reservations ({results.reservations.length})
                  </div>
                  {results.reservations.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="search-item"
                      onClick={() => handleSelect(`/admin/reservations?ref=${b.reference}`)}
                    >
                      <div className="search-item-info">
                        <span className="search-item-primary">{b.reference} — {b.propertyName}</span>
                        <span className="search-item-secondary">
                          Guest: {b.guestName} • {b.checkIn} to {b.checkOut} • ₹{b.totalAmount?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <ArrowRight size={14} className="search-item-arrow" />
                    </div>
                  ))}
                </div>
              )}

              {/* Concierge Requests */}
              {results.concierge.length > 0 && (
                <div className="search-result-group">
                  <div className="group-title">
                    <Sparkles size={14} /> Concierge Requests ({results.concierge.length})
                  </div>
                  {results.concierge.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="search-item"
                      onClick={() => handleSelect(`/admin/concierge?id=${c.id}`)}
                    >
                      <div className="search-item-info">
                        <span className="search-item-primary">{c.serviceTitle}</span>
                        <span className="search-item-secondary">
                          Guest: {c.guestName} • {c.propertyName} • Status: {c.status}
                        </span>
                      </div>
                      <ArrowRight size={14} className="search-item-arrow" />
                    </div>
                  ))}
                </div>
              )}

              {/* Guests */}
              {results.guests.length > 0 && (
                <div className="search-result-group">
                  <div className="group-title">
                    <Users size={14} /> Guests ({results.guests.length})
                  </div>
                  {results.guests.slice(0, 3).map((g) => (
                    <div
                      key={g.id}
                      className="search-item"
                      onClick={() => handleSelect(`/admin/guests?id=${g.id}`)}
                    >
                      <div className="search-item-info">
                        <span className="search-item-primary">{g.name}</span>
                        <span className="search-item-secondary">
                          {g.email} • {g.city} • {g.reservationsCount} stays • Total ₹{g.totalSpent?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <ArrowRight size={14} className="search-item-arrow" />
                    </div>
                  ))}
                </div>
              )}

              {/* Staff */}
              {results.staff.length > 0 && (
                <div className="search-result-group">
                  <div className="group-title">
                    <UserCheck size={14} /> Staff Members ({results.staff.length})
                  </div>
                  {results.staff.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      className="search-item"
                      onClick={() => handleSelect(`/admin/staff?id=${s.id}`)}
                    >
                      <div className="search-item-info">
                        <span className="search-item-primary">{s.name} ({s.role})</span>
                        <span className="search-item-secondary">
                          {s.email} • {s.assignedRegions?.join(', ')} • Tasks: {s.currentTasks}
                        </span>
                      </div>
                      <ArrowRight size={14} className="search-item-arrow" />
                    </div>
                  ))}
                </div>
              )}

              {/* Payments */}
              {results.payments.length > 0 && (
                <div className="search-result-group">
                  <div className="group-title">
                    <CreditCard size={14} /> Payments ({results.payments.length})
                  </div>
                  {results.payments.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="search-item"
                      onClick={() => handleSelect(`/admin/payments?id=${t.id}`)}
                    >
                      <div className="search-item-info">
                        <span className="search-item-primary">{t.id} — ₹{t.amount?.toLocaleString('en-IN')}</span>
                        <span className="search-item-secondary">
                          {t.guestName} • {t.paymentMethod} • Status: {t.status.toUpperCase()}
                        </span>
                      </div>
                      <ArrowRight size={14} className="search-item-arrow" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="search-modal-footer">
          <span className="search-footer-hint">
            <kbd className="key-kbd"><CornerDownLeft size={11} /></kbd> to select
          </span>
          <span className="search-footer-hint">
            <kbd className="key-kbd">Esc</kbd> to exit
          </span>
        </div>
      </div>
    </div>
  );
}
