import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ cities, onCitySelect }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <form 
      className="relative w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) {
          onCitySelect({ name: query.trim(), id: null }); // Pass id: null for dynamic resolution
          setShowDropdown(false);
        }
      }}
    >
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-brand transition-colors" />
        <input
          type="text"
          placeholder="Search any city (e.g. Paris)..."
          className="w-full bg-dark-card border border-dark-border focus:border-brand rounded-full py-2.5 pl-10 pr-12 text-sm outline-none transition-all shadow-inner"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-brand/20 rounded-full transition-colors group"
        >
          <Search className="w-3.5 h-3.5 text-white/20 group-hover:text-brand" />
        </button>
      </div>

      {showDropdown && query && (
        <div className="absolute w-full mt-2 bg-dark-card border border-dark-border rounded-2xl shadow-2xl z-[1000] overflow-hidden backdrop-blur-xl">
          {filteredCities.length > 0 ? (
            filteredCities.map(city => (
              <button
                key={city.id}
                className="w-full px-4 py-3 text-left hover:bg-brand/10 transition-colors flex items-center justify-between group"
                onClick={() => {
                  onCitySelect(city);
                  setQuery(city.name);
                  setShowDropdown(false);
                }}
              >
                <span className="text-white/80 group-hover:text-brand">{city.name}</span>
                <span className="text-[10px] text-white/30 uppercase tracking-tighter">City</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-white/40 text-xs text-center italic">
              No cities found
            </div>
          )}
        </div>
      )}
    </form>
  );
}
