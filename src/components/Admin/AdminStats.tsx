import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Megaphone, Calendar, TrendingUp, Activity } from 'lucide-react';
import { teamMembersAPI, projectsAPI, announcementsAPI, eventsAPI } from '../../lib/api';

interface Stats {
  totalMembers: number;
  activeProjects: number;
  totalAnnouncements: number;
  upcomingEvents: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
  }>;
}

const AdminStats: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    activeProjects: 0,
    totalAnnouncements: 0,
    upcomingEvents: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [membersRes, projectsRes, announcementsRes, eventsRes] = await Promise.all([
        teamMembersAPI.getAll(),
        projectsAPI.getAll(),
        announcementsAPI.getAll(),
        eventsAPI.getAll(),
      ]);

      // Filter active projects
      const activeProjects = (projectsRes.data || []).filter((p: any) => p.status === 'active');
      
      // Filter upcoming events
      const upcomingEvents = (eventsRes.data || []).filter((e: any) => 
        new Date(e.date) >= new Date()
      );

      // Create recent activity
      const recentProjects = (projectsRes.data || []).slice(0, 3).map((p: any) => ({
        id: p.id,
        type: 'project',
        description: `Nuevo proyecto: ${p.name}`,
        date: p.createdAt,
      }));

      const recentAnnouncements = (announcementsRes.data || []).slice(0, 3).map((a: any) => ({
        id: a.id,
        type: 'announcement',
        description: `Nuevo anuncio: ${a.title}`,
        date: a.createdAt,
      }));

      const recentActivity = [...recentProjects, ...recentAnnouncements]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setStats({
        totalMembers: membersRes.data?.length || 0,
        activeProjects: activeProjects.length,
        totalAnnouncements: announcementsRes.data?.length || 0,
        upcomingEvents: upcomingEvents.length,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    // Navigate to the specific admin section and trigger the add form
    switch (action) {
      case 'team':
        navigate('/admin');
        // Use setTimeout to ensure navigation completes first
        setTimeout(() => {
          // Trigger team tab and add form
          const event = new CustomEvent('adminAction', { 
            detail: { tab: 'team', action: 'add' } 
          });
          window.dispatchEvent(event);
        }, 100);
        break;
      case 'project':
        navigate('/admin');
        setTimeout(() => {
          const event = new CustomEvent('adminAction', { 
            detail: { tab: 'projects', action: 'add' } 
          });
          window.dispatchEvent(event);
        }, 100);
        break;
      case 'announcement':
        navigate('/admin');
        setTimeout(() => {
          const event = new CustomEvent('adminAction', { 
            detail: { tab: 'announcements', action: 'add' } 
          });
          window.dispatchEvent(event);
        }, 100);
        break;
      case 'event':
        navigate('/admin');
        setTimeout(() => {
          const event = new CustomEvent('adminAction', { 
            detail: { tab: 'events', action: 'add' } 
          });
          window.dispatchEvent(event);
        }, 100);
        break;
    }
  };

  const statCards = [
    {
      title: 'Miembros del Equipo',
      value: stats.totalMembers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Proyectos Activos',
      value: stats.activeProjects,
      icon: Briefcase,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Anuncios Totales',
      value: stats.totalAnnouncements,
      icon: Megaphone,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Eventos Próximos',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Panel de Control</h2>
        <p className="text-gray-600">Resumen general de la actividad del grupo de investigación</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Activity className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        </div>
        
        {stats.recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'project' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-gray-900">{activity.description}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction('team')}
            className="flex items-center justify-center p-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            Agregar Miembro
          </button>
          <button 
            onClick={() => handleQuickAction('project')}
            className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Briefcase className="h-5 w-5 mr-2" />
            Nuevo Proyecto
          </button>
          <button 
            onClick={() => handleQuickAction('announcement')}
            className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Megaphone className="h-5 w-5 mr-2" />
            Crear Anuncio
          </button>
          <button 
            onClick={() => handleQuickAction('event')}
            className="flex items-center justify-center p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Programar Evento
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;