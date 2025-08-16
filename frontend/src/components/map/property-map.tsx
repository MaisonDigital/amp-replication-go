"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PropertySummary } from "@/types/property";
import { formatPriceShort } from "@/lib/utils";

interface PropertyMapProps {
  properties: PropertySummary[];
  onPropertyClick?: (property: PropertySummary) => void;
  className?: string;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
}

export function PropertyMap({
  properties,
  onPropertyClick,
  className = "h-96",
  center = [-75.6972, 45.4215], // Ottawa coordinates
  zoom = 11,
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // Using OpenStreetMap tiles - free and excellent for real estate
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center,
      zoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add custom attribution
    map.current.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "© OpenStreetMap contributors",
      }),
      "bottom-right"
    );

    map.current.on("load", () => {
      setIsLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom]);

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    properties.forEach((property) => {
      if (!property.coordinates.latitude || !property.coordinates.longitude) return;

      // Create custom marker element
      const markerEl = document.createElement("div");
      markerEl.className = "property-marker";
      markerEl.innerHTML = `
        <div class="bg-primary-700 text-white px-2 py-1 rounded-lg shadow-lg text-xs font-medium cursor-pointer hover:bg-primary-800 transition-colors border-2 border-white">
          ${formatPriceShort(property.list_price)}
        </div>
      `;

      // Add click handler
      markerEl.addEventListener("click", () => {
        onPropertyClick?.(property);
      });

      // Create marker
      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([property.coordinates.longitude, property.coordinates.latitude])
        .addTo(map.current!);

      markers.current.push(marker);

      // Add popup on hover
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -40],
      });

      markerEl.addEventListener("mouseenter", () => {
        const popupContent = `
          <div class="p-2">
            <div class="font-medium text-sm text-gray-900">
              ${property.address.street_number || ""} ${property.address.street_name || ""}
            </div>
            <div class="text-xs text-gray-600">${property.address.city_region || ""}</div>
            <div class="font-bold text-primary-600 mt-1">${formatPriceShort(property.list_price)}</div>
            ${property.bedrooms_total ? `<div class="text-xs text-gray-500">${property.bedrooms_total} bed, ${property.bathrooms_total_integer || 0} bath</div>` : ""}
          </div>
        `;

        popup
          .setLngLat([property.coordinates.longitude!, property.coordinates.latitude!])
          .setHTML(popupContent)
          .addTo(map.current!);
      });

      markerEl.addEventListener("mouseleave", () => {
        popup.remove();
      });
    });

    // Fit map to show all markers if we have properties
    if (properties.length > 0) {
      const coordinates = properties
        .filter((p) => p.coordinates.latitude && p.coordinates.longitude)
        .map((p) => [p.coordinates.longitude!, p.coordinates.latitude!] as [number, number]);

      if (coordinates.length > 1) {
        const bounds = coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
        );

        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      } else if (coordinates.length === 1) {
        map.current.setCenter(coordinates[0]);
        map.current.setZoom(14);
      }
    }
  }, [properties, isLoaded, onPropertyClick]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  );
}