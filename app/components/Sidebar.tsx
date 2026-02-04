"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import DestinationItem from "./DestinationItem";
import type { AnimationSettings } from "./Map";

const MAP_STYLE_OPTIONS: {
  id: AnimationSettings["mapStyle"];
  label: string;
  styleId: string;
}[] = [
  { id: "dark", label: "Dark", styleId: "dark-v11" },
  { id: "satellite", label: "Satellite", styleId: "satellite-streets-v12" },
  { id: "light", label: "Light", styleId: "light-v11" },
  { id: "outdoors", label: "Outdoors", styleId: "outdoors-v12" },
  { id: "vintage", label: "Vintage", styleId: "light-v11" },
];

const STORAGE_KEY = "travelanimator-routes";

interface SavedRoute {
  id: string;
  name: string;
  createdAt: number;
  destinations: Destination[];
  settings: AnimationSettings;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  lng: number;
  lat: number;
}

interface GeocoderResult {
  id: string;
  name: string;
  country: string;
  lng: number;
  lat: number;
}

interface SidebarProps {
  destinations: Destination[];
  onAddDestination: (dest: Destination) => void;
  onRemoveDestination: (id: string) => void;
  onReorderDestinations: (destinations: Destination[]) => void;
  isAnimating: boolean;
  isPaused: boolean;
  animationProgress: number;
  onStartAnimation: () => void;
  onTogglePause: () => void;
  onRestartAnimation: () => void;
  settings: AnimationSettings;
  onSettingsChange: (settings: AnimationSettings) => void;
  onOpenExport: () => void;
  onLoadRoute: (destinations: Destination[], settings: AnimationSettings) => void;
}

