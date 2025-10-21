import Globe from "react-globe.gl";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Globe as GlobeIcon, Map as MapIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import L from "leaflet";

type InteractiveMapProps = {
  loading: boolean;
  selectedCity: string;
  selectedLocation: { lat: number; lng: number } | null;
  onHandleGetCity: (
    lat?: number,
    lng?: number,
    cityName?: string
  ) => Promise<void>;
};

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export const InteractiveGlobe = ({
  loading,
  selectedCity,
  selectedLocation,
  onHandleGetCity,
}: InteractiveMapProps) => {
  const [zoom, setZoom] = useState(1.5);
  const [isGlobe, setIsGlobe] = useState(true);

  const handleMapClick = (lat: number, lng: number) => {
    onHandleGetCity(lat, lng);
  };

  const tileProviders = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  const getAdjustedSize = (baseSize: number) => {
    return Math.max(0.3, baseSize / Math.max(1, zoom));
  };

  const globeMarkers = useMemo(() => {
    if (!selectedLocation) return [];

    return [
      {
        name: selectedCity || "Local selecionado",
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        size: getAdjustedSize(0.8),
        color: "#ef4444",
        altitude: 0.02,
      },
    ];
  }, [selectedLocation, selectedCity, zoom]);

  const shouldShowLabels = zoom > 1.2;

  const customIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <Card className="bg-white/10 border-none backdrop-blur-md overflow-hidden w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin size={20} />
          {isGlobe ? "Globo Interativo" : "Mapa Interativo"}
        </CardTitle>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-black">
            {selectedLocation ? `${selectedCity}` : "Clique ou use voz"}
          </Badge>
          <Button
            onClick={() => setIsGlobe(!isGlobe)}
            variant="outline"
            size="sm"
            className="bg-black/30  hover:bg-black/50 text-white border-gray-600"
          >
            {isGlobe ? (
              <>
                <GlobeIcon size={14} className="mr-1" />
                Globo
              </>
            ) : (
              <>
                <MapIcon size={14} className="mr-1" />
                Mapa
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-center justify-center h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden relative w-full">
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white">
                ⏳ Carregando...
              </div>
            </div>
          )}

          {isGlobe ? (
            <Globe
              height={400}
              width={600}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundColor="rgba(0,0,0,0)"
              onGlobeClick={(e) => onHandleGetCity(e.lat, e.lng)}
              pointsData={globeMarkers}
              pointColor="color"
              pointRadius="size"
              pointAltitude="altitude"
              labelsData={shouldShowLabels ? globeMarkers : []}
              labelLat="lat"
              labelLng="lng"
              labelText="name"
              labelSize={1.2}
              labelDotRadius={0.3}
              labelColor={() => "rgba(255, 255, 255, 0.9)"}
              labelResolution={2}
              onZoom={(z) => setZoom(zoom)}
            />
          ) : (
            <MapContainer
              center={selectedLocation || [-15.7797, -47.9297]}
              zoom={selectedLocation ? 10 : 4}
              style={{ height: "100%", width: "100%" }}
              className="rounded-lg"
            >
              <TileLayer
                url={tileProviders.dark}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              <MapClickHandler onMapClick={handleMapClick} />

              {selectedLocation && (
                <Marker
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={customIcon}
                >
                  <Popup className="custom-popup">
                    <div className="text-center p-2">
                      <h3 className="font-bold text-sm">{selectedCity}</h3>
                      <p className="text-xs text-gray-600">
                        {selectedLocation.lat.toFixed(4)},{" "}
                        {selectedLocation.lng.toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          )}
        </div>

        <div className="absolute bottom-2 left-2 z-20">
          <Badge variant="outline" className="bg-black/50 text-white text-xs">
            {isGlobe ? "Modo: Globo 3D" : "Modo: Mapa 2D"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
