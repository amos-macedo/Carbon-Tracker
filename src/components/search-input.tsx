import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Mic, MicOff } from "lucide-react";

interface SearchInputProps {
  cityInput: string;
  onInputChange: (value: string) => void;
  onFocus: () => void;
  onSearch: () => void;
  onVoiceToggle: () => void;
  isListening: boolean;
}

export const SearchInput = ({
  cityInput,
  onInputChange,
  onFocus,
  onSearch,
  onVoiceToggle,
  isListening,
}: SearchInputProps) => {
  return (
    <div className="flex-1 relative">
      <Input
        placeholder="Buscar cidade ou usar comando de voz..."
        value={cityInput}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={onFocus}
        className="bg-white/20 backdrop-blur-md border-white/30 text-white placeholder-white/70 flex-1 min-w-0 pl-10 pr-20"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />

      <Search
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onVoiceToggle}
        className={`absolute right-0.5 top-1/2 m-0 cursor-pointer transform -translate-y-1/2 p-1 h-8 w-8 ${
          isListening
            ? "bg-red-500/80 text-white"
            : "bg-white/20 text-white/70 hover:bg-white/30"
        }`}
      >
        {isListening ? (
          <MicOff size={14} className="animate-pulse" />
        ) : (
          <Mic size={14} />
        )}
      </Button>
    </div>
  );
};
