import { DetailedForecast } from "@/types/api";
import { getWeatherIconComponent } from "@/utils/weatherIcons";
import { Droplets, Wind } from "lucide-react";
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { TooltipPayload } from "./today-tab";

interface ForecastTabProps {
  detailedForecast: DetailedForecast[];
}

const CHART_COLORS = {
  temperature: "#f59e0b",
  rain: "#3b82f6",
};

export const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-gray-700 rounded-lg p-3 backdrop-blur-sm">
        <p className="font-semibold text-white">{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
            {entry.unit || ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ForecastTab = ({ detailedForecast }: ForecastTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {detailedForecast.map((day, index) => (
          <div
            key={index}
            className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/15 transition-colors"
          >
            <p className="font-semibold text-xs sm:text-sm mb-2">{day.day}</p>
            <div className="my-2 flex justify-center">
              {getWeatherIconComponent(day.icon, 20)}
            </div>
            <p className="text-sm font-bold mb-1">{day.temp}°C</p>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-red-400">↑{day.high}°</span>
              <span className="text-blue-400">↓{day.low}°</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Droplets size={10} />
                {day.rain}%
              </span>
              <span className="flex items-center gap-1">
                <Wind size={10} />
                {day.windSpeed}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Variação de Temperatura</h4>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={detailedForecast}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.temperature}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.temperature}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="day" stroke="#fff" fontSize={10} />
            <YAxis stroke="#fff" fontSize={10} unit="°C" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={CHART_COLORS.temperature}
              fillOpacity={1}
              fill="url(#tempGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Previsão Completa</h4>
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart data={detailedForecast}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="day" stroke="#fff" fontSize={10} />
            <YAxis yAxisId="left" stroke="#fff" fontSize={10} unit="°C" />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#fff"
              fontSize={10}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="right"
              dataKey="rain"
              fill={CHART_COLORS.rain}
              name="Chuva (%)"
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="high"
              stroke="#ef4444"
              strokeWidth={2}
              name="Máx"
              dot={{ r: 2 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="low"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Mín"
              dot={{ r: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
