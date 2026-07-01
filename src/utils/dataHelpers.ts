import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

/**
 * Get raw search data for a platform.
 */
export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

/** Cache extracted profiles to avoid re-mapping on every call */
const profileCache = new Map<Platform, UserProfileSummary[]>();

/**
 * Extract user profiles from platform search data (memoized).
 */
export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const cached = profileCache.get(platform);
  if (cached) return cached;

  const data = getSearchData(platform);
  const profiles = data.accounts.map((item) => {
    const profile = item.account.user_profile as UserProfileSummary & {
      username?: string;
    };

    return {
      ...profile,
      username: profile.username ?? profile.handle ?? profile.user_id,
      platform,
    };
  });
  profileCache.set(platform, profiles);
  return profiles;
}

/**
 * Filter profiles by search query against username and fullname.
 */
export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query.trim()) return profiles;
  const q = query.toLowerCase().trim();
  return profiles.filter(
    (p) =>
      (p.username || "").toLowerCase().includes(q) ||
      (p.fullname || "").toLowerCase().includes(q)
  );
}
