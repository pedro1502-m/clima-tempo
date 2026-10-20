import React from 'react';
import { CloudSun, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { AtmosphereType, ATMOSPHERE_THEMES } from '../utils/weather.ts';
import { GeoCity } from '../types/weather.ts';

interface HeaderProps {
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  selectedCity: GeoCity;
  onSelectPopularCity: (city: GeoCity) => void;
  currentAtmosphere: AtmosphereType;
  manualAtmosphere: AtmosphereType | null;
  onSelectManualAtmosphere: (theme: AtmosphereType | null) => void;
}

const POPULAR_CITIES: GeoCity[] = [
  { id: 3448439, name: 'São Paulo', latitude: -23.5475, longitude: -46.6361, country: 'Brasil', country_code: 'BR', admin1: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { id: 3451190, name: 'Rio de Janeiro', latitude: -22.9064, longitude: -43.1822, country: 'Brasil', country_code: 'BR', admin1: 'Rio de Janeiro', timezone: 'America/Sao_Paulo' },
  { id: 3464975, name: 'Curitiba', latitude: -25.4278, longitude: -49.2731, country: 'Brasil', country_code: 'BR', admin1: 'Paraná', timezone: 'America/Sao_Paulo' },
  { id: 3450554, name: 'Salvador', latitude: -12.9711, longitude: -38.5108, country: 'Brasil', country_code: 'BR', admin1: 'Bahia', timezone: 'America/Bahia' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'França', country_code: 'FR', admin1: 'Île-de-France', timezone: 'Europe/Paris' },
  { id: 1850147, name: 'Tóquio', latitude: 35.6895, longitude: 139.6917, country: 'Japão', country_code: 'JP', admin1: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 5128581, name: 'Nova York', latitude: 40.7143, longitude: -74.006, country: 'Estados Unidos', country_code: 'US', admin1: 'New York', timezone: 'America/New_York' },
];

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  selectedCity,
  onSelectPopularCity,
  currentAtmosphere,
  manualAtmosphere,
  onSelectManualAtmosphere,
}) => {
  const [showThemePicker, setShowThemePicker] = React.useState(false);

  return (
    <header className="relative z-40 w-full pt-4 pb-2 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-white/10">
        {/* App Title & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-sky-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                ClimaTempo IA <span className="text-amber-300 text-lg">✨</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-sky-100 border border-white/20 backdrop-blur-md">
                Live 2026
              </span>
            </div>
            <p className="text-xs text-slate-200/80">
              Previsão do tempo inteligente, fundos dinâmicos e fotos reais de lugares
            </p>
          </div>
        </div>

        {/* Action Controls: Unit toggle & Atmosphere switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Dynamic atmosphere badge & test controller */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all shadow-sm"
              title="Mudar fundo dinâmico para testar outros cenários"
              aria-label="Selecionar atmosfera do fundo"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
              <span>
                Fundo:{' '}
                <strong className="text-amber-200 font-semibold">
                  {manualAtmosphere
                    ? `${ATMOSPHERE_THEMES[manualAtmosphere].emoji} ${ATMOSPHERE_THEMES[manualAtmosphere].title}`
                    : `Auto (${ATMOSPHERE_THEMES[currentAtmosphere].emoji})`}
                </strong>
              </span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-72 p-3 rounded-2xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-xl z-50 text-white">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Fundos Dinâmicos
                  </span>
                  <button
                    onClick={() => {
                      onSelectManualAtmosphere(null);
                      setShowThemePicker(false);
                    }}
                    className="text-[11px] text-sky-300 hover:text-sky-200 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Modo Automático
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(ATMOSPHERE_THEMES) as AtmosphereType[]).map((key) => {
                    const t = ATMOSPHERE_THEMES[key];
                    const isSelected = manualAtmosphere === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onSelectManualAtmosphere(key);
                          setShowThemePicker(false);
                        }}
                        className={`text-left p-2 rounded-xl text-xs flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-amber-500/30 border border-amber-400 text-white font-semibold'
                            : 'hover:bg-white/10 text-slate-200 border border-transparent'
                        }`}
                      >
                        <span className="text-base">{t.emoji}</span>
                        <span className="truncate">{t.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Unit Toggle Button */}
          <button
            onClick={onToggleUnit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all shadow-sm"
            aria-label={`Alternar para ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
          >
            <span className={unit === 'C' ? 'text-amber-300' : 'text-slate-300'}>°C</span>
            <span className="text-white/40">/</span>
            <span className={unit === 'F' ? 'text-amber-300' : 'text-slate-300'}>°F</span>
          </button>
        </div>
      </div>

      {/* Quick City Navigation Chips */}
      <div className="flex items-center gap-1.5 pt-2.5 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-xs font-semibold text-white/70 whitespace-nowrap pr-1 flex items-center gap-1">
          Atalhos:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isCurrent = selectedCity.name.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              onClick={() => onSelectPopularCity(city)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 backdrop-blur-md ${
                isCurrent
                  ? 'bg-amber-400/90 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
