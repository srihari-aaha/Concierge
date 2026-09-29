import React from 'react';
import Button from '../common/Button';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionIcon: ActionIcon,
  onAction,
  secondaryText,
  onSecondaryAction,
  className = ''
}) {
  return (
    <div className={`admin-empty-state ${className}`}>
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={28} />
        </div>
      )}

      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}

      {(actionText || secondaryText) && (
        <div className="empty-state-actions">
          {actionText && (
            <Button
              variant="primary"
              size="sm"
              icon={ActionIcon}
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}

          {secondaryText && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSecondaryAction}
            >
              {secondaryText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
