import React, { useState } from 'react';
import {
  Briefcase,
  Play,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import './ProviderDashboardPage.css';

export default function ProviderDashboardPage() {
  const { conciergeRequests, advanceProviderJobStatus, currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('active'); // active, completed, all

  // Jobs assigned to this provider (or all assigned jobs in prototype)
  const providerJobs = conciergeRequests.filter(
    (r) => r.assignedProviderId === currentUser.id || r.assignedProviderName?.includes((currentUser?.name || 'Provider').split(' ')[0])
  );

  const activeJobs = providerJobs.filter((j) => j.status !== 'completed');
  const completedJobs = providerJobs.filter((j) => j.status === 'completed');

  const displayedJobs =
    activeTab === 'active' ? activeJobs : activeTab === 'completed' ? completedJobs : providerJobs;

  return (
    <DashboardLayout
      title={`Field Specialist Portal — ${currentUser?.name || 'Provider'}`}
      subtitle={`${currentUser.company} • Verified Service Specialist`}
    >
      <div className="provider-dash-container">
        {/* Earnings & Stats Bar */}
        <div className="provider-stats-banner">
          <div className="provider-stat-item">
            <span className="p-stat-lbl">ASSIGNED JOBS</span>
            <strong className="p-stat-val">{activeJobs.length} Active</strong>
          </div>
          <div className="provider-stat-item">
            <span className="p-stat-lbl">COMPLETED THIS MONTH</span>
            <strong className="p-stat-val">{completedJobs.length + 18} Services</strong>
          </div>
          <div className="provider-stat-item">
            <span className="p-stat-lbl">PAYOUT EARNINGS</span>
            <strong className="p-stat-val highlight">₹38,400</strong>
          </div>
          <div className="provider-stat-item">
            <span className="p-stat-lbl">SERVICE RATING</span>
            <strong className="p-stat-val">4.94 ★</strong>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="provider-tabs-row">
          <button
            type="button"
            className={`p-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <span>Active & Assigned Jobs ({activeJobs.length})</span>
          </button>
          <button
            type="button"
            className={`p-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span>Completed History ({completedJobs.length})</span>
          </button>
        </div>

        {/* Jobs Cards Feed */}
        <div className="provider-jobs-list">
          {displayedJobs.length > 0 ? (
            displayedJobs.map((job) => (
              <div key={job.id} className="provider-job-card">
                <div className="job-card-header">
                  <div>
                    <div className="job-type-pill">
                      <span>{job.category.toUpperCase()}</span>
                      <Badge
                        variant={
                          job.status === 'completed'
                            ? 'completed'
                            : job.status === 'in_progress'
                            ? 'in_progress'
                            : job.status === 'assigned'
                            ? 'assigned'
                            : 'unassigned'
                        }
                        size="sm"
                        dot
                      >
                        {job.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="job-title">{job.serviceTitle}</h3>
                  </div>

                  <div className="job-payout-box">
                    <span className="payout-lbl">JOB EARNING</span>
                    <strong className="payout-val">
                      ₹{job.cost > 0 ? job.cost.toLocaleString('en-IN') : '1,500'}
                    </strong>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="job-meta-grid">
                  <div className="job-meta-col">
                    <span className="meta-k">GUEST CUSTOMER</span>
                    <div className="meta-v">
                      <User size={14} className="meta-icon" />
                      <span>{job.guestName}</span>
                    </div>
                    <div className="meta-sub">{job.guestPhone}</div>
                  </div>

                  <div className="job-meta-col">
                    <span className="meta-k">PROPERTY & LOCATION</span>
                    <div className="meta-v">
                      <MapPin size={14} className="meta-icon" />
                      <span>{job.propertyName}</span>
                    </div>
                    <div className="meta-sub">North Goa Coastline</div>
                  </div>

                  <div className="job-meta-col">
                    <span className="meta-k">SCHEDULED TIME</span>
                    <div className="meta-v">
                      <Calendar size={14} className="meta-icon" />
                      <span>{job.date}</span>
                    </div>
                    <div className="meta-sub">{job.timeSlot}</div>
                  </div>
                </div>

                {/* Requirements / Flight / Notes */}
                <div className="job-instructions-card">
                  <span className="instructions-lbl">SPECIAL INSTRUCTIONS / GUEST REQUIREMENTS:</span>
                  <p className="instructions-body">
                    {job.specialInstructions || 'Standard verified service procedure.'}
                  </p>
                </div>

                {/* Action Buttons for Mobile/Field Worker */}
                <div className="job-actions-row">
                  {job.status === 'assigned' && (
                    <Button
                      variant="primary"
                      size="md"
                      icon={Play}
                      onClick={() => advanceProviderJobStatus(job.id, 'in_progress')}
                    >
                      Start Job (Mark In Progress)
                    </Button>
                  )}

                  {job.status === 'in_progress' && (
                    <Button
                      variant="primary"
                      size="md"
                      icon={CheckCircle}
                      onClick={() => advanceProviderJobStatus(job.id, 'completed')}
                    >
                      Complete Service Job
                    </Button>
                  )}

                  {job.status === 'completed' && (
                    <span className="job-complete-badge">
                      <Check size={16} /> Service Successfully Completed
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="provider-empty-state">
              <CheckCircle size={36} color="var(--primary)" />
              <h4>No active jobs in your queue</h4>
              <p>New concierge assignments will ping here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
