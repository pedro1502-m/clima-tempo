import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Clock, Loader2 } from 'lucide-react';
import { GeoCity } from '../types/weather.ts';

interface SearchBarProps {
  onSelectCity: (city: GeoCity) => void;
  isLoading: boolean;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  isLoading,
  onUseCurrentLocation,
  isLocating,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentCities, setRecentCities] = useState<GeoCity[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent cities from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('clima_recent_cities');
      if (stored) {
        setRecentCities(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save city to recents
  const saveToRecents = (city: GeoCity) => {
    try {
      const updated = [city, ...recentCities.filter((c) => c.name !== city.name || c.country !== city.country)].slice(0, 5);
      setRecentCities(updated);
      localStorage.setItem('clima_recent_cities', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Debounced search query
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoCity) => {
    saveToRecents(city);
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30 px-4">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Search icon */}
        <div className="absolute left-4 text-slate-300 pointer-events-none">
          {isSearching || isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Digite a cidade ou local (ex: Florianópolis, Salvador, Tóquio)..."
          className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white/20 hover:bg-white/25 focus:bg-slate-900/90 text-white placeholder-slate-200/75 border border-white/25 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 backdrop-blur-xl transition-all shadow-xl text-sm sm:text-base font-medium"
          aria-label="Buscar previsão do tempo para uma cidade ou local"
        />

        {/* Right action buttons: Clear and GPS */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="p-2 rounded-xl bg-amber-400/80 hover:bg-amber-400 text-slate-950 font-semibold transition-all flex items-center gap-1 shadow-md hover:scale-105 disabled:opacity-50"
            title="Usar minha localização atual (GPS)"
            aria-label="Usar minha localização atual"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline text-xs font-bold">GPS</span>
          </button>
        </div>
      </form>

      {/* Dropdown Suggestions & Recents */}
      {isOpen && (
        <div className="absolute left-4 right-4 mt-2 max-h-80 overflow-y-auto rounded-2xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-2xl z-50 text-white divide-y divide-white/10 animate-in fade-in-50 duration-150">
          {/* Suggestions from geocoding */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <span className="px-3 py-1 text-[11px] font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Cidades Encontradas
              </span>
              <div className="mt-1 space-y-0.5">
                {suggestions.map((city) => (
                  <button
                    key={`${city.id}-${city.name}-${city.latitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/15 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-white/10 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-amber-200">
                          {city.name}
                        </p>
                        <p className="text-xs text-slate-300">
                          {[city.admin1, city.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                    {city.country_code && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-200 uppercase">
                        {city.country_code}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {query.trim().length >= 2 && suggestions.length === 0 && !isSearching && (
            <div className="p-4 text-center text-sm text-slate-300">
              Nenhuma cidade encontrada para &ldquo;{query}&rdquo;. Tente outro nome ou use os atalhos.
            </div>
          )}

          {/* Recent Cities History */}
          {recentCities.length > 0 && suggestions.length === 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Pesquisas Recentes
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRecentCities([]);
                    localStorage.removeItem('clima_recent_cities');
                  }}
                  className="text-[10px] text-slate-400 hover:text-rose-300 transition-colors"
                >
                  Limpar
                </button>
              </div>
              <div className="mt-1 space-y-0.5">
                {recentCities.map((city) => (
                  <button
                    key={`recent-${city.name}-${city.country}`}
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/15 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300" />
                      <span className="text-xs text-slate-200 group-hover:text-white">
                        {city.name}, {city.country}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
