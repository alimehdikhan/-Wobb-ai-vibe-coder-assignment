import { useState, useMemo, useCallback } from "react";
import type { Platform } from "@/types";
import { PLATFORM_META } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { SelectedList } from "@/components/SelectedList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Discover{" "}
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Top Influencers
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
          Browse and curate creators across Instagram, YouTube, and TikTok
        </p>
      </div>

      {/* Filters */}
      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Results count */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 mb-4 text-center" aria-live="polite">
        Showing <strong className="text-gray-600 dark:text-gray-300">{filtered.length}</strong> of{" "}
        {allProfiles.length} profiles on {PLATFORM_META[platform].label}
      </p>

      {/* Profile grid */}
      <ProfileList profiles={filtered} platform={platform} />

      {/* Selected profiles preview */}
      <SelectedList compact />
    </Layout>
  );
}
