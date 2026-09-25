import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RequestTracker from '../../components/concierge/RequestTracker';
import ReviewModal from '../../components/reviews/ReviewModal';
import Button from '../../components/common/Button';

export default function GuestRequestsPage() {
  const { conciergeRequests } = useApp();
  const [reviewingRequest, setReviewingRequest] = useState(null);

  return (
    <DashboardLayout
      title="Concierge Request Tracking"
      subtitle="Monitor live fulfillment of your airport transfers, private chefs, housekeeping, and local experiences"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{conciergeRequests.length}</strong> active & scheduled requests
            </span>
          </div>
          <Link to="/concierge">
            <Button variant="primary" size="md" icon={Plus}>
              Request New Service
            </Button>
          </Link>
        </div>

        {/* Requests List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {conciergeRequests.map((req) => (
            <RequestTracker
              key={req.id}
              request={req}
              onReviewService={(r) => setReviewingRequest(r)}
            />
          ))}
        </div>

        {/* Review Modal */}
        {reviewingRequest && (
          <ReviewModal
            isOpen={Boolean(reviewingRequest)}
            onClose={() => setReviewingRequest(null)}
            service={reviewingRequest}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
