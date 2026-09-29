import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './DetailDrawer.css';

export default function DetailDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badges,
  children,
  footer,
  width = '520px'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="drawer-panel"
        style={{ width: `min(${width}, 100vw)` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-header-info">
            {badges && <div className="drawer-badges">{badges}</div>}
            <h2 className="drawer-title">{title}</h2>
            {subtitle && <p className="drawer-subtitle">{subtitle}</p>}
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {children}
        </div>

        {footer && (
          <div className="drawer-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
