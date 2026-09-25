import React from 'react';
import { Clock, User, Phone, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Timeline from '../common/Timeline';
import { useApp } from '../../context/AppContext';
import './RequestTracker.css';

const STAGE_ORDER = ['requested', 'accepted', 'assigned', 'in_progress', 'completed'];

export default function RequestTracker({ request, onReviewService }) {
  const { currentRole, acceptConciergeRequest, advanceProviderJobStatus } = useApp();

  const getStepIndex = (status) => {
    switch (status) {
      case 'requested':
        return 0;
      case 'accepted':
        return 1;
      case 'assigned':
        return 2;
      case 'in_progress':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(request.status);

  const steps = [
    { label: 'Requested', time: 'Received' },
    { label: 'Accepted', time: request.statusTimeline?.find((t) => t.step === 'Accepted')?.time || 'Pending' },
    { label: 'Provider Assigned', time: request.assignedProviderName || 'Pending' },
    { label: 'In Progress', time: request.status === 'in_progress' ? 'Active' : request.status === 'completed' ? 'Done' : 'Pending' },
    { label: 'Completed', time: request.status === 'completed' ? 'Finished' : 'Upcoming' }
  ];

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'requested':
        return 'pending';
      case 'accepted':
        return 'assigned';
      case 'assigned':
        return 'assigned';
      case 'in_progress':
        return 'in_progress';
      case 'completed':
        return 'completed';
      case 'cancelled':
      case 'canceled':
        return 'canceled';
      default:
        return 'unassigned';
    }
  };

  return (
    <div className="request-tracker-card">
      <div className="tracker-top-bar">
        <div className="tracker-title-group">
          <span className="tracker-category-tag">{request.category.toUpperCase()}</span>
          <h4 className="tracker-service-title">{request.serviceTitle}</h4>
          <span className="tracker-stay-info">
            {request.propertyName} • Scheduled for {request.date} ({request.timeSlot})
          </span>
        </div>

        <div className="tracker-status-cluster">
          <Badge variant={getStatusBadgeVariant(request.status)} size="md" dot>
            {request.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <div className="tracker-price">
            {request.cost > 0 ? `₹${request.cost.toLocaleString('en-IN')}` : 'Complimentary'}
          </div>
        </div>
      </div>

      {/* Progress Visual Timeline */}
      <div className="tracker-timeline-wrap">
        <Timeline steps={steps} currentStepIndex={currentStep} orientation="horizontal" />
      </div>

      {/* Provider & Special Instructions details */}
      <div className="tracker-meta-grid">
        {request.assignedProviderName && (
          <div className="meta-box provider-box">
            <div className="meta-label">ASSIGNED LOCAL PROVIDER</div>
            <div className="provider-info-line">
              <User size={15} className="meta-icon" />
              <strong>{request.assignedProviderName}</strong>
            </div>
            {request.assignedProviderPhone && (
              <div className="provider-phone-line">
                <Phone size={13} className="meta-icon" />
                <span>{request.assignedProviderPhone}</span>
              </div>
            )}
          </div>
        )}

        <div className="meta-box instructions-box">
          <div className="meta-label">SPECIAL REQUESTS / NOTES</div>
          <p className="meta-text">{request.specialInstructions || 'No special requirements noted.'}</p>
        </div>
      </div>

      {/* Role-specific interactive simulation triggers */}
      <div className="tracker-actions-bar">
        {/* Guest actions */}
        {currentRole === 'guest' && request.status === 'completed' && onReviewService && (
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => onReviewService(request)}
          >
            Review This Concierge Experience
          </Button>
        )}

        {/* Owner simulation actions */}
        {currentRole === 'owner' && request.status === 'requested' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => acceptConciergeRequest(request.id)}
          >
            Accept Request as Owner
          </Button>
        )}

        {/* Provider simulation actions */}
        {currentRole === 'provider' && request.status === 'assigned' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => advanceProviderJobStatus(request.id, 'in_progress')}
          >
            Start Job (Mark In-Progress)
          </Button>
        )}

        {currentRole === 'provider' && request.status === 'in_progress' && (
          <Button
            variant="primary"
            size="sm"
            icon={CheckCircle}
            onClick={() => advanceProviderJobStatus(request.id, 'completed')}
          >
            Complete Service Job
          </Button>
        )}
      </div>
    </div>
  );
}
