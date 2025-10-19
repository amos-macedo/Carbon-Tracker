import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EmissionData } from "@/app/page";

type EquivalentEnvironmentalProps = {
  currentEmission: EmissionData | null;
};
export const EquivalentEnvironmental = ({
  currentEmission,
}: EquivalentEnvironmentalProps) => {
  return (
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
  );
};
