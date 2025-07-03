import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ExternalLink, Users } from 'lucide-react';
import { projectsAPI } from '../lib/api';

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
}

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchProjects();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('projects.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Project Image */}
                  <div className="h-48 bg-gradient-to-r from-primary-400 to-secondary-400 relative">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-white text-2xl font-bold">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {t(`projects.status.${project.status}`)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Project Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>

                    {/* Project Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Team Members Count */}
                    {project.teamMembers && project.teamMembers.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {project.teamMembers.length} {t('projects.teamMembers')}
                        </span>
                      </div>
                    )}

                    {/* View Project Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/projects/${project.id}`}
                        className="inline-flex items-center px-3 py-1 text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {t('projects.viewProject')}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;