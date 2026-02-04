"use client";

import { useState, useCallback, useRef } from "react";
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
import DestinationItem from "./DestinationItem";

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
}

export default function Sidebar({
  destinations,
  onAddDestination,
  onRemoveDestination,
  onReorderDestinations,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocoderResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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
    <div className="absolute left-4 top-4 bottom-4 z-10 flex w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[rgba(15,15,15,0.85)] backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-xl font-semibold text-white">
          🌍 TravelAnimator
        </h1>
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
            className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50"
          />

          {isOpen && results.length > 0 && (
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

      {/* Destinations List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
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
                {destinations.map((dest, index) => (
                  <DestinationItem
                    key={dest.id}
                    destination={dest}
                    index={index}
                    onRemove={onRemoveDestination}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
