import React from 'react';
import './Card.css';

export default function Card({
  children,
  className = '',
  hover = false,
  padded = true,
  onClick,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`card ${hover ? 'card-hover' : ''} ${padded ? 'card-padded' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}
