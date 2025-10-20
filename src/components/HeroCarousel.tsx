import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: 'THIS HALLOWEEN',
    subtitle: 'MAKE IT HAUNTED',
    buttonText: 'Get Tickets Now',
    bgColor: 'from-gray-900 to-gray-800',
  },
  {
    title: 'LIVE MUSIC',
    subtitle: 'EXPERIENCE THE BEAT',
    buttonText: 'Explore Events',
    bgColor: 'from-blue-900 to-blue-800',
  },
  {
    title: 'BUSINESS EVENTS',
    subtitle: 'NETWORK & GROW',
    buttonText: 'Find Conferences',
    bgColor: 'from-slate-900 to-slate-800',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
              <h1 className="text-6xl font-bold text-white mb-2 tracking-wide">
                {slide.title}
              </h1>
              <h2 className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-8 tracking-wide">
                {slide.subtitle}
              </h2>
              <button className="px-8 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg">
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
