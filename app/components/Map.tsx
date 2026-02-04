"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import greatCircle from "@turf/great-circle";
import "mapbox-gl/dist/mapbox-gl.css";
import { Toaster, toast } from "sonner";
import Sidebar from "./Sidebar";
import { useTheme } from "./ThemeProvider";
import ExportModal, {
  type ExportOptions,
  type ExportState,
} from "./ExportModal";

interface Destination {
  id: string;
  name: string;
  country: string;
  lng: number;
  lat: number;
}

export interface AnimationSettings {
  speed: number;
  pauseDuration: number;
  stopZoom: number;
  lineStyle: "solid" | "dashed" | "dotted";
  routeColor: string;
  showLabels: boolean;
  mapStyle: "dark" | "satellite" | "light" | "outdoors" | "vintage";
}

const DEFAULT_SETTINGS: AnimationSettings = {
  speed: 1,
  pauseDuration: 1.5,
  stopZoom: 8,
  lineStyle: "solid",
  routeColor: "#00D4FF",
  showLabels: false,
  mapStyle: "dark",
};

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
  onFrame: (progress: number) => void,
  getSpeed: () => number = () => 1
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
        elapsed += (now - lastTime) * getSpeed();
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

const LINE_DASH: Record<AnimationSettings["lineStyle"], number[] | undefined> =
  {
    solid: undefined,
    dashed: [2, 2],
    dotted: [0.5, 2],
  };

const MAP_STYLE_URLS: Record<AnimationSettings["mapStyle"], string> = {
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  light: "mapbox://styles/mapbox/light-v11",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  vintage: "mapbox://styles/mapbox/light-v11",
};

