import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  HeartHandshake,
  Compass,
  MapPin,
  ChevronRight,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import PropertyCard from '../../components/property/PropertyCard';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { properties, conciergeCategories } = useApp();

  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState('2');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const query = destination ? `?destination=${encodeURIComponent(destination)}` : '';
    navigate(`/explore${query}`);
  };

  const featuredStays = properties.slice(0, 4);

  const destinationsList = [
    {
      name: 'Goa',
      tagline: 'Coastal villas & palm groves',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
      count: '3 Stays'
    },
    {
      name: 'Pondicherry',
      tagline: 'French quarter courtyards',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      count: '2 Stays'
    },
    {
      name: 'Kerala',
      tagline: 'Tranquil backwater sanctuaries',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
      count: '4 Stays'
    },
    {
      name: 'Coorg',
      tagline: 'Coffee plantation estates',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
      count: '2 Stays'
    },
    {
      name: 'Ooty',
      tagline: 'Colonial hill cottages',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
      count: '3 Stays'
    },
    {
      name: 'Jaipur',
      tagline: 'Royal heritage havelis',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      count: '3 Stays'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-image" />
        <div className="hero-overlay" />

        <div className="container hero-container animate-fade-in">
          <div className="hero-badge-pill">
            <Sparkles size={14} className="hero-sparkle" />
            <span>Curated Indian Holiday Stays & Dedicated Concierge</span>
          </div>

          <h1 className="hero-headline">
            Stay somewhere beautiful.<br />
            <em>We'll take care of the rest.</em>
          </h1>

          <p className="hero-subtext">
            Discover hand-selected holiday villas and heritage retreats across India, with personal concierge care available before, during, and after your arrival.
          </p>

          {/* Quick Search Floating Bar */}
          <form onSubmit={handleHeroSearch} className="hero-search-bar">
            <div className="search-field">
              <label className="field-label">WHERE TO?</label>
              <div className="field-input-wrap">
                <MapPin size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Goa, Pondicherry, Coorg, Kerala..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="search-field divider-left">
              <label className="field-label">CHECK-IN / OUT</label>
              <div className="field-input-wrap">
                <Calendar size={16} className="search-icon" />
                <span className="field-static-val">Flexible holiday dates</span>
              </div>
            </div>

            <div className="search-field divider-left">
              <label className="field-label">GUESTS</label>
              <div className="field-input-wrap">
                <Users size={16} className="search-icon" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="search-select"
                >
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6+ Guests</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Search}
              className="search-submit-btn"
            >
              Explore Stays
            </Button>
          </form>

          {/* Hero CTAs */}
          <div className="hero-quick-links">
            <span className="quick-label">Trending Now:</span>
            <Link to="/explore?destination=Goa" className="quick-tag">Ashwem Villas</Link>
            <Link to="/explore?destination=Pondicherry" className="quick-tag">Franco-Tamil Courtyards</Link>
            <Link to="/explore?destination=Coorg" className="quick-tag">Coffee Estates</Link>
            <Link to="/concierge" className="quick-tag concierge-highlight">
              <Sparkles size={12} /> Explore In-Villa Dining
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Stays Section */}
      <section className="section-spacing featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-subtitle">HANDPICKED SANCTUARIES</span>
              <h2 className="section-title">Featured Holiday Stays</h2>
              <p className="section-desc">
                Personally inspected properties with exceptional architectural character, private pools, and bespoke concierge hospitality.
              </p>
            </div>
            <Link to="/explore">
              <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
                View All Stays
              </Button>
            </Link>
          </div>

          <div className="property-grid-four">
            {featuredStays.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Why StayEase Section */}
      <section className="section-spacing why-section">
        <div className="container">
          <div className="text-center section-header">
            <span className="section-subtitle">THE STAYEASE PHILOSOPHY</span>
            <h2 className="section-title">Effortless Holiday Living</h2>
            <p className="section-desc centered">
              We bridge the warmth of authentic Indian private villas with five-star hotel attentiveness.
            </p>
          </div>

          <div className="why-cards-grid">
            <div className="why-card">
              <div className="why-icon-circle">
                <Compass size={24} />
              </div>
              <h3 className="why-card-title">Curated Stays</h3>
              <p className="why-card-text">
                Every property undergoes a 45-point inspection covering sleep comfort, architectural privacy, water pressure, and serenity.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-circle">
                <Sparkles size={24} />
              </div>
              <h3 className="why-card-title">Dedicated Concierge</h3>
              <p className="why-card-text">
                From stocking your favorite organic teas before arrival to arranging chauffeured airport pickups and private seafood feasts.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-circle">
                <ShieldCheck size={24} />
              </div>
              <h3 className="why-card-title">Vetted Local Providers</h3>
              <p className="why-card-text">
                Our drivers, private chefs, yoga instructors, and technicians are verified locals with background checks and proven track records.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon-circle">
                <HeartHandshake size={24} />
              </div>
              <h3 className="why-card-title">Hassle-Free Peace of Mind</h3>
              <p className="why-card-text">
                Any maintenance ticket or custom celebration request is triaged immediately by your personal stay coordinator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concierge Marketplace Showcase */}
      <section className="section-spacing concierge-showcase-section">
        <div className="container">
          <div className="concierge-banner-card">
            <div className="concierge-banner-content">
              <span className="concierge-tag">ON-GROUND HOSPITALITY</span>
              <h2 className="concierge-title">What can we take care of for you?</h2>
              <p className="concierge-desc">
                Your holiday should feel unburdened. Tap into our curated menu of in-stay comforts, delivered directly to your villa doorstep.
              </p>

              <div className="concierge-categories-pills">
                {conciergeCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/concierge?category=${cat.id}`}
                    className="concierge-cat-pill"
                  >
                    <span>{cat.title}</span>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>

              <div className="concierge-cta-row">
                <Link to="/concierge">
                  <Button variant="primary" size="lg" icon={Sparkles}>
                    Explore Concierge Services
                  </Button>
                </Link>
              </div>
            </div>

            <div className="concierge-banner-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80"
                alt="Concierge hospitality in Indian retreat"
                className="concierge-banner-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section className="section-spacing destinations-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">INSPIRING LOCALES</span>
            <h2 className="section-title">Popular Indian Destinations</h2>
            <p className="section-desc">
              From sun-drenched Arabian Sea coastlines to misty Nilgiri tea hills and royal desert courtyards.
            </p>
          </div>

          <div className="destinations-grid">
            {destinationsList.map((dest) => (
              <Link
                key={dest.name}
                to={`/explore?destination=${encodeURIComponent(dest.name)}`}
                className="destination-tile"
              >
                <img src={dest.image} alt={dest.name} className="destination-img" />
                <div className="destination-overlay" />
                <div className="destination-info">
                  <span className="dest-count">{dest.count}</span>
                  <h3 className="dest-name">{dest.name}</h3>
                  <p className="dest-tagline">{dest.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing how-it-works-section">
        <div className="container">
          <div className="text-center section-header">
            <span className="section-subtitle">THE PROCESS</span>
            <h2 className="section-title">How StayEase Works</h2>
            <p className="section-desc centered">
              Four simple steps between your busy life and serene holiday bliss.
            </p>
          </div>

          <div className="steps-sequence">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3 className="step-heading">Discover a Stay</h3>
              <p className="step-text">
                Browse our curated sanctuaries across Goa, Pondicherry, Kerala, Coorg, Ooty, and Rajasthan.
              </p>
            </div>

            <div className="step-connector" />

            <div className="step-card">
              <span className="step-num">02</span>
              <h3 className="step-heading">Book Effortlessly</h3>
              <p className="step-text">
                Reserve transparently with immediate confirmation, flexible dates, and prototype payment simulator.
              </p>
            </div>

            <div className="step-connector" />

            <div className="step-card">
              <span className="step-num">03</span>
              <h3 className="step-heading">Request Anything</h3>
              <p className="step-text">
                Use your Concierge dashboard to order airport transfers, private chefs, fresh groceries, or tours.
              </p>
            </div>

            <div className="step-connector" />

            <div className="step-card">
              <span className="step-num">04</span>
              <h3 className="step-heading">Relax & Enjoy</h3>
              <p className="step-text">
                Arrive to chilled drinks, ambient air conditioning, and on-call local support throughout your stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="section-spacing cta-banner-section">
        <div className="container">
          <div className="final-cta-card">
            <h2 className="final-cta-title">Your stay should feel effortless.</h2>
            <p className="final-cta-desc">
              Experience the tranquility of India’s finest holiday homes with genuine hospitality at your fingertips.
            </p>
            <div className="final-cta-buttons">
              <Link to="/explore">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Explore StayEase
                </Button>
              </Link>
              <Link to="/concierge">
                <Button variant="secondary" size="lg">
                  View Concierge Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
