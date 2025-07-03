import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mail, Target, Eye, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/data_arch_code_logo.jpeg"
                alt="Data Arch Labs"
                className="h-8 w-auto"
              />
              <h3 className="text-lg font-bold">Data Arch Labs</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {t('home.description')}
            </p>
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Arequipa, Perú</span>
            </div>
          </div>

          {/* Mission */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Target className="h-5 w-5 text-primary-400 mr-2" />
              <h4 className="text-lg font-semibold">🧭 Misión</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Desarrollar soluciones tecnológicas innovadoras que impulsen el crecimiento profesional mediante IA, diseño computacional y automatización, promoviendo el aprendizaje continuo y el impacto social desde Arequipa hacia el mundo.
            </p>
          </div>

          {/* Vision */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Eye className="h-5 w-5 text-secondary-400 mr-2" />
              <h4 className="text-lg font-semibold">🌄 Visión</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Convertirnos en un referente latinoamericano en investigación aplicada y desarrollo de software con enfoque en IA, sostenibilidad y diseño computacional, transformando la forma de investigar y compartir conocimiento.
            </p>
          </div>

          {/* Quick Links & Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <a href="/projects" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.projects')}
                </a>
              </li>
              <li>
                <a href="/team" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.team')}
                </a>
              </li>
              <li>
                <a href="/announcements" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.announcements')}
                </a>
              </li>
              <li>
                <a href="/calendar" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {t('nav.calendar')}
                </a>
              </li>
            </ul>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">contact@dataarchlabs.com</span>
              </div>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Data Arch Labs. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">🤝 Colaboración</span>
              <span className="text-gray-400 text-sm">⚡ Innovación</span>
              <span className="text-gray-400 text-sm">🌱 Sostenibilidad</span>
              <span className="text-gray-400 text-sm">🎯 Excelencia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;