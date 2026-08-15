import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false, requireAuth = false }) => {
  const { isAuthenticated, isAdmin, loading, isRouteAllowed, getDefaultAdminRoute } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin mb-4" />
        <p className="font-display text-sm font-bold text-slate-300">Verifying Security Credentials...</p>
      </div>
    );
  }

  // Admin Route Protection
  if (requireAdmin) {
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (!isRouteAllowed(location.pathname)) {
      const targetPath = getDefaultAdminRoute();
      return <Navigate to={targetPath} replace />;
    }
  }

  // General Customer/User Route Protection
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
