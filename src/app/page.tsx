"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Zap, Leaf, Calculator, ArrowLeft, History } from "lucide-react";

// Tipos
type VehicleType = "sedan" | "suv" | "electric" | "hybrid" | "truck";
type EmissionData = {
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

type ComparisonData = {
  name: string;
  yourEmission: number;
  averageEmission: number;
};

// Dados mockados
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

export default function CarbonTracker() {
  const [currentView, setCurrentView] = useState<"calculator" | "results">(
    "calculator"
  );
  const [vehicleType, setVehicleType] = useState<VehicleType>("sedan");
  const [distance, setDistance] = useState<string>("");
  const [currentEmission, setCurrentEmission] = useState<EmissionData | null>(
    null
  );
  const [history, setHistory] = useState<EmissionData[]>([]);

  // Carregar histórico do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("carbonHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const calculateEmission = () => {
    const dist = parseFloat(distance);
    if (!dist || dist <= 0) return;

    const emission = vehicleEmissions[vehicleType] * dist;

    const equivalents = {
      trees: Math.ceil(emission / 4.0),
      electricKm:
        Math.round((emission / vehicleEmissions.electric) * 100) / 100,
      averageCarKm: Math.round((emission / vehicleEmissions.sedan) * 100) / 100,
    };

    const newEmission: EmissionData = {
      vehicleType,
      distance: dist,
      emission: Math.round(emission * 100) / 100,
      date: new Date().toLocaleString(),
      equivalents,
    };

    setCurrentEmission(newEmission);

    const updatedHistory = [newEmission, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    localStorage.setItem("carbonHistory", JSON.stringify(updatedHistory));

    setCurrentView("results");
  };

  const getEmissionColor = (emission: number) => {
    if (emission < 5) return "text-green-400";
    if (emission < 15) return "text-yellow-400";
    return "text-red-400";
  };

  const getEmissionBadge = (emission: number) => {
    if (emission < 5)
      return { text: "🟢 Baixa Emissão", color: "text-green-400" };
    if (emission < 15)
      return { text: "🟡 Emissão Moderada", color: "text-yellow-400" };
    return { text: "🔴 Alta Emissão", color: "text-red-400" };
  };

  const comparisonData: ComparisonData[] = [
    {
      name: "Seu Veículo",
      yourEmission: currentEmission?.emission || 0,
      averageEmission:
        averageEmissions[currentEmission?.vehicleType || "sedan"] *
        (currentEmission?.distance || 1),
    },
    {
      name: "Elétrico",
      yourEmission: 0,
      averageEmission:
        vehicleEmissions.electric * (currentEmission?.distance || 1),
    },
    {
      name: "Híbrido",
      yourEmission: 0,
      averageEmission:
        vehicleEmissions.hybrid * (currentEmission?.distance || 1),
    },
    {
      name: "SUV",
      yourEmission: 0,
      averageEmission: vehicleEmissions.suv * (currentEmission?.distance || 1),
    },
  ];

  // Tela 1: Calculadora
  if (currentView === "calculator") {
    return (
      <div className="min-h-screen bg-[#0f0f13] text-white p-6">
        {/* Header */}
        <header className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00d4aa] to-[#6366f1] rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">CarbonTracker</h1>
            </div>
            <div className="flex gap-4 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">
                📊 Docs
              </button>
              <button className="hover:text-white transition-colors">
                ⭐ GitHub
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00d4aa] to-[#6366f1] bg-clip-text text-transparent">
              Descubra Seu Impacto Ambiental
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Calcule e visualize suas emissões de carbono em tempo real com
              nossa plataforma inteligente
            </p>
          </div>

          {/* Calculator Card */}
          <Card className="bg-[#1a1a23] border-gray-800 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tipo de Veículo
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) =>
                      setVehicleType(e.target.value as VehicleType)
                    }
                    className="w-full bg-[#252532] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa]"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="electric">Elétrico</option>
                    <option value="hybrid">Híbrido</option>
                    <option value="truck">Caminhão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Distância (km)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="150"
                      className="flex-1 bg-[#252532] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa]"
                    />
                    <span className="text-gray-400">km</span>
                  </div>
                </div>

                <Button
                  onClick={calculateEmission}
                  className="w-full bg-gradient-to-r from-[#00d4aa] to-[#6366f1] hover:from-[#00c4a0] hover:to-[#5858f0] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calcular Emissões
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-6 text-gray-400 text-2xl">
              <Car className="w-8 h-8" />
              <span>+</span>
              <Zap className="w-8 h-8" />
              <span>+</span>
              <Leaf className="w-8 h-8" />
              <span>=</span>
              <span className="text-green-400">💚</span>
            </div>
          </div>
        </header>
      </div>
    );
  }

  // Tela 2: Resultados com Sidebar
  // Tela 2: Resultados com Sidebar Responsiva
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      {/* Mobile Header - Aparece apenas no mobile */}
      <div className="lg:hidden bg-[#1a1a23] border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView("calculator")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00d4aa] to-[#6366f1] rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold">CarbonTracker</h1>
          </div>

          <Button
            onClick={() => setCurrentView("calculator")}
            className="bg-gradient-to-r from-[#00d4aa] to-[#6366f1] hover:from-[#00c4a0] hover:to-[#5858f0] text-xs px-3 py-2"
          >
            Nova
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Desktop Header - Aparece apenas no desktop */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <button
                onClick={() => setCurrentView("calculator")}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00d4aa] to-[#6366f1] rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold">CarbonTracker</h1>
              </div>

              <Button
                onClick={() => setCurrentView("calculator")}
                className="bg-gradient-to-r from-[#00d4aa] to-[#6366f1] hover:from-[#00c4a0] hover:to-[#5858f0]"
              >
                Nova Consulta
              </Button>
            </div>

            {/* Conteúdo Principal */}
            <div className="space-y-4 lg:space-y-6">
              {/* Card de Emissão Principal */}
              <Card className="bg-[#1a1a23] border-gray-800">
                <CardContent className="p-4 lg:p-6">
                  <div className="text-center">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-300 mb-3 lg:mb-4">
                      SUA EMISSÃO DE CARBONO
                    </h3>

                    <div className="mb-3 lg:mb-4">
                      <div className="text-3xl lg:text-5xl font-bold mb-1 lg:mb-2">
                        <span
                          className={getEmissionColor(
                            currentEmission!.emission
                          )}
                        >
                          {currentEmission!.emission}
                        </span>
                      </div>
                      <div className="text-lg lg:text-xl text-gray-400">
                        kg CO₂e
                      </div>
                    </div>

                    <div
                      className={`text-base lg:text-lg font-semibold mb-1 lg:mb-2 ${
                        getEmissionBadge(currentEmission!.emission).color
                      }`}
                    >
                      {getEmissionBadge(currentEmission!.emission).text}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-400">
                      Meta recomendada: &lt; 15kg para esta distância
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equivalentes Ambientais */}
              <Card className="bg-[#1a1a23] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg text-gray-300">
                    Equivalentes Ambientais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                    <div className="bg-[#252532] rounded-lg p-3 lg:p-4 text-center">
                      <div className="text-xl lg:text-2xl mb-1 lg:mb-2">🌳</div>
                      <div className="text-xl lg:text-2xl font-bold text-green-400">
                        {currentEmission!.equivalents.trees}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-400">
                        árvores para compensar
                      </div>
                    </div>

                    <div className="bg-[#252532] rounded-lg p-3 lg:p-4 text-center">
                      <div className="text-xl lg:text-2xl mb-1 lg:mb-2">🔌</div>
                      <div className="text-xl lg:text-2xl font-bold text-blue-400">
                        {currentEmission!.equivalents.electricKm} km
                      </div>
                      <div className="text-xs lg:text-sm text-gray-400">
                        com carro elétrico
                      </div>
                    </div>

                    <div className="bg-[#252532] rounded-lg p-3 lg:p-4 text-center">
                      <div className="text-xl lg:text-2xl mb-1 lg:mb-2">🚗</div>
                      <div className="text-xl lg:text-2xl font-bold text-yellow-400">
                        {currentEmission!.equivalents.averageCarKm} km
                      </div>
                      <div className="text-xs lg:text-sm text-gray-400">
                        com carro médio
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Comparação */}
              <Card className="bg-[#1a1a23] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg text-gray-300">
                    Comparação por Tipo de Veículo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                          dataKey="name"
                          stroke="#888"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          stroke="#888"
                          fontSize={12}
                          label={{
                            value: "kg CO₂e",
                            angle: -90,
                            position: "insideLeft",
                            fontSize: 12,
                          }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="yourEmission"
                          name="Sua Emissão"
                          fill="#00d4aa"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="averageEmission"
                          name="Emissão Média"
                          fill="#6366f1"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Sidebar Direita - Visível apenas no desktop */}
        <aside className="hidden lg:block w-80 bg-[#0E1217] border-l border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-[#00d4aa]" />
            <h3 className="font-semibold text-lg">Histórico de Cálculos</h3>
          </div>

          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-[#00d4aa] ${
                  currentEmission?.date === item.date
                    ? "bg-[#1a1a23] border-[#00d4aa]"
                    : "bg-[#161A1F] border-gray-700"
                }`}
                onClick={() => setCurrentEmission(item)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.emission < 5
                          ? "bg-green-400"
                          : item.emission < 15
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                    <span className="font-medium capitalize text-sm">
                      {item.vehicleType}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${getEmissionColor(
                      item.emission
                    )}`}
                  >
                    {item.emission} kg
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>{item.distance} km</span>
                  <span>{new Date(item.date).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>

          {history.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhum cálculo no histórico</p>
            </div>
          )}
        </aside>

        {/* Mobile Bottom Sheet - Histórico no mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0E1217] border-t border-gray-800">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-[#00d4aa]" />
              <h3 className="font-semibold">Histórico</h3>
            </div>

            <div className="overflow-x-auto">
              <div className="flex space-x-3 pb-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className={`min-w-[140px] p-3 rounded-lg border transition-all cursor-pointer flex-shrink-0 ${
                      currentEmission?.date === item.date
                        ? "bg-[#1a1a23] border-[#00d4aa]"
                        : "bg-[#161A1F] border-gray-700"
                    }`}
                    onClick={() => setCurrentEmission(item)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.emission < 5
                              ? "bg-green-400"
                              : item.emission < 15
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                        />
                        <span className="font-medium capitalize text-xs">
                          {item.vehicleType}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-sm font-bold ${getEmissionColor(
                          item.emission
                        )}`}
                      >
                        {item.emission} kg
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.distance} km
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {history.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">Nenhum cálculo no histórico</p>
              </div>
            )}
          </div>
        </div>

        {/* Espaço para a bottom sheet no mobile */}
        <div className="lg:hidden h-32"></div>
      </div>
    </div>
  );
}
// "use client";
// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Search,
//   Bell,
//   Settings,
//   Car,
//   Trash2,
//   Factory,
//   Zap,
//   ChevronDown,
//   FileText,
//   Calculator,
//   CheckCircle2,
//   AlertCircle,
//   Info,
//   UserPlus,
// } from "lucide-react";
// import { ca } from "date-fns/locale";
// import { CategoryCharts } from "@/components/charts/category-charts";
// import { EmissionByCategoryChart } from "@/components/charts/emission-by-category-chart";

