import { Button } from "./ui/button";
import { Navigation, Star, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onUseMyLocation: () => void;
  onToggleFavorite: () => void;
  isFavorited: boolean;
  loading?: boolean;
}

export const ActionButtons = ({
  onUseMyLocation,
  onToggleFavorite,
  isFavorited,
  loading = false,
}: ActionButtonsProps) => {
  return (
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
  );
};
