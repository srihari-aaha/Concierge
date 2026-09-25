import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, CalendarCheck, Sparkles, Smile, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Discover Your Idyllic Indian Sanctuary',
      desc: 'Browse our vetted collection of beachfront villas in Ashwem, Franco-Tamil heritage courtyards in Pondicherry, or mist-draped coffee estates in Coorg. Each property features verified photography, detailed floor layouts, and transparent pricing.',
      icon: Compass
    },
    {
      num: '02',
      title: 'Seamless Reservation with Zero Hidden Fees',
      desc: 'Lock in your dates instantly. Transparent pricing outlines cleaning, StayEase platform concierge services, and GST upfront. Use mock UPI or cards in this prototype to simulate instant booking confirmation.',
      icon: CalendarCheck
    },
    {
      num: '03',
      title: 'Request Anything from our On-Ground Concierge',
      desc: 'Want chilled coconut water and artisanal cheeses waiting when you unlock the front door? Need an airport pickup at midnight or an authentic Kodava pork curry prepared by a private in-villa chef? Simply submit a request in two taps.',
      icon: Sparkles
    },
    {
      num: '04',
      title: 'Unwind with Complete Peace of Mind',
      desc: 'From high-speed Wi-Fi credentials and door pin codes to on-demand maintenance resolution within 60 minutes, StayEase acts as your invisible, attentive hotel concierge in the comfort of a private home.',
      icon: Smile
    }
  ];

  return (
    <div className="how-it-works-page">
      <div className="concierge-header-banner">
        <div className="container text-center">
          <span className="section-subtitle">THE STAYEASE EXPERIENCE</span>
          <h1 className="concierge-page-title">How StayEase Works</h1>
          <p className="concierge-page-desc centered" style={{ maxWidth: '640px', margin: '0 auto' }}>
            We pair the spacious freedom of boutique Indian holiday homes with the reliable service standard of a luxury hotel.
          </p>
        </div>
      </div>

      <div className="container section-spacing">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '820px', margin: '0 auto' }}>
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'flex-start',
                  backgroundColor: 'var(--surface)',
                  padding: '2.25rem',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: 'var(--primary-light)',
                    lineHeight: 1
                  }}
                >
                  {s.num}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Icon size={20} color="var(--primary-dark)" />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text)' }}>
                      {s.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}

          <div
            style={{
              backgroundColor: 'var(--primary-tint)',
              padding: '3rem',
              borderRadius: 'var(--radius-card)',
              textAlign: 'center',
              border: '1px solid rgba(237, 112, 20, 0.2)',
              marginTop: '1.5rem'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
              Ready for an effortless Indian vacation?
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
              Explore our boutique collection and experience on-call concierge service.
            </p>
            <Link to="/explore">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Explore Available Stays
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
