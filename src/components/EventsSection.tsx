import { Calendar, MapPin, Ticket } from 'lucide-react';
import type { Event } from '../lib/types';

interface EventsSectionProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  location: string;
}

export function EventsSection({ events, onEventClick, location }: EventsSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Browsing events in
        </h2>
        <span className="text-2xl font-bold text-orange-600">{location || 'All Locations'}</span>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button className="px-4 py-2 text-orange-600 border-b-2 border-orange-600 font-medium">
          All
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
          Today
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
          This weekend
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No events found. Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full">
                  {event.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span>{new Date(event.start_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Ticket className="w-4 h-4 text-orange-600" />
                    <span>{event.available_tickets} tickets available</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${event.ticket_price.toFixed(2)}
                  </span>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Get Tickets
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
