import { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Ticket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI } from '../lib/api';
import type { Event } from '../lib/types';

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableTickets, setAvailableTickets] = useState(event?.available_tickets ?? 0);

  useEffect(() => {
    if (event) {
      setAvailableTickets(event.available_tickets);
      setQuantity(1);
      setSuccess(false);
    } else {
      setQuantity(1);
      setSuccess(false);
      setAvailableTickets(0);
    }
  }, [event]);

  if (!event) return null;

  const handleBooking = async () => {
    if (!user) {
      alert('Please sign in to book tickets');
      return;
    }

    if (quantity > availableTickets) {
      alert('Not enough tickets available');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const { event: updatedEvent } = await eventsAPI.bookEvent(event.id, quantity, token);
      setAvailableTickets(updatedEvent.available_tickets);

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to book tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="relative h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-2xl overflow-hidden">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-24 h-24 text-white/30" />
            </div>
          )}
          <div className="absolute top-4 left-4 px-4 py-2 bg-orange-600 text-white font-semibold rounded-full">
            {event.category}
          </div>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">Your tickets have been successfully booked.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.start_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(event.end_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Ticket className="w-5 h-5 text-orange-600" />
                  <span>{availableTickets} tickets available</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">About this event</h3>
                <div
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Price per ticket</div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${event.ticket_price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      max={availableTickets}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${(event.ticket_price * quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={loading || !user}
                  className="w-full px-6 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : !user ? 'Sign in to Book' : 'Book Now'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
