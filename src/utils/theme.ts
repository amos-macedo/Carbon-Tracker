import { WeatherData } from "@/hooks/useWeather";

  
  
  type props = {
    weather: WeatherData | null ;
    isDayTime: boolean;
  }
  export const getTheme = ({ weather, isDayTime }: props) => {
    const baseThemes: { [key: string]: string } = {
      sunny: isDayTime
        ? "from-yellow-400 via-orange-500 to-red-500"
        : "from-blue-900 via-purple-900 to-gray-900",
      rain: "from-blue-700 via-blue-800 to-gray-900",
      cloud: isDayTime
        ? "from-gray-400 via-gray-500 to-gray-600"
        : "from-gray-600 via-gray-700 to-gray-800",
      snow: "from-blue-200 via-blue-300 to-blue-400",
      storm: "from-purple-700 via-purple-800 to-gray-900",
      fog: "from-gray-400 via-gray-500 to-gray-600",
    };
    return baseThemes[weather?.icon as string] || baseThemes.sunny;
  };