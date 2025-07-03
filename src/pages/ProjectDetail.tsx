import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users, Calendar, ExternalLink, FileText, Image, Download } from 'lucide-react';
import { projectsAPI, teamMembersAPI } from '../lib/api';

interface Project {
  id: string;
  name: string;
  description: string;
  content: string;
  images: string[];
  files: string[];
  teamMembers: string[];
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
  creator?: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projectTeamMembers, setProjectTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;

      try {
        // Fetch project details
        const projectResponse = await projectsAPI.getById(id);
        setProject(projectResponse.data);

        // Fetch all team members
        const membersResponse = await teamMembersAPI.getAll();
        const allMembers = membersResponse.data || [];
        setTeamMembers(allMembers);

        // Filter team members for this project
        const projectMembers = allMembers.filter((member: TeamMember) =>
          projectResponse.data.teamMembers?.includes(member.id)
        );
        setProjectTeamMembers(projectMembers);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Proyecto no encontrado</p>
          <Link
            to="/projects"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Proyectos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a {t('projects.title')}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(project.status)}`}
                >
                  {getStatusText(project.status)}
                </span>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Creado el {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>

              {/* Detailed Content */}
              {project.content && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contenido Detallado</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {project.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Images */}
              {project.images && project.images.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Image className="h-5 w-5 mr-2" />
                    Imágenes del Proyecto
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`${project.name} - Imagen ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <a
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded-md text-sm font-medium transition-opacity"
                          >
                            Ver imagen
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {project.files && project.files.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Archivos del Proyecto
                  </h2>
                  <div className="space-y-3">
                    {project.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-900 font-medium">
                            {file.split('/').pop() || `Archivo ${index + 1}`}
                          </span>
                        </div>
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Proyecto</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Fecha de Creación:</span>
                    <p className="text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>

                  {project.creator && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Creado por:</span>
                      <p className="text-gray-900">{project.creator.fullName || project.creator.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              {projectTeamMembers.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Equipo del Proyecto
                  </h3>
                  <div className="space-y-3">
                    {projectTeamMembers.map((member) => (
                      <Link
                        key={member.id}
                        to={`/team/${member.id}`}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary-600 font-medium text-sm">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;