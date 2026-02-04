"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Destination {
  id: string;
  name: string;
  country: string;
  lng: number;
  lat: number;
}

interface DestinationItemProps {
  destination: Destination;
  index: number;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export default function DestinationItem({
  destination,
  index,
  onRemove,
  disabled,
}: DestinationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: destination.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3 group"
    >
      <button
        {...attributes}
        {...(disabled ? {} : listeners)}
        className={`text-zinc-600 ${disabled ? "opacity-30" : "cursor-grab hover:text-zinc-400 active:cursor-grabbing"}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>

      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
        {index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-white">
          {destination.name}
        </div>
        <div className="truncate text-xs text-zinc-500">
          {destination.country}
        </div>
      </div>

      {!disabled && (
        <button
          onClick={() => onRemove(destination.id)}
          className="text-zinc-600 opacity-0 transition-colors hover:text-red-400 group-hover:opacity-100"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>
      )}
    </div>
  );
}
