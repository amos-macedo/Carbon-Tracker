import { useEffect, useMemo } from "react";
import { useDynamicPhrase } from "./useDynamicPhrase";
import { useFavorites } from "./useFavorites";
import { useLocation } from "./useLocation";
import { useWeatherData } from "./useWeatherData";

export const useWeather = () => {
  const {
    selectedCity,
    selectedState,
    countryCode,
    weather,
    detailedForecast,
    hourlyForecast,
    loading,
    handleGetCity,
    setSelectedCity,
    setCountryCode,
    currentLocation,
  } = useWeatherData();

  const {
    selectedLocation,
    userLocation,
    useMyLocation,
    updateSelectedLocation
  } = useLocation(handleGetCity);

  const {
    favorites,
    toggleFavorite,
    setFavorites
  } = useFavorites(selectedCity, countryCode);

  const {
    dynamicPhrase,
    generateDynamicPhrase
  } = useDynamicPhrase();


  useEffect(() => {
    if (currentLocation) {
      updateSelectedLocation(currentLocation);
    }
  }, [currentLocation, updateSelectedLocation]);


  useEffect(() => {
    if (weather?.temp ) {
      generateDynamicPhrase(weather.temp, countryCode);
    }
  }, [weather?.temp, countryCode, generateDynamicPhrase]);


  const isDayTime = useMemo(() => {
    if (!weather?.sunrise || !weather?.sunset) return true;
    const now = Math.floor(Date.now() / 1000);
    return now > weather.sunrise && now < weather.sunset;
  }, [weather?.sunrise, weather?.sunset]);

  return {

    selectedCity,
    selectedState,
    countryCode,
    weather,
    dynamicPhrase,
    loading,
    favorites,
    selectedLocation: selectedLocation || currentLocation, 
    userLocation,
    isDayTime,
    detailedForecast,
    hourlyForecast,
    
    handleGetCity,
    toggleFavorite,
    useMyLocation,
    setFavorites,
    setSelectedCity,
    setCountryCode
  };
};