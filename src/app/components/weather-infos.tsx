import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWeatherIconComponent } from "@/utils/weatherIcons";
import { WeatherData } from "@/types/api";

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
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold truncate sm:text-2xl ">
              {city}, {countryCode}
            </h1>
            <p className="text-xs capitalize opacity-80 truncate sm:text-sm ">
              {weather.description}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 sm:gap-3">
            {countryCode && (
              <img
                key={""}
                src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
                alt={`Bandeira ${countryCode}`}
                className="rounded-sm shadow-md w-6 h-4 sm:w-8 sm:h-6 lg:w-10 lg:h-7"
                width={40}
                height={40}
              />
            )}
            <Badge variant="secondary" className="text-black text-xs px-2 py-1">
              {isDayTime ? "☀️ Dia" : "🌙 Noite"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="flex-shrink-0">
              {getWeatherIconComponent(weather.icon, 40)}
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold sm:text-3xl lg:text-5xl">
                {weather.temp}°C
              </p>
              <p className="text-xs opacity-80 sm:text-sm">
                Sensação: {weather.feelsLike}°C
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-center sm:grid-cols-4 sm:gap-3  sm:mt-6">
          <div className="p-2 rounded-lg bg-white/5 sm:p-0 sm:bg-transparent">
            <Wind size={16} className="mx-auto mb-1 sm:size-[18px]" />
            <p className="font-semibold text-xs sm:text-sm ">
              {weather.wind} km/h
            </p>
            <p className="text-[10px] opacity-70 sm:text-xs">Vento</p>
          </div>
          <div className="p-2 rounded-lg bg-white/5 sm:p-0 sm:bg-transparent">
            <Droplets size={16} className="mx-auto mb-1 sm:size-[18px]" />
            <p className="font-semibold text-xs sm:text-sm ">
              {weather.humidity}%
            </p>
            <p className="text-[10px] opacity-70 sm:text-xs">Umidade</p>
          </div>
          <div className="p-2 rounded-lg bg-white/5 sm:p-0 sm:bg-transparent">
            <CloudRain size={16} className="mx-auto mb-1 sm:size-[18px]" />
            <p className="font-semibold text-xs sm:text-sm ">{weather.pop}%</p>
            <p className="text-[10px] opacity-70 sm:text-xs">Chuva</p>
          </div>
          <div className="p-2 rounded-lg bg-white/5 sm:p-0 sm:bg-transparent">
            <Thermometer size={16} className="mx-auto mb-1 sm:size-[18px]" />
            <p className="font-semibold text-xs sm:text-sm ">
              {weather.pressure} hPa
            </p>
            <p className="text-[10px] opacity-70 sm:text-xs">Pressão</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
