import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import './StatCard.css';

export default function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'var(--primary-tint)',
  iconColor = 'var(--primary)',
  trend,
  trendDirection = 'up', // 'up', 'down', 'neutral'
  contextText,
  onClick,
  className = ''
}) {
  return (
    <div
      className={`admin-stat-card ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {Icon && (
          <div
            className="stat-card-icon"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-card-val-row">
        <div className="stat-card-value">{value}</div>
        {trend && (
          <span className={`stat-card-trend trend-${trendDirection}`}>
            {trendDirection === 'up' && <ArrowUpRight size={13} />}
            {trendDirection === 'down' && <ArrowDownRight size={13} />}
            {trendDirection === 'neutral' && <Minus size={13} />}
            <span>{trend}</span>
          </span>
        )}
      </div>

      {(subtitle || contextText) && (
        <div className="stat-card-bottom">
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
          {contextText && <span className="stat-card-context">{contextText}</span>}
        </div>
      )}
    </div>
  );
}