// const DashboardPage = () => {
//   // Mock data
//   const totalEmission = 9850;
//   const goalPercent = 65;
//   const categoryData = [
//     {
//       name: "Transporte",
//       value: 2.5,
//       meta: 80,
//       icon: <Car className="w-4 h-4" />,
//     },
//     {
//       name: "Resíduos",
//       value: 1.8,
//       meta: 60,
//       icon: <Trash2 className="w-4 h-4" />,
//     },
//     {
//       name: "Processos Ind.",
//       value: 1.2,
//       meta: 90,
//       icon: <Factory className="w-4 h-4" />,
//     },
//     {
//       name: "Energia",
//       value: 3.8,
//       meta: 70,
//       icon: <Zap className="w-4 h-4" />,
//     },
//   ];

//   const trendData = [
//     { month: "Jan", emissions: 1000 },
//     { month: "Fev", emissions: 950 },
//     { month: "Mar", emissions: 900 },
//     { month: "Abr", emissions: 870 },
//     { month: "Mai", emissions: 850 },
//     { month: "Jun", emissions: 800 },
//     { month: "Jul", emissions: 760 },
//     { month: "Ago", emissions: 700 },
//     { month: "Set", emissions: 680 },
//     { month: "Out", emissions: 650 },
//     { month: "Nov", emissions: 620 },
//     { month: "Dez", emissions: 600 },
//   ];

