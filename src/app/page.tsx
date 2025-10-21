"use client";

import React, { useEffect, useRef } from "react";
import { SearchBar } from "@/components/search-bar";
import { InteractiveGlobe } from "@/components/interative-globe";
import { FavoritesCard } from "@/components/favorites-card";
import { WeatherInfos } from "@/components/weather-infos";
import { WeatherOverview } from "@/components/weather-overview";
import { getTheme } from "@/utils/theme";
import { useWeather } from "@/hooks/useWeather";

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
            />

            <InteractiveGlobe
              loading={loading}
              selectedCity={selectedCity}
              selectedLocation={selectedLocation}
              onHandleGetCity={handleGetCity}
              setSelectedCity={(city) => {}}
            />

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
              weather={{
                description: weather.description,
                icon: weather.icon,
                main: weather.description,
                id: 0,
                pop: weather.pop,
              }}
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
