import type { Platform, ProfileDetailResponse } from "@/types";
import { extractProfiles } from "@/utils/dataHelpers";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string,
  platform: Platform
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (loader) {
    const result = await loader();
    const data =
      (result as { default?: ProfileDetailResponse }).default ?? result;
    return data as ProfileDetailResponse;
  }

  const profile = extractProfiles(platform).find(
    (candidate) => candidate.username === username
  );

  if (!profile) return null;

  return {
    data: {
      success: true,
      user_profile: profile,
    },
  };
}
