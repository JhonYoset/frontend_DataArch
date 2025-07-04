import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const { t } = useTranslation();

  console.log('🛡️ ProtectedRoute check:', { 
    loading, 
    hasUser: !!user, 
    userEmail: user?.email, 
    isAdmin, 
    requireAdmin 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('auth.verifyingAuth')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ No user found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('❌ Admin required but user is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;