import { Cloud, CloudRain, CloudSnow, Sun, Zap } from "lucide-react";

export const getWeatherIconComponent = (icon: string, size = 40) => {
  const props = { size };
  switch (icon) {
    case "sunny":
      return <Sun {...props} className="text-yellow-300" />;
    case "rain":
      return <CloudRain {...props} className="text-blue-300" />;
    case "cloud":
      return <Cloud {...props} className="text-gray-300" />;
    case "snow":
      return <CloudSnow {...props} className="text-white" />;
    case "storm":
      return <Zap {...props} className="text-yellow-400" />;
    case "fog":
      return <Cloud {...props} className="text-gray-400" />;
    default:
      return <Sun {...props} className="text-yellow-300" />;
  }
};

export const getWeatherIcon = (weatherMain: string) => {
  switch (weatherMain.toLowerCase()) {
    case "clear":
      return "sunny";
    case "rain":
    case "drizzle":
      return "rain";
    case "clouds":
      return "cloud";
    case "snow":
      return "snow";
    case "thunderstorm":
      return "storm";
    case "mist":
    case "fog":
    case "haze":
      return "fog";
    default:
      return "sunny";
  }
};
