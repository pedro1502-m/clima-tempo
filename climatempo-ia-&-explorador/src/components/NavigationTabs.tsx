import React from 'react';
import { CloudSun, CalendarDays, Sparkles, Camera, Map } from 'lucide-react';

export type ActiveTab = 'overview' | 'forecast7' | 'ai' | 'gallery' | 'map';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  photoCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  photoCount,
}) => {
  const tabs = [
    {
      id: 'overview' as ActiveTab,
      label: 'Visão Geral & Horas',
      emoji: '⛅',
      icon: <CloudSun className="w-4 h-4" />,
    },
    {
      id: 'forecast7' as ActiveTab,
      label: 'Previsão 7 Dias',
      emoji: '📅',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'ai' as ActiveTab,
      label: 'IA & Dicas do Dia',
      emoji: '🧠',
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      badge: 'IA',
    },
    {
      id: 'gallery' as ActiveTab,
      label: 'Fotos do Local',
      emoji: '📸',
      icon: <Camera className="w-4 h-4 text-sky-300" />,
      badge: photoCount > 0 ? String(photoCount) : undefined,
    },
    {
      id: 'map' as ActiveTab,
      label: 'Geolocalização',
      emoji: '🗺️',
      icon: <Map className="w-4 h-4 text-emerald-300" />,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/70 border border-white/20 backdrop-blur-2xl shadow-xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 min-w-[120px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-white/20 text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
