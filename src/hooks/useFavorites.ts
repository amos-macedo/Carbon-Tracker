import { useState, useCallback } from 'react';

export const useFavorites = (selectedCity: string, countryCode: string) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = useCallback(() => {
    const cityKey = `${selectedCity}, ${countryCode}`;
    setFavorites(prev =>
      prev.includes(cityKey)
        ? prev.filter(fav => fav !== cityKey)
        : [...prev, cityKey]
    );
  }, [selectedCity, countryCode]);

  return {
    favorites,
    toggleFavorite,
    setFavorites
  };
};