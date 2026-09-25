import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles, Clock, CreditCard, HeartHandshake } from 'lucide-react';
import './FAQPage.css';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: 'Reservations & Stays',
      q: 'How does StayEase verify its holiday homestays and villas?',
      a: 'Every property on StayEase undergoes an on-ground 45-point inspection covering acoustic tranquility, water pressure, bedding hygiene, emergency power backups, and architecture. We only list private residences that meet our boutique hospitality criteria.'
    },
    {
      category: 'Concierge & In-Stay Care',
      q: 'How does the on-ground concierge service work?',
      a: 'Once your reservation is confirmed, your dedicated StayEase concierge is activated. You can request airport chauffeur transfers, refrigerator stocking, or private chefs through your guest portal. Our on-ground coordinators assign vetted regional specialists and monitor service delivery in real time.'
    },
    {
      category: 'Pricing & Payments',
      q: 'Are there hidden service fees or surge charges?',
      a: 'No. StayEase uses 100% transparent pricing. Nightly rates, villa sanitization, and the StayEase concierge fee are itemized before you reserve. In this prototype, mock UPI, card, and net banking simulators let you test the checkout flow without real financial transactions.'
    },
    {
      category: 'Maintenance & Emergencies',
      q: 'What happens if an AC or Wi-Fi router malfunctions during my stay?',
      a: 'We offer a complimentary stay guarantee. Simply submit a maintenance ticket via your "My Stay" portal. A licensed technician from our vetted regional network is dispatched within 45 minutes to resolve the issue.'
    },
    {
      category: 'For Property Owners',
      q: 'How does StayEase assist villa owners with guest operations?',
      a: 'StayEase provides an integrated host portal where owners manage bookings, review incoming concierge orders, and dispatch trusted regional providers with a single click. We take care of vendor coordination so you can focus on property stewardship.'
    },
    {
      category: 'Cancellations & Flexibility',
      q: 'What is the cancellation and refund policy?',
      a: 'Standard reservations are eligible for a full refund up to 7 days before check-in. Within 7 days, bookings can be rescheduled with concierge support based on property availability.'
    }
  ];

  return (
    <div className="faq-page">
      <div className="concierge-header-banner">
        <div className="container text-center">
          <span className="section-subtitle">QUESTIONS & CLARITY</span>
          <h1 className="concierge-page-title">Frequently Asked Questions</h1>
          <p className="concierge-page-desc centered" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Everything you need to know about reserving curated Indian homestays and ordering on-ground concierge services.
          </p>
        </div>
      </div>

      <div className="container section-spacing faq-container">
        <div className="faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <div className="faq-q-left">
                    <span className="faq-cat-tag">{faq.category}</span>
                    <h3 className="faq-q-title">{faq.q}</h3>
                  </div>
                  <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotate' : ''}`} />
                </button>

                {isOpen && (
                  <div className="faq-answer-panel animate-fade-in">
                    <p className="faq-a-text">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="faq-contact-card">
          <div className="faq-contact-icon">
            <HeartHandshake size={28} />
          </div>
          <div>
            <h4 className="faq-contact-title">Have a specific vacation requirement?</h4>
            <p className="faq-contact-text">
              Our hospitality desk is available 24/7 for tailored itineraries, dietary arrangements, and group bookings.
            </p>
          </div>
          <a href="/contact" className="btn btn-primary btn-md">
            Contact Concierge Desk
          </a>
        </div>
      </div>
    </div>
  );
}
