import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const addProfile = useSelectedProfiles((s) => s.addProfile);
  const isSelected = useSelectedProfiles((s) =>
    s.profiles.some((p) => p.username === profile.username)
  );

  const handleClick = useCallback(() => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, profile.username, platform]);

  const handleAddToList = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      addProfile({ ...profile, platform });
    },
    [addProfile, profile, platform]
  );

  const meta = PLATFORM_META[platform];

  return (
    <article
      onClick={handleClick}
      className="group relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in"
      role="button"
      tabIndex={0}
      aria-label={`View ${profile.fullname}'s profile`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Platform accent */}
      <div
        className={`h-1 bg-gradient-to-r ${meta.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar src={profile.picture} alt={profile.fullname} size="md" />
            <div className="absolute -bottom-1 -right-1 p-0.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700/60 flex items-center justify-center">
              <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">
                @{profile.username}
              </span>
              <VerifiedBadge verified={profile.is_verified} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {profile.fullname}
            </p>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 text-right">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {formatCount(profile.followers)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              followers
            </span>
          </div>

          {/* Engagement rate */}
          {profile.engagement_rate !== undefined && (
            <div className="hidden md:flex flex-col items-end gap-0.5 shrink-0 text-right">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {formatEngagementRate(profile.engagement_rate)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                engagement
              </span>
            </div>
          )}

          {/* Add to List */}
          <button
            onClick={handleAddToList}
            disabled={isSelected}
            aria-label={
              isSelected
                ? `${profile.username} already in list`
                : `Add ${profile.username} to list`
            }
            className={`shrink-0 px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-default ring-1 ring-green-200 dark:ring-green-800"
                : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm hover:shadow-md active:scale-95"
            }`}
          >
            {isSelected ? (
              <span className="flex items-center gap-1.5">
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
                <span className="hidden sm:inline">Added</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
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
                <span className="hidden sm:inline">Add</span>
              </span>
            )}
          </button>
        </div>

        {/* Mobile stats row */}
        <div className="flex sm:hidden items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {formatCount(profile.followers)} followers
          </span>
          {profile.engagement_rate !== undefined && (
            <>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {formatEngagementRate(profile.engagement_rate)} eng.
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
});
