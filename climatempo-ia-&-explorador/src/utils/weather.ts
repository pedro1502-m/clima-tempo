export interface WeatherCondition {
  code: number;
  label: string;
  emoji: string;
  type: 'clear' | 'partly_cloudy' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog';
}

export type AtmosphereType =
  | 'day'
  | 'night'
  | 'sunset'
  | 'dawn'
  | 'rain'
  | 'thunderstorm'
  | 'cloudy'
  | 'snow'
  | 'fog';

export interface ThemeConfig {
  id: AtmosphereType;
  title: string;
  emoji: string;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  textTone: 'light' | 'dark';
  imageUrl: string;
  backupImageUrl: string;
  description: string;
}

export const WMO_CODES: Record<number, WeatherCondition> = {
  0: { code: 0, label: 'Céu limpo', emoji: '☀️', type: 'clear' },
  1: { code: 1, label: 'Ensolarado com poucas nuvens', emoji: '🌤️', type: 'clear' },
  2: { code: 2, label: 'Parcialmente nublado', emoji: '⛅', type: 'partly_cloudy' },
  3: { code: 3, label: 'Encoberto', emoji: '☁️', type: 'cloudy' },
  45: { code: 45, label: 'Nevoeiro', emoji: '🌫️', type: 'fog' },
  48: { code: 48, label: 'Nevoeiro depositando geada', emoji: '🌫️❄️', type: 'fog' },
  51: { code: 51, label: 'Garoa leve', emoji: '🌦️', type: 'rain' },
  53: { code: 53, label: 'Garoa moderada', emoji: '🌧️', type: 'rain' },
  55: { code: 55, label: 'Garoa densa', emoji: '🌧️', type: 'rain' },
  56: { code: 56, label: 'Garoa congelante leve', emoji: '🌧️🧊', type: 'snow' },
  57: { code: 57, label: 'Garoa congelante densa', emoji: '🌧️🧊', type: 'snow' },
  61: { code: 61, label: 'Chuva leve', emoji: '🌦️', type: 'rain' },
  63: { code: 63, label: 'Chuva moderada', emoji: '🌧️', type: 'rain' },
  65: { code: 65, label: 'Chuva forte', emoji: '🌧️💧', type: 'rain' },
  66: { code: 66, label: 'Chuva congelante leve', emoji: '🌧️❄️', type: 'snow' },
  67: { code: 67, label: 'Chuva congelante intensa', emoji: '🌧️❄️', type: 'snow' },
  71: { code: 71, label: 'Neve leve', emoji: '🌨️', type: 'snow' },
  73: { code: 73, label: 'Neve moderada', emoji: '🌨️❄️', type: 'snow' },
  75: { code: 75, label: 'Neve intensa', emoji: '❄️☃️', type: 'snow' },
  77: { code: 77, label: 'Grãos de neve', emoji: '❄️', type: 'snow' },
  80: { code: 80, label: 'Pancadas de chuva fracas', emoji: '🌦️', type: 'rain' },
  81: { code: 81, label: 'Pancadas de chuva moderadas', emoji: '🌧️', type: 'rain' },
  82: { code: 82, label: 'Pancadas de chuva violentas', emoji: '⛈️🌊', type: 'rain' },
  85: { code: 85, label: 'Pancadas de neve leves', emoji: '🌨️', type: 'snow' },
  86: { code: 86, label: 'Pancadas de neve pesadas', emoji: '🌨️❄️', type: 'snow' },
  95: { code: 95, label: 'Tempestade elétrica', emoji: '⛈️⚡', type: 'thunderstorm' },
  96: { code: 96, label: 'Tempestade com granizo leve', emoji: '⛈️🌩️', type: 'thunderstorm' },
  99: { code: 99, label: 'Tempestade severa com granizo', emoji: '⛈️🌪️', type: 'thunderstorm' },
};

export function getWeatherConditionByCode(code: number, isDay: number = 1): WeatherCondition {
  const base = WMO_CODES[code] || {
    code,
    label: 'Clima estável',
    emoji: isDay ? '☀️' : '🌙',
    type: 'clear',
  };

  if (code === 0 && !isDay) {
    return { ...base, label: 'Céu estrelado', emoji: '🌙✨' };
  }
  if (code === 1 && !isDay) {
    return { ...base, label: 'Noite com poucas nuvens', emoji: '🌤️🌙' };
  }
  return base;
}

