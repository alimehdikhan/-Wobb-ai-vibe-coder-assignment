import { memo, useCallback, useRef } from "react";
import type { Platform } from "@/types";
import { PLATFORM_VALUES, PLATFORM_META } from "@/types";
import { PlatformIcon } from "./PlatformIcon";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const platformActiveColors: Record<Platform, string> = {
  instagram:
    "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow-lg shadow-pink-200/40 dark:shadow-pink-900/30",
  youtube:
    "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-200/40 dark:shadow-red-900/30",
  tiktok:
    "bg-gradient-to-r from-gray-900 via-purple-800 to-cyan-500 text-white shadow-lg shadow-purple-200/40 dark:shadow-purple-900/30",
};

export const PlatformFilter = memo(function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onSearchChange("");
    inputRef.current?.focus();
  }, [onSearchChange]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Platform tabs */}
      <div
        className="flex flex-wrap gap-2 justify-center"
        role="tablist"
        aria-label="Filter by platform"
      >
        {PLATFORM_VALUES.map((p) => {
          const isActive = selected === p;
          const meta = PLATFORM_META[p];
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show ${meta.label} profiles`}
              onClick={() => onChange(p)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ease-out cursor-pointer flex items-center justify-center group ${
                isActive
                  ? `${platformActiveColors[p]} scale-105`
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:scale-105 hover:shadow-md"
              }`}
            >
              <PlatformIcon
                platform={p}
                className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:scale-110"
                active={isActive}
              />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          aria-label="Search influencers"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all duration-200"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});
