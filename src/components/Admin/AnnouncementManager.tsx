import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Save, X, Calendar, Search, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { announcementsAPI, eventsAPI } from '../../lib/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  links: string[];
  created_at: string;
}

const AnnouncementManager: React.FC = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    links: [],
  });

  useEffect(() => {
    fetchAnnouncements();
    
    // Listen for trigger add form event
    const handleTriggerAddForm = () => {
      setShowAddForm(true);
    };

    window.addEventListener('triggerAddForm', handleTriggerAddForm);
    
    return () => {
      window.removeEventListener('triggerAddForm', handleTriggerAddForm);
    };
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [announcements, searchTerm]);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsAPI.getAll();
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnnouncements = () => {
    let filtered = announcements;

    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAnnouncements(filtered);
  };

  const createCalendarEvent = async (announcement: any) => {
    try {
      // Create a calendar event for the announcement
      const eventData = {
        title: `Anuncio: ${announcement.title}`,
        description: announcement.content,
        date: announcement.date,
        time: '09:00', // Default time
        location: 'Portal Web',
        type: 'other'
      };

      await eventsAPI.create(eventData);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      // Don't fail the announcement creation if calendar event fails
    }
  };

  const handleSave = async () => {
    try {
      let savedAnnouncement;
      
      if (editingId) {
        // Update existing announcement
        savedAnnouncement = await announcementsAPI.update(editingId, formData);
      } else {
        // Create new announcement
        savedAnnouncement = await announcementsAPI.create(formData);
        
        // Create calendar event for new announcements
        if (savedAnnouncement.data) {
          await createCalendarEvent(savedAnnouncement.data);
        }
      }

      await fetchAnnouncements();
      resetForm();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Error al guardar el anuncio. Por favor, intenta de nuevo.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) return;

    try {
      await announcementsAPI.delete(id);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error al eliminar el anuncio. Por favor, intenta de nuevo.');
    }
  };

  const startEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData(announcement);
    setShowAddForm(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      links: [],
    });
  };

  const handleLinksChange = (value: string) => {
    const links = value.split('\n').map(link => link.trim()).filter(link => link);
    setFormData({ ...formData, links });
  };

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('admin.manageAnnouncements')}</h2>
          <p className="text-gray-600 mt-1">Gestiona los anuncios del grupo de investigación</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Anuncio
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar anuncios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? 'Editar Anuncio' : 'Crear Nuevo Anuncio'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Escribe el contenido del anuncio..."
              required
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enlaces (una URL por línea)
            </label>
            <textarea
              value={formData.links?.join('\n') || ''}
              onChange={(e) => handleLinksChange(e.target.value)}
              rows={3}
              placeholder="https://example.com&#10;https://meet.google.com/abc-defg-hij"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {!editingId && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                📅 Se creará automáticamente un evento en el calendario para este anuncio.
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4 mr-2 inline" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2 inline" />
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{announcement.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(new Date(announcement.date), 'dd/MM/yyyy')}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(announcement)}
                  className="text-primary-600 hover:text-primary-700 p-1 rounded"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="text-red-600 hover:text-red-700 p-1 rounded"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3 whitespace-pre-line line-clamp-3">{announcement.content}</p>
            
            {announcement.links && announcement.links.length > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Enlaces:</h4>
                <div className="space-y-1">
                  {announcement.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm mr-4"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {link.length > 50 ? `${link.substring(0, 50)}...` : link}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron anuncios</p>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManager;