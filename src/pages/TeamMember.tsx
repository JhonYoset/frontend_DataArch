import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { teamMembersAPI, projectsAPI } from '../lib/api';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string | null;
  researchAreas: string[];
  githubUrl: string | null;
  linkedinUrl: string | null;
  email: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

const TeamMember: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!id) return;

      try {
        // Fetch member details
        const memberResponse = await teamMembersAPI.getById(id);
        setMember(memberResponse.data);

        // Fetch all projects and filter by team member
        const projectsResponse = await projectsAPI.getAll();
        const memberProjects = (projectsResponse.data || []).filter((project: any) =>
          project.teamMembers && project.teamMembers.includes(id)
        );
        setProjects(memberProjects);
      } catch (error) {
        console.error('Error fetching member data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

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

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Member not found</p>
          <Link
            to="/team"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')} to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/team"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')} to {t('team.title')}
          </Link>
        </div>
      </section>

      {/* Member Profile */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl font-bold">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-grow text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h1>
                  <p className="text-xl text-primary-600 font-medium mb-4">
                    {member.role}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start space-x-4 mb-6">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                        <span>Email</span>
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>

                  {/* Research Areas */}
                  {member.researchAreas && member.researchAreas.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {t('team.researchAreas')}
                      </h3>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {member.researchAreas.map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {member.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('team.projects')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {project.name}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              project.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : project.status === 'completed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {t(`projects.status.${project.status}`)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        <Link
                          to={`/projects`}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {t('projects.viewProject')}
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamMember;