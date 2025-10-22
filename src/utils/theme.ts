import { WeatherData } from "@/types/api";


type Props = {
  weather: WeatherData ;
  isDayTime: boolean;
}
export const getTheme = ({ weather, isDayTime }: Props) => {
  if (!weather?.icon) return "from-blue-400 via-blue-500 to-blue-600";

  const { icon, temp = 0 } = weather;

  if (temp >= 40) {
    return isDayTime
      ? "from-red-600 via-orange-600 to-yellow-500"
      : "from-red-900 via-orange-900 to-amber-800";
  }

  if (temp <= 5) {
    return isDayTime
      ? "from-blue-200 via-cyan-300 to-sky-400"
      : "from-blue-900 via-slate-900 to-gray-900";
  }

  const getTemperatureLevel = (t: number) => {
    if (t >= 35) return "hot";
    if (t >= 25) return "warm";
    if (t >= 15) return "mild";
    return "cold";
  };

  const level = getTemperatureLevel(temp);

  const temperatureThemes = {
    hot: {
      day: "from-orange-500 via-red-500 to-yellow-500",
      night: "from-orange-800 via-red-800 to-yellow-800",
    },
    warm: {
      day: "from-yellow-400 via-orange-400 to-yellow-500",
      night: "from-indigo-800 via-purple-800 to-blue-900",
    },
    mild: {
      day: "from-cyan-400 via-blue-500 to-cyan-600",
      night: "from-blue-800 via-indigo-900 to-purple-900",
    },
    cold: {
      day: "from-sky-300 via-blue-400 to-cyan-500",
      night: "from-blue-900 via-slate-900 to-gray-900",
    },
  };


  const weatherThemes: Record<string, string> = {
    rain: "from-slate-600 via-slate-700 to-slate-800",
    storm: "from-purple-700 via-purple-800 to-gray-900",
    snow: "from-blue-100 via-blue-200 to-cyan-300",
    fog: "from-gray-400 via-gray-500 to-gray-600",
    cloud: isDayTime
      ? "from-gray-300 via-gray-400 to-gray-500"
      : "from-gray-600 via-gray-700 to-gray-800",
  };

  if (icon === "sunny") {
    return temperatureThemes[level][isDayTime ? "day" : "night"];
  }

  return weatherThemes[icon] || temperatureThemes[level][isDayTime ? "day" : "night"];
};
