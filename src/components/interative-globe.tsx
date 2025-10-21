import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Globe from "react-globe.gl";
import { Badge } from "./ui/badge";

type InteractiveGlobeProps = {
  loading: boolean;
  selectedCity: string;
  selectedLocation: { lat: number; lng: number } | null;
  onHandleGetCity: (
    lat?: number,
    lng?: number,
    cityName?: string
  ) => Promise<void>;
  setSelectedCity: (city: string) => void;
};

export const InteractiveGlobe = ({
  loading,
  selectedCity,
  selectedLocation,
  onHandleGetCity,
  setSelectedCity,
}: InteractiveGlobeProps) => {
  const globeMarkers = selectedLocation
    ? [
        {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          size: 1,
          color: "red",
        },
      ]
    : [];
  return (
    <Card className="bg-white/10 border-none backdrop-blur-md overflow-hidden w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin size={20} />
          Globo Interativo
        </CardTitle>
        <Badge variant="secondary" className="text-black">
          {selectedLocation
            ? `${selectedCity} selecionada`
            : "Clique ou use voz"}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden relative w-full">
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-6">
                ⏳ Carregando...
              </div>
            </div>
          )}
          <Globe
            height={400}
            width={600}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            onGlobeClick={(e) => {
              onHandleGetCity(e.lat, e.lng);
            }}
            pointsData={globeMarkers}
            pointColor="color"
            pointRadius="size"
            pointAltitude={0.01}
          />
        </div>
      </CardContent>
    </Card>
  );
};
