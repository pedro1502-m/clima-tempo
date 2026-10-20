import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { AtmosphereBackground } from './components/AtmosphereBackground.tsx';
import { CurrentWeather } from './components/CurrentWeather.tsx';
import { MetricsGrid } from './components/MetricsGrid.tsx';
import { HourlyForecast } from './components/HourlyForecast.tsx';
import { DailyForecast } from './components/DailyForecast.tsx';
import { AiAdvisor } from './components/AiAdvisor.tsx';
import { CityGallery } from './components/CityGallery.tsx';
import { LocationDetails } from './components/LocationDetails.tsx';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs.tsx';
import {
  GeoCity,
  ForecastResponse,
  AiInsight,
  CityPhoto,
} from './types/weather.ts';
import {
  AtmosphereType,
  getAtmosphereTheme,
  getWeatherConditionByCode,
} from './utils/weather.ts';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

const DEFAULT_CITY: GeoCity = {
  id: 3448439,
  name: 'São Paulo',
  latitude: -23.5475,
  longitude: -46.6361,
  country: 'Brasil',
  country_code: 'BR',
  admin1: 'São Paulo',
  timezone: 'America/Sao_Paulo',
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeoCity>(DEFAULT_CITY);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState<boolean>(true);
  const [forecastError, setForecastError] = useState<string | null>(null);

  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(false);

  const [photos, setPhotos] = useState<CityPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState<boolean>(false);

  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [manualAtmosphere, setManualAtmosphere] = useState<AtmosphereType | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Fetch forecast data
  const loadForecast = useCallback(async (city: GeoCity) => {
    setIsLoadingForecast(true);
    setForecastError(null);

    try {
      const tz = city.timezone || 'auto';
      const res = await fetch(`/api/weather/forecast?lat=${city.latitude}&lon=${city.longitude}&timezone=${encodeURIComponent(tz)}`);
      if (!res.ok) {
        throw new Error('Não foi possível obter dados meteorológicos.');
      }
      const data: ForecastResponse = await res.json();
      setForecast(data);

      // Concurrently fetch AI insights
      loadAiInsight(city, data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido ao buscar previsão.';
      setForecastError(msg);
    } finally {
      setIsLoadingForecast(false);
    }
  }, []);

  // Fetch AI insights
  const loadAiInsight = async (city: GeoCity, forecastData: ForecastResponse) => {
    setIsLoadingInsight(true);
    try {
      const cond = getWeatherConditionByCode(forecastData.current.weather_code, forecastData.current.is_day);
      const res = await fetch('/api/gemini/weather-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: city.name,
          country: city.country,
          temperature: forecastData.current.temperature_2m,
          feelsLike: forecastData.current.apparent_temperature,
          condition: cond.label,
          humidity: forecastData.current.relative_humidity_2m,
          windSpeed: forecastData.current.wind_speed_10m,
          uvIndex: forecastData.daily.uv_index_max[0] || 0,
          precipitationProb: forecastData.daily.precipitation_probability_max[0] || 0,
          isDay: forecastData.current.is_day,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.insight);
      }
    } catch (err) {
      console.error('Failed to load AI insight:', err);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // Fetch photos for city
  const loadCityPhotos = useCallback(async (city: GeoCity) => {
    setIsLoadingPhotos(true);
    try {
      const res = await fetch(`/api/city/photos?city=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}`);
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error('Failed to load photos:', err);
    } finally {
      setIsLoadingPhotos(false);
    }
  }, []);

  // Effect to load data when city changes
  useEffect(() => {
    loadForecast(selectedCity);
    loadCityPhotos(selectedCity);
  }, [selectedCity, loadForecast, loadCityPhotos]);

  // Handle GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          // Reverse geocoding or direct coords
          const res = await fetch(`/api/weather/search?q=${lat.toFixed(2)},${lon.toFixed(2)}`);
          let gpsCity: GeoCity = {
            id: Date.now(),
            name: 'Localização Atual',
            latitude: lat,
            longitude: lon,
            country: 'GPS',
            country_code: '',
            admin1: 'Você está aqui',
          };

          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              gpsCity = data.results[0];
            }
          }

          setSelectedCity(gpsCity);
        } catch {
          setSelectedCity({
            id: Date.now(),
            name: 'Minha Localização',
            latitude: lat,
            longitude: lon,
            country: 'GPS',
            country_code: '',
          });
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        alert('Não foi possível obter sua localização. Permita o acesso ao GPS.');
      },
      { timeout: 8000 }
    );
  };

  // Calculate current atmosphere theme based on city time and weather code
  const currentAtmosphere: AtmosphereType = forecast
    ? getAtmosphereTheme({
        weatherCode: forecast.current.weather_code,
        isDay: forecast.current.is_day,
        localHour: new Date().getHours(),
      })
    : 'day';

  const effectiveAtmosphere = manualAtmosphere || currentAtmosphere;

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      {/* Dynamic Background changing with weather & time */}
      <AtmosphereBackground atmosphere={effectiveAtmosphere} />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 pb-16">
        {/* Navigation & Header */}
        <Header
          unit={unit}
          onToggleUnit={() => setUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
          selectedCity={selectedCity}
          onSelectPopularCity={(city) => setSelectedCity(city)}
          currentAtmosphere={currentAtmosphere}
          manualAtmosphere={manualAtmosphere}
          onSelectManualAtmosphere={(t) => setManualAtmosphere(t)}
        />

        {/* Search Bar with autocomplete */}
        <div className="mt-4">
          <SearchBar
            onSelectCity={(city) => setSelectedCity(city)}
            isLoading={isLoadingForecast}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLocating={isLocating}
          />
        </div>

        {/* Error Notification */}
        {forecastError && (
          <div className="max-w-2xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span>{forecastError}</span>
              </div>
              <button
                onClick={() => loadForecast(selectedCity)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoadingForecast && !forecast && (
          <div className="max-w-4xl mx-auto px-4 mt-12 text-center py-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900/70 border border-white/20 backdrop-blur-xl">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
              <span className="text-sm font-semibold">
                Obtendo previsão do tempo para {selectedCity.name}...
              </span>
            </div>
          </div>
        )}

        {/* Main Weather UI */}
        {forecast && (
          <main>
            {/* Current Weather Hero Card */}
            <CurrentWeather
              city={selectedCity}
              current={forecast.current}
              daily={forecast.daily}
              unit={unit}
              vibeScore={aiInsight?.vibeScore}
              onOpenAiTab={() => setActiveTab('ai')}
            />

            {/* Navigation Tabs */}
            <NavigationTabs
              activeTab={activeTab}
              onChangeTab={(tab) => setActiveTab(tab)}
              photoCount={photos.length}
            />

            {/* Tab Views */}
            {activeTab === 'overview' && (
              <div className="space-y-2 animate-in fade-in-50 duration-200">
                <MetricsGrid current={forecast.current} daily={forecast.daily} unit={unit} />
                <HourlyForecast hourly={forecast.hourly} unit={unit} />
                <DailyForecast daily={forecast.daily} unit={unit} />
              </div>
            )}

            {activeTab === 'forecast7' && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <DailyForecast daily={forecast.daily} unit={unit} />
                <HourlyForecast hourly={forecast.hourly} unit={unit} />
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="animate-in fade-in-50 duration-200">
                <AiAdvisor
                  city={selectedCity}
                  current={forecast.current}
                  insight={aiInsight}
                  isLoadingInsight={isLoadingInsight}
                />
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="animate-in fade-in-50 duration-200">
                <CityGallery
                  city={selectedCity}
                  photos={photos}
                  isLoading={isLoadingPhotos}
                />
              </div>
            )}

            {activeTab === 'map' && (
              <div className="animate-in fade-in-50 duration-200">
                <LocationDetails city={selectedCity} forecast={forecast} />
              </div>
            )}
          </main>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-slate-950/60 backdrop-blur-xl py-6 px-4 text-center text-xs text-slate-300">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span>ClimaTempo IA</span>
            <span className="text-amber-400">☀️</span>
            <span>• Previsão precisa com Open-Meteo &amp; IA Gemini</span>
          </p>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-medium text-slate-200 border border-white/10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Desenvolvido para Projeto Web Developer
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
