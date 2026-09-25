import React from 'react';
import './Badge.css';

export default function Badge({
  children,
  variant = 'default', // default, sage, confirmed, pending, progress, urgent, accent
  size = 'md',        // sm, md
  dot = false,
  className = ''
}) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
