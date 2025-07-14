import { useState, useCallback } from "react";

export interface MapBounds {
  ne_lat: number;
  ne_lng: number;
  sw_lat: number;
  sw_lng: number;
}

export function useMapBounds() {
  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const updateBounds = useCallback((mapBounds: MapBounds) => {
    setBounds(mapBounds);
  }, []);

  const clearBounds = useCallback(() => {
    setBounds(null);
  }, []);

  return {
    bounds,
    updateBounds,
    clearBounds,
    hasBounds: bounds !== null,
  };
}