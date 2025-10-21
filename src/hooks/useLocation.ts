import { useState, useCallback, useEffect } from 'react';

interface UseLocationReturn {
  selectedLocation: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  useMyLocation: () => void;
  updateSelectedLocation: (location: { lat: number; lng: number } | null) => void;
}

export const useLocation = (
  handleGetCity: (lat?: number, lng?: number, cityName?: string) => Promise<void>
): UseLocationReturn => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const updateSelectedLocation = useCallback((location: { lat: number; lng: number } | null) => {
    setSelectedLocation(location);
  }, []);

  const useMyLocation = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSelectedLocation({ lat: latitude, lng: longitude });
        handleGetCity(latitude, longitude);
      },
      (error) => {
        let errorMsg = "Erro ao obter localização";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Permissão de localização negada. Ative nas configurações do navegador.";
          handleGetCity(undefined, undefined, "São Paulo");
        } else {
          alert(errorMsg);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [handleGetCity]);

  // Carregar localização inicial
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setSelectedLocation({ lat: latitude, lng: longitude });
          handleGetCity(latitude, longitude);
        },
        () => {
          // Fallback para São Paulo
          setSelectedLocation({ lat: -23.5505, lng: -46.6333 });
          handleGetCity(undefined, undefined, "São Paulo");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setSelectedLocation({ lat: -23.5505, lng: -46.6333 });
      handleGetCity(undefined, undefined, "São Paulo");
    }
  }, [handleGetCity]);

  return {
    selectedLocation,
    userLocation,
    useMyLocation,
    updateSelectedLocation
  };
};