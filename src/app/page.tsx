"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import { FavoritesCard } from "@/components/favorites-card";
import { WeatherInfos } from "@/components/weather-infos";
import { WeatherOverview } from "@/components/weather-overview";
import { getTheme } from "@/utils/theme";
import { useWeather } from "@/hooks/useWeather";
import dynamic from "next/dynamic";

// Importar InteractiveGlobe dinamicamente com SSR desabilitado
const InteractiveGlobe = dynamic(
  () =>
    import("@/components/interactive-globe").then(
      (module) => module.InteractiveGlobe
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 h-96 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🌍</div>
          <p className="text-lg font-semibold">
            Carregando globo interativo...
          </p>
          <p className="text-sm opacity-70 mt-2">Aguarde um momento</p>
        </div>
      </div>
    ),
    loader: () =>
      import("@/components/interactive-globe").then(
        (module) => module.InteractiveGlobe
      ),
  }
);

const detailedForecast = [
  { day: "Seg", temp: 27, high: 30, low: 22, rain: 10, icon: "sunny" },
  { day: "Ter", temp: 28, high: 31, low: 23, rain: 20, icon: "cloud" },
  { day: "Qua", temp: 29, high: 33, low: 24, rain: 60, icon: "rain" },
  { day: "Qui", temp: 26, high: 29, low: 21, rain: 80, icon: "storm" },
  { day: "Sex", temp: 25, high: 28, low: 20, rain: 30, icon: "cloud" },
];

const hourlyForecast = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i * 2}:00`,
  temp: 20 + Math.random() * 10,
  rain: Math.random() * 100,
}));

export default function EnhancedWeatherApp() {
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    selectedCity,
    countryCode,
    weather,
    dynamicPhrase,
    loading,
    favorites,
    selectedLocation,
    userLocation,
    isDayTime,
    handleGetCity,
    toggleFavorite,
    useMyLocation,
    setFavorites,
  } = useWeather();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        // Se você tiver algum estado de UI específico da página
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loading state melhorado
  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando dados do clima...</p>
        </div>
      </div>
    );
  }

  // Se não tem weather data ainda, mas também não está loading
  if (!weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Não foi possível carregar os dados do clima.</p>
          <button
            onClick={() => handleGetCity(undefined, undefined, "São Paulo")}
            className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${getTheme({
        weather: {
          description: weather.description,
          icon: weather.icon,
          temp: weather.temp,
          feelsLike: weather.feelsLike,
          humidity: weather.humidity,
          wind: weather.wind,
          pressure: weather.pressure,
          rain: weather.rain,
          pop: weather.pop,
          sunrise: weather.sunrise,
          sunset: weather.sunset,
        },
        isDayTime,
      })} text-white transition-all duration-1000 overflow-x-hidden`}
    >
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4 max-w-full">
            <SearchBar
              isFavorited={favorites.includes(
                `${selectedCity}, ${countryCode}`
              )}
              onHandleGetCity={handleGetCity}
              onToggleFavorite={toggleFavorite}
              onUseMyLocation={useMyLocation}
              loading={loading}
            />

            {/* InteractiveGlobe com Suspense */}
            <Suspense
              fallback={
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 h-96 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-4">🌍</div>
                    <p className="text-lg font-semibold">
                      Preparando visualização 3D...
                    </p>
                  </div>
                </div>
              }
            >
              <InteractiveGlobe
                loading={loading}
                selectedCity={selectedCity}
                selectedLocation={selectedLocation}
                onHandleGetCity={handleGetCity}
              />
            </Suspense>

            <FavoritesCard
              favorites={favorites}
              handleGetCity={handleGetCity}
            />
          </div>
          <div className="flex-1 space-y-4 min-w-0 max-w-full">
            <WeatherInfos
              city={selectedCity}
              countryCode={countryCode}
              weather={weather}
              isDayTime={isDayTime}
            />

            <WeatherOverview
              dynamicPhrase={dynamicPhrase}
              weather={weather}
              loading={loading}
              onUseMyLocation={useMyLocation}
              isDayTime={isDayTime}
              detailedForecast={detailedForecast}
              hourlyForecast={hourlyForecast}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
