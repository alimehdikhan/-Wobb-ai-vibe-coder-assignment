/** Supported social platforms */
export const PLATFORM_VALUES = ["instagram", "youtube", "tiktok"] as const;
export type Platform = (typeof PLATFORM_VALUES)[number];

/** Labels & icons for each platform */
export const PLATFORM_META: Record<
  Platform,
  { label: string; icon: string; gradient: string }
> = {
  instagram: {
    label: "Instagram",
    icon: "📸",
    gradient: "from-pink-500 via-purple-500 to-orange-400",
  },
  youtube: {
    label: "YouTube",
    icon: "▶️",
    gradient: "from-red-600 to-red-500",
  },
  tiktok: {
    label: "TikTok",
    icon: "🎵",
    gradient: "from-gray-900 via-purple-800 to-cyan-500",
  },
};

/** Compact profile returned from the search endpoint */
export interface UserProfileSummary {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  avg_views?: number;
  platform?: Platform;
}

/** Wrapper around a search result item */
export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source: string;
  };
}

/** Full search response for a platform */
export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

/** Extended profile with additional stats */
export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
}

/** Profile detail API response shape */
export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}