//   const pieData = [
//     { name: "Energia", value: 3.8 },
//     { name: "Transporte", value: 2.5 },
//     { name: "Resíduos", value: 1.8 },
//     { name: "Processos Ind.", value: 1.2 },
//   ];

//   const barData = [
//     { name: "Energia", atual: 3800, anterior: 4600 },
//     { name: "Transporte", atual: 2500, anterior: 3000 },
//     { name: "Resíduos", atual: 1800, anterior: 2200 },
//     { name: "Processos Ind.", atual: 1200, anterior: 1600 },
//   ];

//   const recentActivity = [
//     {
//       title: "Relatório 'Emissões Q1 2024' gerado por João.",
//       icon: <FileText className="w-4 h-4 text-cyan-400" />,
//       time: "2 horas atrás",
//     },
//     {
//       title: "Dados de energia para Março foram atualizados.",
//       icon: <Zap className="w-4 h-4 text-green-400" />,
//       time: "Ontem",
//     },
//     {
//       title: "Nova meta de redução de emissões definida.",
//       icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
//       time: "3 dias atrás",
//     },
//     {
//       title: "Módulo de simulação de carbono atualizado.",
//       icon: <Calculator className="w-4 h-4 text-yellow-400" />,
//       time: "1 semana atrás",
//     },
//     {
//       title: "Usuário 'Maria Silva' adicionado ao sistema.",
//       icon: <UserPlus className="w-4 h-4 text-pink-400" />,
//       time: "2 semanas atrás",
//     },
//   ];

