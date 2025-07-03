import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Briefcase, Megaphone, Calendar, Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TeamMemberManager from './TeamMemberManager';
import ProjectManager from './ProjectManager';
import AnnouncementManager from './AnnouncementManager';
import EventManager from './EventManager';
import AdminStats from './AdminStats';

type ActiveTab = 'overview' | 'team' | 'projects' | 'announcements' | 'events';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Listen for admin actions from quick actions
  useEffect(() => {
    const handleAdminAction = (event: CustomEvent) => {
      const { tab, action } = event.detail;
      setActiveTab(tab);
      
      // Trigger the add form for the specific component
      if (action === 'add') {
        setTimeout(() => {
          const addEvent = new CustomEvent('triggerAddForm');
          window.dispatchEvent(addEvent);
        }, 100);
      }
    };

    window.addEventListener('adminAction', handleAdminAction as EventListener);
    
    return () => {
      window.removeEventListener('adminAction', handleAdminAction as EventListener);
    };
  }, []);

  const tabs = [
    { id: 'overview' as ActiveTab, name: 'Overview', icon: BarChart3 },
    { id: 'team' as ActiveTab, name: t('admin.manageTeam'), icon: Users },
    { id: 'projects' as ActiveTab, name: t('admin.manageProjects'), icon: Briefcase },
    { id: 'announcements' as ActiveTab, name: t('admin.manageAnnouncements'), icon: Megaphone },
    { id: 'events' as ActiveTab, name: t('admin.manageEvents'), icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminStats />;
      case 'team':
        return <TeamMemberManager />;
      case 'projects':
        return <ProjectManager />;
      case 'announcements':
        return <AnnouncementManager />;
      case 'events':
        return <EventManager />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('admin.dashboard')}
                </h1>
                <p className="text-gray-600 mt-1">
                  Bienvenido de vuelta, {user?.fullName || user?.email}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Administrador
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2 bg-white rounded-lg shadow-sm p-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;