import { Ghost, Music, Globe, Drama, Heart, Gamepad2, Briefcase, Coffee } from 'lucide-react';

const categories = [
  { name: 'Halloween', icon: Ghost, badge: 'New' },
  { name: 'Music', icon: Music },
  { name: 'Nightlife', icon: Globe },
  { name: 'Performing & Visual Arts', icon: Drama },
  { name: 'Dating', icon: Heart },
  { name: 'Hobbies', icon: Gamepad2 },
  { name: 'Business', icon: Briefcase },
  { name: 'Food & Drink', icon: Coffee },
];

export function CategorySection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.name}
              className="relative flex flex-col items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all hover:scale-105 group"
            >
              {category.badge && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  {category.badge}
                </span>
              )}
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-orange-100 transition-colors">
                <Icon className="w-7 h-7 text-gray-700 group-hover:text-orange-600 transition-colors" />
              </div>
              <span className="text-sm text-center text-gray-700 font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
