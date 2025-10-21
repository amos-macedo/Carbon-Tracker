import { Calendar, Navigation } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { getWeatherIconComponent } from "@/utils/weatherIcons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useState } from "react";
import { Button } from "./ui/button";
import { WeatherData } from "@/hooks/useWeather";

type DatailedForecast = {
  day: string;
  temp: number;
  high: number;
  low: number;
  rain: number;
  icon: string;
};
type HourlyForecast = {
  hour: string;
  temp: number;
  rain: number;
};

type WeatherOverviewProps = {
  dynamicPhrase: string;
  weather: WeatherData;
  isDayTime: boolean;
  loading: boolean;
  onUseMyLocation: () => void;
  detailedForecast: DatailedForecast[];
  hourlyForecast: HourlyForecast[];
};

export const WeatherOverview = ({
  dynamicPhrase,
  weather,
  isDayTime,
  loading,
  onUseMyLocation,
  detailedForecast,
  hourlyForecast,
}: WeatherOverviewProps) => {
  const [activeTab, setActiveTab] = useState("today");
  return (
    <div className="flex flex-col gap-5">
      <Card className="bg-white/10 border-none backdrop-blur-md w-full">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="today" className="text-xs sm:text-sm">
                Hoje
              </TabsTrigger>
              <TabsTrigger value="forecast" className="text-xs sm:text-sm">
                5 Dias
              </TabsTrigger>
              <TabsTrigger value="hourly" className="text-xs sm:text-sm">
                24h
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="p-3 sm:p-4 space-y-4">
              <div className="text-center py-2">
                <p className="text-base sm:text-lg font-semibold">
                  {dynamicPhrase}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Prob. Chuva:</span>
                    <Badge
                      variant={weather.pop > 50 ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {weather.pop}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>UV Index:</span>
                    <Badge variant="destructive" className="text-xs">
                      Alto
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Período:</span>
                    <span>{isDayTime ? "Dia" : "Noite"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibilidade:</span>
                    <span>10 km</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="forecast" className="p-3 sm:p-4">
              <div className="space-y-4">
                <ResponsiveContainer
                  width="100%"
                  height={120}
                  className="text-xs"
                >
                  <LineChart data={detailedForecast}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <XAxis dataKey="day" stroke="#fff" fontSize={12} />
                    <YAxis stroke="#fff" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#facc15"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-5 gap-1 sm:gap-2">
                  {detailedForecast.map((day, index) => (
                    <div
                      key={index}
                      className="text-center bg-white/10 rounded-lg p-1 sm:p-2"
                    >
                      <p className="font-semibold text-xs sm:text-sm">
                        {day.day}
                      </p>
                      <div className="my-1 flex justify-center">
                        {getWeatherIconComponent(day.icon, 16)}
                      </div>
                      <p className="text-xs sm:text-sm font-bold">
                        {day.temp}°C
                      </p>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-xs">↑{day.high}°</span>
                        <span className="text-xs">↓{day.low}°</span>
                      </div>
                      <p className="text-xs opacity-70 mt-1">{day.rain}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hourly" className="p-3 sm:p-4">
              <ResponsiveContainer
                width="100%"
                height={150}
                className="text-xs"
              >
                <BarChart data={hourlyForecast}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.2)"
                  />
                  <XAxis dataKey="hour" stroke="#fff" fontSize={10} />
                  <YAxis stroke="#fff" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="temp" fill="#facc15" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-xs sm:text-sm mt-2">
                <span>Próximas 24 horas</span>
                <span>Variação de temperatura</span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={onUseMyLocation}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 w-full"
        >
          <Navigation size={16} className="mr-2" />
          Minha Localização
        </Button>
        <Button
          variant="secondary"
          className="text-black w-full"
          onClick={() => setActiveTab("forecast")}
        >
          <Calendar size={16} className="mr-2" />
          Previsão Completa
        </Button>
      </div>
    </div>
  );
};
