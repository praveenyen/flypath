"use client";

import { useState } from "react";

export interface ExportOptions {
  resolution: "720p" | "1080p";
  format: "mp4" | "gif";
  watermark: boolean;
}

export type ExportState = "idle" | "recording" | "encoding" | "done" | "error";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  exportState: ExportState;
  exportProgress: number;
  downloadUrl: string | null;
  downloadFormat: string;
  errorMessage: string | null;
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  exportState,
  exportProgress,
  downloadUrl,
  downloadFormat,
  errorMessage,
}: ExportModalProps) {
  const [resolution, setResolution] = useState<"720p" | "1080p">("1080p");
  const [format, setFormat] = useState<"mp4" | "gif">("mp4");
  const [watermark, setWatermark] = useState(false);

  if (!isOpen) return null;

  const isExporting = exportState === "recording" || exportState === "encoding";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[400px] rounded-2xl border border-white/10 bg-[rgba(20,20,20,0.95)] p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Export Video</h2>
          {!isExporting && exportState !== "done" && (
            <button
              onClick={onClose}
              className="text-zinc-500 transition-colors hover:text-white"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Idle — Options */}
        {exportState === "idle" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Resolution
              </label>
              <div className="flex gap-2">
                {(["720p", "1080p"] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                      resolution === res
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-zinc-500 hover:bg-white/10"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Format
              </label>
              <div className="flex gap-2">
                {(["mp4", "gif"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium uppercase transition-colors ${
                      format === fmt
                        ? "bg-white/15 text-white"
                        : "bg-white/5 text-zinc-500 hover:bg-white/10"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-400">Include watermark</label>
              <button
                onClick={() => setWatermark(!watermark)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  watermark ? "bg-cyan-500" : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    watermark ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => onExport({ resolution, format, watermark })}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00D4FF] py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#00bfe6]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Start Export
            </button>
          </div>
        )}

        {/* Exporting — Progress */}
        {isExporting && (
          <div className="space-y-4">
            <div className="rounded-lg bg-amber-500/10 p-4">
              <p className="text-sm text-amber-300">
                Exporting... do not resize the window
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {exportState === "recording"
                  ? "Recording animation..."
                  : "Encoding video..."}
              </p>
            </div>

            {exportState === "encoding" && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Encoding</span>
                  <span className="text-xs text-zinc-500">
                    {Math.round(exportProgress * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#00D4FF] transition-[width] duration-150"
                    style={{ width: `${exportProgress * 100}%` }}
                  />
                </div>
              </div>
            )}

            {exportState === "recording" && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full animate-pulse rounded-full bg-[#00D4FF]/40" />
              </div>
            )}
          </div>
        )}

        {/* Done — Download */}
        {exportState === "done" && downloadUrl && (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-500/10 p-4">
              <p className="text-sm text-green-400">Export complete!</p>
            </div>
            <div className="flex gap-2">
              <a
                href={downloadUrl}
                download={`travel-animation.${downloadFormat}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00D4FF] py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#00bfe6]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </a>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-white/10 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {exportState === "error" && (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-500/10 p-4">
              <p className="text-sm text-red-400">
                {errorMessage || "Export failed"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-white/10 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