export const ATMOSPHERE_THEMES: Record<AtmosphereType, ThemeConfig> = {
  day: {
    id: 'day',
    title: 'Dia Ensolarado',
    emoji: '☀️',
    bgGradient: 'from-sky-500/70 via-blue-600/70 to-indigo-900/80',
    cardBg: 'bg-white/15 hover:bg-white/20 border-white/20',
    accentColor: 'text-amber-300',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80',
    description: 'Céu aberto com sol radiante iluminando a cidade.',
  },
  dawn: {
    id: 'dawn',
    title: 'Amanhecer',
    emoji: '🌅',
    bgGradient: 'from-amber-600/70 via-rose-600/70 to-indigo-950/80',
    cardBg: 'bg-white/15 hover:bg-white/20 border-amber-200/30',
    accentColor: 'text-amber-200',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1920&q=80',
    description: 'Primeiros raios de sol com tons suaves e dourados.',
  },
  sunset: {
    id: 'sunset',
    title: 'Pôr do Sol / Entardecer',
    emoji: '🌇',
    bgGradient: 'from-orange-600/75 via-rose-700/70 to-purple-950/85',
    cardBg: 'bg-white/15 hover:bg-white/20 border-orange-200/30',
    accentColor: 'text-orange-300',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
    description: 'Entardecer cinematográfico com tons quentes de laranja e magenta.',
  },
  night: {
    id: 'night',
    title: 'Noite Estrelada',
    emoji: '🌙',
    bgGradient: 'from-slate-950/90 via-indigo-950/85 to-blue-950/90',
    cardBg: 'bg-slate-900/60 hover:bg-slate-900/70 border-indigo-500/25',
    accentColor: 'text-indigo-300',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
    description: 'Atmosfera noturna com brilho da lua e estrelas.',
  },
  rain: {
    id: 'rain',
    title: 'Chuva',
    emoji: '🌧️',
    bgGradient: 'from-slate-800/80 via-cyan-950/80 to-slate-950/90',
    cardBg: 'bg-slate-900/50 hover:bg-slate-900/65 border-cyan-400/25',
    accentColor: 'text-cyan-300',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80',
    description: 'Gotas de chuva caindo suavemente pela atmosfera.',
  },
  thunderstorm: {
    id: 'thunderstorm',
    title: 'Tempestade Elétrica',
    emoji: '⛈️',
    bgGradient: 'from-violet-950/90 via-slate-950/90 to-purple-950/95',
    cardBg: 'bg-purple-950/50 hover:bg-purple-950/65 border-violet-400/30',
    accentColor: 'text-violet-300',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1511289081-d06dda19034d?auto=format&fit=crop&w=1920&q=80',
    description: 'Nuvens carregadas com relâmpagos e trovoadas.',
  },
  cloudy: {
    id: 'cloudy',
    title: 'Nublado / Encoberto',
    emoji: '☁️',
    bgGradient: 'from-slate-700/80 via-blue-900/75 to-slate-900/85',
    cardBg: 'bg-slate-900/50 hover:bg-slate-900/65 border-slate-400/25',
    accentColor: 'text-slate-300',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1920&q=80',
    description: 'Manto de nuvens densas cobrindo o horizonte.',
  },
  snow: {
    id: 'snow',
    title: 'Neve & Gelo',
    emoji: '❄️',
    bgGradient: 'from-blue-200/50 via-slate-800/80 to-slate-950/90',
    cardBg: 'bg-slate-900/60 hover:bg-slate-900/70 border-sky-300/30',
    accentColor: 'text-sky-200',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1517299321909-be09afeed323?auto=format&fit=crop&w=1920&q=80',
    description: 'Flocos de neve em paisagem fria e cristalina.',
  },
  fog: {
    id: 'fog',
    title: 'Neblina / Nevoeiro',
    emoji: '🌫️',
    bgGradient: 'from-zinc-700/80 via-slate-850/80 to-zinc-950/90',
    cardBg: 'bg-slate-900/55 hover:bg-slate-900/70 border-zinc-400/25',
    accentColor: 'text-zinc-300',
    textTone: 'light',
    imageUrl: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1920&q=80',
    backupImageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1920&q=80',
    description: 'Névoa densa com clima misterioso e temperatura amena.',
  },
};

export function getAtmosphereTheme(params: {
  weatherCode: number;
  isDay: number;
  localHour?: number;
  sunriseHour?: number;
  sunsetHour?: number;
}): AtmosphereType {
  const { weatherCode, isDay, localHour } = params;

  // Severe / precipitation weather takes precedence
  if ([95, 96, 99].includes(weatherCode)) return 'thunderstorm';
  if ([71, 73, 75, 77, 85, 86, 56, 57, 66, 67].includes(weatherCode)) return 'snow';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return 'rain';
  if ([45, 48].includes(weatherCode)) return 'fog';

  // If heavy overcast / cloudy
  if (weatherCode === 3) return 'cloudy';

  // Solar timing if available
  if (localHour !== undefined) {
    if (localHour >= 5 && localHour <= 7) return 'dawn';
    if (localHour >= 17 && localHour <= 19) return 'sunset';
  }

  if (isDay === 0) return 'night';
  if (weatherCode === 2) return 'cloudy';
  return 'day';
}

export function getUvIndexInfo(uv: number): { label: string; color: string; advice: string } {
  if (uv < 3) {
    return {
      label: 'Baixo',
      color: 'text-emerald-400',
      advice: 'Pouco risco. Ideal para passeios ao ar livre! 🟢',
    };
  }
  if (uv < 6) {
    return {
      label: 'Moderado',
      color: 'text-amber-400',
      advice: 'Proteção recomendada durante o meio-dia. Use óculos de sol! 🟡',
    };
  }
  if (uv < 8) {
    return {
      label: 'Alto',
      color: 'text-orange-400',
      advice: 'Use protetor solar FPS 30+ e procure sombras entre 11h e 16h! 🟠',
    };
  }
  if (uv < 11) {
    return {
      label: 'Muito Alto',
      color: 'text-rose-400',
      advice: 'Risco de queimaduras solares rápidas. Chapéu e protetor indispensáveis! 🔴',
    };
  }
  return {
    label: 'Extremo',
    color: 'text-purple-400',
    advice: 'Evite exposição direta ao sol. Risco altíssimo de queimadura! 🟣',
  };
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'L', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export function formatTimeFromIso(isoString: string): string {
  if (!isoString) return '--:--';
  const parts = isoString.split('T');
  if (parts.length > 1) {
    return parts[1].slice(0, 5);
  }
  return isoString;
}

export function getDayNamePt(dateString: string): string {
  try {
    const date = new Date(dateString + 'T12:00:00Z');
    const day = date.getUTCDay();
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[day];
  } catch {
    return dateString;
  }
}
