import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Save, X, Search, Filter, Eye } from 'lucide-react';
import { projectsAPI, teamMembersAPI } from '../../lib/api';

interface Project {
  id: string;
  name: string;
  description: string;
  content: string;
  images: string[];
  files: string[];
  teamMembers: string[];
  status: 'active' | 'completed' | 'on-hold';
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string;
}

const ProjectManager: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    content: '',
    images: [],
    files: [],
    teamMembers: [],
    status: 'active',
  });

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
    
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
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await teamMembersAPI.getAll();
      setTeamMembers(response.data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleSave = async () => {
    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        content: formData.content || '',
        images: formData.images || [],
        files: formData.files || [],
        teamMembers: formData.teamMembers || [],
        status: formData.status || 'active',
      };

      if (editingId) {
        // Update existing project
        await projectsAPI.update(editingId, projectData);
      } else {
        // Create new project
        await projectsAPI.create(projectData);
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto. Por favor, intenta de nuevo.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;

    try {
      await projectsAPI.delete(id);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto. Por favor, intenta de nuevo.');
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setShowAddForm(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      description: '',
      content: '',
      images: [],
      files: [],
      teamMembers: [],
      status: 'active',
    });
  };

  const handleArrayChange = (field: 'images' | 'files', value: string) => {
    const items = value.split('\n').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  const handleTeamMembersChange = (memberIds: string[]) => {
    setFormData({ ...formData, teamMembers: memberIds });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'completed':
        return 'Completado';
      case 'on-hold':
        return 'En Pausa';
      default:
        return status;
    }
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
          <h2 className="text-2xl font-bold text-gray-900">{t('admin.manageProjects')}</h2>
          <p className="text-gray-600 mt-1">Gestiona los proyectos de investigación</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="completed">Completados</option>
            <option value="on-hold">En Pausa</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
                <option value="on-hold">En Pausa</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido Detallado</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Descripción detallada del proyecto, metodología, objetivos, etc."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imágenes (una URL por línea)
              </label>
              <textarea
                value={formData.images?.join('\n') || ''}
                onChange={(e) => handleArrayChange('images', e.target.value)}
                rows={3}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivos (una URL por línea)
              </label>
              <textarea
                value={formData.files?.join('\n') || ''}
                onChange={(e) => handleArrayChange('files', e.target.value)}
                rows={3}
                placeholder="https://example.com/document.pdf&#10;https://example.com/presentation.pptx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Miembros del Equipo</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
              {teamMembers.map((member) => (
                <label key={member.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.teamMembers?.includes(member.id) || false}
                    onChange={(e) => {
                      const currentMembers = formData.teamMembers || [];
                      if (e.target.checked) {
                        handleTeamMembersChange([...currentMembers, member.id]);
                      } else {
                        handleTeamMembersChange(currentMembers.filter(id => id !== member.id));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{member.name}</span>
                </label>
              ))}
            </div>
          </div>
          
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 truncate flex-1 mr-2">
                  {project.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{project.teamMembers?.length || 0} miembros</span>
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(project)}
                    className="text-primary-600 hover:text-primary-700 p-1 rounded"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-700 p-1 rounded"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                  className="text-gray-600 hover:text-gray-700 p-1 rounded"
                  title="Ver proyecto"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron proyectos</p>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;