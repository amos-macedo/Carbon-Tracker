import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VoiceStatusProps {
  voiceResponse: string;
  onClearResponse: () => void;
}

export const VoiceStatus = ({
  voiceResponse,
  onClearResponse,
}: VoiceStatusProps) => {
  if (!voiceResponse) return null;

  const getStatusColor = () => {
    if (voiceResponse.includes("❌") || voiceResponse.includes("⚠️")) {
      return {
        bg: "bg-red-500/20 border-red-500/30",
        dot: "bg-red-500",
      };
    } else if (voiceResponse.includes("🎯") || voiceResponse.includes("🔍")) {
      return {
        bg: "bg-blue-500/20 border-blue-500/30",
        dot: "bg-blue-500",
      };
    } else {
      return {
        bg: "bg-green-500/20 border-green-500/30",
        dot: "bg-green-500",
      };
    }
  };

  const colors = getStatusColor();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className={`backdrop-blur-md rounded-xl p-4 border shadow-lg ${colors.bg}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full animate-pulse ${colors.dot}`}
            />
            <p className="text-sm font-medium">{voiceResponse}</p>
          </div>
          <button
            onClick={onClearResponse}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

interface VoiceStatusIndicatorProps {
  isListening: boolean;
}

export const VoiceStatusIndicator = ({
  isListening,
}: VoiceStatusIndicatorProps) => (
  <div className="flex items-center gap-2 text-sm">
    <div
      className={`w-2 h-2 rounded-full ${
        isListening ? "bg-green-500 animate-pulse" : "bg-gray-400"
      }`}
    />
    <span className={isListening ? "text-green-400" : "text-gray-400"}>
      {isListening ? "Sistema Ativo" : "Sistema em Espera"}
    </span>
  </div>
);
