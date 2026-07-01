import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { PLATFORM_META } from "@/types";
import { formatCount, formatEngagementRate } from "@/utils/formatters";
import { Avatar } from "./Avatar";
import { VerifiedBadge } from "./VerifiedBadge";
import { useSelectedProfiles } from "@/store/selectedProfiles";
import { PlatformIcon } from "./PlatformIcon";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
}: ProfileCardProps) {
  const addProfile = useSelectedProfiles((s) => s.addProfile);
  const isSelected = useSelectedProfiles((s) =>
    s.profiles.some((p) => p.username === profile.username)
  );

  const handleAddToList = useCallback(() => {
    addProfile({ ...profile, platform });
  }, [addProfile, profile, platform]);

  const meta = PLATFORM_META[platform];

  return (
    <article className="surface-card group overflow-hidden animate-fade-in transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]">
      <div
        className={`h-1 bg-gradient-to-r ${meta.gradient} opacity-70 group-hover:opacity-100 transition-opacity`}
        aria-hidden="true"
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <Link
            to={`/profile/${profile.username}?platform=${platform}`}
            className="flex flex-1 min-w-0 gap-3 sm:gap-4 rounded-[var(--radius-md)] focus-visible:outline-offset-2"
            aria-label={`View ${profile.fullname}'s profile`}
          >
            <div className="relative shrink-0">
              <Avatar src={profile.picture} alt="" size="md" />
              <div className="absolute -bottom-1 -right-1 p-0.5 bg-[var(--surface-card)] rounded-full shadow-sm border border-[var(--color-border)] flex items-center justify-center">
                <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[var(--color-text)] truncate text-sm sm:text-base">
                  @{profile.username}
                </span>
                <VerifiedBadge verified={profile.is_verified} />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] truncate mt-0.5">
                {profile.fullname}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 sm:hidden">
                <span className="text-xs font-semibold text-[var(--color-text)]">
                  {formatCount(profile.followers)} followers
                </span>
                {profile.engagement_rate !== undefined && (
                  <span className="text-xs font-semibold text-[var(--color-success)]">
                    {formatEngagementRate(profile.engagement_rate)} eng.
                  </span>
                )}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 shrink-0">
              <div className="stat-pill">
                <span className="stat-pill-value">{formatCount(profile.followers)}</span>
                <span className="stat-pill-label">Followers</span>
              </div>
              {profile.engagement_rate !== undefined && (
                <div className="stat-pill">
                  <span className="stat-pill-value stat-pill-value--accent">
                    {formatEngagementRate(profile.engagement_rate)}
                  </span>
                  <span className="stat-pill-label">Engagement</span>
                </div>
              )}
            </div>
          </Link>

          <button
            type="button"
            onClick={handleAddToList}
            disabled={isSelected}
            aria-label={
              isSelected
                ? `${profile.username} already in list`
                : `Add ${profile.username} to list`
            }
            className={`btn shrink-0 self-center ${isSelected ? "btn-success" : "btn-primary"}`}
          >
            {isSelected ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden min-[380px]:inline">Added</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden min-[380px]:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
});