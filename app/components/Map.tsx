"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./Sidebar";

interface Destination {
  id: string;
  name: string;
  country: string;
  lng: number;
  lat: number;
}

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [15, 50],
      zoom: 3,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers and fit bounds when destinations change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add numbered markers
    destinations.forEach((dest, i) => {
      const el = document.createElement("div");
      el.className = "destination-marker";
      el.textContent = String(i + 1);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([dest.lng, dest.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Fit bounds
    if (destinations.length === 1) {
      map.flyTo({
        center: [destinations[0].lng, destinations[0].lat],
        zoom: 6,
      });
    } else if (destinations.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      destinations.forEach((d) => bounds.extend([d.lng, d.lat]));
      map.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 420, right: 80 },
      });
    }
  }, [destinations]);

  const handleAddDestination = useCallback((dest: Destination) => {
    setDestinations((prev) => [...prev, dest]);
  }, []);

  const handleRemoveDestination = useCallback((id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleReorderDestinations = useCallback((newDests: Destination[]) => {
    setDestinations(newDests);
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <div ref={mapContainerRef} className="h-full w-full" />
      <Sidebar
        destinations={destinations}
        onAddDestination={handleAddDestination}
        onRemoveDestination={handleRemoveDestination}
        onReorderDestinations={handleReorderDestinations}
      />
    </div>
  );
}
