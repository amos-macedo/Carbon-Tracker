import { Droplets, Wind, Eye, Gauge } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { WeatherData } from "@/types/api";
import { Badge } from "./ui/badge";
import { CustomTooltip } from "./forecast-tab";
import { DynamicPhraseType } from "@/hooks/useDynamicPhrase";

interface TodayTabProps {
  dynamicPhrase: DynamicPhraseType;
  weather: WeatherData;
}
export type TooltipPayload = {
  name: string;
  value: number;
  color: string;
  unit?: string;
};

export const TodayTab = ({ dynamicPhrase, weather }: TodayTabProps) => {
  const probabilityData = [
    { name: "Chuva", value: weather.pop, color: "#3b82f6" },
    { name: "Sem Chuva", value: 100 - weather.pop, color: "#6b7280" },
  ];

  const renderUVBadge = (uvIndex: number) => {
    if (uvIndex <= 2)
      return <Badge className="bg-green-500 text-xs">Baixo</Badge>;
    if (uvIndex <= 5)
      return <Badge className="bg-yellow-500 text-xs">Moderado</Badge>;
    if (uvIndex <= 7)
      return <Badge className="bg-orange-500 text-xs">Alto</Badge>;
    if (uvIndex <= 10)
      return (
        <Badge variant="destructive" className="text-xs">
          Muito Alto
        </Badge>
      );
    return (
      <Badge variant="destructive" className="text-xs">
        Extremo
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-2">
        <p className="text-base sm:text-lg font-semibold">
          {dynamicPhrase.dynamicPhrase}
        </p>
        {dynamicPhrase.ptVersion &&
          dynamicPhrase.ptVersion !== dynamicPhrase.dynamicPhrase && (
            <span className="text-sm text-white/70 italic">
              {`"${dynamicPhrase.ptVersion}"`}
            </span>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Droplets size={16} />
              Prob. Chuva:
            </span>
            <Badge
              variant={weather.pop > 50 ? "destructive" : "default"}
              className="text-xs"
            >
              {weather.pop}%
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Gauge size={16} />
              Pressão:
            </span>
            <span>{weather.pressure}hPa</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Wind size={16} />
              Vento:
            </span>
            <span>{weather.windSpeed} km/h</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Eye size={16} />
              UV Index:
            </span>
            {renderUVBadge(weather.uvIndex)}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={probabilityData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {probabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-sm font-bold"
              >
                {weather.pop}%
              </text>
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-center mt-2">Probabilidade de Chuva</p>
        </div>
      </div>
    </div>
  );
};
