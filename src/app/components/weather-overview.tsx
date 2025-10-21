import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Navigation, Calendar } from "lucide-react";

import { WeatherData, DetailedForecast, HourlyForecast } from "@/types/api";
import { TodayTab } from "@/components/today-tab";
import { ForecastTab } from "@/components/forecast-tab";
import { HourlyTab } from "@/components/hourly-tab";

type WeatherOverviewProps = {
  dynamicPhrase: string;
  weather: WeatherData;
  isDayTime: boolean;
  loading: boolean;
  onUseMyLocation: () => void;
  detailedForecast: DetailedForecast[];
  hourlyForecast: HourlyForecast[];
};

export const WeatherOverview = ({
  dynamicPhrase,
  weather,
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
                24h Detalhado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="p-3 sm:p-4">
              <TodayTab dynamicPhrase={dynamicPhrase} weather={weather} />
            </TabsContent>

            <TabsContent value="forecast" className="p-3 sm:p-4">
              <ForecastTab detailedForecast={detailedForecast} />
            </TabsContent>

            <TabsContent value="hourly" className="p-3 sm:p-4">
              <HourlyTab hourlyForecast={hourlyForecast} />
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