export default function Sidebar({
  destinations,
  onAddDestination,
  onRemoveDestination,
  onReorderDestinations,
  isAnimating,
  isPaused,
  animationProgress,
  onStartAnimation,
  onTogglePause,
  onRestartAnimation,
  settings,
  onSettingsChange,
  onOpenExport,
  onLoadRoute,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocoderResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // My Routes state
  const [myRoutesOpen, setMyRoutesOpen] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedRoutes(JSON.parse(stored));
    } catch {
      // Ignore invalid data
    }
  }, []);

  const persistRoutes = (routes: SavedRoute[]) => {
    setSavedRoutes(routes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  };

  const handleSaveRoute = () => {
    if (destinations.length === 0) return;
    const name =
      saveName.trim() || destinations.map((d) => d.name).join(" → ");
    const route: SavedRoute = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      destinations,
      settings,
    };
    persistRoutes([route, ...savedRoutes]);
    setShowSaveInput(false);
    setSaveName("");
    toast.success("Route saved!");
  };

  const handleDeleteRoute = (id: string) => {
    persistRoutes(savedRoutes.filter((r) => r.id !== id));
  };

  const handleRenameRoute = (id: string) => {
    if (!editingName.trim()) return;
    persistRoutes(
      savedRoutes.map((r) =>
        r.id === id ? { ...r, name: editingName.trim() } : r
      )
    );
    setEditingId(null);
    setEditingName("");
  };

  const handleShare = () => {
    const data = { destinations, settings };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/app?route=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied!");
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const updateSetting = <K extends keyof AnimationSettings>(
    key: K,
    value: AnimationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?types=place&limit=5&access_token=${token}`
    );
    const data = await res.json();

    setResults(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.features.map((f: any) => ({
        id: f.id,
        name: f.text,
        country:
          f.context?.find((c: { id: string }) => c.id.startsWith("country"))
            ?.text ?? "",
        lng: f.center[0],
        lat: f.center[1],
      }))
    );
    setIsOpen(true);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (result: GeocoderResult) => {
    onAddDestination({
      id: crypto.randomUUID(),
      name: result.name,
      country: result.country,
      lng: result.lng,
      lat: result.lat,
    });
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setMobileExpanded(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = destinations.findIndex((d) => d.id === active.id);
      const newIndex = destinations.findIndex((d) => d.id === over.id);
      onReorderDestinations(arrayMove(destinations, oldIndex, newIndex));
    }
  };

  return (
    <>
    <div
      className="sidebar-container sidebar-pattern fixed inset-x-0 bottom-0 z-10 flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[rgba(15,15,15,0.85)] backdrop-blur-xl md:absolute md:bottom-4 md:left-4 md:right-auto md:top-4 md:max-h-none md:w-[380px] md:rounded-2xl"
      data-mobile-collapsed={!mobileExpanded}
      data-desktop-collapsed={!sidebarOpen}
    >
      {/* Mobile drag handle */}
      <div
        className="flex cursor-pointer justify-center py-2 md:hidden"
        onClick={() => setMobileExpanded(!mobileExpanded)}
      >
        <div className="h-1 w-8 rounded-full bg-white/20" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-2 pb-4 md:pt-6">
        <h1 className="text-xl font-semibold text-white">
          🌍 TravelAnimator
        </h1>
        <button
          onClick={() => setMyRoutesOpen(!myRoutesOpen)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            myRoutesOpen
              ? "bg-[#00D4FF]/20 text-[#00D4FF]"
              : "text-zinc-500 hover:bg-white/10 hover:text-white"
          }`}
          title="My Routes"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Add Destination */}
      <div className="px-6 pb-4">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">
          Add Destination
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder="Search for a city..."
            disabled={isAnimating}
            className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-40"
          />

          {isOpen && results.length > 0 && !isAnimating && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-white/10 bg-[rgba(25,25,25,0.95)] shadow-xl backdrop-blur-xl">
              {results.map((r) => (
                <button
                  key={r.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(r)}
                  className="w-full px-4 py-2.5 text-left transition-colors hover:bg-white/10"
                >
                  <span className="text-sm text-white">{r.name}</span>
                  <span className="ml-2 text-xs text-zinc-500">
                    {r.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Destinations List + Settings (scrollable area) */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {myRoutesOpen ? (
          <div>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
              Saved Routes
            </h2>
            {savedRoutes.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                No saved routes yet
              </p>
            ) : (
              <div className="space-y-2">
                {savedRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="rounded-lg border border-white/5 bg-white/5 p-3"
                  >
                    {editingId === route.id ? (
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameRoute(route.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="flex-1 rounded bg-white/10 px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-[#00D4FF]/50"
                        />
                        <button
                          onClick={() => handleRenameRoute(route.id)}
                          className="text-xs text-[#00D4FF] hover:text-[#00bfe6]"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-white">
                            {route.name}
                          </div>
                          <div className="mt-0.5 text-xs text-zinc-500">
                            {route.destinations.length} cities &middot;{" "}
                            {new Date(route.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="ml-2 flex gap-1">
                          <button
                            onClick={() => {
                              onLoadRoute(route.destinations, route.settings);
                              setMyRoutesOpen(false);
                            }}
                            className="rounded px-2 py-1 text-xs text-[#00D4FF] transition-colors hover:bg-white/10"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(route.id);
                              setEditingName(route.name);
                            }}
                            className="rounded px-1.5 py-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.id)}
                            className="rounded px-1.5 py-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-red-400"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
        <>
        {destinations.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No destinations added yet
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={destinations.map((d) => d.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {destinations.map((dest, index) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <DestinationItem
                        destination={dest}
                        index={index}
                        onRemove={onRemoveDestination}
                        disabled={isAnimating}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Animation Settings (collapsible) */}
        {destinations.length >= 2 && (
          <div className="mt-4 border-t border-white/10 pt-3">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex w-full items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-400"
            >
              <span>Animation Settings</span>
              <svg
                className={`h-4 w-4 transition-transform ${settingsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {settingsOpen && (
              <div className="mt-3 space-y-4">
                {/* Map Style */}
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Map Style
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {MAP_STYLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateSetting("mapStyle", opt.id)}
                        className={`overflow-hidden rounded-lg border transition-colors ${
                          settings.mapStyle === opt.id
                            ? "border-cyan-400 ring-1 ring-cyan-400/50"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.mapbox.com/styles/v1/mapbox/${opt.styleId}/static/12,45,2/120x80@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                          alt={opt.label}
                          className="h-14 w-full object-cover"
                          style={
                            opt.id === "vintage"
                              ? { filter: "sepia(0.4) saturate(0.8)" }
                              : undefined
                          }
                        />
                        <div
                          className={`py-1 text-center text-[10px] font-medium ${
                            settings.mapStyle === opt.id
                              ? "text-cyan-400"
                              : "text-zinc-500"
                          }`}
                        >
                          {opt.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs text-zinc-400">Speed</label>
                    <span className="text-xs text-zinc-500">
                      {settings.speed.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={settings.speed}
                    onChange={(e) =>
                      updateSetting("speed", parseFloat(e.target.value))
                    }
                    className="settings-slider"
                  />
                </div>

                {/* Pause Duration */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs text-zinc-400">
                      Pause Duration
                    </label>
                    <span className="text-xs text-zinc-500">
                      {settings.pauseDuration.toFixed(1)}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={settings.pauseDuration}
                    onChange={(e) =>
                      updateSetting(
                        "pauseDuration",
                        parseFloat(e.target.value)
                      )
                    }
                    className="settings-slider"
                  />
                </div>

                {/* Zoom at Stops */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs text-zinc-400">
                      Zoom at Stops
                    </label>
                    <span className="text-xs text-zinc-500">
                      {settings.stopZoom}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="14"
                    step="1"
                    value={settings.stopZoom}
                    onChange={(e) =>
                      updateSetting("stopZoom", parseInt(e.target.value))
                    }
                    className="settings-slider"
                  />
                </div>

                {/* Line Style */}
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400">
                    Line Style
                  </label>
                  <div className="flex gap-1">
                    {(["solid", "dashed", "dotted"] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateSetting("lineStyle", style)}
                        className={`flex-1 rounded px-2 py-1 text-xs capitalize transition-colors ${
                          settings.lineStyle === style
                            ? "bg-white/20 text-white"
                            : "bg-white/5 text-zinc-500 hover:bg-white/10"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Route Color */}
                <div className="flex items-center justify-between">
                  <label className="text-xs text-zinc-400">Route Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.routeColor}
                      onChange={(e) =>
                        updateSetting("routeColor", e.target.value)
                      }
                      className="h-6 w-6 cursor-pointer rounded border border-white/10 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs text-zinc-500">
                      {settings.routeColor}
                    </span>
                  </div>
                </div>

                {/* Show Labels */}
                <div className="flex items-center justify-between">
                  <label className="text-xs text-zinc-400">
                    Show Labels
                  </label>
                  <button
                    onClick={() =>
                      updateSetting("showLabels", !settings.showLabels)
                    }
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      settings.showLabels ? "bg-cyan-500" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        settings.showLabels
                          ? "translate-x-4"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Save & Share */}
        {destinations.length > 0 && !isAnimating && (
          <div className="mt-4 border-t border-white/10 pt-3">
            {showSaveInput ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveRoute();
                    if (e.key === "Escape") setShowSaveInput(false);
                  }}
                  placeholder="Route name..."
                  className="flex-1 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-[#00D4FF]/50"
                />
                <button
                  onClick={handleSaveRoute}
                  className="rounded-lg bg-[#00D4FF] px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-[#00bfe6]"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSaveName(
                      destinations.map((d) => d.name).join(" → ")
                    );
                    setShowSaveInput(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Route
                </button>
                <button
                  onClick={handleShare}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share
                </button>
              </div>
            )}
          </div>
        )}
        </>
        )}
      </div>

      {/* Animation Controls */}
      {destinations.length >= 2 && (
        <div className="border-t border-white/10 px-6 py-4">
          {!isAnimating ? (
            <div className="space-y-2">
              <button
                onClick={onStartAnimation}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00D4FF] py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#00bfe6]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Animate Route
              </button>
              <button
                onClick={onOpenExport}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Video
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#00D4FF] transition-[width] duration-150"
                  style={{ width: `${animationProgress * 100}%` }}
                />
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onTogglePause}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  {isPaused ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                    </svg>
                  )}
                </button>

                <span className="text-xs font-medium text-zinc-400">
                  {Math.round(animationProgress * 100)}%
                </span>

                <button
                  onClick={onRestartAnimation}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24L14 10h8V2l-4.35 4.35z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Desktop toggle button */}
    <button
      className={`hidden md:flex absolute z-10 top-1/2 -translate-y-1/2 h-10 w-5 items-center justify-center rounded-r-lg border border-l-0 border-white/10 bg-[rgba(15,15,15,0.85)] backdrop-blur-xl text-zinc-400 transition-all duration-300 hover:text-white ${
        sidebarOpen
          ? "left-[calc(1rem+380px)]"
          : "left-0"
      }`}
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    </>
  );
}
