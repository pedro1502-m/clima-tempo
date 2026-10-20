import React, { useState } from 'react';
import {
  Sparkles,
  Shirt,
  Compass,
  HeartPulse,
  BookOpen,
  Send,
  Loader2,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { AiInsight, GeoCity, CurrentWeatherData } from '../types/weather.ts';

interface AiAdvisorProps {
  city: GeoCity;
  current: CurrentWeatherData;
  insight: AiInsight | null;
  isLoadingInsight: boolean;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({
  city,
  current,
  insight,
  isLoadingInsight,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const quickQuestions = [
    'O que devo vestir agora para sair?',
    'Dá para fazer caminhada ou correr agora?',
    'Vale a pena levar guarda-chuva hoje?',
    'Quais passeios combinam com o tempo de hoje?',
  ];

  const handleAsk = async (userQuery: string) => {
    if (!userQuery.trim()) return;
    setIsAsking(true);
    setAnswer(null);

    try {
      const res = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQuery,
          city: city.name,
          weatherData: {
            temperature: current.temperature_2m,
            feelsLike: current.apparent_temperature,
            condition: current.weather_code,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            precipitationProb: current.precipitation,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswer(data.answer);
      } else {
        setAnswer('Não foi possível obter resposta no momento. O clima segue estável!');
      }
    } catch {
      setAnswer('Erro ao comunicar com a IA. Tente novamente em instantes.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-amber-400/30 backdrop-blur-2xl shadow-2xl text-white relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Assistente de Clima &amp; Guia IA
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Análise em tempo real personalizada para {city.name}, {city.country}
              </p>
            </div>
          </div>

          {insight?.vibeScore && (
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md self-start sm:self-auto">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>🌟 Vibe:</span>
                <span className="text-white font-extrabold">{insight.vibeScore}</span>
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoadingInsight && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-sm font-medium text-slate-200">
              Gerando análise meteorológica e recomendações inteligentes para {city.name}...
            </p>
          </div>
        )}

        {/* Content loaded */}
        {!isLoadingInsight && insight && (
          <div className="mt-6 space-y-6">
            {/* 1. Summary */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-sm sm:text-base leading-relaxed text-slate-100 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🌤️</span>
              <div>
                <strong className="text-amber-300 font-bold block mb-0.5">Diagnóstico do Dia:</strong>
                <p className="text-slate-200">{insight.summary}</p>
              </div>
            </div>

            {/* 2. Grid Cards: Outfits & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Outfit Suggestions */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2 mb-3">
                    <Shirt className="w-4 h-4 text-amber-300" />
                    <span>O que vestir hoje? 👗👕</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {insight.outfitAdvice.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Activities */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-sky-200 flex items-center gap-2 mb-3">
                    <Compass className="w-4 h-4 text-sky-300" />
                    <span>Atividades Recomendadas 🚴‍♂️</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {insight.activities.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Health Advice & Local Curiosity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Health and Well-being */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-400/25">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <HeartPulse className="w-4 h-4" /> Bem-estar &amp; Saúde
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100">{insight.healthTips}</p>
              </div>

              {/* Curiosity */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-400/25">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-4 h-4" /> Curiosidade Local
                </h4>
                <p className="text-xs sm:text-sm text-indigo-100">{insight.curiosity}</p>
              </div>
            </div>

            {/* 4. Interactive Q&A: Pergunte ao ClimaBot */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Tem alguma dúvida sobre seus planos em {city.name}?</span>
              </h4>

              {/* Quick suggestion buttons */}
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuestion(q);
                      handleAsk(q);
                    }}
                    className="px-2.5 py-1 rounded-xl text-xs bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/10 transition-all flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3 text-amber-300" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk(question);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={`Pergunte algo como "Posso correr no parque às 16h?"...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={isAsking || !question.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Perguntar</span>
                </button>
              </form>

              {/* Answer box */}
              {answer && (
                <div className="mt-3 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-xs sm:text-sm text-slate-100 flex items-start gap-2.5 animate-in fade-in-50">
                  <span className="text-xl">💡</span>
                  <div>
                    <strong className="text-amber-300 font-bold block mb-0.5">Resposta do ClimaBot IA:</strong>
                    <p className="text-white/95 leading-relaxed">{answer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
