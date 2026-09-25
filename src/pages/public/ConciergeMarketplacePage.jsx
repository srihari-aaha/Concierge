import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ServiceCard from '../../components/concierge/ServiceCard';
import ConciergeRequestModal from '../../components/concierge/ConciergeRequestModal';
import {
  Car,
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  Compass,
  Wrench,
  HeartHandshake,
  ShieldCheck,
  Clock,
  CheckCircle2
} from 'lucide-react';
import './ConciergeMarketplacePage.css';

const ICON_MAP = {
  transportation: Car,
  housekeeping: Sparkles,
  dining: UtensilsCrossed,
  grocery: ShoppingBag,
  experiences: Compass,
  maintenance: Wrench,
  special: HeartHandshake
};

export default function ConciergeMarketplacePage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const { conciergeCategories, properties } = useApp();

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedService, setSelectedService] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Flat list or filtered list of services
  const displayedServices =
    activeCategory === 'all'
      ? conciergeCategories.flatMap((c) => c.services)
      : conciergeCategories.find((c) => c.id === activeCategory)?.services || [];

  const handleRequestService = (service) => {
    setSelectedService(service);
    setRequestModalOpen(true);
  };

  return (
    <div className="concierge-page">
      {/* Editorial Header */}
      <div className="concierge-header-banner">
        <div className="container">
          <div className="concierge-header-center">
            <span className="section-subtitle">THE STAYEASE SIGNATURE</span>
            <h1 className="concierge-page-title">What can we take care of?</h1>
            <p className="concierge-page-desc">
              Your stay, made effortless. From private chefs in your courtyard to seamless airport chauffeur transfers and emergency repairs, our local desk coordinates every detail.
            </p>
          </div>
        </div>
      </div>

      <div className="container concierge-main-container">
        {/* Category Pills Bar */}
        <div className="concierge-tabs-nav">
          <button
            type="button"
            className={`concierge-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <span>All Services</span>
          </button>

          {conciergeCategories.map((cat) => {
            const Icon = ICON_MAP[cat.id] || Sparkles;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`concierge-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={16} />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Category Highlight Description */}
        {activeCategory !== 'all' && (
          <div className="category-meta-banner">
            <h3 className="category-meta-title">
              {conciergeCategories.find((c) => c.id === activeCategory)?.title}
            </h3>
            <p className="category-meta-desc">
              {conciergeCategories.find((c) => c.id === activeCategory)?.description}
            </p>
          </div>
        )}

        {/* Services Grid */}
        <div className="services-grid">
          {displayedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onRequest={handleRequestService}
            />
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="concierge-assurance-box">
          <div className="assurance-col">
            <ShieldCheck size={28} className="assurance-lead-icon" />
            <div>
              <h4 className="assurance-title">Vetted Local Specialists</h4>
              <p className="assurance-desc">
                Every chauffeur, cook, and maintenance technician is identity-verified and trained to StayEase hospitality standards.
              </p>
            </div>
          </div>

          <div className="assurance-col">
            <Clock size={28} className="assurance-lead-icon" />
            <div>
              <h4 className="assurance-title">2-Hour Rapid Coordination</h4>
              <p className="assurance-desc">
                Once submitted, our on-call coordinator confirms scheduling and assigns local providers promptly.
              </p>
            </div>
          </div>

          <div className="assurance-col">
            <CheckCircle2 size={28} className="assurance-lead-icon" />
            <div>
              <h4 className="assurance-title">Transparent Pricing</h4>
              <p className="assurance-desc">
                Maintenance and Wi-Fi diagnostics are always complimentary. Dining and transport rates are settled transparently with zero hidden markups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {selectedService && (
        <ConciergeRequestModal
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          service={selectedService}
          property={properties[0]}
        />
      )}
    </div>
  );
}
