import React, { useState } from 'react';
import { Star, MessageSquare, ShieldCheck, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import ReviewModal from '../../components/reviews/ReviewModal';

export default function GuestReviewsPage() {
  const { reviews, bookings } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(bookings[0] || null);

  return (
    <DashboardLayout
      title="My Reviews & Testimonials"
      subtitle="Past feedback and verified reviews you have submitted for your stays and concierge experiences"
    >
      <div style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header action card */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-card)',
            padding: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text)' }}>
                Share Your Experience
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Help other conscious travelers discover tranquility. Reviews are verified against real reservation records.
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Write a Review
          </Button>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviews.length === 0 ? (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-card)',
                padding: '3rem',
                textAlign: 'center'
              }}
            >
              <p style={{ color: 'var(--text-muted)' }}>You haven't submitted any reviews yet.</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-card)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                      {rev.propertyName || 'Palm Grove Retreat'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Reviewed on {rev.date}</span>
                      {rev.serviceReviewed && (
                        <span>• Service: <strong>{rev.serviceReviewed}</strong></span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StarRating value={rev.rating || 5} readonly />
                    <Badge variant="sage" size="sm">
                      <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                      Verified Stay
                    </Badge>
                  </div>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>

                {rev.ratingsBreakdown && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '0.75rem',
                      background: 'var(--color-bg-sand)',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div>Cleanliness: <strong>{rev.ratingsBreakdown.cleanliness}/5</strong></div>
                    <div>Communication: <strong>{rev.ratingsBreakdown.communication}/5</strong></div>
                    <div>Location: <strong>{rev.ratingsBreakdown.location}/5</strong></div>
                    <div>Value: <strong>{rev.ratingsBreakdown.value}/5</strong></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={selectedBooking ? { id: selectedBooking.propertyId, name: selectedBooking.propertyName } : null}
        />
      )}
    </DashboardLayout>
  );
}
