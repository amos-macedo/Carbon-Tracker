import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MonthlyTrendChart = {
  trendData: Array<{
    month: string;
    emissions: number;
    target: number;
  }>;
};
export const MonthlyTrendChart = ({ trendData }: MonthlyTrendChart) => {
  return (
    <main className="w-full h-full">
      <div className="col-span-2 w-full h-full bg-[#1E2128FF] p-6 rounded-2xl shadow-lg">
        <h3 className="font-semibold mb-4">Monthly Emissions Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="emissions"
              stroke="#3b82f6"
              strokeWidth={2}
              dot
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};
