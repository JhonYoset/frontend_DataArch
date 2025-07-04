import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on user role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t('auth.completingAuth')}</p>
      </div>
    </div>
  );
};

export default AuthCallback;