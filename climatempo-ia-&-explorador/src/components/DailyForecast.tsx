import React from 'react';
import { CalendarDays, Droplets } from 'lucide-react';
import { DailyWeatherData } from '../types/weather.ts';
import { getWeatherConditionByCode, getDayNamePt } from '../utils/weather.ts';

interface DailyForecastProps {
  daily: DailyWeatherData;
  unit: 'C' | 'F';
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit }) => {
  const formatTemp = (celsius: number) => {
    if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };

  // Find overall min and max across all 7 days for relative progress bar scaling
  const allMins = daily.temperature_2m_min;
  const allMaxs = daily.temperature_2m_max;
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = Math.max(globalMax - globalMin, 1);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl shadow-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-300" />
            <span>Previsão para os Próximos 7 Dias</span>
            <span className="text-sm">📅</span>
          </h3>
          <span className="text-xs text-slate-300 font-medium">Tendência semanal</span>
        </div>

        <div className="space-y-2">
          {daily.time.slice(0, 7).map((dateIso, idx) => {
            const min = daily.temperature_2m_min[idx];
            const max = daily.temperature_2m_max[idx];
            const code = daily.weather_code[idx];
            const rainProb = daily.precipitation_probability_max[idx] ?? 0;
            const condition = getWeatherConditionByCode(code, 1);

            let dayTitle = getDayNamePt(dateIso);
            if (idx === 0) dayTitle = 'Hoje';
            if (idx === 1) dayTitle = 'Amanhã';

            // Calculate percentage bar positions
            const leftPercent = Math.max(0, ((min - globalMin) / range) * 100);
            const rightPercent = Math.max(0, ((globalMax - max) / range) * 100);

            return (
              <div
                key={dateIso}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl transition-all hover:bg-white/15 border ${
                  idx === 0
                    ? 'bg-white/10 border-amber-400/30'
                    : 'bg-white/5 border-white/10'
                } gap-2 sm:gap-4`}
              >
                {/* Day name & date */}
                <div className="w-28 flex-shrink-0">
                  <p className="text-sm font-bold text-white">{dayTitle}</p>
                  <p className="text-[11px] text-slate-300">
                    {dateIso.split('-').slice(1).reverse().join('/')}
                  </p>
                </div>

                {/* Condition emoji & label */}
                <div className="flex items-center gap-2.5 sm:w-44 flex-shrink-0">
                  <span className="text-2xl select-none">{condition.emoji}</span>
                  <span className="text-xs font-medium text-slate-200 truncate">
                    {condition.label}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="flex items-center gap-1 sm:w-20 flex-shrink-0">
                  {rainProb > 15 ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-cyan-300">
                      <Droplets className="w-3.5 h-3.5" />
                      {rainProb}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">0%</span>
                  )}
                </div>

                {/* Min-Max Bar and Numbers */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-9 text-right text-xs font-bold text-sky-300">
                    {formatTemp(min)}°
                  </span>

                  {/* Gradient bar representing temperature span */}
                  <div className="flex-1 h-2 rounded-full bg-slate-800/80 overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        right: `${rightPercent}%`,
                      }}
                    />
                  </div>

                  <span className="w-9 text-left text-xs font-bold text-rose-300">
                    {formatTemp(max)}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
