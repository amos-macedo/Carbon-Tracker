import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type EmissionByCategoryChartProps = {
  pieData: {
    name: string;
    value: number;
  }[];
  colors: string[];
};
export const EmissionByCategoryChart = ({
  pieData,
  colors,
}: EmissionByCategoryChartProps) => {
  return (
    <main className="w-full h-full">
      <div className="col-span-1 w-full h-full bg-[#1E2128FF] p-6 rounded-2xl shadow-lg">
        <h3 className="font-semibold mb-4">Emissions by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
            >
              {pieData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={colors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs text-gray-400">
          {pieData.map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[i] }}
              />
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
