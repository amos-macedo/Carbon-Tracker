import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { getWeatherIconComponent } from "@/utils/weatherIcons";
import { WeatherData } from "@/hooks/useWeather";

type WeatherInfosProps = {
  city: string;
  countryCode: string;
  weather: WeatherData;
  isDayTime: boolean;
};

export const WeatherInfos = ({
  city,
  countryCode,
  weather,
  isDayTime,
}: WeatherInfosProps) => {
  return (
    <Card className="bg-white/10 border-none backdrop-blur-md w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              {city}, {countryCode}
            </h1>
            <p className="text-sm sm:text-lg capitalize opacity-80 truncate">
              {weather.description}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              key={""}
              src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
              alt={`Bandeira ${countryCode}`}
              className="rounded-sm shadow-md w-8 h-6 sm:w-10 sm:h-7"
            />
            <Badge variant="secondary" className="text-black text-xs">
              {isDayTime ? "☀️ Dia" : "🌙 Noite"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              {getWeatherIconComponent(weather.icon, 40)}
            </div>
            <div className="min-w-0">
              <p className="text-3xl sm:text-5xl font-bold">{weather.temp}°C</p>
              <p className="text-xs sm:text-sm opacity-80">
                Sensação: {weather.feelsLike}°C
              </p>
            </div>
          </div>
        </div>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 text-center">
          <div>
            <Wind size={18} className="mx-auto mb-1" />
            <p className="font-semibold text-sm sm:text-base">
              {weather.wind} km/h
            </p>
            <p className="text-xs opacity-70">Vento</p>
          </div>
          <div>
            <Droplets size={18} className="mx-auto mb-1" />
            <p className="font-semibold text-sm sm:text-base">
              {weather.humidity}%
            </p>
            <p className="text-xs opacity-70">Umidade</p>
          </div>
          <div>
            <CloudRain size={18} className="mx-auto mb-1" />
            <p className="font-semibold text-sm sm:text-base">{weather.pop}%</p>
            <p className="text-xs opacity-70">Chuva</p>
          </div>
          <div>
            <Thermometer size={18} className="mx-auto mb-1" />
            <p className="font-semibold text-sm sm:text-base">
              {weather.pressure} hPa
            </p>
            <p className="text-xs opacity-70">Pressão</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
