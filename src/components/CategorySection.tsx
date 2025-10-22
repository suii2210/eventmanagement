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

interface CategorySectionProps {
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string;
}

export function CategorySection({ onCategoryClick, selectedCategory }: CategorySectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
        {selectedCategory && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtered by:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
              {selectedCategory}
              <button
                onClick={() => onCategoryClick?.('')}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => onCategoryClick?.(category.name)}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-xl transition-all hover:scale-105 group ${
                isSelected 
                  ? 'bg-orange-50 border-2 border-orange-500 shadow-lg' 
                  : 'bg-white hover:shadow-lg'
              }`}
            >
              {category.badge && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  {category.badge}
                </span>
              )}
              <div className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors ${
                isSelected 
                  ? 'bg-orange-100' 
                  : 'bg-gray-100 group-hover:bg-orange-100'
              }`}>
                <Icon className={`w-7 h-7 transition-colors ${
                  isSelected 
                    ? 'text-orange-600' 
                    : 'text-gray-700 group-hover:text-orange-600'
                }`} />
              </div>
              <span className={`text-sm text-center font-medium ${
                isSelected ? 'text-orange-700' : 'text-gray-700'
              }`}>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
