import { useState, useEffect, useCallback } from 'react';

interface UseVoiceRecognitionProps {
  onHandleGetCity: (lat?: number, lng?: number, cityName?: string) => Promise<void>;
  onUseMyLocation: () => void;
  setVoiceResponse: (response: string) => void;
}

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

export const useVoiceRecognition = ({
  onHandleGetCity,
  onUseMyLocation,
  setVoiceResponse
}: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);

  const getVoiceError = useCallback((error: string): string => {
    const errorMap: Record<string, string> = {
      "no-speech": "Nenhum comando detectado",
      "audio-capture": "Microfone não disponível",
      "not-allowed": "Permissão de microfone negada",
      network: "Erro de conexão",
      aborted: "Reconhecimento interrompido",
      "bad-grammar": "Erro na gramática",
      "language-not-supported": "Idioma não suportado",
    };
    return errorMap[error] || `Erro: ${error}`;
  }, []);

  const processVoiceCommand = useCallback((command: string) => {
    console.log('🎯 Processando comando de voz:', command);
    
    const lowerCommand = command.toLowerCase().trim();

    const cleanCommand = lowerCommand
      .replace(/(qual|como) (é|está|fica) (o )?(clima|tempo) (em|de|na|no)?/gi, "")
      .replace(/(clima|tempo) (em|de|na|no)?/gi, "")
      .replace(/(mostrar|exibir|consultar) (o )?(clima|tempo) (em|de|na|no)?/gi, "")
      .replace(/(previsão|condições) (do )?tempo (em|de|na|no)?/gi, "")
      .replace(/[.,!?]/g, "")
      .trim();

    console.log('Comando limpo:', cleanCommand);

    // Comandos especiais com ações reais
    const specialCommands: Record<string, () => void> = {
      "minha localização": onUseMyLocation,
      "localização atual": onUseMyLocation,
      "onde estou": onUseMyLocation,
      "usar gps": onUseMyLocation,
      "são paulo": () => onHandleGetCity(undefined, undefined, "São Paulo"),
      "rio de janeiro": () => onHandleGetCity(undefined, undefined, "Rio de Janeiro"),
      "nova york": () => onHandleGetCity(undefined, undefined, "New York"),
      "londres": () => onHandleGetCity(undefined, undefined, "London"),
    };

    // Verificar comandos especiais
    for (const [cmd, action] of Object.entries(specialCommands)) {
      if (lowerCommand.includes(cmd)) {
        console.log(`🚀 Executando comando especial: ${cmd}`);
        setVoiceResponse(`🚀 Executando: ${cmd}`);
        action();
        return;
      }
    }

    // Comando de cidade normal
    if (cleanCommand && cleanCommand.length > 2) {
      console.log(`🔍 Buscando cidade por voz: ${cleanCommand}`);
      setVoiceResponse(`🔍 Buscando dados para: ${cleanCommand}`);
      onHandleGetCity(undefined, undefined, cleanCommand);
      return;
    }

    // Comando não reconhecido
    if (cleanCommand.length <= 2) {
      setVoiceResponse("🎯 Por favor, especifique uma cidade (ex: 'clima em São Paulo')");
      return;
    }
  }, [onHandleGetCity, onUseMyLocation, setVoiceResponse]);

  const toggleVoiceRecognition = useCallback(() => {
    if (!speechRecognition) {
      setVoiceResponse("❌ Sistema de voz não disponível neste navegador");
      return;
    }

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
      setVoiceResponse("⏹️ Reconhecimento pausado");
    } else {
      setVoiceResponse("🎤 Iniciando sistema de voz...");
      setTimeout(() => {
        speechRecognition.start();
      }, 500);
    }
  }, [speechRecognition, isListening, setVoiceResponse]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "pt-BR";

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceResponse("🎤 Sistema de reconhecimento ativo...");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setVoiceResponse(`🎯 Comando detectado: "${transcript}"`);
          processVoiceCommand(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Erro no reconhecimento de voz:", event.error);
          setVoiceResponse(`⚠️ Erro no sistema de voz: ${getVoiceError(event.error)}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          setTimeout(() => setVoiceResponse(""), 3000);
        };

        setSpeechRecognition(recognition as SpeechRecognition);
      }
    }
  }, [getVoiceError, processVoiceCommand, setVoiceResponse]);

  return {
    isListening,
    speechRecognition,
    toggleVoiceRecognition,
  };
};