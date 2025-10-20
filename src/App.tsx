import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { CategorySection } from './components/CategorySection';
import { EventsSection } from './components/EventsSection';
import { AuthModal } from './components/AuthModal';
import { EventDetailModal } from './components/EventDetailModal';
import { CreateEventModal } from './components/CreateEventModal';
import { eventsAPI } from './lib/api';
import type { Event } from './lib/types';

function AppContent() {
  const { loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Hyderabad');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const events = await eventsAPI.getEvents();
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      const loweredSearch = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(loweredSearch) ||
          event.description.toLowerCase().includes(loweredSearch) ||
          event.category.toLowerCase().includes(loweredSearch)
      );
    }

    if (location) {
      const loweredLocation = location.toLowerCase();
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(loweredLocation)
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, location, events]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAuthClick={() => setIsAuthModalOpen(true)}
        onCreateEventClick={() => setIsCreateEventModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        location={location}
        onLocationChange={setLocation}
      />

      <HeroCarousel />
      <CategorySection />
      <EventsSection
        events={filteredEvents}
        onEventClick={setSelectedEvent}
        location={location}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onEventCreated={fetchEvents}
      />
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
