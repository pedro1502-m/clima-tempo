import React from 'react';
import { MapPin, Calendar, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { GeoCity, CurrentWeatherData, DailyWeatherData } from '../types/weather.ts';
import { getWeatherConditionByCode, getDayNamePt } from '../utils/weather.ts';

interface CurrentWeatherProps {
  city: GeoCity;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  unit: 'C' | 'F';
  vibeScore?: string;
  onOpenAiTab: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  city,
  current,
  daily,
  unit,
  vibeScore,
  onOpenAiTab,
}) => {
  const condition = getWeatherConditionByCode(current.weather_code, current.is_day);

  // Convert Celsius to Fahrenheit if needed
  const formatTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const todayMax = daily.temperature_2m_max[0] ?? current.temperature_2m;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature_2m;
  const todayDateStr = daily.time[0] || new Date().toISOString().slice(0, 10);
  const dayName = getDayNamePt(todayDateStr);

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/20 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-white">
        {/* Subtle top ambient glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Location & Time Details */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-semibold backdrop-blur-md border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{city.name}</span>
              {city.admin1 && <span className="text-white/60">• {city.admin1}</span>}
              <span className="font-bold text-white">• {city.country}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              {city.name}
            </h2>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200/90 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                {dayName}, {todayDateStr.split('-').reverse().join('/')}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-xs">
                {current.is_day ? '☀️ Dia' : '🌙 Noite'}
              </span>
            </div>

            {/* Vibe score chip (AI connection) */}
            {vibeScore && (
              <button
                onClick={onOpenAiTab}
                className="mt-3 group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-orange-500/25 border border-amber-400/40 text-amber-200 text-xs font-medium hover:scale-105 transition-all text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>
                  <strong className="text-white">Vibe IA:</strong> {vibeScore}
                </span>
              </button>
            )}
          </div>

          {/* Right: Big Temperature & Condition */}
          <div className="flex items-center gap-5 sm:gap-6 self-start md:self-auto">
            {/* Condition Emoji Illustration */}
            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-7xl md:text-8xl filter drop-shadow-lg select-none transform hover:scale-110 transition-transform duration-300">
                {condition.emoji}
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold text-amber-300 tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
                {condition.label}
              </span>
            </div>

            {/* Temperature numbers */}
            <div>
              <div className="flex items-start">
                <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white">
                  {formatTemp(current.temperature_2m)}
                </span>
                <span className="text-2xl sm:text-3xl font-light text-amber-300 ml-1">
                  °{unit}
                </span>
              </div>

              {/* Sensação e Min/Max */}
              <div className="space-y-1 pt-1 text-xs sm:text-sm text-slate-200 font-medium">
                <p className="flex items-center gap-1">
                  <span>Sensação térmica:</span>
                  <strong className="text-white font-bold">
                    {formatTemp(current.apparent_temperature)}°{unit}
                  </strong>
                </p>

                <div className="flex items-center gap-3 pt-0.5">
                  <span className="flex items-center text-rose-300 font-semibold gap-0.5">
                    <ArrowUp className="w-3.5 h-3.5" />
                    {formatTemp(todayMax)}°
                  </span>
                  <span className="flex items-center text-sky-300 font-semibold gap-0.5">
                    <ArrowDown className="w-3.5 h-3.5" />
                    {formatTemp(todayMin)}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
