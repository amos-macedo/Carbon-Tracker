import { EmissionData } from "@/app/page";
import { getEmissionColor } from "@/utils/emissions";
import { History, X } from "lucide-react";
import { useState } from "react";

type HistoricalChart = {
  history: EmissionData[];
  onSetCurrentEmission: (emission: EmissionData) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const Historical = ({
  history,
  onSetCurrentEmission,
  open,
  setOpen,
}: HistoricalChart) => {
  const [currentEmission, setCurrentEmission] = useState<EmissionData | null>(
    null
  );

  return (
    <div>
      <aside className="hidden lg:block w-80 bg-[#0E1217] border-l border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-[#00d4aa]" />
          <h3 className="font-semibold text-lg">Histórico de Cálculos</h3>
        </div>

        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-[#00d4aa] ${
                currentEmission?.date === item.date
                  ? "bg-[#1a1a23] border-[#00d4aa]"
                  : "bg-[#161A1F] border-gray-700"
              }`}
              onClick={() => {
                setCurrentEmission(item);
                onSetCurrentEmission(item);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.emission < 5
                        ? "bg-green-400"
                        : item.emission < 15
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span className="font-medium capitalize text-sm">
                    {item.vehicleType}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${getEmissionColor(
                    item.emission
                  )}`}
                >
                  {item.emission} kg
                </span>
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>{item.distance} km</span>
                <span>{new Date(item.date).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          ))}
        </div>

        {history.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhum cálculo no histórico</p>
          </div>
        )}
      </aside>

      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setOpen(false)}
          />
          <aside className="lg:hidden fixed right-0 top-0 h-full w-80 bg-[#0E1217] border-l border-gray-800 z-50 transform transition-transform duration-300">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#00d4aa]" />
                  <h3 className="font-semibold text-lg">Histórico</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-[#00d4aa] ${
                        currentEmission?.date === item.date
                          ? "bg-[#1a1a23] border-[#00d4aa]"
                          : "bg-[#161A1F] border-gray-700"
                      }`}
                      onClick={() => {
                        setCurrentEmission(item);
                        onSetCurrentEmission(item);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              item.emission < 5
                                ? "bg-green-400"
                                : item.emission < 15
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                          />
                          <span className="font-medium capitalize text-sm">
                            {item.vehicleType}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold ${getEmissionColor(
                            item.emission
                          )}`}
                        >
                          {item.emission} kg
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{item.distance} km</span>
                        <span>
                          {new Date(item.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {history.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhum cálculo no histórico</p>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};
