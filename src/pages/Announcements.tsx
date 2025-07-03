import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar, ExternalLink } from 'lucide-react';
import { announcementsAPI } from '../lib/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  links: string[];
  createdAt: string;
}

const Announcements: React.FC = () => {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchAnnouncements();
  }, []);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('announcements.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('announcements.subtitle')}
          </p>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-gray-600 text-lg">{t('announcements.noAnnouncements')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-8">
                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(new Date(announcement.date), 'MMMM dd, yyyy')}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {announcement.title}
                    </h2>

                    {/* Content */}
                    <div className="prose max-w-none mb-6">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {announcement.content}
                      </p>
                    </div>

                    {/* Links */}
                    {announcement.links && announcement.links.length > 0 && (
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Related Links:</h4>
                        <div className="space-y-2">
                          {announcement.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
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

export default Announcements;