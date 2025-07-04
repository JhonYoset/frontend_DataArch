import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, LogIn, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../Auth/LoginModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin, loading } = useAuth();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.team'), href: '/team' },
    { name: t('nav.announcements'), href: '/announcements' },
    { name: t('nav.calendar'), href: '/calendar' },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAdminAccess = () => {
    navigate('/admin');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/data_arch_code_logo.jpeg"
                alt="Data Arch Labs"
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary-600">Data Arch Labs</h1>
                <p className="text-sm text-gray-600">{t('home.subtitle')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase">{i18n.language}</span>
              </button>

              {/* Auth Controls */}
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span className="text-sm text-gray-600">{t('common.loading')}</span>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  {/* User Info */}
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-md">
                    <User className="h-4 w-4 text-gray-600" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {user.full_name || user.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-gray-600 capitalize">
                        {user.role === 'admin' ? t('auth.administrator') : t('auth.member')}
                      </div>
                    </div>
                  </div>

                  {/* Admin Dashboard Button */}
                  {isAdmin && (
                    <button
                      onClick={handleAdminAccess}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('auth.adminDashboard')}</span>
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('auth.signOut')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('auth.signIn')}</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile User Info */}
                {user && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      {t('auth.connectedAs')}: <span className="font-medium">{user.full_name || user.email}</span>
                    </div>
                    
                    {isAdmin && (
                      <button
                        onClick={handleAdminAccess}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        {t('auth.adminDashboard_mobile')}
                      </button>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {t('auth.signOut_mobile')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Header;