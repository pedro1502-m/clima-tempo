import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
} from 'lucide-react';
import { CurrentWeatherData, DailyWeatherData } from '../types/weather.ts';
import { getUvIndexInfo, getWindDirection, formatTimeFromIso } from '../utils/weather.ts';

interface MetricsGridProps {
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  unit: 'C' | 'F';
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ current, daily, unit }) => {
  const maxUvToday = daily.uv_index_max[0] ?? 0;
  const uvInfo = getUvIndexInfo(maxUvToday);
  const windDir = getWindDirection(current.wind_direction_10m);
  const rainProb = daily.precipitation_probability_max[0] ?? (current.precipitation > 0 ? 90 : 10);
  const sunrise = formatTimeFromIso(daily.sunrise[0] || '');
  const sunset = formatTimeFromIso(daily.sunset[0] || '');

  const formatTemp = (celsius: number) => {
    if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return Math.round(celsius);
  };

  const metrics = [
    {
      id: 'apparent_temp',
      title: 'Sensação Térmica',
      emoji: '🌡️',
      icon: <Thermometer className="w-5 h-5 text-amber-300" />,
      value: `${formatTemp(current.apparent_temperature)}°${unit}`,
      subtext: current.apparent_temperature > current.temperature_2m ? 'Sensação mais quente que o termômetro' : 'Sensação mais fresca',
      accent: 'border-amber-400/30',
    },
    {
      id: 'humidity',
      title: 'Umidade do Ar',
      emoji: '💧',
      icon: <Droplets className="w-5 h-5 text-cyan-300" />,
      value: `${current.relative_humidity_2m}%`,
      subtext: current.relative_humidity_2m > 75 ? 'Ar bastante úmido' : current.relative_humidity_2m < 30 ? 'Ar seco, beba água!' : 'Nível confortável',
      accent: 'border-cyan-400/30',
    },
    {
      id: 'wind',
      title: 'Vento & Rajadas',
      emoji: '💨',
      icon: <Wind className="w-5 h-5 text-sky-300" />,
      value: `${Math.round(current.wind_speed_10m)} km/h`,
      subtext: `Direção ${windDir} (${current.wind_direction_10m}°) • Rajadas ${Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.3)} km/h`,
      accent: 'border-sky-400/30',
    },
    {
      id: 'uv_index',
      title: 'Índice UV Máximo',
      emoji: '☀️',
      icon: <Sun className="w-5 h-5 text-yellow-300" />,
      value: `${maxUvToday.toFixed(1)} (${uvInfo.label})`,
      subtext: uvInfo.advice,
      accent: 'border-yellow-400/30',
    },
    {
      id: 'rain_prob',
      title: 'Probabilidade de Chuva',
      emoji: '🌧️',
      icon: <CloudRain className="w-5 h-5 text-blue-300" />,
      value: `${rainProb}%`,
      subtext: `Acumulado previsto: ${(daily.precipitation_sum[0] || 0).toFixed(1)} mm`,
      accent: 'border-blue-400/30',
    },
    {
      id: 'pressure',
      title: 'Pressão Atmosférica',
      emoji: '🔽',
      icon: <Gauge className="w-5 h-5 text-emerald-300" />,
      value: `${Math.round(current.pressure_msl || 1013)} hPa`,
      subtext: (current.pressure_msl || 1013) > 1015 ? 'Alta pressão (tempo firme)' : 'Baixa pressão atmosférica',
      accent: 'border-emerald-400/30',
    },
    {
      id: 'sunrise',
      title: 'Nascer do Sol',
      emoji: '🌅',
      icon: <Sunrise className="w-5 h-5 text-amber-200" />,
      value: sunrise,
      subtext: 'Início da luz do dia',
      accent: 'border-amber-300/30',
    },
    {
      id: 'sunset',
      title: 'Pôr do Sol',
      emoji: '🌇',
      icon: <Sunset className="w-5 h-5 text-orange-300" />,
      value: sunset,
      subtext: 'Início da noite e crepúsculo',
      accent: 'border-orange-400/30',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span>Detalhes &amp; Métricas do Clima</span>
          <span className="text-sm">📊</span>
        </h3>
        <span className="text-xs text-slate-300 font-medium">Tempo real atualizado</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-2xl bg-slate-900/60 border ${m.accent} backdrop-blur-xl shadow-lg transition-all hover:bg-slate-900/75 hover:scale-[1.02] flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>{m.emoji}</span>
                <span className="truncate">{m.title}</span>
              </span>
              <div className="p-1 rounded-lg bg-white/10">{m.icon}</div>
            </div>

            <div className="my-2">
              <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{m.value}</p>
            </div>

            <p className="text-[11px] leading-snug text-slate-300 line-clamp-2">{m.subtext}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
