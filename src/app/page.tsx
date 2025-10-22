"use client";

import React, { useEffect, Suspense } from "react";
import { SearchBar } from "@/app/components/search-bar";
import { WeatherOverview } from "@/app/components/weather-overview";
import { getTheme } from "@/utils/theme";
import { useWeather } from "@/hooks/useWeather";
import dynamic from "next/dynamic";
import { FavoritesCard } from "./components/favorites-card";
import { WeatherInfos } from "./components/weather-infos";
import toast from "react-hot-toast";

const InteractiveGlobe = dynamic(
  () =>
    import("./components/interactive-globe").then(
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
      import("./components/interactive-globe").then(
        (module) => module.InteractiveGlobe
      ),
  }
);

export default function EnhancedWeatherApp() {
  const {
    selectedCity,
    selectedState,
    countryCode,
    weather,
    dynamicPhrase,
    loading,
    favorites,
    selectedLocation,
    isDayTime,
    detailedForecast,
    hourlyForecast,
    handleGetCity,
    toggleFavorite,
    useMyLocation,
  } = useWeather();

  useEffect(() => {
    if (dynamicPhrase.dynamicPhrase === "") return;
    toast.success(dynamicPhrase.dynamicPhrase);
  }, [dynamicPhrase]);

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
        weather,
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
              selectedCity={selectedCity}
            />

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
              state={selectedState}
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
