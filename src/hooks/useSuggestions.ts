import { useState, useCallback } from 'react';

interface Suggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export const useSuggestions = (
  cityInput: string,
  setCityInput: (value: string) => void,
  onHandleGetCity: (lat?: number, lng?: number, cityName?: string) => Promise<void>
) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const API_KEY = process.env.API_KEY || "c8931f2cdef10ed93b8fe825e533915e";

  const handleInputChange = useCallback(async (value: string) => {
    setCityInput(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.log("Erro no autocomplete:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [setCityInput, API_KEY]);

  const selectSuggestion = useCallback((suggestion: Suggestion) => {
    setCityInput(`${suggestion.name}, ${suggestion.country}`);
    setShowSuggestions(false);
    onHandleGetCity(suggestion.lat, suggestion.lon, suggestion.name);
  }, [setCityInput, onHandleGetCity]);

  return {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    selectSuggestion
  };
};