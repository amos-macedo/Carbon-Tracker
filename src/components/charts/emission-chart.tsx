import { getEmissionBadge, getEmissionColor } from "@/utils/emissions";
import { Card, CardContent } from "../ui/card";
import { EmissionData } from "@/app/page";

type TotalEmissionsChartProps = {
  currentEmission: EmissionData;
};

export const EmissionChart = ({
  currentEmission,
}: TotalEmissionsChartProps) => {
  return (
    <Card className="bg-[#1a1a23] border-gray-800">
      <CardContent className="p-4 lg:p-6">
        <div className="text-center">
          <h3 className="text-base lg:text-lg font-semibold text-gray-300 mb-3 lg:mb-4">
            SUA EMISSÃO DE CARBONO
          </h3>

          <div className="mb-3 lg:mb-4">
            <div className="text-3xl lg:text-5xl font-bold mb-1 lg:mb-2">
              <span className={getEmissionColor(currentEmission!.emission)}>
                {currentEmission!.emission}
              </span>
            </div>
            <div className="text-lg lg:text-xl text-gray-400">kg CO₂e</div>
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
  );
};
