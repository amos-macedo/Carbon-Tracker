"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmissionChart } from "@/components/charts/emission-chart";
import { EquivalentEnvironmental } from "@/components/charts/equivalent-environmental";
import { VehicleTypeComparison } from "@/components/charts/vehicle-type-comparison";
import { Historical } from "@/components/charts/historical";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

export type VehicleType = "sedan" | "suv" | "electric" | "hybrid" | "truck";
export type EmissionData = {
  vehicleType: VehicleType;
  distance: number;
  emission: number;
  date: string;
  equivalents: {
    trees: number;
    electricKm: number;
    averageCarKm: number;
  };
};

export type ComparisonData = {
  name: string;
  yourEmission: number;
  averageEmission: number;
};

const vehicleEmissions: Record<VehicleType, number> = {
  sedan: 0.192,
  suv: 0.25,
  electric: 0.053,
  hybrid: 0.105,
  truck: 0.35,
};

const averageEmissions: Record<VehicleType, number> = {
  sedan: 0.182,
  suv: 0.24,
  electric: 0.051,
  hybrid: 0.1,
  truck: 0.34,
};

// export default function CarbonTracker() {
//   const router = useRouter();
//   const [history, setHistory] = useState<EmissionData[]>([]);
//   const [currentEmission, setCurrentEmission] = useState<EmissionData | null>(
//     null
//   );
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const handleCalculate = () => {
//     router.push("/calculator");
//   };

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const stored = localStorage.getItem("carbonHistory");
//     const parsed: EmissionData[] = stored ? JSON.parse(stored) : [];

//     if (parsed.length === 0) {
//       router.replace("/calculator");
//     } else {
//       setHistory(parsed);
//       setCurrentEmission(parsed[0]);
//     }

//     setIsLoading(false);
//   }, [router]);

//   if (isLoading || !currentEmission) {
//     return (
//       <div className="min-h-screen bg-[#0f0f13] text-white flex items-center justify-center">
//         <span className="text-gray-400">Carregando...</span>
//       </div>
//     );
//   }

//   const comparisonData: ComparisonData[] = [
//     {
//       name: "Seu Veículo",
//       yourEmission: currentEmission.emission,
//       averageEmission:
//         averageEmissions[currentEmission.vehicleType] *
//         currentEmission.distance,
//     },
//     {
//       name: "Elétrico",
//       yourEmission: 0,
//       averageEmission: vehicleEmissions.electric * currentEmission.distance,
//     },
//     {
//       name: "Híbrido",
//       yourEmission: 0,
//       averageEmission: vehicleEmissions.hybrid * currentEmission.distance,
//     },
//     {
//       name: "SUV",
//       yourEmission: 0,
//       averageEmission: vehicleEmissions.suv * currentEmission.distance,
//     },
//   ];

//   return (
//     <div className="min-h-screen w-full bg-[#0f0f13] text-white">
//       <div className="lg:hidden">
//         <Header
//           handleCalculate={handleCalculate}
//           handleOpenSidebar={() => setIsSidebarOpen(true)}
//         />
//       </div>
//       <Button
//         onClick={handleCalculate}
//         className="bg-gradient-to-r from-[#00d4aa] lg:hidden fixed bottom-4 right-4 z-40 text-2xl h-16 w-16 rounded-full to-[#6366f1] hover:from-[#00c4a0] hover:to-[#5858f0]"
//       >
//         <Plus size={20} />
//       </Button>

//       <div className="flex flex-col lg:flex-row ">
//         <main className="flex-1 p-4 lg:p-6">
//           <div className="max-w-4xl mx-auto">
//             <div className="hidden lg:block">
//               <Header
//                 handleCalculate={handleCalculate}
//                 handleOpenSidebar={() => setIsSidebarOpen(true)}
//               />
//             </div>
//             <div className="space-y-4 lg:space-y-6">
//               <EmissionChart currentEmission={currentEmission} />

//               <EquivalentEnvironmental currentEmission={currentEmission} />

//               <VehicleTypeComparison comparisonData={comparisonData} />
//             </div>
//           </div>
//         </main>

//         <Historical
//           history={history}
//           onSetCurrentEmission={setCurrentEmission}
//           open={isSidebarOpen}
//           setOpen={setIsSidebarOpen}
//         />

//         <div className="lg:hidden h-40"></div>
//       </div>
//     </div>
//   );
// }

// // src/components/test-api.tsx

export interface Make {
  data: {
    id: string;
    attributes: {
      name: string;
      number_of_models: number;
    };
  };
}

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import {
  Cloud,
  Sun,
  Umbrella,
  Wind,
  Thermometer,
  Droplets,
  CloudRain,
  CloudSnow,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Importação dinâmica do globo 3D (para evitar erro no SSR)
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Mapeamento país → idioma (os principais)
const COUNTRY_TO_LANGUAGE: { [key: string]: string } = {
  // 🌎 Américas
  AG: "en",
  AI: "en",
  AR: "es",
  AW: "nl",
  BB: "en",
  BZ: "en",
  BM: "en",
  BO: "es",
  BR: "pt",
  BS: "en",
  CA: "en",
  CL: "es",
  CO: "es",
  CR: "es",
  CU: "es",
  DM: "en",
  DO: "es",
  EC: "es",
  SV: "es",
  GD: "en",
  GT: "es",
  GY: "en",
  HN: "es",
  HT: "ht",
  JM: "en",
  MX: "es",
  NI: "es",
  PA: "es",
  PE: "es",
  PY: "es",
  SR: "nl",
  TT: "en",
  US: "en",
  UY: "es",
  VE: "es",

  // 🌍 Europa
  AL: "sq",
  AD: "ca",
  AT: "de",
  BA: "bs",
  BE: "nl",
  BG: "bg",
  BY: "be",
  CH: "de",
  CY: "el",
  CZ: "cs",
  DE: "de",
  DK: "da",
  EE: "et",
  ES: "es",
  FI: "fi",
  FO: "fo",
  FR: "fr",
  GB: "en",
  GR: "el",
  HR: "hr",
  HU: "hu",
  IE: "en",
  IS: "is",
  IT: "it",
  LI: "de",
  LT: "lt",
  LU: "lb",
  LV: "lv",
  MC: "fr",
  MD: "ro",
  ME: "sr",
  MK: "mk",
  MT: "mt",
  NL: "nl",
  NO: "no",
  PL: "pl",
  PT: "pt",
  RO: "ro",
  RS: "sr",
  RU: "ru",
  SE: "sv",
  SI: "sl",
  SK: "sk",
  SM: "it",
  UA: "uk",
  VA: "la",

  // 🌏 Ásia
  AE: "ar",
  AF: "fa",
  AM: "hy",
  AZ: "az",
  BD: "bn",
  BH: "ar",
  BN: "ms",
  BT: "dz",
  CN: "zh",
  GE: "ka",
  HK: "zh",
  ID: "id",
  IL: "he",
  IN: "hi",
  IQ: "ar",
  IR: "fa",
  JO: "ar",
  JP: "ja",
  KH: "km",
  KP: "ko",
  KR: "ko",
  KW: "ar",
  KZ: "kk",
  LA: "lo",
  LB: "ar",
  LK: "si",
  MM: "my",
  MN: "mn",
  MY: "ms",
  NP: "ne",
  OM: "ar",
  PH: "tl",
  PK: "ur",
  QA: "ar",
  SA: "ar",
  SG: "en",
  SY: "ar",
  TH: "th",
  TJ: "tg",
  TL: "pt",
  TM: "tk",
  TR: "tr",
  TW: "zh",
  UZ: "uz",
  VN: "vi",
  YE: "ar",

  // 🌍 África
  AO: "pt",
  BF: "fr",
  BI: "fr",
  BJ: "fr",
  BW: "en",
  CD: "fr",
  CF: "fr",
  CG: "fr",
  CI: "fr",
  CM: "fr",
  CV: "pt",
  DJ: "fr",
  DZ: "ar",
  EG: "ar",
  ER: "ti",
  ET: "am",
  GA: "fr",
  GH: "en",
  GM: "en",
  GN: "fr",
  GQ: "es",
  GW: "pt",
  KE: "en",
  KM: "ar",
  LR: "en",
  LS: "en",
  LY: "ar",
  MA: "ar",
  MG: "fr",
  ML: "fr",
  MR: "ar",
  MU: "en",
  MW: "en",
  MZ: "pt",
  NA: "en",
  NE: "fr",
  NG: "en",
  RW: "rw",
  SC: "fr",
  SD: "ar",
  SL: "en",
  SN: "fr",
  SO: "so",
  SS: "en",
  ST: "pt",
  SZ: "en",
  TD: "fr",
  TG: "fr",
  TN: "ar",
  TZ: "sw",
  UG: "en",
  ZA: "en",
  ZM: "en",
  ZW: "en",

  // 🌊 Oceania
  AU: "en",
  FJ: "en",
  FM: "en",
  KI: "en",
  MH: "en",
  NR: "en",
  NZ: "en",
  PG: "en",
  SB: "en",
  TO: "to",
  TV: "en",
  VU: "bi",
  WS: "sm",
};

// Frases base em português
const BASE_PHRASES = {
  hot: [
    "🌞 Um dia perfeito para praia e piscina!",
    "🔥 Está quente! Hora de um sorvete refrescante.",
    "☀️ Ótimo dia para atividades ao ar livre!",
    "🏖️ Calor ideal para um dia na praia!",
  ],
  warm: [
    "😊 Temperatura agradável para um passeio no parque!",
    "🌳 Dia perfeito para caminhadas e picnic!",
    "🚶‍♂️ Clima ideal para explorar a cidade!",
    "🌈 Condições perfeitas para atividades externas!",
  ],
  mild: [
    "🧥 Dia ameno, leve um casaco leve!",
    "🍂 Clima perfeito para uma caminhada relaxante!",
    "🌤️ Ótimo para café em uma varanda!",
    "🚴‍♀️ Temperatura ideal para pedalar!",
  ],
  cool: [
    "🧣 Está fresco! Perfeito para um café quente.",
    "📚 Ótimo dia para ler um livro aconchegante!",
    "🍁 Clima agradável para uma caminhada energizante!",
    "🏕️ Bom dia para acampar com amigos!",
  ],
  cold: [
    "❄️ Está frio! Hora de chocolate quente!",
    "🔥 Perfeito para ficar aconchegado em casa!",
    "🧤 Não esqueça seu casaco mais quente!",
    "🏔️ Clima ideal para esportes de inverno!",
  ],
};

export default function Page() {
  const [cityInput, setCityInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("São Paulo");
  const [countryCode, setCountryCode] = useState("BR");
  const [weather, setWeather] = useState({
    temp: 26,
    feelsLike: 28,
    humidity: 60,
    wind: 10,
    description: "Céu limpo e ensolarado",
    icon: "sunny",
  });
  const [dynamicPhrase, setDynamicPhrase] = useState(
    "🌞 Um ótimo dia para caminhar e aproveitar o sol!"
  );
  const [loading, setLoading] = useState(false);

  const forecastData = [
    { day: "Seg", temp: 27 },
    { day: "Ter", temp: 28 },
    { day: "Qua", temp: 29 },
    { day: "Qui", temp: 26 },
    { day: "Sex", temp: 25 },
  ];

  // Muda o fundo conforme o clima
  const getBg = () => {
    switch (weather.icon) {
      case "sunny":
        return "from-yellow-400 via-orange-500 to-red-500";
      case "rain":
        return "from-blue-700 via-blue-800 to-gray-900";
      case "cloud":
        return "from-gray-500 via-gray-600 to-gray-800";
      case "snow":
        return "from-blue-200 via-blue-300 to-blue-400";
      case "storm":
        return "from-purple-700 via-purple-800 to-gray-900";
      case "fog":
        return "from-gray-400 via-gray-500 to-gray-600";
      default:
        return "from-sky-400 via-sky-500 to-indigo-600";
    }
  };

  const API_KEY = "c8931f2cdef10ed93b8fe825e533915e";
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  if (!API_KEY) {
    throw new Error("OpenWeather API Key não configurada");
  }

  // Função para traduzir texto usando Google Translate API FREE
  const translateText = async (
    text: string,
    targetLang: string
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );

      if (!response.ok) {
        throw new Error("Erro na tradução");
      }

      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
      console.warn("Erro na tradução, retornando texto original:", error);
      return text;
    }
  };

  // Gera frase baseada na temperatura
  const getTemperatureCategory = (temp: number) => {
    if (temp >= 30) return "hot";
    if (temp >= 25) return "warm";
    if (temp >= 18) return "mild";
    if (temp >= 10) return "cool";
    return "cold";
  };

  // Seleciona frase aleatória e traduz se necessário
  const generateDynamicPhrase = async (temp: number, countryCode: string) => {
    const category = getTemperatureCategory(temp);
    const phrases = BASE_PHRASES[category as keyof typeof BASE_PHRASES];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    const targetLanguage = COUNTRY_TO_LANGUAGE[countryCode] || "en";

    if (targetLanguage !== "pt") {
      try {
        const translatedPhrase = await translateText(
          randomPhrase,
          targetLanguage
        );
        setDynamicPhrase(translatedPhrase);
      } catch (error) {
        setDynamicPhrase(randomPhrase);
      }
    } else {
      setDynamicPhrase(randomPhrase);
    }
  };

  const handleGetCity = async (
    lat?: number,
    lng?: number,
    cityName?: string
  ) => {
    setLoading(true);
    try {
      // let response;
      let url;

      if (cityName) {
        // BUSCA POR NOME DA CIDADE
        url = `${BASE_URL}/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric&lang=pt_br`;
      } else if (lat && lng) {
        // BUSCA POR COORDENADAS (como você já tinha)
        url = `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=pt_br`;
      } else {
        throw new Error("Coordenadas ou nome da cidade são necessários");
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do clima");
      }

      const data = await response.json();

      const city = data.name || "Local desconhecido";
      const country = data.sys.country || "BR";

      setSelectedCity(city);
      setCountryCode(country);

      const weatherData = {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        description: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].main),
      };

      setWeather(weatherData);
      await generateDynamicPhrase(weatherData.temp, country);

      console.log(`Cidade: ${city}, ${country}`);
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
      alert("Erro ao buscar dados do clima. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherMain: string) => {
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

  const getWeatherIconComponent = (icon: string) => {
    switch (icon) {
      case "sunny":
        return <Sun size={40} className="text-yellow-300" />;
      case "rain":
        return <CloudRain size={40} className="text-blue-300" />;
      case "cloud":
        return <Cloud size={40} className="text-gray-300" />;
      case "snow":
        return <CloudSnow size={40} className="text-white" />;
      case "storm":
        return <Zap size={40} className="text-yellow-400" />;
      case "fog":
        return <Cloud size={40} className="text-gray-400" />;
      default:
        return <Sun size={40} className="text-yellow-300" />;
    }
  };

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${getBg()} text-white transition-all duration-1000`}
    >
      <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Digite o nome de uma cidade"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              handleGetCity(undefined, undefined, cityInput)
            }
          />
          <div className="flex-1 flex justify-center items-center h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            {loading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 text-white">
                  ⏳ Carregando dados meteorológicos...
                </div>
              </div>
            )}
            <div className="md:hidden ">
              <Globe
                height={300}
                width={300}
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)"
                onGlobeClick={(e) => handleGetCity(e.lat, e.lng)}
              />
            </div>
            <div className="hidden md:block">
              <Globe
                height={600}
                width={600}
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)"
                onGlobeClick={(e) => handleGetCity(e.lat, e.lng)}
              />
            </div>
          </div>
        </div>

        {/* PAINEL DE INFORMAÇÕES */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col flex-1 gap-4"
        >
          {/* Cabeçalho */}
          <Card className="bg-white/10 border-none text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                {selectedCity}
                <img
                  src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
                  alt={`Bandeira ${countryCode}`}
                  className="rounded-sm shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = `https://flagcdn.com/w40/br.png`;
                  }}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getWeatherIconComponent(weather.icon)}
                  <div>
                    <p className="text-lg capitalize">{weather.description}</p>
                    <p className="text-4xl font-bold">{weather.temp}°C</p>
                    <p className="text-sm opacity-80">
                      Sensação: {weather.feelsLike}°C
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 text-center border-t border-white/20 pt-3">
                <div className="flex flex-col items-center">
                  <Wind size={18} className="mb-1" />
                  <span className="text-sm">{weather.wind} km/h</span>
                  <span className="text-xs opacity-70">Vento</span>
                </div>
                <div className="flex flex-col items-center">
                  <Thermometer size={18} className="mb-1" />
                  <span className="text-sm">{weather.feelsLike}°C</span>
                  <span className="text-xs opacity-70">Sensação</span>
                </div>
                <div className="flex flex-col items-center">
                  <Droplets size={18} className="mb-1" />
                  <span className="text-sm">{weather.humidity}%</span>
                  <span className="text-xs opacity-70">Umidade</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico da previsão */}
          <Card className="bg-white/10 border-none text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle>Próximos dias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={forecastData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.2)"
                  />
                  <XAxis dataKey="day" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                      border: "none",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#facc15"
                    strokeWidth={3}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Frase dinâmica */}
          <motion.div
            key={dynamicPhrase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 rounded-xl p-4 text-center text-lg font-medium backdrop-blur-md"
          >
            {dynamicPhrase}
          </motion.div>

          <div className="text-center">
            <Button variant="secondary" className="text-black font-semibold">
              Ver mais detalhes
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
