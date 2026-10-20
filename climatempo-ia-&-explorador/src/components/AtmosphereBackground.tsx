import React, { useMemo } from 'react';
import { AtmosphereType, ATMOSPHERE_THEMES } from '../utils/weather.ts';

interface AtmosphereBackgroundProps {
  atmosphere: AtmosphereType;
}

export const AtmosphereBackground: React.FC<AtmosphereBackgroundProps> = ({ atmosphere }) => {
  const theme = useMemo(() => {
    return ATMOSPHERE_THEMES[atmosphere] || ATMOSPHERE_THEMES.day;
  }, [atmosphere]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Background image layer with smooth transitions */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{
          backgroundImage: `url(${theme.imageUrl})`,
        }}
      />

      {/* Atmospheric dynamic gradient wash */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} transition-colors duration-1000 opacity-90`}
      />

      {/* Dark overlay for text contrast and readability */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />

      {/* Atmospheric visual effects */}
      {atmosphere === 'rain' && (
        <div className="absolute inset-0 overflow-hidden opacity-60">
          <div className="rain-container" />
          <style>{`
            .rain-container {
              position: absolute;
              width: 100%;
              height: 100%;
              background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px);
              background-size: 20px 30px;
              animation: rainFall 0.7s linear infinite;
            }
            @keyframes rainFall {
              from { transform: translateY(-30px); }
              to { transform: translateY(30px); }
            }
          `}</style>
        </div>
      )}

      {atmosphere === 'thunderstorm' && (
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <div className="lightning-effect" />
          <style>{`
            .lightning-effect {
              position: absolute;
              inset: 0;
              background-color: rgba(220, 220, 255, 0.15);
              animation: lightningFlash 5s infinite;
            }
            @keyframes lightningFlash {
              0%, 92%, 94%, 98%, 100% { opacity: 0; }
              93%, 95% { opacity: 0.8; }
            }
          `}</style>
        </div>
      )}

      {atmosphere === 'snow' && (
        <div className="absolute inset-0 overflow-hidden opacity-70">
          <div className="snow-container" />
          <style>{`
            .snow-container {
              position: absolute;
              width: 100%;
              height: 100%;
              background-image: radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px);
              background-size: 50px 50px;
              animation: snowFall 3s linear infinite;
            }
            @keyframes snowFall {
              from { transform: translateY(-50px) translateX(0); }
              to { transform: translateY(50px) translateX(20px); }
            }
          `}</style>
        </div>
      )}

      {atmosphere === 'night' && (
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="stars-layer" />
          <style>{`
            .stars-layer {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                                radial-gradient(1.5px 1.5px at 150px 80px, #ffffff, rgba(0,0,0,0)),
                                radial-gradient(1px 1px at 280px 120px, #e2e8f0, rgba(0,0,0,0)),
                                radial-gradient(2px 2px at 390px 240px, #ffffff, rgba(0,0,0,0)),
                                radial-gradient(1px 1px at 520px 180px, #cbd5e1, rgba(0,0,0,0));
              background-repeat: repeat;
              background-size: 400px 300px;
              animation: starTwinkle 4s ease-in-out infinite alternate;
            }
            @keyframes starTwinkle {
              0% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};
