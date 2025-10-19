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

export default function CarbonTracker() {
  const router = useRouter();
  const [history, setHistory] = useState<EmissionData[]>([]);
  const [currentEmission, setCurrentEmission] = useState<EmissionData | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCalculate = () => {
    router.push("/calculator");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("carbonHistory");
    const parsed: EmissionData[] = stored ? JSON.parse(stored) : [];

    if (parsed.length === 0) {
      router.replace("/calculator");
    } else {
      setHistory(parsed);
      setCurrentEmission(parsed[0]);
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading || !currentEmission) {
    return (
      <div className="min-h-screen bg-[#0f0f13] text-white flex items-center justify-center">
        <span className="text-gray-400">Carregando...</span>
      </div>
    );
  }

  const comparisonData: ComparisonData[] = [
    {
      name: "Seu Veículo",
      yourEmission: currentEmission.emission,
      averageEmission:
        averageEmissions[currentEmission.vehicleType] *
        currentEmission.distance,
    },
    {
      name: "Elétrico",
      yourEmission: 0,
      averageEmission: vehicleEmissions.electric * currentEmission.distance,
    },
    {
      name: "Híbrido",
      yourEmission: 0,
      averageEmission: vehicleEmissions.hybrid * currentEmission.distance,
    },
    {
      name: "SUV",
      yourEmission: 0,
      averageEmission: vehicleEmissions.suv * currentEmission.distance,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0f0f13] text-white">
      <div className="lg:hidden">
        <Header
          handleCalculate={handleCalculate}
          handleOpenSidebar={() => setIsSidebarOpen(true)}
        />
      </div>
      <Button
        onClick={handleCalculate}
        className="bg-gradient-to-r from-[#00d4aa] lg:hidden fixed bottom-4 right-4 z-40 text-2xl h-16 w-16 rounded-full to-[#6366f1] hover:from-[#00c4a0] hover:to-[#5858f0]"
      >
        <Plus size={20} />
      </Button>

      <div className="flex flex-col lg:flex-row ">
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="hidden lg:block">
              <Header
                handleCalculate={handleCalculate}
                handleOpenSidebar={() => setIsSidebarOpen(true)}
              />
            </div>
            <div className="space-y-4 lg:space-y-6">
              <EmissionChart currentEmission={currentEmission} />

              <EquivalentEnvironmental currentEmission={currentEmission} />

              <VehicleTypeComparison comparisonData={comparisonData} />
            </div>
          </div>
        </main>

        <Historical
          history={history}
          onSetCurrentEmission={setCurrentEmission}
          open={isSidebarOpen}
          setOpen={setIsSidebarOpen}
        />

        <div className="lg:hidden h-40"></div>
      </div>
    </div>
  );
}
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
