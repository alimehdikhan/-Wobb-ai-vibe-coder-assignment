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

    async function loadProfile() {
      try {
        const data = await loadProfileByUsername(username, platform);
        if (cancelled) return;

        if (data) {
          setProfileData(data.data.user_profile);
        } else {
          setError(true);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [username, platform]);

  const meta = PLATFORM_META[platform];

  if (loading) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center justify-center py-24 animate-fade-in" role="status" aria-live="polite">
          <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
            <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span>Loading profile…</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="surface-panel max-w-md mx-auto text-center py-12 px-6 animate-fade-in" role="alert">
          <div className="w-14 h-14 mx-auto mb-4 rounded-[var(--radius-lg)] bg-[var(--color-error-muted)] flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">Profile unavailable</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-5">
            Could not load details for <strong>@{username}</strong>
          </p>
          <Link to="/" className="btn btn-primary">
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
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to search
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto animate-slide-up">
        <article className="surface-card overflow-hidden">
          <div className={`h-1.5 bg-gradient-to-r ${meta.gradient}`} aria-hidden="true" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <Avatar src={user.picture} alt={user.fullname} size="xl" className="shadow-[var(--shadow-md)]" />
                <div className="absolute -bottom-1 -right-1 p-1 bg-[var(--surface-card)] rounded-full shadow-sm border border-[var(--color-border)] flex items-center justify-center">
                  <PlatformIcon platform={platform} className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
                    @{user.username}
                  </h1>
                  <VerifiedBadge verified={user.is_verified} />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-full)] text-xs font-semibold bg-[var(--surface-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                    <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
                    {meta.label}
                  </span>
                </div>
                <p className="text-base text-[var(--color-text-secondary)] mt-1">{user.fullname}</p>

                {user.description && (
                  <p className="mt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-4 sm:line-clamp-none">
                    {user.description}
                  </p>
                )}

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-5">
                  <button
                    type="button"
                    onClick={handleAddToList}
                    disabled={isSelected}
                    aria-label={
                      isSelected
                        ? `${user.username} already in your list`
                        : `Add ${user.username} to your list`
                    }
                    className={`btn ${isSelected ? "btn-success" : "btn-primary"}`}
                  >
                    {isSelected ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to List
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                      className="btn btn-ghost border border-[var(--color-border)]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on {meta.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="mt-6" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="section-label mb-3">
            Statistics
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 list-none p-0 m-0">
            {stats.map((stat, index) => (
              <li
                key={stat.label}
                className="surface-panel p-4 transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-xl mb-2 block" aria-hidden="true">{stat.icon}</span>
                <p className="text-lg font-bold text-[var(--color-text)] tabular-nums">{stat.value}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 uppercase tracking-wide">{stat.label}</p>
              </li>
            ))}
          </ul>
        </section>
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
        <div className="surface-panel max-w-md mx-auto text-center py-12 px-6">
          <p className="text-[var(--color-text-secondary)] mb-4">Invalid profile URL</p>
          <Link to="/" className="btn btn-primary">← Back to search</Link>
        </div>
      </Layout>
    );
  }

  return (
    <ProfileDetailContent
      key={`${platform}:${username}`}
      username={username}
      platform={platform}
    />
  );
}
