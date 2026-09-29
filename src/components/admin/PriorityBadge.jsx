import React from 'react';
import './PriorityBadge.css';

export default function PriorityBadge({ priority = 'normal', size = 'sm' }) {
  const p = String(priority).toLowerCase();

  const configs = {
    urgent: { label: 'Urgent', class: 'priority-urgent' },
    high: { label: 'High', class: 'priority-high' },
    normal: { label: 'Normal', class: 'priority-normal' },
    low: { label: 'Low', class: 'priority-low' }
  };

  const config = configs[p] || configs.normal;

  return (
    <span className={`admin-priority-badge ${config.class} size-${size}`}>
      <span className="priority-indicator" />
      <span>{config.label}</span>
    </span>
  );
}