//   const colors = ["#00BFFF", "#00FA9A", "#FFD700", "#FF6347"];

//   return (
//     <div className="min-h-screen flex bg-[#0B0E11] text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#0E1217] border-r border-gray-800 flex flex-col justify-between">
//         <div>
//           <div className="p-6 font-bold text-xl text-cyan-400">EmissionAI</div>
//           <nav className="flex flex-col gap-2 px-4 text-sm">
//             {[
//               "Visão Geral",
//               "Emissões",
//               "Relatórios",
//               "Metas",
//               "Usuários",
//               "Configurações",
//             ].map((item, i) => (
//               <button
//                 key={i}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 ${
//                   i === 0 ? "bg-cyan-600/20 text-cyan-400" : "text-gray-300"
//                 }`}
//               >
//                 <div className="w-1 h-1 rounded-full bg-current" /> {item}
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="p-4 text-xs text-gray-500 border-t border-gray-800 space-y-2">
//           <p>Ajuda e Suporte</p>
//           <p>Enviar Feedback</p>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Pesquisar emissões, relatório"
//                 className="bg-[#1A1E23] text-sm pl-8 pr-3 py-2 rounded-lg w-80 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <Bell className="text-gray-400 hover:text-white" />
//             <Settings className="text-gray-400 hover:text-white" />
//             <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black font-semibold">
//               A
//             </div>
//           </div>
//         </div>

