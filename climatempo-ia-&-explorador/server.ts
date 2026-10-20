import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on the server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface CityPhoto {
  id: string;
  url: string;
  title: string;
  location: string;
  author: string;
  tag: string;
}

const CURATED_CITY_PHOTOS: Record<string, CityPhoto[]> = {
  'são paulo': [
    {
      id: 'sp-1',
      url: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?auto=format&fit=crop&w=1200&q=80',
      title: 'Ponte Estaiada Octávio Frias',
      location: 'São Paulo, SP - Brasil',
      author: 'Diego Jimenez',
      tag: 'Arquitetura Moderna 🌉',
    },
    {
      id: 'sp-2',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      title: 'Avenida Paulista e Luzes Noturnas',
      location: 'São Paulo, SP - Brasil',
      author: 'Sergio Souza',
      tag: 'Coração Financeiro 🏙️',
    },
    {
      id: 'sp-3',
      url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      title: 'Centro Histórico e Edifícios Emblemáticos',
      location: 'São Paulo, SP - Brasil',
      author: 'Gustavo Minas',
      tag: 'História Urbana 🏛️',
    },
    {
      id: 'sp-4',
      url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80',
      title: 'Parque e Horizonte Paulistano',
      location: 'São Paulo, SP - Brasil',
      author: 'Lucas George',
      tag: 'Verde & Metrópole 🌳',
    },
  ],
  'rio de janeiro': [
    {
      id: 'rio-1',
      url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
      title: 'Cristo Redentor e Baía de Guanabara',
      location: 'Rio de Janeiro, RJ - Brasil',
      author: 'Agustin Diaz Gargiulo',
      tag: 'Maravilha do Mundo ⛰️',
    },
    {
      id: 'rio-2',
      url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
      title: 'Praia de Copacabana ao Entardecer',
      location: 'Rio de Janeiro, RJ - Brasil',
      author: 'Raphael Nogueira',
      tag: 'Praia & Vibe Carioca 🏖️',
    },
    {
      id: 'rio-3',
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      title: 'Morros e Litoral Espetacular',
      location: 'Rio de Janeiro, RJ - Brasil',
      author: 'Marcos Paulo Prado',
      tag: 'Pôr do Sol Mágico 🌅',
    },
  ],
  'curitiba': [
    {
      id: 'cwb-1',
      url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      title: 'Jardim Botânico e Estufa de Vidro',
      location: 'Curitiba, PR - Brasil',
      author: 'Celso Pupo',
      tag: 'Capital Ecológica 🌿',
    },
    {
      id: 'cwb-2',
      url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80',
      title: 'Bosques e Parques Verdes',
      location: 'Curitiba, PR - Brasil',
      author: 'Matheus Frade',
      tag: 'Natureza & Frescor 🌲',
    },
  ],
  'salvador': [
    {
      id: 'ssa-1',
      url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
      title: 'Farol da Barra e Litoral Baiano',
      location: 'Salvador, BA - Brasil',
      author: 'Mateus Campos Felipe',
      tag: 'Farol & Oceano Atlântico ⛵',
    },
    {
      id: 'ssa-2',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      title: 'Pelourinho e Cores Históricas',
      location: 'Salvador, BA - Brasil',
      author: 'Everson Mayer',
      tag: 'Patrimônio & Axé 🎨',
    },
  ],
  'tóquio': [
    {
      id: 'tky-1',
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      title: 'Torre de Tóquio à Noite',
      location: 'Tóquio - Japão',
      author: 'Jezael Melgoza',
      tag: 'Luzes & Neon 🗼',
    },
    {
      id: 'tky-2',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      title: 'Metrópole Futurista de Tóquio',
      location: 'Tóquio - Japão',
      author: 'Andre Benz',
      tag: 'Cultura Urbana 🚶‍♂️',
    },
  ],
  'paris': [
    {
      id: 'prs-1',
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      title: 'Torre Eiffel com Céu Radiante',
      location: 'Paris - França',
      author: 'Anthony DELANOIX',
      tag: 'Cartão Postal Clássico 🗼',
    },
    {
      id: 'prs-2',
      url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
      title: 'Rio Sena e Pontes Históricas',
      location: 'Paris - França',
      author: 'Alexander Kagan',
      tag: 'Romantismo & História 🚤',
    },
  ],
  'nova york': [
    {
      id: 'nyc-1',
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
      title: 'Manhattan Skyline e Empire State',
      location: 'Nova York - EUA',
      author: 'Oliver Niblett',
      tag: 'Arranha-céus Icônicos 🏙️',
    },
    {
      id: 'nyc-2',
      url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&q=80',
      title: 'Central Park no Outono',
      location: 'Nova York - EUA',
      author: 'Jermaine Ee',
      tag: 'Parque & Tranquilidade 🍂',
    },
  ],
  'londres': [
    {
      id: 'lon-1',
      url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      title: 'Big Ben e Casas do Parlamento',
      location: 'Londres - Reino Unido',
      author: 'Luke Stackpoole',
      tag: 'História Vitoriana 🕰️',
    },
  ],
};

