"use client";
import { ArrowLeft, Car, Leaf, Zap } from "lucide-react";

import { EmissionData } from "@/app/page";
import { EmissionCalculator } from "@/components/calculator-card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const CalculatorPage = () => {
  const router = useRouter();
  const [previousHistory, setPreviousHistory] = useState<EmissionData[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return; // garante que estamos no client

    const stored = localStorage.getItem("carbonHistory");
    if (stored) {
      setPreviousHistory(JSON.parse(stored));
    }
  }, []);

  const handleHome = () => {
    router.push("/");
  };

  const calculateEmission = (newEmission: EmissionData) => {
    const stored = localStorage.getItem("carbonHistory");
    const previousHistory: EmissionData[] = stored ? JSON.parse(stored) : [];
    const updatedHistory = [newEmission, ...previousHistory.slice(0, 9)];

    localStorage.setItem("carbonHistory", JSON.stringify(updatedHistory));

    handleHome();
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f13] text-white p-6">
      <header className="max-w-4xl mx-auto mb-12">
        <div className="relative flex items-center justify-center mb-8">
          {previousHistory.length > 0 && (
            <Button
              onClick={handleHome}
              className="flex absolute left-0 top-0 items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <p className="hidden lg:block">Voltar</p>
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00d4aa] to-[#6366f1] rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">CarbonTracker</h1>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00d4aa] to-[#6366f1] bg-clip-text text-transparent">
            Descubra Seu Impacto Ambiental
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Calcule e visualize suas emissões de carbono em tempo real com nossa
            plataforma inteligente
          </p>
        </div>

        <EmissionCalculator handleCalculate={calculateEmission} />

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
};

export default CalculatorPage;
