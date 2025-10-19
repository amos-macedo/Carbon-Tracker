import { Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { VehicleType } from "@/app/page";
import { useState } from "react";

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

const vehicleEmissions: Record<VehicleType, number> = {
  sedan: 0.192,
  suv: 0.25,
  electric: 0.053,
  hybrid: 0.105,
  truck: 0.35,
};

type EmissionCalculatorProps = {
  handleCalculate: (emission: EmissionData) => void;
};

export const EmissionCalculator = ({
  handleCalculate,
}: EmissionCalculatorProps) => {
  const [vehicleType, setVehicleType] = useState<VehicleType>("sedan");
  const [distance, setDistance] = useState<string>("");

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
    handleCalculate(newEmission);
  };
  return (
    <Card className="bg-[#1a1a23] border-gray-800 max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Veículo
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleType)}
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
  );
};
