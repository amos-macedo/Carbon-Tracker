"use client";

import {
  Loader2,
  Mic,
  MicOff,
  Navigation,
  Search,
  Star,
  Volume2,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { useRef, useState, useEffect } from "react";
import { COUNTRY_TO_LANGUAGE } from "@/utils/country-lng";

type SearchBarProps = {
  isFavorited: boolean;
  onHandleGetCity: (
    lat?: number,
    lng?: number,
    cityName?: string
  ) => Promise<void>;
  onToggleFavorite: () => void;
  onUseMyLocation: () => void;
  loading?: boolean;
};

interface Suggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// Interfaces para Web Speech API
interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
  readonly isFinal: boolean;
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
}

// Extendendo a interface Window para incluir as propriedades de speech recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const SearchBar = ({
  isFavorited,
  onHandleGetCity,
  onUseMyLocation,
  onToggleFavorite,
  loading = false,
}: SearchBarProps) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition | null>(null);
  const [voiceResponse, setVoiceResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Efeito para Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "pt-BR";

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceResponse("🎤 Ouvindo...");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setVoiceResponse(`🎯 Você disse: "${transcript}"`);
          processVoiceCommand(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Erro no reconhecimento de voz:", event.error);
          setVoiceResponse(`❌ Erro: ${event.error}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setSpeechRecognition(recognition as SpeechRecognition);
      }
    }
  }, []);

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

  const API_KEY = process.env.API_KEY;

  const handleInputChange = async (value: string) => {
    setCityInput(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.log("Erro no autocomplete:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();

    const cleanCommand = lowerCommand
      .replace(/qual (é|eh|e) o (clima|tempo) (em|de|na|no)?/gi, "")
      .replace(/clima (em|de|na|no)?/gi, "")
      .replace(/tempo (em|de|na|no)?/gi, "")
      .replace(/mostr(e|ar) (o )?(clima|tempo) (em|de|na|no)?/gi, "")
      .trim();

    if (cleanCommand && cleanCommand.length > 2) {
      setCityInput(cleanCommand);
      onHandleGetCity(undefined, undefined, cleanCommand);
      return;
    }

    if (
      lowerCommand.includes("minha localização") ||
      lowerCommand.includes("localização atual")
    ) {
      onUseMyLocation();
      return;
    }

    if (cleanCommand.length <= 2) {
      setVoiceResponse("Por favor, fale o nome de uma cidade ou país");
      return;
    }

    setCityInput(lowerCommand);
    onHandleGetCity(undefined, undefined, lowerCommand);
  };

  const toggleVoiceRecognition = () => {
    if (!speechRecognition) {
      setVoiceResponse(
        "❌ Reconhecimento de voz não suportado no seu navegador"
      );
      return;
    }

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      speechRecognition.start();
    }
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    setCityInput(`${suggestion.name}, ${suggestion.country}`);
    setShowSuggestions(false);
    onHandleGetCity(suggestion.lat, suggestion.lon, suggestion.name);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 relative">
        <div
          className="flex-1 flex gap-2 min-w-0 relative"
          ref={suggestionsRef}
        >
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Buscar cidade ou usar comando de voz..."
              value={cityInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white placeholder-white/70 flex-1 min-w-0 pl-10 pr-20"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onHandleGetCity(undefined, undefined, cityInput);
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
              onClick={toggleVoiceRecognition}
              disabled={isSpeaking}
              className={`absolute right-2 top-1/2 cursor-pointer transform -translate-y-1/2 p-1 h-8 w-8 ${
                isListening
                  ? "bg-red-500/80 text-white"
                  : isSpeaking
                  ? "bg-blue-500/80 text-white"
                  : "bg-white/20 text-white/70 hover:bg-white/30"
              }`}
            >
              {isListening ? (
                <MicOff size={14} className="animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 size={14} className="animate-pulse" />
              ) : (
                <Mic size={14} />
              )}
            </Button>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-md rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-white/80 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {suggestion.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {suggestion.state && `${suggestion.state}, `}
                            {suggestion.country}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {COUNTRY_TO_LANGUAGE[suggestion.country] || "en"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* 
          <Button
            onClick={() => onHandleGetCity(undefined, undefined, cityInput)}
            className="bg-white/20 hover:bg-white/30 flex-shrink-0"
          >
            🔍
          </Button> */}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onUseMyLocation}
            disabled={loading}
            className="bg-white/20 cursor-pointer hover:bg-white/30 flex-shrink-0"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Navigation size={16} />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onToggleFavorite}
            className="bg-white/20 hover:bg-white/30 cursor-pointer"
          >
            <Star size={16} className={isFavorited ? "fill-yellow-400" : ""} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {voiceResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/20 backdrop-blur-md rounded-lg p-3"
          >
            <p className="text-sm text-center">{voiceResponse}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
