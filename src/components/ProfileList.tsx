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
        icon={
          <svg className="w-7 h-7 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        title="No profiles found"
        description="Try a different search term or switch to another platform."
      />
    );
  }

  return (
    <ul
      className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0"
      aria-label="Influencer profiles"
    >
      {profiles.map((profile, index) => (
        <li key={profile.user_id} style={{ animationDelay: `${index * 40}ms` }}>
          <ProfileCard profile={profile} platform={platform} />
        </li>
      ))}
    </ul>
  );
});