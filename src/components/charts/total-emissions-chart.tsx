import { ArrowDown, ArrowUp } from "lucide-react";

type TotalEmissionsChartProps = {
  totalEmissions: number;
  goal: number;
  variation: number;
};

export const TotalEmissionsChart = ({
  totalEmissions,
  goal,
  variation,
}: TotalEmissionsChartProps) => {
  return (
    <div className="w-full h-full ">
      <div className="col-span-2 bg-[#1E2128FF] w-full h-full p-6 rounded-2xl shadow-lg flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Total Emissions - October 2024
          </h2>
          <div className="relative flex justify-center items-center mt-6 mb-4">
            <svg viewBox="0 0 36 36" className="w-32 h-32">
              <path
                className="text-gray-700"
                stroke="currentColor"
                strokeWidth="3.8"
                fill="none"
                d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500"
                stroke="currentColor"
                strokeWidth="3.8"
                strokeDasharray={`${(totalEmissions / goal) * 100}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-2xl font-bold">
              {totalEmissions.toFixed(1)}t
            </span>
          </div>
          <p className="text-center text-sm text-gray-400">
            {variation < 0 ? (
              <span className="text-green-400 flex justify-center items-center gap-1">
                <ArrowDown size={14} /> {Math.abs(variation)}% vs September
              </span>
            ) : (
              <span className="text-red-400 flex justify-center items-center gap-1">
                <ArrowUp size={14} /> {variation}% vs September
              </span>
            )}
          </p>
        </div>
        <p className="text-center text-gray-400 text-xs mt-2">
          Goal: {goal}t CO₂e
        </p>
      </div>
    </div>
  );
};
