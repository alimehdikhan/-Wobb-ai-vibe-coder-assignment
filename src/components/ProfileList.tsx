import { memo } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { EmptyState } from "./EmptyState";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export const ProfileList = memo(function ProfileList({
  profiles,
  platform,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No profiles found"
        description="Try adjusting your search query or switching to a different platform."
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-3"
      role="list"
      aria-label="Influencer profiles"
    >
      {profiles.map((profile, index) => (
        <div
          key={profile.user_id}
          role="listitem"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProfileCard profile={profile} platform={platform} />
        </div>
      ))}
    </div>
  );
});
