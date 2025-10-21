import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";

interface Suggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

interface SuggestionsListProps {
  showSuggestions: boolean;
  suggestions: Suggestion[];
  onSelectSuggestion: (suggestion: Suggestion) => void;
}

export const SuggestionsList = ({
  showSuggestions,
  suggestions,
  onSelectSuggestion,
}: SuggestionsListProps) => {
  if (!showSuggestions) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
      >
        {suggestions.length === 0 ? (
          <SuggestionSkeleton />
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={`${suggestion.lat}-${suggestion.lon}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectSuggestion(suggestion)}
                className="w-full p-4 text-left hover:bg-white/10 transition-all duration-200 border-b border-gray-700/50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {suggestion.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {suggestion.state && `${suggestion.state}, `}
                      {suggestion.country}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-500 flex-shrink-0"
                  />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export const SuggestionSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center space-x-3 p-3 animate-pulse"
      >
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);
