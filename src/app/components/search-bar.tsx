"use client";

import { useSuggestions } from "@/hooks/useSuggestions";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useRef, useState, useEffect } from "react";
import { SearchInput } from "../../components/search-input";
import { SuggestionsList } from "../../components/suggestion-list";
import { ActionButtons } from "../../components/action-buttons";
import {
  VoiceStatus,
  VoiceStatusIndicator,
} from "../../components/voice-status";

type SearchBarProps = {
  onHandleGetCity: (
    lat?: number,
    lng?: number,
    cityName?: string
  ) => Promise<void>;
  onToggleFavorite: () => void;
  onUseMyLocation: () => void;
  isFavorited: boolean;
  loading?: boolean;
  selectedCity?: string;
};

export const SearchBar = ({
  selectedCity,
  isFavorited,
  onHandleGetCity,
  onUseMyLocation,
  onToggleFavorite,
  loading = false,
}: SearchBarProps) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [cityInput, setCityInput] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");

  const { isListening, toggleVoiceRecognition } = useVoiceRecognition({
    onHandleGetCity,
    onUseMyLocation,
    setVoiceResponse,
  });

  const {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleInputChange,
    selectSuggestion,
  } = useSuggestions(cityInput, setCityInput, onHandleGetCity);

  useEffect(() => {
    if (selectedCity) {
      if (selectedCity !== "Local desconhecido") {
        setCityInput(selectedCity);
      } else {
        setCityInput(" ");
      }
    }
  }, [selectedCity]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 relative">
        <div
          className="flex-1 flex gap-2 min-w-0 relative"
          ref={suggestionsRef}
        >
          <SearchInput
            cityInput={cityInput}
            onInputChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onSearch={() => onHandleGetCity(undefined, undefined, cityInput)}
            onVoiceToggle={toggleVoiceRecognition}
            isListening={isListening}
          />

          <SuggestionsList
            showSuggestions={showSuggestions}
            suggestions={suggestions}
            onSelectSuggestion={selectSuggestion}
          />
        </div>

        <ActionButtons
          onUseMyLocation={onUseMyLocation}
          onToggleFavorite={onToggleFavorite}
          isFavorited={isFavorited}
          loading={loading}
        />
      </div>

      <VoiceStatus
        voiceResponse={voiceResponse}
        onClearResponse={() => setVoiceResponse("")}
      />

      <VoiceStatusIndicator isListening={isListening} />
    </div>
  );
};
