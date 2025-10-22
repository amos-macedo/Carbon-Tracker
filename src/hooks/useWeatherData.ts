import { useState, useCallback } from 'react';
import { WeatherData, DetailedForecast, HourlyForecast, OpenWeatherResponse, OpenWeatherForecastItem, LocationData } from '@/types/api';
import { getWeatherIcon } from '@/utils/weatherIcons';

interface UseWeatherDataReturn {
  selectedCity: string;
  selectedState: string;
  countryCode: string;
  weather: WeatherData | null;
  detailedForecast: DetailedForecast[];
  hourlyForecast: HourlyForecast[];
  loading: boolean;
  handleGetCity: (lat?: number, lng?: number, cityName?: string) => Promise<void>;
  setSelectedCity: (city: string) => void;
  setCountryCode: (code: string) => void;
  currentLocation: { lat: number; lng: number } | null; 
}

export const useWeatherData = (): UseWeatherDataReturn => {
  const [selectedCity, setSelectedCity] = useState("São Paulo");
  const [selectedState, setSelectedState] = useState("SP");
  const [countryCode, setCountryCode] = useState("BR");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailedForecast, setDetailedForecast] = useState<DetailedForecast[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const formatDay = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).split(',')[0];
  };

  const formatHour = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', hour12: false });
  };

  const mapWeatherIcon = (openWeatherIcon: string): string => {
    const iconMap: Record<string, string> = {
      '01d': 'sunny', '01n': 'clear-night', '02d': 'partly-cloudy', '02n': 'partly-cloudy-night',
      '03d': 'cloud', '03n': 'cloud', '04d': 'cloud', '04n': 'cloud', '09d': 'rain', '09n': 'rain',
      '10d': 'rain', '10n': 'rain', '11d': 'storm', '11n': 'storm', '13d': 'snow', '13n': 'snow',
      '50d': 'fog', '50n': 'fog'
    };
    return iconMap[openWeatherIcon] || 'sunny';
  };

  const fetchLocationData = async (lat: number, lng: number): Promise<LocationData> => {
    try {
      const geoUrl = `/api/geolocation?lat=${lat}&lng=${lng}`;
      const geoResponse = await fetch(geoUrl);
      
      if (!geoResponse.ok) {
        console.warn('Erro ao buscar localização, usando padrão');
        return {
          city: 'Local Desconhecido',
          state: '',
          countryCode: '',
          lat: lat,
          lng: lng
        };
      }
      
      const locationData: LocationData = await geoResponse.json();
      return locationData;
    } catch (error) {
      console.warn('Erro na geolocalização, retornando padrão:', error);
      return {
        city: 'Local Desconhecido',
        state: '',
        countryCode: '',
        lat: lat,
        lng: lng
      };
    }
  };

  const handleGetCity = useCallback(async (lat?: number, lng?: number, cityName?: string) => {
    setLoading(true);
    try {
      let apiUrl = "/api/weather?";
      let locationData: LocationData | null = null;

      if (lat && lng) {
        locationData = await fetchLocationData(lat, lng);
        apiUrl += `lat=${lat}&lng=${lng}`;
        setCurrentLocation({ lat, lng });
      } else if (cityName) {
        apiUrl += `city=${encodeURIComponent(cityName)}`;
      } else {
        throw new Error("Coordenadas ou nome da cidade são necessários");
      }

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

      const data: OpenWeatherResponse = await response.json();
      if (data.error) throw new Error(data.error);

      if (!locationData && data.current.coord) {
        try {
          locationData = await fetchLocationData(
            data.current.coord.lat, 
            data.current.coord.lon
          );
        } catch (error) {
          console.warn('Não foi possível obter dados de localização, usando padrão');
          locationData = {
            city: data.current.name || 'Local Desconhecido',
            state: '',
            countryCode: data.current.sys?.country || '',
            lat: data.current.coord.lat,
            lng: data.current.coord.lon
          };
        }
      }

      if (locationData) {
        setSelectedCity(locationData.city);
        setSelectedState(locationData.state);
        setCountryCode(locationData.countryCode);
        
        setCurrentLocation({
          lat: locationData.lat,
          lng: locationData.lng
        });
        
      } else {
        const city = data.current.name || "Local Desconhecido";
        const country = data.current.sys?.country || "";
        
        setSelectedCity(city);
        setCountryCode(country);
        setSelectedState('');
      }

      const currentData = data.current;
      const currentRain = currentData.rain ? (currentData.rain["1h"] || currentData.rain["3h"] || 0) : 0;
      let currentPop = data.forecast?.list?.[0]?.pop || 0;

      if (currentRain > 0 && currentPop === 0) {
        currentPop = 0.8;
      }

      const weatherData: WeatherData = {
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind: Math.round(currentData.wind.speed * 3.6),
        pressure: currentData.main.pressure,
        description: currentData.weather[0].description,
        icon: getWeatherIcon(currentData.weather[0].main),
        rain: currentRain,
        pop: Math.round(currentPop * 100),
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
        windSpeed: Math.round(currentData.wind.speed * 3.6),
        uvIndex: Math.round(currentData.uvi || 0),
        visibility: currentData.visibility / 1000,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon
      };

      setWeather(weatherData);


      if (data.forecast) {
        const detailed = processDetailedForecast(data.forecast.list);
        setDetailedForecast(detailed);
        
        const hourly = processHourlyForecast(data.forecast.list);
        setHourlyForecast(hourly);
      }

    } catch (error) {
      console.log("Erro:", error);
      alert(error instanceof Error ? error.message : "Erro ao buscar dados do clima.");
    } finally {
      setLoading(false);
    }
  }, []);

  const processDetailedForecast = (forecastList: OpenWeatherForecastItem[]): DetailedForecast[] => {
    return forecastList
      .filter((_, index) => index % 8 === 0)
      .slice(0, 7)
      .map((day) => {
        const dayItems = forecastList.filter((item) => {
          const itemDate = new Date(item.dt * 1000).toDateString();
          const dayDate = new Date(day.dt * 1000).toDateString();
          return itemDate === dayDate;
        });
        
        const maxPop = Math.max(...dayItems.map(item => item.pop || 0));
        
        return {
          day: formatDay(day.dt),
          temp: Math.round(day.main.temp),
          high: Math.round(day.main.temp_max),
          low: Math.round(day.main.temp_min),
          rain: Math.round(maxPop * 100),
          icon: mapWeatherIcon(day.weather[0].icon),
          humidity: day.main.humidity,
          windSpeed: Math.round(day.wind.speed * 3.6),
          pressure: day.main.pressure
        };
      });
  };

  const processHourlyForecast = (forecastList: OpenWeatherForecastItem[]): HourlyForecast[] => {
    return forecastList.slice(0, 24).map((hour) => ({
      hour: formatHour(hour.dt),
      temp: Math.round(hour.main.temp),
      rain: Math.round((hour.pop || 0) * 100),
      humidity: hour.main.humidity,
      windSpeed: Math.round(hour.wind.speed * 3.6),
      feelsLike: Math.round(hour.main.feels_like)
    }));
  };

  return {
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
    currentLocation 
  };
};