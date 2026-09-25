import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import Button from '../common/Button';
import './FilterPanel.css';

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  totalResults
}) {
  const destinations = ['All', 'Goa', 'Pondicherry', 'Coorg', 'Kerala', 'Ooty', 'Jaipur', 'Udaipur', 'Manali'];
  const propertyTypes = ['All', 'Beachfront Villa', 'Heritage Villa', 'Plantation Estate', 'Waterfront Villa', 'Hill Cottage', 'Heritage Haveli'];
  const amenitiesList = [
    'Private Swimming Pool',
    'Air Conditioning in All Rooms',
    'High-Speed Wi-Fi (300 Mbps)',
    'Chef-Prepared Kodava Meals',
    'Wood Fireplace (Firewood provided)',
    'Lagoon-Edge Private Infinity Pool'
  ];

  return (
    <div className="filter-panel-card">
      {/* Search Header */}
      <div className="filter-search-row">
        <div className="filter-search-box">
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search destination, villa name, or scenic region..."
            value={filters.searchQuery}
            onChange={(e) => onChange('searchQuery', e.target.value)}
          />
        </div>

        <div className="filter-actions-right">
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={onReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Destination Pills */}
      <div className="filter-group">
        <label className="filter-label">Destination</label>
        <div className="filter-chips-scroll">
          {destinations.map((dest) => (
            <button
              key={dest}
              type="button"
              className={`filter-chip ${filters.destination === dest ? 'active' : ''}`}
              onClick={() => onChange('destination', dest)}
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-grid-row">
        {/* Property Type Dropdown */}
        <div className="filter-subgroup">
          <label className="filter-label">Stay Architecture</label>
          <select
            className="filter-select"
            value={filters.propertyType}
            onChange={(e) => onChange('propertyType', e.target.value)}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Guests Count */}
        <div className="filter-subgroup">
          <label className="filter-label">Minimum Guests</label>
          <select
            className="filter-select"
            value={filters.minGuests}
            onChange={(e) => onChange('minGuests', Number(e.target.value))}
          >
            <option value={1}>1+ Guests</option>
            <option value={2}>2+ Guests (Couples)</option>
            <option value={4}>4+ Guests (Small Family)</option>
            <option value={6}>6+ Guests (Large Group)</option>
          </select>
        </div>

        {/* Price Maximum */}
        <div className="filter-subgroup">
          <label className="filter-label">
            Max Nightly Rate: <strong>₹{filters.maxPrice.toLocaleString('en-IN')}</strong>
          </label>
          <input
            type="range"
            min="9000"
            max="30000"
            step="1000"
            value={filters.maxPrice}
            onChange={(e) => onChange('maxPrice', Number(e.target.value))}
            className="filter-range-slider"
          />
        </div>
      </div>
    </div>
  );
}
