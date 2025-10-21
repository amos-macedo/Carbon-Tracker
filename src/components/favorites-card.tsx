import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

type FavoritesCardProps = {
  favorites: string[];
  handleGetCity: (
    lat: number | undefined,
    lng: number | undefined,
    city: string
  ) => void;
};
export const FavoritesCard = ({
  favorites,
  handleGetCity,
}: FavoritesCardProps) => {
  return (
    <>
      {favorites.length > 0 && (
        <Card className="bg-white/10 border-none backdrop-blur-md w-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star size={18} />
              Cidades Favoritas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {favorites.slice(0, 4).map((fav, index) => {
                const [city, country] = fav.split(", ");
                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-white/30 transition-all text-black flex-shrink-0"
                    onClick={() => handleGetCity(undefined, undefined, city)}
                  >
                    {city}, {country}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
