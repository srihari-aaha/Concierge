import React from 'react';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // danger, warning, primary
  loading = false
}) {
  const iconConfig = {
    danger: { icon: AlertCircle, color: '#DC2626', bg: '#FEE2E2' },
    warning: { icon: AlertTriangle, color: '#D97706', bg: '#FEF3C7' },
    primary: { icon: HelpCircle, color: '#ED7014', bg: '#FFF1E8' }
  };

  const currentIcon = iconConfig[variant] || iconConfig.primary;
  const Icon = currentIcon.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="440px">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: currentIcon.bg,
            color: currentIcon.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <Icon size={24} />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
          {title}
        </h3>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '360px' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'center' }}>
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            loading={loading}
            style={{ flex: 1 }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
