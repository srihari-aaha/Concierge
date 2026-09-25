import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, subtle, danger
  size = 'md',         // sm, md, lg
  className = '',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-block' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="btn-icon btn-icon-left" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
          <span className="btn-text">{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="btn-icon btn-icon-right" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        </>
      )}
    </button>
  );
}
