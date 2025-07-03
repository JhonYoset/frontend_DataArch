import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, isAfter, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { eventsAPI } from '../lib/api';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string | null;
  type: 'meeting' | 'deadline' | 'conference' | 'other';
  createdAt: string;
}

const Calendar: React.FC = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getAll();
        
        // Filter future events
        const futureEvents = (response.data || []).filter((event: Event) => 
          isAfter(new Date(event.date), startOfDay(new Date()))
        );
        
        setEvents(futureEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deadline':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'conference':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'other':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return '👥';
      case 'deadline':
        return '⏰';
      case 'conference':
        return '🎤';
      case 'other':
        return '📅';
      default:
        return '📅';
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('calendar.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('calendar.subtitle')}
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">{t('calendar.noEvents')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <span
                            className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {t(`calendar.types.${event.type}`)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-3" />
                        <span>{format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-3" />
                        <span>{event.time}</span>
                      </div>

                      {event.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {event.description}
                        </p>
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

export default Calendar;