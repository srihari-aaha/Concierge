import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Megaphone,
  CheckCircle,
  Plus,
  Send,
  Calendar,
  Users,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './AdminCommunicationsPage.css';

export default function AdminCommunicationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, showToast } = useApp();
  const { announcements, setAnnouncements } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('notifications'); // notifications, announcements
  const [notifCategoryFilter, setNotifCategoryFilter] = useState('all');
  const [isNewAnnModalOpen, setIsNewAnnModalOpen] = useState(false);

  const [newAnn, setNewAnn] = useState({
    title: '',
    targetAudience: 'All Property Owners & Concierge Staff',
    content: ''
  });

  const filteredNotifs = notifications.filter((n) => {
    if (notifCategoryFilter === 'unread') return !n.read;
    if (notifCategoryFilter !== 'all') {
      const titleLower = n.title.toLowerCase();
      if (notifCategoryFilter === 'booking' && !titleLower.includes('booking') && !titleLower.includes('reservation')) return false;
      if (notifCategoryFilter === 'concierge' && !titleLower.includes('concierge') && !titleLower.includes('service')) return false;
      if (notifCategoryFilter === 'maintenance' && !titleLower.includes('maintenance')) return false;
    }
    return true;
  });

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    const created = {
      id: `ann-${Date.now()}`,
      title: newAnn.title,
      targetAudience: newAnn.targetAudience,
      content: newAnn.content,
      date: 'Just now',
      status: 'published'
    };
    setAnnouncements((prev) => [created, ...prev]);
    setIsNewAnnModalOpen(false);
    setNewAnn({
      title: '',
      targetAudience: 'All Property Owners & Concierge Staff',
      content: ''
    });
    showToast('Platform announcement broadcasted to selected recipients.', 'success');
  };

  return (
    <AdminLayout>
      <div className="admin-comms-page">
        <PageHeader
          title="Communications & Operational Broadcasts"
          subtitle="System notifications center, multi-channel alerts, and platform announcements for hosts and service teams"
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Communications' }
          ]}
          actions={
            activeTab === 'notifications' ? (
              <Button
                variant="outline"
                size="sm"
                icon={CheckCircle}
                onClick={markAllNotificationsAsRead}
              >
                Mark All Read
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsNewAnnModalOpen(true)}
              >
                New Broadcast Announcement
              </Button>
            )
          }
        />

        {/* Tab Bar */}
        <div className="comms-tab-bar">
          <button
            type="button"
            className={`comms-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={15} /> System Notifications ({notifications.length})
          </button>
          <button
            type="button"
            className={`comms-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Megaphone size={15} /> Platform Announcements ({announcements.length})
          </button>
        </div>

        {/* TAB 1: Notifications */}
        {activeTab === 'notifications' && (
          <div className="notifs-container">
            <div className="notifs-filter-row">
              <span className="notifs-count-label">
                Showing {filteredNotifs.length} updates ({notifications.filter((n) => !n.read).length} unread)
              </span>

              <div className="notif-category-pills">
                {['all', 'unread', 'booking', 'concierge', 'maintenance'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-pill ${notifCategoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setNotifCategoryFilter(cat)}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="notif-cards-list">
              {filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  className={`admin-notif-card ${!n.read ? 'unread' : ''}`}
                  onClick={() => markNotificationAsRead(n.id)}
                >
                  <div className="notif-card-icon">
                    <Bell size={18} />
                  </div>

                  <div className="notif-card-body">
                    <div className="notif-card-header">
                      <strong className="notif-card-title">{n.title}</strong>
                      <span className="notif-card-time">{n.time}</span>
                    </div>
                    <p className="notif-card-message">{n.message}</p>
                  </div>

                  {n.link && (
                    <button
                      type="button"
                      className="notif-open-link-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationAsRead(n.id);
                        navigate(n.link);
                      }}
                      title="Open related record"
                    >
                      <ExternalLink size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Announcements */}
        {activeTab === 'announcements' && (
          <div className="announcements-container">
            <div className="announcements-grid">
              {announcements.map((ann) => (
                <div key={ann.id} className="announcement-card">
                  <div className="ann-card-top">
                    <span className="ann-target-badge">
                      <Users size={12} /> {ann.targetAudience}
                    </span>
                    <span className="ann-date-text">{ann.date}</span>
                  </div>

                  <h3 className="ann-title">{ann.title}</h3>
                  <p className="ann-content">{ann.content}</p>

                  <div className="ann-card-footer">
                    <span className="ann-status-pill">Active Broadcast</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Broadcast Modal */}
        <Modal
          isOpen={isNewAnnModalOpen}
          onClose={() => setIsNewAnnModalOpen(false)}
          title="Create Platform Broadcast"
          subtitle="Publish advisory notice across property manager and concierge consoles"
          maxWidth="560px"
        >
          <form onSubmit={handleCreateAnnouncement} className="add-ann-form">
            <div className="form-group">
              <label>Announcement Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Peak Season High-Speed Wi-Fi Inspection Advisory"
                value={newAnn.title}
                onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Target Audience *</label>
              <select
                value={newAnn.targetAudience}
                onChange={(e) => setNewAnn({ ...newAnn, targetAudience: e.target.value })}
              >
                <option value="All Property Owners & Concierge Staff">All Property Owners & Concierge Staff</option>
                <option value="Goa Coastal Region Hosts">Goa Coastal Region Hosts</option>
                <option value="Pondicherry Heritage Stays">Pondicherry Heritage Stays</option>
                <option value="All Service Providers & Chauffeurs">All Service Providers & Chauffeurs</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message Content *</label>
              <textarea
                rows="4"
                required
                placeholder="Provide detailed instructions or seasonal protocols..."
                value={newAnn.content}
                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
              />
            </div>

            <div className="form-actions-row">
              <Button variant="outline" size="md" onClick={() => setIsNewAnnModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" icon={Send}>
                Publish Broadcast
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
