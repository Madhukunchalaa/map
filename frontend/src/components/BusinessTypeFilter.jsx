import { Hotel, Utensils, Pill, Zap, ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const types = [
  { id: 'Hotel', icon: Hotel, label: 'Hotels' },
  { id: 'Restaurant', icon: Utensils, label: 'Dining' },
  { id: 'Pharmacy', icon: Pill, label: 'Pharmacy' },
  { id: 'EV Charging', icon: Zap, label: 'EV Charging' },
  { id: 'Grocery Store', icon: ShoppingCart, label: 'Grocery' },
];

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function BusinessTypeFilter({ activeType, onTypeSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => {
        const Icon = type.icon;
        const isActive = activeType === type.id;
        
        return (
          <button
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300",
              "border",
              isActive 
                ? "bg-brand text-dark border-brand shadow-lg shadow-brand/20 scale-105" 
                : "bg-dark-card text-white/60 border-dark-border hover:border-white/30 hover:text-white"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5", isActive ? "text-dark" : "text-brand")} />
            {type.label}
          </button>
        );
      })}
    </div>
  );
}
