import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyWeatherData } from '../types/weather.ts';
import { getWeatherConditionByCode, formatTimeFromIso } from '../utils/weather.ts';

interface HourlyForecastProps {
  hourly: HourlyWeatherData;
  unit: 'C' | 'F';
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const formatTemp = (celsius: number) => {
    if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };

  // Find index closest to current hour and take next 24 hours
  const nowIso = new Date().toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex((t) => t.startsWith(nowIso));
  if (startIndex === -1) startIndex = 0;
  const next24Hours = hourly.time.slice(startIndex, startIndex + 24);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl shadow-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-300" />
            <span>Previsão Hora a Hora (Próximas 24h)</span>
            <span className="text-sm">⏱️</span>
          </h3>
          <span className="text-xs text-slate-300 font-medium">Deslize para ver mais →</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          {next24Hours.map((timeIso, idx) => {
            const actualIndex = startIndex + idx;
            const temp = hourly.temperature_2m[actualIndex];
            const code = hourly.weather_code[actualIndex];
            const prob = hourly.precipitation_probability[actualIndex] ?? 0;
            const hourNumber = parseInt(timeIso.slice(11, 13), 10);
            const isDay = hourNumber >= 6 && hourNumber < 18 ? 1 : 0;
            const condition = getWeatherConditionByCode(code, isDay);
            const timeLabel = idx === 0 ? 'Agora' : formatTimeFromIso(timeIso);

            return (
              <div
                key={timeIso}
                className={`flex-shrink-0 flex flex-col items-center justify-between p-3 rounded-2xl w-20 text-center transition-all hover:bg-white/15 border ${
                  idx === 0
                    ? 'bg-amber-500/25 border-amber-400/50 shadow-md'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-xs font-semibold text-slate-200">{timeLabel}</span>

                <span className="text-2xl my-2 select-none transform hover:scale-125 transition-transform">
                  {condition.emoji}
                </span>

                <span className="text-base font-extrabold text-white">
                  {formatTemp(temp)}°
                </span>

                {prob > 10 ? (
                  <span className="mt-1 flex items-center gap-0.5 text-[10px] font-bold text-cyan-300">
                    <Droplets className="w-3 h-3" />
                    {prob}%
                  </span>
                ) : (
                  <span className="mt-1 text-[10px] text-slate-400 font-mono">0%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
