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

// src/components/test-api.tsx

export interface Make {
  data: {
    id: string;
    attributes: {
      name: string;
      number_of_models: number;
    };
  };
}
