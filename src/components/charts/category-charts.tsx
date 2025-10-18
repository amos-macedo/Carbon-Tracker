type CategoryChartProps = {
  categoryData: Array<{
    name: string;
    value: number;
    limit: number;
    icon: React.ReactNode;
  }>;
  colors: Array<string>;
};
export const CategoryCharts = ({
  categoryData,
  colors,
}: CategoryChartProps) => {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full col-span-2 grid grid-cols-2 gap-4">
        {categoryData.map((c, i) => {
          const percentage = Math.round((c.value / c.limit) * 100);
          const color = colors[i];
          return (
            <div
              key={c.name}
              className="bg-[#1E2128FF] p-4 rounded-2xl shadow-lg flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {c.icon}
                  <h3 className="font-medium">{c.name}</h3>
                </div>
                <span className="text-sm text-gray-400">{c.value}t</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {percentage}% of category limit
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
};
