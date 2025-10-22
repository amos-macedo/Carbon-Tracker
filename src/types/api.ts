
export type WeatherData = {
  pop: number;
  uvIndex: number;
  windSpeed: number;
  pressure: number;
  humidity: number;
  feelsLike: number;
  visibility: number;
  temp: number;
  description: string;
  sunrise: number;
  sunset: number;
  icon: string;
  lat: number;
  lon: number;
  wind: number;
  rain?: number; 
};

export type DetailedForecast = {
  day: string;
  temp: number;
  high: number;
  low: number;
  rain: number;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
};

export type HourlyForecast = {
  hour: string;
  temp: number;
  rain: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
};

export interface LocationData {
  city: string;
  state: string;
  countryCode: string;
  lat: number;
  lng: number;
}
export interface OpenWeatherCurrent {
  coord: {
    lat: number;
    lon: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_max: number;
    temp_min: number;
  };
  wind: {
    speed: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  visibility: number;
  name: string;
  pop?: number;
  uvi?: number;
}

export interface OpenWeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  pop: number;
  rain?: {
    "3h"?: number;
  };
}

export interface OpenWeatherForecast {
  list: OpenWeatherForecastItem[];
}

export interface OpenWeatherResponse {
  current: OpenWeatherCurrent;
  forecast: OpenWeatherForecast;
  error?: string;
}

