import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { eventsAPI } from '../lib/api';
import type { Event } from '../lib/types';

// Fallback slides if no events are available
const fallbackSlides = [
  {
    title: 'DISCOVER EVENTS',
    subtitle: 'FIND YOUR NEXT EXPERIENCE',
    buttonText: 'Explore Events',
    bgColor: 'from-gray-900 to-gray-800',
    isEvent: false,
  },
  {
    title: 'LIVE MUSIC',
    subtitle: 'EXPERIENCE THE BEAT',
    buttonText: 'Find Events',
    bgColor: 'from-blue-900 to-blue-800',
    isEvent: false,
  },
];

export function HeroCarousel({ onEventClick }: { onEventClick?: (event: Event) => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(fallbackSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const events = await eventsAPI.getEvents();
        if (events && events.length > 0) {
          // Take the first 3 latest events and format them for the carousel
          const eventSlides = events.slice(0, 3).map((event, index) => ({
            id: event.id,
            title: event.title.toUpperCase(),
            subtitle: event.category?.toUpperCase() || 'EXCITING EVENT',
            buttonText: 'Get Tickets Now',
            bgColor: index === 0 ? 'from-gray-900 to-gray-800' : 
                     index === 1 ? 'from-blue-900 to-blue-800' : 'from-slate-900 to-slate-800',
            isEvent: true,
            event: event,
          }));
          setSlides(eventSlides);
        } else {
          setSlides(fallbackSlides);
        }
      } catch (error) {
        console.error('Error fetching events for carousel:', error);
        setSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEvents();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleButtonClick = () => {
    const currentSlideData = slides[currentSlide] as any;
    if (currentSlideData?.isEvent && currentSlideData?.event && onEventClick) {
      onEventClick(currentSlideData.event);
    }
  };

  if (loading) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 bg-gradient-to-r overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-wide">
                {slide.title}
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-8 tracking-wide">
                {slide.subtitle}
              </h2>
              <button 
                onClick={handleButtonClick}
                className="px-8 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg cursor-pointer"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg z-20"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg z-20"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