//         <h1 className="text-2xl font-semibold mb-6">
//           Visão Geral do Dashboard de Emissões
//         </h1>

//         {/* Summary Cards */}
//         <div className="flex flex-col gap-4 mb-6">
//           <div className="flex gap-5">
//             <Card className="bg-cyan-950/40 border-none w-2/4">
//               <CardHeader>
//                 <CardTitle className="text-cyan-400 text-sm">
//                   Emissão Total Atual
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-4xl font-bold">
//                   {totalEmission.toLocaleString()} tCO₂e
//                 </p>
//                 <p className="text-sm text-gray-400 mt-2">
//                   Acompanhe seu progresso em direção às metas de emissões.
//                 </p>
//                 <div className="mt-3 text-cyan-400 font-semibold text-lg">
//                   {goalPercent}% da meta
//                 </div>
//               </CardContent>
//             </Card>

//             <Card
//               key={categoryData[0].name}
//               className="bg-[#161A1F] border-none"
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-gray-300 text-sm">
//                   {categoryData[0].icon} {categoryData[0].name}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold">
//                   {categoryData[0].value} tCO₂e
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {categoryData[0].meta}% da meta
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="w-full flex gap-5">
//             {categoryData
//               .filter((_, i) => i !== 0)
//               .map((c, i) => (
//                 <Card key={i} className="bg-[#161A1F] border-none">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2 text-gray-300 text-sm">
//                       {c.icon} {c.name}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-2xl font-bold">{c.value} tCO₂e</p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       {c.meta}% da meta
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//           </div>
//         </div>

