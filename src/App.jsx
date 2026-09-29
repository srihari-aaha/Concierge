import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';

// Common Components & Guards
import Toast from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicNavbar from './components/layout/PublicNavbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import ExplorePage from './pages/public/ExplorePage';
import PropertyDetailPage from './pages/public/PropertyDetailPage';
import ConciergeMarketplacePage from './pages/public/ConciergeMarketplacePage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AboutPage from './pages/public/AboutPage';
import AuthPage from './pages/public/AuthPage';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage';

// Evaluator Test Suite
import DemoCenterPage from './pages/demo/DemoCenterPage';

// Guest Pages
import GuestDashboardPage from './pages/guest/GuestDashboardPage';
import MyStayPage from './pages/guest/MyStayPage';
import GuestBookingsPage from './pages/guest/GuestBookingsPage';
import GuestRequestsPage from './pages/guest/GuestRequestsPage';
import GuestMaintenancePage from './pages/guest/GuestMaintenancePage';
import GuestReviewsPage from './pages/guest/GuestReviewsPage';
import GuestProfilePage from './pages/guest/GuestProfilePage';

// Owner Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import OwnerPropertiesPage from './pages/owner/OwnerPropertiesPage';
import OwnerReservationsPage from './pages/owner/OwnerReservationsPage';
import OwnerConciergePage from './pages/owner/OwnerConciergePage';
import OwnerMaintenancePage from './pages/owner/OwnerMaintenancePage';
import OwnerProvidersPage from './pages/owner/OwnerProvidersPage';
import OwnerEarningsPage from './pages/owner/OwnerEarningsPage';
import OwnerGuestsPage from './pages/owner/OwnerGuestsPage';
import OwnerProfilePage from './pages/owner/OwnerProfilePage';

// Provider Pages
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage';
import ProviderSchedulePage from './pages/provider/ProviderSchedulePage';
import ProviderEarningsPage from './pages/provider/ProviderEarningsPage';
import ProviderProfilePage from './pages/provider/ProviderProfilePage';

// Admin Pages (Complete Operational Suite)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';
import AdminConciergePage from './pages/admin/AdminConciergePage';
import AdminOperationsPage from './pages/admin/AdminOperationsPage';
import AdminGuestsPage from './pages/admin/AdminGuestsPage';
import AdminOwnersPage from './pages/admin/AdminOwnersPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminCommunicationsPage from './pages/admin/AdminCommunicationsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// Cross-role Messages Page
import MessagesPage from './pages/common/MessagesPage';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper for public pages with header & footer
function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicNavbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

function MainApp() {
  const { toast, closeToast } = useApp();

  return (
    <>
      {/* Global Interactive Feedback Toast */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/explore" element={<PublicLayout><ExplorePage /></PublicLayout>} />
        <Route path="/property/:id" element={<PublicLayout><PropertyDetailPage /></PublicLayout>} />
        <Route path="/concierge" element={<PublicLayout><ConciergeMarketplacePage /></PublicLayout>} />
        <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><AuthPage /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><AuthPage /></PublicLayout>} />

        {/* Dedicated Evaluator / Developer Test Control Room */}
        <Route path="/demo" element={<PublicLayout><DemoCenterPage /></PublicLayout>} />

        {/* Guest Portal (Role-Guarded) */}
        <Route
          path="/guest/dashboard"
          element={
            <ProtectedRoute allowedRole="guest">
              <GuestDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/my-stay"
          element={
            <ProtectedRoute allowedRole="guest">
              <MyStayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/stay"
          element={
            <ProtectedRoute allowedRole="guest">
              <MyStayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/bookings"
          element={
            <ProtectedRoute allowedRole="guest">
              <GuestBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/requests"
          element={
            <ProtectedRoute allowedRole="guest">
              <GuestRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/maintenance"
          element={
            <ProtectedRoute allowedRole="guest">
              <GuestMaintenancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/reviews"
          element={
            <ProtectedRoute allowedRole="guest">
              <GuestReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/profile"
          element={
            <ProtectedRoute allowedRole="guest">
              <GuestProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guest/messages"
          element={
            <ProtectedRoute allowedRole="guest">
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Owner Portal (Role-Guarded) */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/properties"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerPropertiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/reservations"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/concierge"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerConciergePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/maintenance"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerMaintenancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/providers"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerProvidersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/earnings"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerEarningsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/guests"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerGuestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/messages"
          element={
            <ProtectedRoute allowedRole="owner">
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Provider Portal (Role-Guarded) */}
        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute allowedRole="provider">
              <ProviderDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/jobs"
          element={
            <ProtectedRoute allowedRole="provider">
              <ProviderDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/schedule"
          element={
            <ProtectedRoute allowedRole="provider">
              <ProviderSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/earnings"
          element={
            <ProtectedRoute allowedRole="provider">
              <ProviderEarningsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/profile"
          element={
            <ProtectedRoute allowedRole="provider">
              <ProviderProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/messages"
          element={
            <ProtectedRoute allowedRole="provider">
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Portal (Role-Guarded Complete Operations Portal) */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminPropertiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/concierge"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminConciergePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/operations"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminOperationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/housekeeping"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminOperationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/maintenance"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminOperationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/owners"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminOwnersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/guests"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminOwnersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminStaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/providers"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminStaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminPaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/communications"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminCommunicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Common Messages Fallback */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AdminProvider>
          <MainApp />
        </AdminProvider>
      </AppProvider>
    </Router>
  );
}
