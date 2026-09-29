import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
	Users,
	Search,
	Filter,
	Star,
	Home,
	Building,
	CreditCard,
	Phone,
	Mail,
	MapPin,
	ShieldCheck,
	CheckCircle,
	Award,
	ArrowRight,
	ExternalLink,
	DollarSign,
	Landmark
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import EmptyState from '../../components/admin/EmptyState';
import Button from '../../components/common/Button';
import './AdminOwnersPage.css';

export default function AdminOwnersPage() {
	const { properties, showToast } = useApp();
	const { owners, setOwners, updateOwner, paymentTransactions, addAuditLog } = useAdmin();
	const navigate = useNavigate();

	const [searchParams, setSearchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	const selectedOwnerId = searchParams.get('id');
	const [drawerOwner, setDrawerOwner] = useState(() => {
		return (owners && owners.find((o) => o.id === selectedOwnerId)) || null;
	});

	const filteredOwners = useMemo(() => {
		if (!owners) return [];
		return owners.filter((o) => {
			if (statusFilter !== 'all' && o.status !== statusFilter) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchesProps = o.properties?.some((p) => p.toLowerCase().includes(q));
				return (
					o.name.toLowerCase().includes(q) ||
					o.email.toLowerCase().includes(q) ||
					o.phone.includes(q) ||
					(o.city && o.city.toLowerCase().includes(q)) ||
					matchesProps
				);
			}
			return true;
		});
	}, [owners, statusFilter, searchQuery]);

	const handleOpenDetail = (o) => {
		setDrawerOwner(o);
		setSearchParams({ id: o.id });
	};

	const handleCloseDetail = () => {
		setDrawerOwner(null);
		setSearchParams({});
	};

	const handleToggleSuperhost = (owner) => {
		const newStatus = owner.status === 'superhost' ? 'verified' : 'superhost';
		updateOwner(owner.id, { status: newStatus });
		if (drawerOwner?.id === owner.id) {
			setDrawerOwner({ ...drawerOwner, status: newStatus });
		}
		addAuditLog('Updated Owner Tier', 'Owner', owner.id, owner.status, newStatus, owner.name);
		showToast(`Host ${owner.name} updated to ${newStatus.toUpperCase()}`, 'info');
	};

	// Drawer associated properties and bilateral payments
	const ownerProperties = drawerOwner
		? properties.filter(
			(p) =>
				p.ownerId === drawerOwner.id ||
				p.ownerName === drawerOwner.name ||
				drawerOwner.properties?.includes(p.name)
		)
		: [];

	const ownerSettlements = drawerOwner
		? paymentTransactions.filter(
			(t) =>
				t.ownerId === drawerOwner.id ||
				t.ownerName === drawerOwner.name ||
				t.ownerEmail === drawerOwner.email
		)
		: [];

	return (
		<AdminLayout>
			<div className="admin-owners-page">
				<PageHeader
					title="Property Owner Directory & Host Relations"
					subtitle="Directory of verified holiday home hosts, active property portfolios, verified banking details, and revenue settlements with Super Admin"
					breadcrumbs={[
						{ label: 'Admin', path: '/admin/dashboard' },
						{ label: 'Owners' }
					]}
				/>

				{/* Filter Controls */}
				<div className="owners-filter-bar">
					<div className="filter-search-input">
						<Search size={16} className="filter-icon" />
						<input
							type="text"
							placeholder="Search by host name, email, phone, city or property name..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="filter-selects-row">
						<select
							className="admin-select"
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
						>
							<option value="all">All Host Tiers</option>
							<option value="superhost">Superhosts Only</option>
							<option value="verified">Verified Hosts</option>
							<option value="active">Active Hosts</option>
						</select>

						{(searchQuery || statusFilter !== 'all') && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setSearchQuery('');
									setStatusFilter('all');
								}}
							>
								Reset
							</Button>
						)}
					</div>
				</div>

				{/* Directory Table */}
				{filteredOwners.length === 0 ? (
					<EmptyState
						icon={Users}
						title="No property owners found"
						description="No host accounts match your search filter."
						actionText="Clear Filters"
						onAction={() => {
							setSearchQuery('');
							setStatusFilter('all');
						}}
					/>
				) : (
					<div className="admin-table-container">
						<table className="admin-data-table">
							<thead>
								<tr>
									<th>PROPERTY OWNER</th>
									<th>CONTACT DETAILS</th>
									<th>LOCATION</th>
									<th>PORTFOLIO</th>
									<th>TOTAL SETTLEMENTS</th>
									<th>COMMISSION PAID</th>
									<th>HOST STATUS</th>
									<th style={{ textAlign: 'right' }}>ACTIONS</th>
								</tr>
							</thead>
							<tbody>
								{filteredOwners.map((o) => (
									<tr key={o.id} onClick={() => handleOpenDetail(o)} style={{ cursor: 'pointer' }}>
										<td>
											<div className="owner-col-cell">
												<img src={o.avatar} alt={o.name} className="owner-table-avatar" />
												<div>
													<div className="owner-name-row">
														<strong className="owner-row-name">{o.name}</strong>
														{o.status === 'superhost' && (
															<span className="superhost-inline-badge" title="Verified Superhost">
																<Award size={12} /> Superhost
															</span>
														)}
													</div>
													<span className="member-since">Host since {o.memberSince || '2023'} • ★ {o.rating || '4.9'}</span>
												</div>
											</div>
										</td>
										<td>
											<div className="owner-contact-cell">
												<span><Mail size={12} /> {o.email}</span>
												<span><Phone size={12} /> {o.phone}</span>
											</div>
										</td>
										<td>
											<span className="owner-city-text">
												<MapPin size={12} /> {o.city}, {o.state}
											</span>
										</td>
										<td>
											<div className="portfolio-cell">
												<strong className="prop-count-val">{o.propertiesCount} {o.propertiesCount === 1 ? 'Property' : 'Properties'}</strong>
												<span className="portfolio-sub">{o.properties?.slice(0, 2).join(', ')}{o.properties?.length > 2 ? '...' : ''}</span>
											</div>
										</td>
										<td>
											<strong className="table-amount highlight-payout">₹{o.totalPayouts?.toLocaleString('en-IN')}</strong>
											<span className="cell-sub-label">Disbursed by Super Admin</span>
										</td>
										<td>
											<strong className="table-amount">₹{o.commissionPaid?.toLocaleString('en-IN')}</strong>
											<span className="cell-sub-label">10% Platform Retention</span>
										</td>
										<td>
											<StatusBadge status={o.status} />
										</td>
										<td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
											<div className="table-row-actions">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleToggleSuperhost(o)}
												>
													{o.status === 'superhost' ? 'Revoke Superhost' : 'Make Superhost'}
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleOpenDetail(o)}
												>
													Profile
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Detailed Owner Drawer */}
				{drawerOwner && (
					<DetailDrawer
						isOpen={Boolean(drawerOwner)}
						onClose={handleCloseDetail}
						title={drawerOwner.name}
						subtitle={`${drawerOwner.city}, ${drawerOwner.state} • ${drawerOwner.propertiesCount} Properties • Host since ${drawerOwner.memberSince}`}
						badges={<StatusBadge status={drawerOwner.status} />}
						width="600px"
						footer={
							<div className="drawer-footer-actions">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleToggleSuperhost(drawerOwner)}
								>
									{drawerOwner.status === 'superhost' ? 'Remove Superhost Tier' : 'Upgrade to Superhost'}
								</Button>
								<Button
									variant="primary"
									size="sm"
									onClick={() => showToast(`Direct communication channel opened with ${drawerOwner.email}`, 'info')}
								>
									Contact Host
								</Button>
							</div>
						}
					>
						{/* Owner Profile Card */}
						<div className="drawer-owner-profile-box">
							<img src={drawerOwner.avatar} alt={drawerOwner.name} className="owner-drawer-avatar" />
							<div className="owner-drawer-meta">
								<div className="drawer-name-heading">
									<h4 className="owner-profile-name">{drawerOwner.name}</h4>
									{drawerOwner.status === 'superhost' && (
										<span className="superhost-pill"><Award size={13} /> Superhost</span>
									)}
								</div>
								<p className="owner-profile-sub">{drawerOwner.email} • {drawerOwner.phone}</p>
								<span className="owner-pref-note">
									<strong>Host Dossier:</strong> {drawerOwner.notes || 'Verified property host with high-quality luxury holiday listings.'}
								</span>
							</div>
						</div>

						{/* Lifetime Financial KPI Strip (Super Admin <-> Owner) */}
						<div className="owner-kpi-strip">
							<div className="o-stat-box">
								<span className="o-stat-lbl">Settlements Disbursed</span>
								<strong className="o-stat-val">₹{drawerOwner.totalPayouts?.toLocaleString('en-IN')}</strong>
							</div>
							<div className="o-stat-box">
								<span className="o-stat-lbl">Commission Retained</span>
								<strong className="o-stat-val">₹{drawerOwner.commissionPaid?.toLocaleString('en-IN')}</strong>
							</div>
							<div className="o-stat-box">
								<span className="o-stat-lbl">Active Properties</span>
								<strong className="o-stat-val">{drawerOwner.propertiesCount}</strong>
							</div>
							<div className="o-stat-box">
								<span className="o-stat-lbl">Host Quality Score</span>
								<strong className="o-stat-val">★ {drawerOwner.rating || '4.9'}</strong>
							</div>
						</div>

						{/* Verified Banking & KYC Details */}
						<div className="drawer-section">
							<h5 className="section-sub-title">Verified Bank & Settlement Details</h5>
							<div className="bank-details-card">
								<div className="bank-card-icon">
									<Landmark size={24} color="var(--primary, #ED7014)" />
								</div>
								<div className="bank-card-info">
									<div className="bank-name-row">
										<strong>{drawerOwner.bankDetails?.bankName || 'HDFC Bank'}</strong>
										<span className="kyc-badge"><ShieldCheck size={13} /> KYC Verified</span>
									</div>
									<p className="bank-meta">
										A/C Holder: <strong>{drawerOwner.bankDetails?.accountHolder || drawerOwner.name}</strong> • Account: <strong>•••• {drawerOwner.bankDetails?.accountEnding || '4892'}</strong>
									</p>
									<p className="bank-meta">
										IFSC: <strong>{drawerOwner.bankDetails?.ifsc || 'HDFC0001024'}</strong> • Payout Mode: <strong>Direct NEFT / RTGS Treasury Settlement</strong>
									</p>
								</div>
							</div>
						</div>

						{/* Properties Listed */}
						<div className="drawer-section">
							<h5 className="section-sub-title">Managed Property Portfolio ({ownerProperties.length || drawerOwner.propertiesCount})</h5>
							{ownerProperties.length === 0 ? (
								<div className="owner-props-summary-list">
									{drawerOwner.properties?.map((propName, idx) => (
										<div key={idx} className="drawer-sub-entry">
											<div>
												<strong>{propName}</strong>
												<p>{drawerOwner.city}, {drawerOwner.state} • Luxury Villa</p>
											</div>
											<span className="prop-status-tag active">Active Listing</span>
										</div>
									))}
								</div>
							) : (
								<div className="drawer-props-grid">
									{ownerProperties.map((p) => (
										<div key={p.id} className="drawer-prop-mini-card">
											<img src={p.coverImage || p.images?.[0]} alt={p.name} className="prop-mini-thumb" />
											<div className="prop-mini-meta">
												<strong className="prop-mini-name">{p.name}</strong>
												<span className="prop-mini-loc">{p.location}</span>
												<div className="prop-mini-rate">
													<strong>₹{p.pricePerNight?.toLocaleString('en-IN')}</strong> / night
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Direct Bilateral Settlements with Super Admin */}
						<div className="drawer-section">
							<h5 className="section-sub-title">Settlement Ledger with Super Admin</h5>
							{ownerSettlements.length === 0 ? (
								<div className="owner-sub-empty">No recent direct settlements recorded for this billing cycle.</div>
							) : (
								ownerSettlements.map((s) => (
									<div key={s.id} className="drawer-sub-entry">
										<div>
											<div className="settlement-ref-row">
												<strong>{s.id}</strong>
												<span className={`flow-tag ${s.flowType || 'payout'}`}>
													{s.flow || 'Super Admin → Owner'}
												</span>
											</div>
											<p>{s.propertyName} • {s.paymentMethod} • Ref: {s.utrNumber || s.id}</p>
										</div>
										<div style={{ textAlign: 'right' }}>
											<strong className="settlement-val">₹{s.amount?.toLocaleString('en-IN')}</strong>
											<div><StatusBadge status={s.status} /></div>
										</div>
									</div>
								))
							)}
						</div>
					</DetailDrawer>
				)}
			</div>
		</AdminLayout>
	);
}