//         {/* Filtros */}
//         <div className="flex gap-4 mb-6">
//           {["Período", "Localização", "Tipo de Emissão"].map((f, i) => (
//             <div
//               key={i}
//               className="flex items-center gap-2 bg-[#161A1F] px-3 py-2 rounded-lg text-sm"
//             >
//               {f}
//               <ChevronDown className="w-4 h-4" />
//             </div>
//           ))}
//           <Button className="bg-cyan-600 hover:bg-cyan-700 text-sm px-4">
//             Aplicar Filtros
//           </Button>
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <Card className="bg-[#161A1F] border-none">
//             <CardHeader>
//               <CardTitle className="text-sm text-gray-300">
//                 Tendência Mensal de Emissões
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={trendData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//                   <XAxis dataKey="month" stroke="#888" />
//                   <YAxis stroke="#888" />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="emissions"
//                     stroke="#00BFFF"
//                     strokeWidth={2}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <EmissionByCategoryChart pieData={pieData} colors={colors} />
//         </div>

//         {/* Comparative Chart */}
//         <Card className="bg-[#161A1F] border-none">
//           <CardHeader>
//             <CardTitle className="text-sm text-gray-300">
//               Comparativo de Emissões
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={barData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//                 <XAxis dataKey="name" stroke="#888" />
//                 <YAxis stroke="#888" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="atual" fill="#00BFFF" name="Ano Atual (2024)" />
//                 <Bar
//                   dataKey="anterior"
//                   fill="#FF7F50"
//                   name="Ano Anterior (2023)"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//             <p className="text-sm text-gray-400 mt-3">
//               Uma redução de{" "}
//               <span className="text-cyan-400 font-semibold">20%</span> nas
//               emissões totais foi alcançada neste período. Isso é equivalente a
//               plantar{" "}
//               <span className="text-cyan-400 font-semibold">500 árvores</span>{" "}
//               ou remover
//               <span className="text-cyan-400 font-semibold">
//                 {" "}
//                 10 carros{" "}
//               </span>{" "}
//               da estrada por um ano.
//             </p>
//           </CardContent>
//         </Card>
//       </main>

//       {/* Sidebar direita */}
//       <aside className="w-80 bg-[#0E1217] border-l border-gray-800 p-6 flex flex-col justify-between">
//         <div>
//           <h3 className="font-semibold mb-4 text-lg">Atividades Recentes</h3>
//           <ul className="space-y-4">
//             {recentActivity.map((a, i) => (
//               <li
//                 key={i}
//                 className="flex items-start gap-3 text-sm text-gray-300"
//               >
//                 {a.icon}
//                 <div>
//                   <p>{a.title}</p>
//                   <span className="text-xs text-gray-500">{a.time}</span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <Button className="bg-cyan-600 hover:bg-cyan-700 text-white mt-6">
//           Nova Simulação
//         </Button>
//       </aside>
//     </div>
//   );
// };

// export default DashboardPage;

// "use client";

// import { useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   ArrowDown,
//   ArrowUp,
//   Car,
//   Home,
//   Utensils,
//   Trash2,
//   FileText,
//   Calculator,
// } from "lucide-react";
// import { TotalEmissionsChart } from "@/components/charts/total-emissions-chart";
// import { CategoryCharts } from "@/components/charts/category-charts";
// import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
// import { EmissionByCategoryChart } from "@/components/charts/emission-by-category-chart";

// const DashboardPage = () => {
//   // Mock data
//   const totalEmissions = 5.2;
//   const goal = 4.8;
//   const variation = -10; // %
//   const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"];

//   const categoryData = [
//     {
//       name: "Transport",
//       value: 1.5,
//       limit: 2.0,
//       icon: <Car className="w-4 h-4" />,
//     },
//     {
//       name: "Energy",
//       value: 1.2,
//       limit: 2.4,
//       icon: <Home className="w-4 h-4" />,
//     },
//     {
//       name: "Food",
//       value: 0.8,
//       limit: 2.4,
//       icon: <Utensils className="w-4 h-4" />,
//     },
//     {
//       name: "Waste",
//       value: 0.5,
//       limit: 2.0,
//       icon: <Trash2 className="w-4 h-4" />,
//     },
//   ];

//   const trendData = [
//     { month: "May", emissions: 4.6, target: 4.5 },
//     { month: "Jun", emissions: 5.0, target: 4.6 },
//     { month: "Jul", emissions: 4.2, target: 4.5 },
//     { month: "Aug", emissions: 4.8, target: 4.6 },
//     { month: "Sep", emissions: 5.0, target: 4.7 },
//     { month: "Oct", emissions: 5.2, target: 4.8 },
//   ];

//   const pieData = useMemo(
//     () => categoryData.map((c) => ({ name: c.name, value: c.value })),
//     [categoryData]
//   );

//   const recentActivity = [
//     { title: "Oct. Emissions Report", icon: <FileText className="w-4 h-4" /> },
//     {
//       title: "Flight calculation LHR-JFK",
//       icon: <Calculator className="w-4 h-4" />,
//     },
//     { title: "Q3 Energy Bill Update", icon: <FileText className="w-4 h-4" /> },
//     { title: "Waste Audit Summary", icon: <FileText className="w-4 h-4" /> },
//   ];

//   return (
//     <div className="py-10 px-6 bg-black h-screen text-white flex justify-between gap-16">
//       <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full ">
//         <TotalEmissionsChart
//           totalEmissions={totalEmissions}
//           goal={goal}
//           variation={variation}
//         />

//         <CategoryCharts categoryData={categoryData} colors={colors} />

//         <MonthlyTrendChart trendData={trendData} />

//         <EmissionByCategoryChart pieData={pieData} colors={colors} />
//       </div>

//       <div className="w-1/4 bg-[#1E2128FF] p-6 rounded-2xl shadow-lg flex flex-col justify-between">
//         <div>
//           <h3 className="font-semibold mb-4">Recent Activity</h3>
//           <ul className="space-y-3">
//             {recentActivity.map((a, i) => (
//               <li
//                 key={i}
//                 className="flex items-center gap-2 text-sm text-gray-300"
//               >
//                 {a.icon}
//                 {a.title}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <button className="bg-blue-600 hover:bg-blue-700 transition mt-6 p-2 rounded-lg text-sm font-medium">
//           New Calculation
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