function addCustomLayers(map: mapboxgl.Map) {
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
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function Map() {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Settings
  const [settings, setSettings] = useState<AnimationSettings>(DEFAULT_SETTINGS);
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Sync map style with theme toggle
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      mapStyle: theme === "dark" ? "dark" : "light",
    }));
  }, [theme]);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const controlRef = useRef<AnimationControl>({
    cancelled: false,
    paused: false,
  });
  const pulsingMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const currentPosRef = useRef<[number, number] | null>(null);
  const sharedRouteLoadedRef = useRef(false);

  // Export state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState("mp4");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Map initialization
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [15, 50],
      zoom: 3,
      preserveDrawingBuffer: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      addCustomLayers(map);
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Load shared route from URL
  useEffect(() => {
    if (!mapLoaded || sharedRouteLoadedRef.current) return;
    sharedRouteLoadedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get("route");
    if (!routeParam) return;

    try {
      const data = JSON.parse(atob(routeParam));
      if (data.destinations?.length) {
        setDestinations(data.destinations);
      }
      if (data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      }
      window.history.replaceState({}, "", window.location.pathname);
    } catch {
      // Invalid shared route data
    }
  }, [mapLoaded]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      controlRef.current.cancelled = true;
      pulsingMarkerRef.current?.remove();
    };
  }, []);

  // Map style switching
  const prevStyleRef = useRef(settings.mapStyle);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    if (prevStyleRef.current === settings.mapStyle) return;
    prevStyleRef.current = settings.mapStyle;

    setMapLoaded(false);
    map.once("style.load", () => {
      addCustomLayers(map);
      setMapLoaded(true);
    });
    map.setStyle(MAP_STYLE_URLS[settings.mapStyle]);
  }, [settings.mapStyle, mapLoaded]);

  // Apply route color and line style to map layers in real-time
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    map.setPaintProperty("route-line", "line-color", settings.routeColor);
    map.setPaintProperty(
      "route-points-circle",
      "circle-color",
      settings.routeColor
    );

    const dash = LINE_DASH[settings.lineStyle];
    map.setPaintProperty("route-line", "line-dasharray", dash);

    // Update pulsing dot color if it exists
    const el = pulsingMarkerRef.current?.getElement();
    if (el) {
      el.style.setProperty("--dot-color", settings.routeColor);
    }
  }, [settings.routeColor, settings.lineStyle, mapLoaded]);

  // Update markers, route, and bounds (skip route/bounds during animation)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Always update markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    destinations.forEach((dest, i) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";

      const el = document.createElement("div");
      el.className = "destination-marker";
      el.textContent = String(i + 1);
      wrapper.appendChild(el);

      if (settings.showLabels) {
        const label = document.createElement("div");
        label.className = "destination-label";
        label.textContent = dest.name;
        wrapper.appendChild(label);
      }

      const marker = new mapboxgl.Marker({ element: wrapper, anchor: "center" })
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
      const mobile = window.innerWidth < 768;
      map.fitBounds(bounds, {
        padding: mobile
          ? { top: 40, bottom: 300, left: 40, right: 40 }
          : { top: 80, bottom: 80, left: 420, right: 80 },
      });
    }
  }, [destinations, mapLoaded, isAnimating, settings.showLabels]);

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
    const getSpeed = () => settingsRef.current.speed;

    // Clear route
    const routeSource = map.getSource("route") as mapboxgl.GeoJSONSource;
    routeSource?.setData({ type: "FeatureCollection", features: [] });

    // Create pulsing marker
    const pulsingEl = document.createElement("div");
    pulsingEl.className = "pulsing-dot";
    pulsingEl.style.setProperty(
      "--dot-color",
      settingsRef.current.routeColor
    );
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

    let ok = await animatePhase(
      2000,
      control,
      (progress) => {
        const eased = easeInOutCubic(progress);
        const stopZoom = settingsRef.current.stopZoom;
        const lng = startCenter[0] + (firstDest[0] - startCenter[0]) * eased;
        const lat = startCenter[1] + (firstDest[1] - startCenter[1]) * eased;
        const zoom = startZoom + (stopZoom - startZoom) * eased;
        map.jumpTo({ center: [lng, lat], zoom });
        pulsingMarker.setLngLat([lng, lat]).addTo(map);
        currentPosRef.current = [lng, lat];
      },
      getSpeed
    );
    if (!ok) {
      pulsingMarker.remove();
      currentPosRef.current = null;
      return;
    }

    // Pause at first destination
    ok = await animatePhase(
      settingsRef.current.pauseDuration * 1000,
      control,
      () => {}
    );
    if (!ok) {
      pulsingMarker.remove();
      return;
    }

    // --- Phase 2: Fly through each segment ---
    for (let i = 0; i < totalSegments; i++) {
      if (control.cancelled) break;

      const arcCoords = arcs[i];

      ok = await animatePhase(
        3000,
        control,
        (progress) => {
          const eased = easeInOutCubic(progress);
          const pointIndex = Math.min(
            Math.floor(eased * (arcCoords.length - 1)),
            arcCoords.length - 1
          );
          const currentPos = arcCoords[pointIndex];

          // Read stop zoom from settings ref for real-time updates
          const stopZoom = settingsRef.current.stopZoom;
          const minZoom = Math.min(Math.max(3, stopZoom - 4), 6);
          const zoomCurve = Math.sin(Math.PI * progress);
          const zoom = stopZoom - (stopZoom - minZoom) * zoomCurve;

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
          currentPosRef.current = currentPos as [number, number];
          setAnimationProgress((i + eased) / totalSegments);
        },
        getSpeed
      );
      if (!ok) break;

      // Pause at destination (reads current setting)
      ok = await animatePhase(
        settingsRef.current.pauseDuration * 1000,
        control,
        () => {}
      );
      if (!ok) break;
    }

    // --- Cleanup ---
    pulsingMarker.remove();
    pulsingMarkerRef.current = null;
    currentPosRef.current = null;

    if (!control.cancelled) {
      // Restore full route
      const allFeatures: GeoJSON.Feature[] = arcs.map((coords) => ({
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates: coords },
        properties: {},
      }));
      routeSource?.setData({
        type: "FeatureCollection",
        features: allFeatures,
      });

      setAnimationProgress(1);

      // Zoom out to fit all
      const bounds = new mapboxgl.LngLatBounds();
      destinations.forEach((d) => bounds.extend([d.lng, d.lat]));
      const mobile = window.innerWidth < 768;
      map.fitBounds(bounds, {
        padding: mobile
          ? { top: 40, bottom: 300, left: 40, right: 40 }
          : { top: 80, bottom: 80, left: 420, right: 80 },
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

  const handleStopAnimation = useCallback(() => {
    controlRef.current.cancelled = true;
    pulsingMarkerRef.current?.remove();
    pulsingMarkerRef.current = null;
    currentPosRef.current = null;
    setIsAnimating(false);
    setIsPaused(false);
    setAnimationProgress(0);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (isAnimating) {
          handleTogglePause();
        } else if (destinations.length >= 2) {
          startAnimation();
        }
      } else if (e.key === "r" || e.key === "R") {
        if (isAnimating) {
          handleRestartAnimation();
        }
      } else if (e.key === "Escape") {
        if (isAnimating) {
          handleStopAnimation();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isAnimating,
    destinations.length,
    handleTogglePause,
    startAnimation,
    handleRestartAnimation,
    handleStopAnimation,
  ]);

  // --- Export ---
  const handleExport = useCallback(
    async (options: ExportOptions) => {
      const map = mapRef.current;
      if (!map || !mapLoaded || destinations.length < 2) return;

      setExportState("recording");
      setExportProgress(0);
      setDownloadUrl(null);
      setDownloadFormat(options.format);
      setErrorMessage(null);

      try {
        const [targetW, targetH] =
          options.resolution === "720p" ? [1280, 720] : [1920, 1080];

        // Compositing canvas for resolution control + watermark + markers
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = targetW;
        exportCanvas.height = targetH;
        const ctx = exportCanvas.getContext("2d")!;

        // MediaRecorder
        const stream = exportCanvas.captureStream(30);
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 5_000_000,
        });
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        // Compositing loop — draws map canvas + markers + watermark each frame
        let active = true;
        const composite = () => {
          if (!active) return;
          const mapCanvas = map.getCanvas();
          const cw = mapContainerRef.current?.clientWidth || mapCanvas.width;
          const ch = mapContainerRef.current?.clientHeight || mapCanvas.height;

          ctx.drawImage(mapCanvas, 0, 0, targetW, targetH);

          // Draw destination markers
          destinations.forEach((dest, i) => {
            const px = map.project([dest.lng, dest.lat]);
            const x = (px.x / cw) * targetW;
            const y = (px.y / ch) * targetH;

            ctx.beginPath();
            ctx.arc(x, y, 14, 0, Math.PI * 2);
            ctx.fillStyle = "#3b82f6";
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = "bold 13px sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(i + 1), x, y);
          });

          // Draw current-position dot
          if (currentPosRef.current) {
            const px = map.project(currentPosRef.current);
            const x = (px.x / cw) * targetW;
            const y = (px.y / ch) * targetH;

            ctx.beginPath();
            ctx.arc(x, y, 7, 0, Math.PI * 2);
            ctx.fillStyle = settingsRef.current.routeColor;
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Watermark
          if (options.watermark) {
            ctx.save();
            ctx.font = `bold ${Math.round(targetH / 45)}px sans-serif`;
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.textAlign = "right";
            ctx.textBaseline = "bottom";
            ctx.fillText("TravelAnimator", targetW - 20, targetH - 20);
            ctx.restore();
          }

          requestAnimationFrame(composite);
        };

        // Start recording + compositing, then replay animation
        composite();
        recorder.start(100);
        await startAnimation();

        // Brief delay for final frames
        await new Promise((r) => setTimeout(r, 500));

        // Stop recording
        active = false;
        const webmBlob = await new Promise<Blob>((resolve) => {
          recorder.onstop = () =>
            resolve(new Blob(chunks, { type: mimeType }));
          recorder.stop();
        });

        // --- Format conversion with FFmpeg ---
        setExportState("encoding");
        setExportProgress(0);

        try {
          const { FFmpeg } = await import("@ffmpeg/ffmpeg");
          const { toBlobURL, fetchFile } = await import("@ffmpeg/util");

          const ffmpeg = new FFmpeg();
          ffmpeg.on("progress", ({ progress }) => {
            setExportProgress(Math.max(0, Math.min(1, progress)));
          });

          const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
          await ffmpeg.load({
            coreURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.js`,
              "text/javascript"
            ),
            wasmURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.wasm`,
              "application/wasm"
            ),
          });

          await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));

          if (options.format === "mp4") {
            await ffmpeg.exec([
              "-i",
              "input.webm",
              "-c:v",
              "libx264",
              "-pix_fmt",
              "yuv420p",
              "-movflags",
              "+faststart",
              "output.mp4",
            ]);
            const data = await ffmpeg.readFile("output.mp4");
            const buf = ((data as Uint8Array).buffer) as ArrayBuffer;
            const blob = new Blob([buf], { type: "video/mp4" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            triggerDownload(url, "travel-animation.mp4");
          } else {
            await ffmpeg.exec([
              "-i",
              "input.webm",
              "-vf",
              `fps=15,scale=${Math.min(targetW, 640)}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
              "output.gif",
            ]);
            const data = await ffmpeg.readFile("output.gif");
            const buf = ((data as Uint8Array).buffer) as ArrayBuffer;
            const blob = new Blob([buf], { type: "image/gif" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            triggerDownload(url, "travel-animation.gif");
          }

          ffmpeg.terminate();
        } catch {
          // FFmpeg unavailable — fall back to webm download
          setDownloadFormat("webm");
          const url = URL.createObjectURL(webmBlob);
          setDownloadUrl(url);
          triggerDownload(url, "travel-animation.webm");
        }

        setExportState("done");
        toast.success("Export complete!");
      } catch (err) {
        setExportState("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Export failed"
        );
      }
    },
    [destinations, mapLoaded, startAnimation]
  );

  const handleCloseExport = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setShowExportModal(false);
    setExportState("idle");
    setExportProgress(0);
    setDownloadUrl(null);
    setErrorMessage(null);
  }, [downloadUrl]);

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

  const handleLoadRoute = useCallback(
    (dests: Destination[], s: AnimationSettings) => {
      setDestinations(dests);
      setSettings(s);
    },
    []
  );

  return (
    <div className="relative h-screen w-screen">
      <div
        ref={mapContainerRef}
        className="h-full w-full"
        style={
          settings.mapStyle === "vintage"
            ? { filter: "sepia(0.4) saturate(0.8)" }
            : undefined
        }
      />
      {!mapLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#00D4FF] dark:border-white/20 dark:border-t-[#00D4FF]" />
            <span className="text-sm text-gray-400 dark:text-zinc-500">Loading map...</span>
          </div>
        </div>
      )}
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
        settings={settings}
        onSettingsChange={setSettings}
        onOpenExport={() => setShowExportModal(true)}
        onLoadRoute={handleLoadRoute}
      />
      <ExportModal
        isOpen={showExportModal}
        onClose={handleCloseExport}
        onExport={handleExport}
        exportState={exportState}
        exportProgress={exportProgress}
        downloadUrl={downloadUrl}
        downloadFormat={downloadFormat}
        errorMessage={errorMessage}
      />
      <Toaster
        theme={theme}
        position="top-center"
        toastOptions={{
          style: theme === "dark"
            ? {
                background: "rgba(25, 25, 25, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
              }
            : {
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                color: "#111",
              },
        }}
      />
    </div>
  );
}
