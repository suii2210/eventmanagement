import { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import { Header } from "./components/Header";
import { HeroCarousel } from "./components/HeroCarousel";
import { CategorySection } from "./components/CategorySection";
import { EventsSection } from "./components/EventsSection";
import { AuthModal } from "./components/AuthModal";
import { EventDetailModal } from "./components/EventDetailModal";

import { eventsAPI } from "./lib/api";
import type { Event } from "./lib/types";

// Create flow
import CreateEventSelectPage from "./components/CreateEventSelectPage";
import EventBuildPage from "./components/EventBuildPage";
import EventTicketsPage from "./components/EventTicketsPage";
import EventPublishPage from "./components/EventPublishPage";
import EventAIPage from "./components/EventAIPage"; // keep if you have AI page
import { EventDraftProvider } from "./contexts/EventDraftContext";

import Footer from "./components/Footer";



function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/create/select" replace />;
  return <>{children}</>;
}

/* ------------- Header wrapper so we can use navigate inside Router -------- */
function HeaderWithNav(props: {
  onAuthClick: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  onSearch: () => void;
}) {
  const nav = useNavigate();
  return (
    <Header
      onAuthClick={props.onAuthClick}
      onCreateEventClick={() => nav("/create/select")}
      searchQuery={props.searchQuery}
      onSearchChange={props.onSearchChange}
      location={props.location}
      onLocationChange={props.onLocationChange}
      onSearch={props.onSearch}
    />
  );
}

/* --------------------------------- App ----------------------------------- */
function AppContent() {
  const { loading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Hyderabad");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load of all events
  useEffect(() => {
    const fetchInitialEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsAPI.getEvents();
        const events = Array.isArray(data) ? data : [];
        setEvents(events);
        setFilteredEvents(events);
      } catch (error) {
        console.error("Error fetching initial events:", error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialEvents();
  }, []);

  const searchEvents = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Searching with:', { searchQuery: searchQuery.trim(), location: location.trim(), selectedCategory });
      
      // Use server-side search, location and category filtering for better performance
      const searchParams: { search?: string; location?: string; category?: string } = {};
      
      if (searchQuery.trim()) {
        searchParams.search = searchQuery.trim();
      }
      if (location.trim() && location.trim() !== "Hyderabad") {
        searchParams.location = location.trim();
      }
      if (selectedCategory.trim()) {
        searchParams.category = selectedCategory.trim();
      }
      
      console.log('Search params:', searchParams);
      const data = await eventsAPI.getEvents(Object.keys(searchParams).length > 0 ? searchParams : undefined);
      const events = Array.isArray(data) ? data : [];
      
      console.log('Search results:', events.length, events);
      setEvents(events);
      setFilteredEvents(events);
    } catch (error) {
      console.error("Error searching events:", error);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, location, selectedCategory]);

  // Search functionality with debouncing for text input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchEvents();
    }, 500); // Debounce time

    return () => clearTimeout(timeoutId);
  }, [searchEvents]);

  const handleSearch = () => {
    searchEvents();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <HeaderWithNav
          onAuthClick={() => setIsAuthModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          location={location}
          onLocationChange={setLocation}
          onSearch={handleSearch}
        />

        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              <>
                <HeroCarousel onEventClick={setSelectedEvent} />
                <CategorySection 
                  onCategoryClick={(category) => {
                    setSelectedCategory(selectedCategory === category ? "" : category);
                  }} 
                  selectedCategory={selectedCategory}
                />
                <EventsSection
                  events={filteredEvents}
                  onEventClick={setSelectedEvent}
                  location={location}
                />
              </>
            }
          />

          {/* Create flow: choose */}
          <Route path="/create/select" element={<CreateEventSelectPage />} />

          {/* Build */}
          <Route
            path="/create/:draftId/build"
            element={
              <Protected>
                <EventDraftProvider>
                  <EventBuildPage />
                </EventDraftProvider>
              </Protected>
            }
          />

          {/* Tickets */}
          <Route
            path="/create/:draftId/tickets"
            element={
              <Protected>
                <EventDraftProvider>
                  <EventTicketsPage />
                </EventDraftProvider>
              </Protected>
            }
          />

          {/* Publish */}
          <Route
            path="/create/:draftId/publish"
            element={
              <Protected>
                <EventDraftProvider>
                  <EventPublishPage />
                </EventDraftProvider>
              </Protected>
            }
          />

          {/* Optional AI page tied to same draft */}
          <Route
            path="/create/:draftId/ai"
            element={
              <Protected>
                <EventDraftProvider>
                  <EventAIPage />
                </EventDraftProvider>
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global modals */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </div>
      <Footer/>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
