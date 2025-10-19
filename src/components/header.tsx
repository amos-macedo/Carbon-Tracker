import { History, Leaf } from "lucide-react";
import { Button } from "./ui/button";

type HeaderProps = {
  handleCalculate: () => void;
  handleOpenSidebar: () => void;
};
export const Header = ({ handleCalculate, handleOpenSidebar }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#00d4aa] to-[#6366f1] rounded-lg flex items-center justify-center">
          <Leaf className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">CarbonTracker</h1>
      </div>
      <Button
        onClick={handleOpenSidebar}
        className="bg-gradient-to-r from-[#00d4aa] lg:hidden to-[#6366f1] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
      >
        <History className="w-6 h-6" />
      </Button>

      <Button
        onClick={handleCalculate}
        className="bg-gradient-to-r hidden lg:block from-[#00d4aa] to-[#6366f1] hover:from-[#00c4a0] hover:to-[#5858f0]"
      >
        Nova Consulta
      </Button>
    </div>
  );
};
