import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

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
  const [selectedLocation, setSelectedLocation] = useLocalStorage<{ lat: number; lng: number } | null>(
    'weather-selected-location', 
    null
  );

  const hasLoadedInitialLocation = useRef(false);

  const updateSelectedLocation = useCallback((location: { lat: number; lng: number } | null) => {
    console.log('📍 updateSelectedLocation chamado:', location);
    setSelectedLocation(location);
  }, [setSelectedLocation]);

  const useMyLocation = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Geolocation success:', { latitude, longitude });
        setUserLocation({ lat: latitude, lng: longitude });
        setSelectedLocation({ lat: latitude, lng: longitude });
        handleGetCity(latitude, longitude);
      },
      (error) => {
        console.error('📍 Geolocation error:', error);
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
  }, [handleGetCity, setSelectedLocation]);

  useEffect(() => {
    if (typeof window === 'undefined' || hasLoadedInitialLocation.current) return;

    hasLoadedInitialLocation.current = true;

    if (selectedLocation) {
      console.log('📍 Usando localização salva:', selectedLocation);
      handleGetCity(selectedLocation.lat, selectedLocation.lng);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('📍 Initial geolocation:', { latitude, longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          setSelectedLocation({ lat: latitude, lng: longitude });
          handleGetCity(latitude, longitude);
        },
        () => {
          console.log('📍 Using São Paulo as fallback');
          const fallbackLocation = { lat: -23.5505, lng: -46.6333 };
          setSelectedLocation(fallbackLocation);
          handleGetCity(undefined, undefined, "São Paulo");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.log('📍 Geolocation not supported, using São Paulo');
      const fallbackLocation = { lat: -23.5505, lng: -46.6333 };
      setSelectedLocation(fallbackLocation);
      handleGetCity(undefined, undefined, "São Paulo");
    }
  }, [handleGetCity, setSelectedLocation, selectedLocation]);

  return {
    selectedLocation,
    userLocation,
    useMyLocation,
    updateSelectedLocation
  };
};