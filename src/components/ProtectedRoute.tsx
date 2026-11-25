import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ role, children }: { role: 'member' | 'admin'; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-[60vh] place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-text"/></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
