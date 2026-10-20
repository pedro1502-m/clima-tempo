import React from 'react';
import { MapPin, Globe, Compass, ExternalLink, Mountain } from 'lucide-react';
import { GeoCity, ForecastResponse } from '../types/weather.ts';

interface LocationDetailsProps {
  city: GeoCity;
  forecast: ForecastResponse;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({ city, forecast }) => {
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city.name}, ${city.country}`)}`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-300" />
              <span>Geolocalização &amp; Dados Geográficos</span>
              <span className="text-sm">🌐</span>
            </h3>
            <p className="text-xs text-slate-300">
              Coordenadas exatas e parâmetros geográficos obtidos via satélite
            </p>
          </div>

          <a
            href={gmapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all self-start sm:self-auto shadow-md hover:scale-105"
          >
            <span>Abrir no Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" /> Latitude
            </span>
            <p className="text-xl font-mono font-bold text-white mt-1">
              {city.latitude.toFixed(4)}°
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {city.latitude >= 0 ? 'Hemisfério Norte' : 'Hemisfério Sul'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-300" /> Longitude
            </span>
            <p className="text-xl font-mono font-bold text-white mt-1">
              {city.longitude.toFixed(4)}°
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {city.longitude >= 0 ? 'Hemisfério Leste' : 'Hemisfério Oeste'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-300" /> Fuso Horário
            </span>
            <p className="text-base font-mono font-bold text-white mt-1 truncate">
              {forecast.timezone || city.timezone || 'Auto'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Sincronizado com tempo local</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-purple-300" /> País / Região
            </span>
            <p className="text-base font-bold text-white mt-1 truncate">
              {city.country} {city.country_code ? `(${city.country_code})` : ''}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">{city.admin1 || 'Região Metropolitana'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
