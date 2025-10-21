interface VoiceRecognitionProps {
  isListening: boolean;
  onProcessCommand: (command: string) => void;
}

export const VoiceRecognition = ({
  isListening,
  onProcessCommand,
}: VoiceRecognitionProps) => {
  const VoiceStatusIndicator = () => (
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

  return <VoiceStatusIndicator />;
};
