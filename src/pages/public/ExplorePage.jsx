import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PropertyCard from '../../components/property/PropertyCard';
import FilterPanel from '../../components/property/FilterPanel';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import './ExplorePage.css';

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || 'All';

  const { properties } = useApp();

  const [filters, setFilters] = useState({
    searchQuery: '',
    destination: initialDestination,
    propertyType: 'All',
    minGuests: 1,
    maxPrice: 30000
  });

  const [sortBy, setSortBy] = useState('featured'); // featured, price_asc, price_desc, rating

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      destination: 'All',
      propertyType: 'All',
      minGuests: 1,
      maxPrice: 30000
    });
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Destination filter
      if (
        filters.destination !== 'All' &&
        !p.location.toLowerCase().includes(filters.destination.toLowerCase()) &&
        !p.state.toLowerCase().includes(filters.destination.toLowerCase())
      ) {
        return false;
      }

      // Property type
      if (filters.propertyType !== 'All' && p.type !== filters.propertyType) {
        return false;
      }

      // Guests
      if (p.guests < filters.minGuests) {
        return false;
      }

      // Max price
      if (p.pricePerNight > filters.maxPrice) {
        return false;
      }

      // Text search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesTag = p.tagline.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesTag && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price_desc') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [properties, filters, sortBy]);

  return (
    <div className="explore-page">
      <div className="explore-header-banner">
        <div className="container">
          <span className="section-subtitle">TRANQUIL INDIAN RETREATS</span>
          <h1 className="explore-main-title">Explore Holiday Stays</h1>
          <p className="explore-main-desc">
            Discover bespoke coastal sanctuaries, tea plantation manors, and heritage courtyards with personal concierge service.
          </p>
        </div>
      </div>

      <div className="container explore-content-container">
        {/* Interactive Filter Panel */}
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResults={filteredProperties.length}
        />

        {/* Results Bar */}
        <div className="explore-results-bar">
          <div className="results-count">
            Showing <strong>{filteredProperties.length}</strong> holiday{' '}
            {filteredProperties.length === 1 ? 'stay' : 'stays'} across India
          </div>

          <div className="sort-control-group">
            <span className="sort-label">Sort by:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured & Curated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Guest Rated</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="explore-grid">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="explore-no-results">
            <Sparkles size={36} className="no-results-icon" />
            <h3 className="no-results-title">No stays match your criteria</h3>
            <p className="no-results-desc">
              Try expanding your budget slider or resetting the destination chips to view all available boutique sanctuaries.
            </p>
            <button
              type="button"
              className="btn btn-outline btn-md"
              onClick={handleResetFilters}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
