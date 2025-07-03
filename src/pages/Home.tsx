import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, BookOpen, ExternalLink, Target, Eye, Globe } from 'lucide-react';
import { projectsAPI, teamMembersAPI } from '../lib/api';

interface Project {
  id: string;
  name: string;
  description: string;
  images: string[];
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    projects: 0,
    members: 0,
    publications: 0,
  });
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, membersRes] = await Promise.all([
          projectsAPI.getAll(),
          teamMembersAPI.getAll(),
        ]);

        setStats({
          projects: projectsRes.data?.length || 0,
          members: membersRes.data?.length || 0,
          publications: 12, // Static for now
        });

        // Get the 3 most recent projects for featured section
        const allProjects = projectsRes.data || [];
        const recentProjects = allProjects
          .sort((a: Project, b: Project) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        
        setFeaturedProjects(recentProjects);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchStats();
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

  const getProjectGradient = (index: number) => {
    const gradients = [
      'from-primary-400 to-secondary-400',
      'from-green-400 to-blue-400',
      'from-purple-400 to-pink-400',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-primary-100">
              {t('home.subtitle')}
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
              {t('home.description')}
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t('home.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.projects}</div>
              <div className="text-gray-600">{t('home.stats.projects')}</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full mb-4">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.members}</div>
              <div className="text-gray-600">{t('home.stats.members')}</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.publications}</div>
              <div className="text-gray-600">{t('home.stats.publications')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Esencia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conoce los principios que guían nuestro trabajo y la visión que nos impulsa hacia el futuro
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 h-full border border-primary-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">🧭 Misión</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Desarrollar soluciones tecnológicas innovadoras que impulsen el crecimiento profesional de nuestros miembros y optimicen los procesos organizacionales mediante el uso creativo de inteligencia artificial, diseño computacional y automatización. A través de un entorno colaborativo y multidisciplinario, facilitamos la investigación, documentación y divulgación de conocimiento, promoviendo el aprendizaje continuo y el impacto social desde Arequipa hacia el mundo.
                </p>
                <div className="mt-6 flex items-center text-primary-600">
                  <Globe className="h-5 w-5 mr-2" />
                  <span className="font-medium">Desde Arequipa hacia el mundo</span>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="relative">
              <div className="bg-gradient-to-br from-secondary-50 to-green-50 rounded-2xl p-8 h-full border border-secondary-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary-600 rounded-xl flex items-center justify-center mr-4">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">🌄 Visión</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Convertirnos en un referente latinoamericano en investigación aplicada y desarrollo de software con enfoque en inteligencia artificial, sostenibilidad y diseño computacional, mediante una cultura de colaboración, excelencia técnica y responsabilidad social. Aspiramos a transformar la forma en que se investiga, diseña y comparte el conocimiento, conectando disciplinas y personas a través de plataformas tecnológicas accesibles, abiertas y globales.
                </p>
                <div className="mt-6 flex items-center text-secondary-600">
                  <Target className="h-5 w-5 mr-2" />
                  <span className="font-medium">Referente latinoamericano</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestros Valores</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Colaboración</h4>
                <p className="text-sm text-gray-600">Trabajo en equipo multidisciplinario</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Innovación</h4>
                <p className="text-sm text-gray-600">Soluciones tecnológicas creativas</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Sostenibilidad</h4>
                <p className="text-sm text-gray-600">Responsabilidad social y ambiental</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Excelencia</h4>
                <p className="text-sm text-gray-600">Calidad técnica y profesional</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proyectos Destacados</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras últimas iniciativas de investigación en IA, diseño sostenible y ciencia de datos.
            </p>
          </div>
          
          {loadingProjects ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : featuredProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                  >
                    {/* Project Image */}
                    <div className={`h-48 bg-gradient-to-r ${getProjectGradient(index)} relative`}>
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images[0]}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-white text-3xl font-bold">
                            {project.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <Link
                        to={`/projects/${project.id}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:underline"
                      >
                        Ver Proyecto
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Projects Button */}
              <div className="text-center">
                <Link
                  to="/projects"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Ver Todos Nuestros Proyectos
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">No hay proyectos disponibles aún.</p>
                <Link
                  to="/projects"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Explorar Proyectos
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;