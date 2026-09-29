import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  Filter,
  CheckCircle,
  EyeOff,
  Flag,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/common/Button';
import './AdminReviewsPage.css';

export default function AdminReviewsPage() {
  const { reviews } = useApp();
  const { moderateReview } = useAdmin();

  const [activeTab, setActiveTab] = useState('all'); // all, pending, flagged, published
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extended mock reviews with moderation statuses
  const [reviewsList, setReviewsList] = useState(() => {
    return reviews.map((r, i) => ({
      ...r,
      status: i === 0 ? 'published' : i === 1 ? 'flagged' : 'published',
      flagReason: i === 1 ? 'Host flagged review for mentioning neighbor noise during religious festival.' : null
    }));
  });

  const handleModerate = (reviewId, newStatus) => {
    moderateReview(reviewId, newStatus);
    setReviewsList((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
    );
  };

  const filteredReviews = useMemo(() => {
    return reviewsList.filter((r) => {
      if (activeTab === 'pending' && r.status !== 'pending_moderation') return false;
      if (activeTab === 'flagged' && r.status !== 'flagged') return false;
      if (activeTab === 'published' && r.status !== 'published') return false;

      if (ratingFilter !== 'all' && Math.floor(r.rating) !== Number(ratingFilter)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (r.propertyName || '').toLowerCase().includes(q) ||
          (r.guestName || '').toLowerCase().includes(q) ||
          (r.comment || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reviewsList, activeTab, ratingFilter, searchQuery]);

  const flaggedCount = reviewsList.filter((r) => r.status === 'flagged').length;

  return (
    <AdminLayout>
      <div className="admin-reviews-page">
        <PageHeader
          title="Guest Review Moderation & Quality Sentiments"
          subtitle="Audit genuine guest feedback, moderate flagged reviews, and maintain StayEase hospitality integrity"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Reviews' }
          ]}
        />

        {/* Tab Bar */}
        <div className="reviews-tab-bar">
          <div className="tab-pill-group">
            <button
              type="button"
              className={`rev-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Reviews ({reviewsList.length})
            </button>
            <button
              type="button"
              className={`rev-tab-pill ${activeTab === 'flagged' ? 'active' : ''}`}
              onClick={() => setActiveTab('flagged')}
            >
              Reported / Flagged ({flaggedCount})
            </button>
            <button
              type="button"
              className={`rev-tab-pill ${activeTab === 'published' ? 'active' : ''}`}
              onClick={() => setActiveTab('published')}
            >
              Published
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="reviews-filter-bar">
          <div className="filter-search-input">
            <Search size={16} className="filter-icon" />
            <input
              type="text"
              placeholder="Search feedback text, villa, or reviewer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <select
              className="admin-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            {(searchQuery || ratingFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setRatingFilter('all');
                  setActiveTab('all');
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No reviews match your filters"
            description="All guest reviews have been processed or no results found."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setRatingFilter('all');
              setActiveTab('all');
            }}
          />
        ) : (
          <div className="reviews-moderation-list">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className={`review-mod-card ${rev.status === 'flagged' ? 'is-flagged' : ''}`}
              >
                <div className="mod-card-header">
                  <div className="mod-guest-meta">
                    <strong className="mod-guest-name">{rev.guestName || 'Verified Guest'}</strong>
                    <span className="mod-guest-loc">({rev.guestLocation || 'India'})</span>
                    <span className="mod-dot">•</span>
                    <span className="mod-date">{rev.date || 'August 2024'}</span>
                  </div>

                  <div className="mod-header-right">
                    <StatusBadge status={rev.status} />
                  </div>
                </div>

                <div className="mod-property-row">
                  <span className="mod-prop-label">Reviewed Stay:</span>
                  <strong className="mod-prop-name">{rev.propertyName}</strong>
                  {rev.serviceReviewed && (
                    <span className="mod-service-tag">Service: {rev.serviceReviewed}</span>
                  )}
                </div>

                <div className="mod-rating-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < rev.rating ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                  <span className="mod-rating-val">{rev.rating}.0 / 5.0</span>
                </div>

                <p className="mod-comment-body">"{rev.comment}"</p>

                {rev.flagReason && (
                  <div className="flag-alert-box">
                    <AlertTriangle size={15} color="#DC2626" />
                    <div>
                      <strong>Host Dispute Flag:</strong> {rev.flagReason}
                    </div>
                  </div>
                )}

                <div className="mod-card-actions">
                  {rev.status !== 'published' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => handleModerate(rev.id, 'published')}
                    >
                      Approve & Publish
                    </Button>
                  )}
                  {rev.status !== 'flagged' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Flag}
                      onClick={() => handleModerate(rev.id, 'flagged')}
                    >
                      Flag for Host Review
                    </Button>
                  )}
                  {rev.status !== 'hidden' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={EyeOff}
                      onClick={() => handleModerate(rev.id, 'hidden')}
                    >
                      Hide from Marketplace
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
