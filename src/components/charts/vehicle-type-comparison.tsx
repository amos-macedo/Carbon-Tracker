import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ComparisonData } from "@/app/page";

type CategoryChartProps = {
  comparisonData: ComparisonData[];
};
export const VehicleTypeComparison = ({
  comparisonData,
}: CategoryChartProps) => {
  return (
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
  );
};
