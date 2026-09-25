import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, currentRole } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    // Redirect to their own role dashboard
    const roleRoutes = {
      guest: '/guest/dashboard',
      owner: '/owner/dashboard',
      provider: '/provider/dashboard',
      admin: '/admin/dashboard'
    };
    const targetDashboard = roleRoutes[currentRole] || '/guest/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}