// API: Search city / geocoding
app.get('/api/weather/search', async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.json({ results: [] });
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=pt&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo geocoding error: ${response.status}`);
    }
    const data = (await response.json()) as { results?: Array<Record<string, unknown>> };
    return res.json({ results: data.results || [] });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/weather/search:', errorMsg);
    const term = q.toLowerCase();
    const fallbackResults = [
      { id: 3448439, name: 'São Paulo', latitude: -23.5475, longitude: -46.6361, country: 'Brasil', admin1: 'São Paulo', country_code: 'BR' },
      { id: 3451190, name: 'Rio de Janeiro', latitude: -22.9064, longitude: -43.1822, country: 'Brasil', admin1: 'Rio de Janeiro', country_code: 'BR' },
      { id: 3464975, name: 'Curitiba', latitude: -25.4278, longitude: -49.2731, country: 'Brasil', admin1: 'Paraná', country_code: 'BR' },
      { id: 3450554, name: 'Salvador', latitude: -12.9711, longitude: -38.5108, country: 'Brasil', admin1: 'Bahia', country_code: 'BR' },
      { id: 3469058, name: 'Brasília', latitude: -15.7797, longitude: -47.9297, country: 'Brasil', admin1: 'Distrito Federal', country_code: 'BR' },
      { id: 1850147, name: 'Tóquio', latitude: 35.6895, longitude: 139.6917, country: 'Japão', admin1: 'Tokyo', country_code: 'JP' },
      { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'França', admin1: 'Île-de-France', country_code: 'FR' },
      { id: 5128581, name: 'Nova York', latitude: 40.7143, longitude: -74.006, country: 'Estados Unidos', admin1: 'New York', country_code: 'US' },
      { id: 2643743, name: 'Londres', latitude: 51.5085, longitude: -0.1257, country: 'Reino Unido', admin1: 'Inglaterra', country_code: 'GB' },
      { id: 2267057, name: 'Lisboa', latitude: 38.7167, longitude: -9.1333, country: 'Portugal', admin1: 'Lisboa', country_code: 'PT' },
    ].filter((c) => c.name.toLowerCase().includes(term) || c.country.toLowerCase().includes(term));

    return res.json({ results: fallbackResults });
  }
});

// API: Forecast data
app.get('/api/weather/forecast', async (req: Request, res: Response) => {
  const { lat, lon, timezone } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Parâmetros lat e lon são obrigatórios.' });
  }

  try {
    const tz = (timezone as string) || 'auto';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=${encodeURIComponent(tz)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo forecast error: ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/weather/forecast:', errorMsg);
    return res.status(500).json({ error: 'Falha ao buscar previsão do tempo.', details: errorMsg });
  }
});

// API: Photos for city
app.get('/api/city/photos', async (req: Request, res: Response) => {
  const city = String(req.query.city || '').trim().toLowerCase();
  const country = String(req.query.country || '').trim();

  const normalize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const cityNorm = normalize(city);

  for (const [key, photos] of Object.entries(CURATED_CITY_PHOTOS)) {
    const keyNorm = normalize(key);
    if (cityNorm.includes(keyNorm) || keyNorm.includes(cityNorm)) {
      return res.json({ photos });
    }
  }

  const genericPhotos: CityPhoto[] = [
    {
      id: 'gen-1',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      title: `Vista panorâmica de ${req.query.city || 'Cidade'}`,
      location: `${req.query.city || 'Destino'}, ${country || 'Mundo'}`,
      author: 'City Explorer',
      tag: 'Panorama Urbano 🏙️',
    },
    {
      id: 'gen-2',
      url: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?auto=format&fit=crop&w=1200&q=80',
      title: `Arquitetura e atmosfera da região`,
      location: `${req.query.city || 'Destino'}`,
      author: 'Urban Photography',
      tag: 'Cultura & Vibe ☕',
    },
    {
      id: 'gen-3',
      url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80',
      title: `Paisagens e horizontes locais`,
      location: `${req.query.city || 'Destino'}`,
      author: 'Nature & Horizons',
      tag: 'Natureza & Céu 🌄',
    },
  ];

  return res.json({ photos: genericPhotos });
});

// Helper for generating fallback insight
function generateRuleBasedInsight(data: {
  city: string;
  country?: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipitationProb: number;
  isDay: number;
}) {
  const { city, country, temperature, feelsLike, condition, humidity, uvIndex, precipitationProb } = data;
  const tempRounded = Math.round(temperature);
  const feelsRounded = Math.round(feelsLike);

  const outfitAdvice: string[] = [];
  if (tempRounded < 16) {
    outfitAdvice.push('🧥 Casaco térmico, jaqueta ou suéter quentinho');
    outfitAdvice.push('👖 Calça comprida e meias confortáveis');
  } else if (tempRounded <= 24) {
    outfitAdvice.push('👔 Camisa leve de manga ou suéter confortável');
    outfitAdvice.push('👖 Calça jeans ou de sarja flexível');
  } else {
    outfitAdvice.push('👕 Roupas leves de algodão e tecidos respiráveis');
    outfitAdvice.push('🩳 Bermuda, saia ou roupas frescas de verão');
  }

  if (precipitationProb > 30) {
    outfitAdvice.push('☂️ Leve guarda-chuva ou jaqueta impermeável');
  } else {
    outfitAdvice.push('🕶️ Óculos escuros para proteção solar');
  }

  const activities: string[] = [];
  if (precipitationProb > 40) {
    activities.push('☕ Conhecer cafeterias aconchegantes ou livrarias charmosas');
    activities.push('🏛️ Visitar museus, galerias ou centros culturais da cidade');
  } else if (tempRounded >= 20 && tempRounded <= 28) {
    activities.push('🚴‍♂️ Passeio de bicicleta ou caminhada em parques ao ar livre');
    activities.push('📸 Explorar mirantes e tirar fotos com a luz do dia');
  } else if (tempRounded > 28) {
    activities.push('🏖️ Praia, piscina ou áreas verdes com bastante sombra');
    activities.push('🥤 Fazer pausas para sorvetes artesanais e hidratação');
  } else {
    activities.push('🚶‍♀️ Caminhada revigorante no centro histórico');
    activities.push('🍲 Apreciar pratos típicos quentes em bistrôs locais');
  }

  const healthTips =
    uvIndex >= 6
      ? '☀️ Índice UV alto! Aplique protetor solar FPS 30+ e evite sol direto entre 11h e 16h.'
      : humidity < 35
      ? '💧 Umidade baixa! Beba bastante água e use soro fisiológico para hidratar as vias aéreas.'
      : '💧 Mantenha-se bem hidratado ao longo do dia com água mineral e frutas frescas.';

  const curiosity = `${city} tem uma geografia marcante e microclimas influenciados por relevo e ventos da região de ${country || 'seu país'}.`;

  const vibeScore =
    tempRounded >= 20 && tempRounded <= 27 && precipitationProb < 25
      ? '9.6/10 - Dia perfeito! Clima ideal para curtir ao máximo ✨'
      : precipitationProb > 60
      ? '7.2/10 - Clima aconchegante para um dia tranquilo e relaxante 🌧️'
      : '8.5/10 - Ótimo dia para cumprir sua rotina com energia 🌤️';

  return {
    summary: `Em ${city}, o clima atual é de ${condition.toLowerCase()} com ${tempRounded}°C e sensação térmica de ${feelsRounded}°C. ${humidity > 70 ? 'O ar está úmido e fresco.' : 'Atmosfera limpa e agradável para atividades.'}`,
    outfitAdvice,
    activities,
    healthTips,
    curiosity,
    vibeScore,
  };
}

// API: Gemini Weather Insights & Advisor
app.post('/api/gemini/weather-insight', async (req: Request, res: Response) => {
  const {
    city,
    country,
    temperature,
    feelsLike,
    condition,
    humidity,
    windSpeed,
    uvIndex,
    precipitationProb,
    isDay,
  } = req.body;

  const cityName = city || 'sua localização';
  const fallbackInsight = generateRuleBasedInsight({
    city: cityName,
    country,
    temperature,
    feelsLike,
    condition,
    humidity,
    windSpeed,
    uvIndex,
    precipitationProb,
    isDay,
  });

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ insight: fallbackInsight });
  }

  try {
    const prompt = `
Analise os dados meteorológicos reais de ${cityName}, ${country || ''}:
- Condição atual: ${condition}
- Temperatura: ${temperature}°C (Sensação: ${feelsLike}°C)
- Umidade: ${humidity}%
- Vento: ${windSpeed} km/h
- UV: ${uvIndex}
- Chance de chuva: ${precipitationProb}%

Gere um diagnóstico meteorológico inteligente em Português do Brasil com emojis amigáveis no formato JSON estrito:
{
  "summary": "Resumo de 2 frases sobre o clima e sensação",
  "outfitAdvice": ["item 1 com emoji", "item 2 com emoji", "item 3 com emoji"],
  "activities": ["atividade 1", "atividade 2"],
  "healthTips": "conselho de saúde",
  "curiosity": "curiosidade sobre a cidade",
  "vibeScore": "nota de 1 a 10 e descrição da vibe"
}
`;

    // Timeout protection so response resolves fast
    const geminiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini timeout')), 3500)
    );

    const response = (await Promise.race([geminiCall, timeoutPromise])) as { text?: string };
    const text = response?.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return res.json({ insight: parsed });
    }
    return res.json({ insight: fallbackInsight });
  } catch (err: unknown) {
    console.warn('Using intelligent rule-based weather insight (Gemini fallback):', err instanceof Error ? err.message : String(err));
    return res.json({ insight: fallbackInsight });
  }
});

// API: Ask Weather IA
app.post('/api/gemini/ask', async (req: Request, res: Response) => {
  const { question, city, weatherData } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Pergunta é obrigatória.' });
  }

  const fallbackAnswer = `Com base nas condições atuais de ${city} (${Math.round(weatherData?.temperature || 20)}°C e ${weatherData?.humidity || 60}% de umidade), o tempo está bastante propício! ${weatherData?.precipitationProb > 40 ? 'Mantenha um guarda-chuva por perto.' : 'Aproveite o dia sem preocupações com chuva forte.'} 🌤️`;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ answer: fallbackAnswer });
  }

  try {
    const prompt = `
O usuário perguntou sobre planos ou clima em ${city}:
- Temperatura: ${weatherData?.temperature}°C
- Umidade: ${weatherData?.humidity}%
- Chance de chuva: ${weatherData?.precipitationProb}%
Pergunta: "${question}"
Responda em 2 frases amigáveis e diretas em português brasileiro com emojis.
`;

    const geminiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini ask timeout')), 3500)
    );

    const response = (await Promise.race([geminiCall, timeoutPromise])) as { text?: string };
    const answer = response?.text?.trim();
    return res.json({ answer: answer || fallbackAnswer });
  } catch {
    return res.json({ answer: fallbackAnswer });
  }
});

// Setup Vite development middleware or serve static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`ClimaTempo IA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
