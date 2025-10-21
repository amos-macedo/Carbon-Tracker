import { HourlyForecast } from "@/types/api";
import { Droplets, Wind } from "lucide-react";
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./forecast-tab";

interface HourlyTabProps {
  hourlyForecast: HourlyForecast[];
}

const CHART_COLORS = {
  temperature: "#f59e0b",
  feelsLike: "#ef4444",
  humidity: "#06b6d4",
  wind: "#8b5cf6",
  areaGradient: {
    start: "#f59e0b20",
    end: "#f59e0b02",
  },
};

export const HourlyTab = ({ hourlyForecast }: HourlyTabProps) => {
  const combinedHourlyData = hourlyForecast.slice(0, 12).map((hour) => ({
    ...hour,
    tempRange: [hour.feelsLike - 2, hour.temp, hour.feelsLike + 2],
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">
          Temperatura vs Sensação Térmica
        </h4>
        <ResponsiveContainer width="100%" height={120}>
          <ComposedChart data={combinedHourlyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="hour" stroke="#fff" fontSize={10} />
            <YAxis stroke="#fff" fontSize={10} unit="°C" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="feelsLike"
              fill={CHART_COLORS.areaGradient.start}
              stroke={CHART_COLORS.feelsLike}
              strokeWidth={1}
              name="Sensação"
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke={CHART_COLORS.temperature}
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Temperatura"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Umidade e Vento</h4>
        <ResponsiveContainer width="100%" height={120}>
          <ComposedChart data={hourlyForecast.slice(0, 8)}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="hour" stroke="#fff" fontSize={10} />
            <YAxis yAxisId="left" stroke="#fff" fontSize={10} unit="%" />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#fff"
              fontSize={10}
              unit="km/h"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="humidity"
              fill={CHART_COLORS.humidity}
              name="Umidade (%)"
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="windSpeed"
              stroke={CHART_COLORS.wind}
              strokeWidth={2}
              name="Vento (km/h)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
        {hourlyForecast.slice(0, 12).map((hour, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white/5 rounded-lg p-3 text-sm hover:bg-white/10 transition-colors"
          >
            <span className="font-medium w-12">{hour.hour}</span>
            <div className="flex items-center gap-4 flex-1 justify-between">
              <span className="font-bold w-12">{hour.temp}°C</span>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="flex items-center gap-1">
                  <Droplets size={12} />
                  {hour.rain}%
                </span>
                <span className="flex items-center gap-1">
                  💧{hour.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind size={12} />
                  {hour.windSpeed}km/h
                </span>
              </div>
              <span className="text-xs text-orange-300 w-16 text-right">
                Sente {hour.feelsLike}°C
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
