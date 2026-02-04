"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import greatCircle from "@turf/great-circle";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./Sidebar";

interface Destination {
  id: string;
  name: string;
  country: string;
  lng: number;
  lat: number;
}

interface AnimationControl {
  cancelled: boolean;
  paused: boolean;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animatePhase(
  durationMs: number,
  control: AnimationControl,
  onFrame: (progress: number) => void
): Promise<boolean> {
  return new Promise((resolve) => {
    let elapsed = 0;
    let lastTime = performance.now();

    const frame = () => {
      if (control.cancelled) {
        resolve(false);
        return;
      }

      const now = performance.now();
      if (!control.paused) {
        elapsed += now - lastTime;
      }
      lastTime = now;

      const progress = Math.min(elapsed / durationMs, 1);
      onFrame(progress);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve(true);
      }
    };

    requestAnimationFrame(frame);
  });
}

function computeArcs(destinations: Destination[]): [number, number][][] {
  const arcs: [number, number][][] = [];
  for (let i = 0; i < destinations.length - 1; i++) {
    const start: [number, number] = [destinations[i].lng, destinations[i].lat];
    const end: [number, number] = [
      destinations[i + 1].lng,
      destinations[i + 1].lat,
    ];
    const arc = greatCircle(start, end, { npoints: 100 });
    const coords =
      arc.geometry.type === "MultiLineString"
        ? (arc.geometry.coordinates.flat() as [number, number][])
        : (arc.geometry.coordinates as [number, number][]);
    arcs.push(coords);
  }
  return arcs;
}

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const controlRef = useRef<AnimationControl>({
    cancelled: false,
    paused: false,
  });
  const pulsingMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Map initialization
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [15, 50],
      zoom: 3,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#00D4FF", "line-width": 3 },
      });

      map.addSource("route-points", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "route-points-circle",
        type: "circle",
        source: "route-points",
        paint: {
          "circle-radius": 5,
          "circle-color": "#00D4FF",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      controlRef.current.cancelled = true;
      pulsingMarkerRef.current?.remove();
    };
  }, []);

  // Update markers, route, and bounds (skip route/bounds during animation)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Always update markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    destinations.forEach((dest, i) => {
      const el = document.createElement("div");
      el.className = "destination-marker";
      el.textContent = String(i + 1);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([dest.lng, dest.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    if (isAnimating) return;

    // Route line
    const routeSource = map.getSource("route") as mapboxgl.GeoJSONSource;
    if (routeSource) {
      if (destinations.length >= 2) {
        const arcs = computeArcs(destinations);
        const features: GeoJSON.Feature[] = arcs.map((coords) => ({
          type: "Feature" as const,
          geometry: { type: "LineString" as const, coordinates: coords },
          properties: {},
        }));
        routeSource.setData({ type: "FeatureCollection", features });
      } else {
        routeSource.setData({ type: "FeatureCollection", features: [] });
      }
    }

    // Circle points
    const pointsSource = map.getSource(
      "route-points"
    ) as mapboxgl.GeoJSONSource;
    if (pointsSource) {
      const pointFeatures: GeoJSON.Feature[] = destinations.map((d) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [d.lng, d.lat],
        },
        properties: {},
      }));
      pointsSource.setData({
        type: "FeatureCollection",
        features: pointFeatures,
      });
    }

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
  }, [destinations, mapLoaded, isAnimating]);

  // --- Animation ---
  const startAnimation = useCallback(async () => {
    const map = mapRef.current;
    if (!map || !mapLoaded || destinations.length < 2) return;

    const control: AnimationControl = { cancelled: false, paused: false };
    controlRef.current = control;

    setIsAnimating(true);
    setIsPaused(false);
    setAnimationProgress(0);

    const arcs = computeArcs(destinations);
    const totalSegments = destinations.length - 1;

    // Clear route
    const routeSource = map.getSource("route") as mapboxgl.GeoJSONSource;
    routeSource?.setData({ type: "FeatureCollection", features: [] });

    // Create pulsing marker
    const pulsingEl = document.createElement("div");
    pulsingEl.className = "pulsing-dot";
    const pulsingMarker = new mapboxgl.Marker({
      element: pulsingEl,
      anchor: "center",
    });
    pulsingMarkerRef.current = pulsingMarker;

    // --- Phase 1: Fly to first destination ---
    const startCenter: [number, number] = [
      map.getCenter().lng,
      map.getCenter().lat,
    ];
    const startZoom = map.getZoom();
    const firstDest: [number, number] = [
      destinations[0].lng,
      destinations[0].lat,
    ];

    let ok = await animatePhase(2000, control, (progress) => {
      const eased = easeInOutCubic(progress);
      const lng = startCenter[0] + (firstDest[0] - startCenter[0]) * eased;
      const lat = startCenter[1] + (firstDest[1] - startCenter[1]) * eased;
      const zoom = startZoom + (8 - startZoom) * eased;
      map.jumpTo({ center: [lng, lat], zoom });
      pulsingMarker.setLngLat([lng, lat]).addTo(map);
    });
    if (!ok) {
      pulsingMarker.remove();
      return;
    }

    // Pause at first destination
    ok = await animatePhase(1500, control, () => {});
    if (!ok) {
      pulsingMarker.remove();
      return;
    }

    // --- Phase 2: Fly through each segment ---
    for (let i = 0; i < totalSegments; i++) {
      if (control.cancelled) break;

      const arcCoords = arcs[i];
      const minZoom = 4;

      ok = await animatePhase(3000, control, (progress) => {
        const eased = easeInOutCubic(progress);
        const pointIndex = Math.min(
          Math.floor(eased * (arcCoords.length - 1)),
          arcCoords.length - 1
        );
        const currentPos = arcCoords[pointIndex];

        // Zoom: 8 -> minZoom -> 8
        const zoomCurve = Math.sin(Math.PI * progress);
        const zoom = 8 - (8 - minZoom) * zoomCurve;

        map.jumpTo({ center: currentPos, zoom });

        // Build route: completed arcs + partial current
        const features: GeoJSON.Feature[] = arcs
          .slice(0, i)
          .map((coords) => ({
            type: "Feature" as const,
            geometry: {
              type: "LineString" as const,
              coordinates: coords,
            },
            properties: {},
          }));

        if (pointIndex > 0) {
          features.push({
            type: "Feature" as const,
            geometry: {
              type: "LineString" as const,
              coordinates: arcCoords.slice(0, pointIndex + 1),
            },
            properties: {},
          });
        }

        routeSource?.setData({ type: "FeatureCollection", features });
        pulsingMarker.setLngLat(currentPos);
        setAnimationProgress((i + eased) / totalSegments);
      });
      if (!ok) break;

      // Pause at destination
      ok = await animatePhase(1500, control, () => {});
      if (!ok) break;
    }

    // --- Cleanup ---
    pulsingMarker.remove();
    pulsingMarkerRef.current = null;

    if (!control.cancelled) {
      // Restore full route
      const allFeatures: GeoJSON.Feature[] = arcs.map((coords) => ({
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates: coords },
        properties: {},
      }));
      routeSource?.setData({ type: "FeatureCollection", features: allFeatures });

      setAnimationProgress(1);

      // Zoom out to fit all
      const bounds = new mapboxgl.LngLatBounds();
      destinations.forEach((d) => bounds.extend([d.lng, d.lat]));
      map.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 420, right: 80 },
        duration: 2000,
      });

      // Wait for zoom-out, then reset
      ok = await animatePhase(2500, control, () => {});
      if (ok) {
        setIsAnimating(false);
        setAnimationProgress(0);
      }
    }
  }, [destinations, mapLoaded]);

  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => {
      const newVal = !prev;
      controlRef.current.paused = newVal;
      return newVal;
    });
  }, []);

  const handleRestartAnimation = useCallback(() => {
    controlRef.current.cancelled = true;
    pulsingMarkerRef.current?.remove();
    pulsingMarkerRef.current = null;

    requestAnimationFrame(() => {
      startAnimation();
    });
  }, [startAnimation]);

  // --- Destination handlers ---
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
        isAnimating={isAnimating}
        isPaused={isPaused}
        animationProgress={animationProgress}
        onStartAnimation={startAnimation}
        onTogglePause={handleTogglePause}
        onRestartAnimation={handleRestartAnimation}
      />
    </div>
  );
}
