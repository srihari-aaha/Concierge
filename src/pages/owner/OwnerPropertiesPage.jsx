import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, MapPin, Sparkles, Check, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function OwnerPropertiesPage() {
  const { properties, addProperty, updatePropertyStatus, currentUser } = useApp();

  const myProperties = properties.filter(
    (p) => p.ownerId === currentUser.id || p.ownerName === currentUser.name
  );

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [location, setLocation] = useState('Anjuna, North Goa');
  const [state, setState] = useState('Goa');
  const [type, setType] = useState('Beachfront Villa');
  const [pricePerNight, setPricePerNight] = useState(15000);
  const [guests, setGuests] = useState(6);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [beds, setBeds] = useState(3);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
  );

  const handleCreateProperty = (e) => {
    e.preventDefault();
    addProperty({
      name,
      tagline: tagline || 'Peaceful bespoke holiday villa with private pool',
      location,
      state,
      region: 'West',
      type,
      pricePerNight: Number(pricePerNight),
      guests: Number(guests),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      beds: Number(beds),
      description: description || 'A serene holiday stay nestled amidst nature.',
      coverImage,
      amenities: [
        'Private Swimming Pool',
        'Air Conditioning in All Rooms',
        'High-Speed Wi-Fi (300 Mbps)',
        'Villa Attendant',
        'Kitchen'
      ],
      houseRules: [
        'Check-in: 2:00 PM | Check-out: 11:00 AM',
        'Quiet hours after 10:30 PM'
      ]
    });

    setAddModalOpen(false);
    setName('');
    setTagline('');
    setDescription('');
  };

  return (
    <DashboardLayout
      title="Property Inventory"
      subtitle="Manage your luxury homestays, pricing, and live availability on StayEase"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Managing <strong>{myProperties.length}</strong> listed properties
            </span>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setAddModalOpen(true)}
          >
            Add New Property
          </Button>
        </div>

        {/* Properties Table / Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {myProperties.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-card)',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '180px 1fr auto',
                gap: '1.75rem',
                alignItems: 'center',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <img
                src={p.coverImage}
                alt={p.name}
                style={{
                  width: '100%',
                  height: '120px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text)' }}>
                    {p.name}
                  </h3>
                  <Badge
                    variant={
                      p.status === 'active'
                        ? 'sage'
                        : p.status === 'pending_approval'
                        ? 'pending'
                        : 'default'
                    }
                    size="sm"
                  >
                    {p.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <MapPin size={13} color="var(--accent)" />
                  <span>{p.location}</span>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  <span><strong>Rate:</strong> ₹{p.pricePerNight.toLocaleString('en-IN')}/night</span>
                  <span><strong>Capacity:</strong> {p.guests} Guests ({p.bedrooms} Beds)</span>
                  <span><strong>Rating:</strong> {p.rating.toFixed(2)} ★</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    background: 'var(--surface-warm)',
                    color: 'var(--text)'
                  }}
                  value={p.status}
                  onChange={(e) => updatePropertyStatus(p.id, e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Add Property Modal */}
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="List a New Holiday Sanctuary"
          subtitle="Submit your property for StayEase curation and concierge connectivity"
          maxWidth="600px"
        >
          <form onSubmit={handleCreateProperty} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Property Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tamarind Grove Villa"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Tagline / Soul of the Stay
              </label>
              <input
                type="text"
                placeholder="e.g. Portuguese architecture framed by swaying betel palms"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Location (Locality, City)
                </label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Property Architecture Type
                </label>
                <select
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Beachfront Villa">Beachfront Villa</option>
                  <option value="Heritage Villa">Heritage Villa</option>
                  <option value="Plantation Estate">Plantation Estate</option>
                  <option value="Waterfront Villa">Waterfront Villa</option>
                  <option value="Hill Cottage">Hill Cottage</option>
                  <option value="Heritage Haveli">Heritage Haveli</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Rate (₹/night)
                </label>
                <input
                  type="number"
                  style={{ width: '100%', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Max Guests
                </label>
                <input
                  type="number"
                  style={{ width: '100%', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  style={{ width: '100%', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  style={{ width: '100%', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Cover Photo URL
              </label>
              <input
                type="text"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Description
              </label>
              <textarea
                rows={3}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'var(--surface-warm)', outline: 'none' }}
                placeholder="Describe the mood, surroundings, nearby beaches, and architectural highlights..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="ghost" size="md" onClick={() => setAddModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" icon={Plus}>
                Submit Property
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
