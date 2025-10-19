import { Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Make, VehicleType } from "@/app/page";
import { useEffect, useState } from "react";
import { carbonAPI } from "@/lib/carbon-api";

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

export type VehicleModel = {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      year: number;
      vehicle_make: string;
    };
  };
};

export const EmissionCalculator = ({
  handleCalculate,
}: EmissionCalculatorProps) => {
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [makes, setMakes] = useState<Make[]>([]);
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMakes = async () => {
    setLoading(true);
    try {
      const result = await carbonAPI.getVehicleMakes();
      setMakes(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    setLoading(true);
    try {
      const result = await carbonAPI.getVehicleModels(selectedMake?.data.id);
      setModels(result.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMakes();
  }, []);

  useEffect(() => {
    if (selectedMake?.data.id) {
      fetchModels();
    } else {
      setModels([]);
      setSelectedModel(null);
    }
  }, [selectedMake]);

  const calculateEmission = async () => {
    const dist = parseFloat(distance);
    if (!dist || dist <= 0 || !selectedModel) return;

    try {
      const estimate = await carbonAPI.createEstimate(
        selectedModel.data.id,
        dist,
        "km"
      );

      const apiEmission = estimate.data.attributes.carbon_kg;

      const equivalents = {
        trees: Math.ceil(apiEmission / 4.0),
        electricKm: Math.round((apiEmission / 0.055) * 100) / 100,
        averageCarKm: Math.round((apiEmission / 0.12) * 100) / 100,
      };

      const newEmission: EmissionData = {
        vehicleType: selectedModel.data.attributes.name as VehicleType,
        distance: dist,
        emission: Math.round(apiEmission * 100) / 100,
        date: new Date().toLocaleString(),
        equivalents,
      };

      handleCalculate(newEmission);
    } catch (error) {
      console.error("Erro na API:", error);
      const localEmission =
        vehicleEmissions[selectedModel.data.attributes.name as VehicleType] *
        dist;

      const equivalents = {
        trees: Math.ceil(localEmission / 4.0),
        electricKm:
          Math.round((localEmission / vehicleEmissions.electric) * 100) / 100,
        averageCarKm:
          Math.round((localEmission / vehicleEmissions.sedan) * 100) / 100,
      };

      const newEmission: EmissionData = {
        vehicleType: selectedModel.data.attributes.name as VehicleType,
        distance: dist,
        emission: Math.round(localEmission * 100) / 100,
        date: new Date().toLocaleString(),
        equivalents,
      };

      handleCalculate(newEmission);
    }
  };

  return (
    <Card className="bg-[#1a1a23] border-gray-800 max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Marca do Veículo
            </label>
            <select
              value={selectedMake?.data.attributes.name || ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "") {
                  setSelectedMake(null);
                } else {
                  setSelectedMake(
                    makes.find(
                      (make) => make.data.attributes.name === selectedValue
                    ) || null
                  );
                }
              }}
              className="w-full bg-[#252532] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa]"
            >
              <option value="">Selecione uma marca</option>
              {makes.map((make) => (
                <option key={make.data.id} value={make.data.attributes.name}>
                  {make.data.attributes.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Modelo do Veículo
            </label>
            <select
              value={selectedModel?.data.id || ""}
              onChange={(e) => {
                const modelId = e.target.value;
                const model = models.find((m) => m.data.id === modelId) || null;
                setSelectedModel(model);
              }}
              className="w-full bg-[#252532] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa]"
              disabled={!selectedMake || models.length === 0}
            >
              <option value="">Selecione um modelo</option>
              {models.map((model) => (
                <option key={model.data.id} value={model.data.id}>
                  {model.data.attributes.name} ({model.data.attributes.year})
                </option>
              ))}
            </select>
            {!selectedMake && (
              <p className="text-xs text-gray-400 mt-1">
                Selecione uma marca primeiro
              </p>
            )}
            {selectedMake && models.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Carregando modelos...
              </p>
            )}
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
            disabled={!selectedModel || !distance || loading}
            className="w-full bg-gradient-to-r from-[#00d4aa] to-[#6366f1] hover:from-[#00c4a0] hover:to-[#5858f0] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calculator className="w-5 h-5 mr-2" />
            {loading ? "Calculando..." : "Calcular Emissões"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
