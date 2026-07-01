import { memo, useCallback, useRef, useId } from "react";
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
  instagram: "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white shadow-md",
  youtube: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md",
  tiktok: "bg-gradient-to-r from-gray-900 via-purple-800 to-cyan-500 text-white shadow-md",
};

export const PlatformFilter = memo(function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  const handleClear = useCallback(() => {
    onSearchChange("");
    inputRef.current?.focus();
  }, [onSearchChange]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent, platform: Platform) => {
      const idx = PLATFORM_VALUES.indexOf(platform);
      let nextPlatform: Platform | undefined;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextPlatform = PLATFORM_VALUES[(idx + 1) % PLATFORM_VALUES.length];
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextPlatform =
          PLATFORM_VALUES[(idx - 1 + PLATFORM_VALUES.length) % PLATFORM_VALUES.length];
      } else if (e.key === "Home") {
        e.preventDefault();
        nextPlatform = PLATFORM_VALUES[0];
      } else if (e.key === "End") {
        e.preventDefault();
        nextPlatform = PLATFORM_VALUES[PLATFORM_VALUES.length - 1];
      }

      if (nextPlatform) {
        onChange(nextPlatform);
        requestAnimationFrame(() => {
          document.getElementById(`tab-${nextPlatform}`)?.focus();
        });
      }
    },
    [onChange]
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <p className="section-label mb-3 text-center sm:text-left">Platform</p>
        <div
          className="flex flex-wrap gap-2 justify-center sm:justify-start"
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
                id={`tab-${p}`}
                aria-selected={isActive}
                aria-controls="search-panel"
                tabIndex={isActive ? 0 : -1}
                aria-label={`Show ${meta.label} profiles`}
                onClick={() => onChange(p)}
                onKeyDown={(e) => handleTabKeyDown(e, p)}
                className={`px-4 py-2.5 rounded-[var(--radius-full)] font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? platformActiveColors[p]
                    : "bg-[var(--surface-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)]"
                }`}
              >
                <PlatformIcon platform={p} className="w-4 h-4" active={isActive} />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={selected}
        id="search-panel"
        role="tabpanel"
        aria-labelledby={`tab-${selected}`}
        className="animate-fade-in"
      >
        <label htmlFor={searchId} className="section-label block mb-2">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-[var(--color-text-muted)]"
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
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Username or full name…"
            className="w-full pl-10 pr-10 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--surface-muted)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer rounded-r-[var(--radius-md)]"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
