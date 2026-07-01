import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Avatar } from "@/components/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, UserProfileSummary } from "@/types";
import { PLATFORM_META } from "@/types";
import { formatCount, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useSelectedProfiles } from "@/store/selectedProfiles";
import { PlatformIcon } from "@/components/PlatformIcon";

/** Stat card definition */
interface StatDef {
  label: string;
  value: string;
  icon: string;
}

/** Build stats array from user profile */
function buildStats(user: FullUserProfile): StatDef[] {
  const stats: StatDef[] = [
    { label: "Followers", value: formatCount(user.followers), icon: "👥" },
    {
      label: "Engagement Rate",
      value: formatEngagementRate(user.engagement_rate),
      icon: "📈",
    },
  ];

  if (user.posts_count !== undefined)
    stats.push({ label: "Posts", value: formatCount(user.posts_count), icon: "📱" });

  if (user.avg_likes !== undefined)
    stats.push({ label: "Avg Likes", value: formatCount(user.avg_likes), icon: "❤️" });

  if (user.avg_comments !== undefined)
    stats.push({ label: "Avg Comments", value: formatCount(user.avg_comments), icon: "💬" });

  if (user.avg_views !== undefined && user.avg_views > 0)
    stats.push({ label: "Avg Views", value: formatCount(user.avg_views), icon: "👁️" });

  if (user.avg_reels_plays !== undefined && user.avg_reels_plays > 0)
    stats.push({ label: "Reel Plays", value: formatCount(user.avg_reels_plays), icon: "🎬" });

  if (user.engagements !== undefined)
    stats.push({ label: "Engagements", value: formatCount(user.engagements), icon: "🔥" });

  return stats;
}

function parsePlatform(platformParam: string | null): Platform {
  const value = platformParam || "instagram";
  return (["instagram", "youtube", "tiktok"].includes(value)
    ? value
    : "instagram") as Platform;
}

interface ProfileDetailContentProps {
  username: string;
  platform: Platform;
}

function ProfileDetailContent({ username, platform }: ProfileDetailContentProps) {
  const [profileData, setProfileData] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const addProfile = useSelectedProfiles((s) => s.addProfile);
  const isSelected = useSelectedProfiles((s) =>
    s.profiles.some((p) => p.username === username)
  );

  useEffect(() => {
    let cancelled = false;

    loadProfileByUsername(username).then((data) => {
      if (cancelled) return;
      if (data) {
        setProfileData(data.data.user_profile);
      } else {
        setError(true);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const meta = PLATFORM_META[platform];

  // ── Loading ──
  if (loading) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center justify-center py-20 animate-fade-in">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Error ──
  if (error || !profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-20 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Could not load profile details for <strong>{username}</strong>
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            ← Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user = profileData;
  const stats = buildStats(user);

  const handleAddToList = () => {
    const profileForStore: UserProfileSummary = {
      user_id: user.user_id,
      username: user.username,
      url: user.url,
      picture: user.picture,
      fullname: user.fullname,
      is_verified: user.is_verified,
      followers: user.followers,
      engagements: user.engagements,
      engagement_rate: user.engagement_rate,
      platform: platform,
    };
    addProfile(profileForStore);
  };

  return (
    <Layout title={user.fullname}>
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to search
      </Link>

      <div className="max-w-3xl mx-auto animate-slide-up">
        {/* Profile header card */}
        <div className="relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm overflow-hidden">
          {/* Platform accent */}
          <div className={`h-2 bg-gradient-to-r ${meta.gradient}`} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative shrink-0">
                <Avatar src={user.picture} alt={user.fullname} size="xl" className="shadow-md" />
                <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-100 dark:border-gray-700/60 flex items-center justify-center">
                  <PlatformIcon platform={platform} className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    @{user.username}
                  </h2>
                  <VerifiedBadge verified={user.is_verified} />
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700/60 shadow-sm">
                    <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
                    <span>{meta.label}</span>
                  </div>
                </div>
                <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">
                  {user.fullname}
                </p>

                {user.description && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {user.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={handleAddToList}
                    disabled={isSelected}
                    aria-label={
                      isSelected
                        ? `${user.username} already in your list`
                        : `Add ${user.username} to your list`
                    }
                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-default ring-1 ring-green-200 dark:ring-green-800"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm hover:shadow-md active:scale-95"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Added to List
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add to List
                      </>
                    )}
                  </button>

                  {user.url && (
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View on {meta.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700/60 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="text-2xl mb-1" aria-hidden="true">
                {stat.icon}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = parsePlatform(searchParams.get("platform"));

  // ── Invalid username ──
  if (!username) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Invalid profile</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            ← Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  return <ProfileDetailContent key={username} username={username} platform={platform} />;
}
