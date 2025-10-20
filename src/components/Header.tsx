import { Calendar, MapPin, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
  onCreateEventClick: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
}

export function Header({ onAuthClick, onCreateEventClick, searchQuery, onSearchChange, location, onLocationChange }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">EventHub</span>
          </div>

          <div className="flex-1 max-w-2xl flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Search
            </button>
          </div>

          <nav className="flex items-center gap-6">
            <button className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Find Events
            </button>
            <button
              onClick={user?.user_type === 'organizer' ? onCreateEventClick : onAuthClick}
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Create Events
            </button>
            <button className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Help Center
            </button>
            {user ? (
              <>
                <button className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                  Find my tickets
                </button>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onAuthClick}
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={onAuthClick}
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
