import React, { useState } from 'react';
import { Camera, MapPin, ExternalLink, X, Maximize2, Image as ImageIcon } from 'lucide-react';
import { CityPhoto, GeoCity } from '../types/weather.ts';

interface CityGalleryProps {
  city: GeoCity;
  photos: CityPhoto[];
  isLoading: boolean;
}

export const CityGallery: React.FC<CityGalleryProps> = ({ city, photos, isLoading }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<CityPhoto | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-300" />
              <span>Fotos &amp; Paisagens de {city.name}</span>
              <span className="text-sm">📸</span>
            </h3>
            <p className="text-xs text-slate-300">
              Imagens reais de alta resolução para explorar a cidade e seus pontos turísticos
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-200 self-start sm:self-auto font-medium">
            {photos.length} fotos disponíveis
          </span>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-white/5 animate-pulse border border-white/10"
              />
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative h-60 rounded-2xl overflow-hidden cursor-pointer border border-white/15 shadow-lg transition-all hover:scale-[1.03] hover:shadow-2xl hover:border-amber-400/50"
              >
                {/* Image */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Tag badge top right */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/70 border border-white/20 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                    {photo.tag}
                  </span>
                </div>

                {/* Expand icon on hover */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-1.5 rounded-lg bg-black/60 text-white flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Bottom title & details */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                    {photo.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      {photo.location}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">@{photo.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && photos.length === 0 && (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-slate-500" />
            <p className="text-sm">Nenhuma foto específica encontrada para este local.</p>
          </div>
        )}
      </div>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
              aria-label="Fechar visualização de foto"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Image */}
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Photo caption footer */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white">
              <div>
                <span className="text-xs font-bold text-amber-400 mb-0.5 block">{selectedPhoto.tag}</span>
                <h4 className="text-lg font-bold text-white">{selectedPhoto.title}</h4>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  {selectedPhoto.location} • Foto por{' '}
                  <strong className="text-white">{selectedPhoto.author}</strong>
                </p>
              </div>

              <a
                href={selectedPhoto.url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-all self-start sm:self-auto border border-white/15"
              >
                <span>Ver imagem original</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
