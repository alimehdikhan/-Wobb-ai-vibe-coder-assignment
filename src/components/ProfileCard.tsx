import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { formatCount, formatEngagementRate } from "@/utils/formatters";
import { Avatar } from "./Avatar";
import { VerifiedBadge } from "./VerifiedBadge";
import { useSelectedProfiles } from "@/store/selectedProfiles";
import { PlatformIcon } from "./PlatformIcon";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  index?: number;
}

function ProfileStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="profile-card__stat">
      <span
        className={`profile-card__stat-value${accent ? " profile-card__stat-value--accent" : ""}`}
      >
        {value}
      </span>
      <span className="profile-card__stat-label">{label}</span>
    </div>
  );
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  index = 0,
}: ProfileCardProps) {
  const addProfile = useSelectedProfiles((s) => s.addProfile);
  const isSelected = useSelectedProfiles((s) =>
    s.profiles.some((p) => p.username === profile.username)
  );
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToList = useCallback(() => {
    if (isSelected) return;
    addProfile({ ...profile, platform });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 500);
  }, [addProfile, profile, platform, isSelected]);

  const engagementValue =
    profile.engagement_rate !== undefined
      ? formatEngagementRate(profile.engagement_rate)
      : "—";

  return (
    <article
      className="profile-card animate-fade-in"
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
    >
      <Link
        to={`/profile/${profile.username}?platform=${platform}`}
        className="profile-card__link"
        aria-label={`View ${profile.fullname}'s profile`}
      >
        <div className="avatar-wrap">
          <Avatar src={profile.picture} alt={profile.fullname} size="card" />
          <div className="avatar-wrap__badge" aria-hidden="true">
            <PlatformIcon platform={platform} className="w-3 h-3" />
          </div>
        </div>

        <div className="profile-card__identity">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="profile-card__username">@{profile.username}</h3>
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <p className="profile-card__fullname">{profile.fullname}</p>

          <div className="profile-card__stats">
            <ProfileStat label="Followers" value={formatCount(profile.followers)} />
            <ProfileStat
              label="Engagement"
              value={engagementValue}
              accent={profile.engagement_rate !== undefined}
            />
          </div>
        </div>
      </Link>

      <div className="profile-card__footer">
        <button
          type="button"
          onClick={handleAddToList}
          disabled={isSelected}
          aria-pressed={isSelected}
          aria-label={
            isSelected
              ? `${profile.username} already in list`
              : `Add ${profile.username} to list`
          }
          className={`btn-add ${isSelected ? "btn-add--added" : "btn-add--default"}${justAdded ? " btn-add--pop" : ""}`}
        >
          {isSelected ? (
            <>
              <span>Added</span>
              <svg
                className="w-4 h-4 shrink-0"
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
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 shrink-0"
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
              <span>Add to List</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
});