import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import './ContactPage.css';

export default function ContactPage() {
  const { showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Concierge');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry received. A StayEase stay coordinator will contact you shortly.', 'success');
  };

  const regionalDesks = [
    { region: 'North Goa Coastal Desk', areas: 'Ashwem, Morjim, Mandrem, Vagator', phone: '+91 98221 44021', email: 'goa.concierge@stayease.in' },
    { region: 'Pondicherry Heritage Desk', areas: 'White Town, Promenade, Auroville', phone: '+91 94862 33419', email: 'pondy.concierge@stayease.in' },
    { region: 'Coorg & Western Ghats', areas: 'Madikeri, Virajpet, Coffee Valleys', phone: '+91 94481 22910', email: 'coorg.concierge@stayease.in' },
    { region: 'Kerala Backwaters Desk', areas: 'Kumarakom, Alleppey, Marari Beach', phone: '+91 98221 00999', email: 'kerala.concierge@stayease.in' },
    { region: 'Rajasthan Heritage Desk', areas: 'Jaipur Pink City, Lake Pichola Udaipur', phone: '+91 98290 88123', email: 'rajasthan.concierge@stayease.in' }
  ];

  return (
    <div className="contact-page">
      <div className="concierge-header-banner">
        <div className="container text-center">
          <span className="section-subtitle">ALWAYS WITHIN REACH</span>
          <h1 className="concierge-page-title">Contact StayEase Concierge</h1>
          <p className="concierge-page-desc centered" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Whether you are planning a holiday, currently in-stay, or interested in partnering your property, our team is at your service.
          </p>
        </div>
      </div>

      <div className="container section-spacing">
        <div className="contact-grid-main">
          {/* Left Column: Form */}
          <div className="contact-form-card">
            <h3 className="form-card-title">Send a Message to Our Desk</h3>
            <p className="form-card-desc">
              Tell us about your upcoming vacation dates, custom dining requests, or hosting inquiries.
            </p>

            {submitted ? (
              <div className="contact-success-box animate-fade-in">
                <CheckCircle2 size={44} className="success-icon" />
                <h4 className="success-title">Message Received</h4>
                <p className="success-text">
                  Thank you, <strong>{name}</strong>. Our on-ground stay coordinator has received your message and will respond within 2 hours.
                </p>
                <Button variant="subtle" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row-two">
                  <div className="form-group">
                    <label className="field-label">Full Name</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Guest"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Phone Number</label>
                    <input
                      type="tel"
                      className="field-input"
                      placeholder="+91 98201 55678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label className="field-label">Email Address</label>
                    <input
                      type="email"
                      className="field-input"
                      placeholder="priya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Topic</label>
                    <select
                      className="field-select"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                    >
                      <option value="Concierge">In-Stay Concierge Request</option>
                      <option value="Booking">Holiday Booking & Reservation</option>
                      <option value="Owner">List / Manage a Property</option>
                      <option value="Provider">Join Regional Service Guild</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Your Message or Requirements</label>
                  <textarea
                    rows={4}
                    className="field-textarea"
                    placeholder="Provide details about dates, destination, special dietary preferences, or specific inquiries..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <Button variant="primary" size="lg" type="submit" icon={Send} fullWidth>
                  Send Inquiry to Concierge Desk
                </Button>
              </form>
            )}
          </div>

          {/* Right Column: 24/7 Hotline & Regional Desks */}
          <div className="contact-info-col">
            <div className="hotline-card">
              <div className="hotline-icon-wrap">
                <Phone size={24} />
              </div>
              <div>
                <span className="hotline-lbl">24/7 RAPID CONCIERGE HOTLINE</span>
                <strong className="hotline-number">+91 98221 00999</strong>
                <span className="hotline-sub">Emergency support & immediate guest assistance</span>
              </div>
            </div>

            <div className="desks-card">
              <h4 className="desks-title">Regional On-Ground Desks</h4>
              <p className="desks-desc">Direct local coordination across our holiday sanctuaries:</p>

              <div className="desks-list">
                {regionalDesks.map((d, i) => (
                  <div key={i} className="desk-item">
                    <strong className="desk-name">{d.region}</strong>
                    <span className="desk-areas">{d.areas}</span>
                    <div className="desk-contacts">
                      <span>{d.phone}</span>
                      <span>•</span>
                      <span>{d.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
