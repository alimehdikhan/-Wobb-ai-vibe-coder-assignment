import { useState, useMemo, useCallback } from "react";
import type { Platform } from "@/types";
import { PLATFORM_META } from "@/types";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        title="Discover"
        accent="Top Influencers"
        subtitle="Search, explore, and curate creators across Instagram, YouTube, and TikTok."
      />

      <section aria-labelledby="filters-heading" className="mb-8">
        <h2 id="filters-heading" className="sr-only">
          Search and filter influencers
        </h2>
        <div className="filter-panel">
          <PlatformFilter
            selected={platform}
            onChange={handlePlatformChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
      </section>

      <section aria-labelledby="results-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
          <div>
            <p id="results-heading" className="section-label mb-1">
              Results
            </p>
            <p className="text-sm font-medium text-[var(--color-text)]" aria-live="polite">
              {filtered.length} of {allProfiles.length} on{" "}
              <span className="text-[var(--color-primary)]">{PLATFORM_META[platform].label}</span>
            </p>
          </div>
        </div>

        <ProfileList key={platform} profiles={filtered} platform={platform} />
      </section>

      <SelectedList compact />
    </Layout>
  );
}