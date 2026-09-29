import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './PageHeader.css';

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  className = ''
}) {
  return (
    <div className={`admin-page-header ${className}`}>
      <div className="page-header-content">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <span key={crumb.label || idx} className="breadcrumb-item">
                  {crumb.path && !isLast ? (
                    <Link to={crumb.path} className="breadcrumb-link">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="breadcrumb-current">{crumb.label}</span>
                  )}
                  {!isLast && <ChevronRight size={13} className="breadcrumb-separator" />}
                </span>
              );
            })}
          </nav>
        )}

        <div className="page-title-row">
          <div>
            <h1 className="admin-page-title">{title}</h1>
            {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
          </div>

          {actions && <div className="page-header-actions">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
