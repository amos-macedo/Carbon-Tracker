import { useLocalStorage } from './useLocalStorage';

export const useFavorites = (selectedCity: string, countryCode: string) => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('weather-favorites', []);

  const toggleFavorite = () => {
    const cityKey = `${selectedCity}, ${countryCode}`;
    
    setFavorites(prev =>
      prev.includes(cityKey)
        ? prev.filter(fav => fav !== cityKey)
        : [...prev, cityKey]
    );
  };

  return {
    favorites,
    toggleFavorite,
    setFavorites
  };
};