import { useState, useCallback, useEffect } from 'react';
import { getWeatherIcon } from '@/utils/weatherIcons';
import { COUNTRY_TO_LANGUAGE } from '@/utils/country-lng';
import { BASE_PHRASES } from '@/utils/baseFhrase';

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
  pressure: number;
  rain: number;
  pop: number;
  sunrise: number;
  sunset: number;
}

interface UseWeatherReturn {
  selectedCity: string;
  countryCode: string;
  weather: WeatherData | null;
  dynamicPhrase: string;
  loading: boolean;
  favorites: string[];
  selectedLocation: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  isDayTime: boolean;
  
  handleGetCity: (lat?: number, lng?: number, cityName?: string) => Promise<void>;
  toggleFavorite: () => void;
  useMyLocation: () => void;
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useWeather = (): UseWeatherReturn => {
  const [selectedCity, setSelectedCity] = useState("São Paulo");
  const [countryCode, setCountryCode] = useState("BR");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [dynamicPhrase, setDynamicPhrase] = useState("🌞 Um ótimo dia para caminhar e aproveitar o sol!");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDayTime, setIsDayTime] = useState(true);

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'pt') return text;

    try {
      const response = await fetch(
        `/api/translate?text=${encodeURIComponent(text)}&targetLang=${targetLang}`
      );
      
      if (!response.ok) throw new Error('Translation failed');
      
      const data = await response.json();
      return data.translatedText || text;
      
    } catch (error) {
      console.warn('Erro na tradução:', error);
      return text;
    }
  };

  const getTemperatureCategory = (temp: number) => {
    if (temp >= 30) return "hot";
    if (temp >= 25) return "warm";
    if (temp >= 18) return "mild";
    if (temp >= 10) return "cool";
    return "cold";
  };

  const generateDynamicPhrase = async (temp: number, countryCode: string) => {
    const category = getTemperatureCategory(temp);
    const phrases = BASE_PHRASES[category as keyof typeof BASE_PHRASES];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const targetLanguage = COUNTRY_TO_LANGUAGE[countryCode] || "en";

    if (targetLanguage !== "pt") {
      try {
        const translatedPhrase = await translateText(randomPhrase, targetLanguage);
        setDynamicPhrase(translatedPhrase);
      } catch (error) {
        setDynamicPhrase(randomPhrase);
      }
    } else {
      setDynamicPhrase(randomPhrase);
    }
  };

  const handleGetCity = useCallback(async (lat?: number, lng?: number, cityName?: string) => {
    setLoading(true);
    try {
      let apiUrl = "/api/weather?";

      if (cityName) {
        apiUrl += `city=${encodeURIComponent(cityName)}`;
      } else if (lat && lng) {
        apiUrl += `lat=${lat}&lng=${lng}`;
        setSelectedLocation({ lat, lng });
      } else {
        throw new Error("Coordenadas ou nome da cidade são necessários");
      }

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

      const data = await response.json();
      if (data.cod && data.cod !== 200) throw new Error(data.message || "Cidade não encontrada");

      const city = data.name || "Local desconhecido";
      const country = data.sys.country || "BR";

      setSelectedCity(city);
      setCountryCode(country);

      const weatherData: WeatherData = {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        pressure: data.main.pressure,
        description: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].main),
        rain: data.rain ? data.rain["1h"] || 0 : 0,
        pop: data.pop || 0,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      };

      setWeather(weatherData);

      if (cityName && data.coord) {
        setSelectedLocation({
          lat: data.coord.lat,
          lng: data.coord.lon,
        });
      }

      await generateDynamicPhrase(weatherData.temp, country);
    } catch (error) {
      console.log("Erro:", error);
      alert(error instanceof Error ? error.message : "Erro ao buscar dados do clima.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(() => {
    const cityKey = `${selectedCity}, ${countryCode}`;
    setFavorites(prev =>
      prev.includes(cityKey)
        ? prev.filter(fav => fav !== cityKey)
        : [...prev, cityKey]
    );
  }, [selectedCity, countryCode]);

  const useMyLocation = useCallback(() => {
    setLoading(true);

    // Verificar se estamos no cliente
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        handleGetCity(latitude, longitude);
      },
      (error) => {
        setLoading(false);
        let errorMsg = "Erro ao obter localização";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Permissão de localização negada. Ative nas configurações do navegador.";
          // Se negar a localização, busca São Paulo como fallback
          handleGetCity(undefined, undefined, "São Paulo");
        } else {
          alert(errorMsg);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [handleGetCity]);

  // Efeito para carregar dados automaticamente no início
  useEffect(() => {
    // Não executar no servidor
    if (typeof window === 'undefined') return;

    const loadInitialWeather = async () => {
      // Tenta usar a localização atual primeiro
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            handleGetCity(latitude, longitude);
          },
          (error) => {
            // Se falhar (permissão negada ou erro), usa São Paulo como fallback
            console.log("Localização não disponível, usando São Paulo como fallback");
            handleGetCity(undefined, undefined, "São Paulo");
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        // Geolocalização não suportada, usa São Paulo
        handleGetCity(undefined, undefined, "São Paulo");
      }
    };

    loadInitialWeather();
  }, [handleGetCity]);

  // Efeito para dia/noite
  useEffect(() => {
    if (weather?.sunrise && weather?.sunset) {
      const now = Math.floor(Date.now() / 1000);
      setIsDayTime(now > weather.sunrise && now < weather.sunset);
    }
  }, [weather?.sunrise, weather?.sunset]);

  return {
    // Estados
    selectedCity,
    countryCode,
    weather,
    dynamicPhrase,
    loading,
    favorites,
    selectedLocation,
    userLocation,
    isDayTime,
    
    // Ações
    handleGetCity,
    toggleFavorite,
    useMyLocation,
    setFavorites,
  };
};