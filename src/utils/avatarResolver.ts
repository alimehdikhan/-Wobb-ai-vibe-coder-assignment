import MrBeast6000Profile from "@/assets/data/profiles/MrBeast6000.json";
import cristianoProfile from "@/assets/data/profiles/cristiano.json";
import instagramProfile from "@/assets/data/profiles/instagram.json";
import khabyLameProfile from "@/assets/data/profiles/khaby.lame.json";
import mrbeastProfile from "@/assets/data/profiles/mrbeast.json";
import tseriesProfile from "@/assets/data/profiles/tseries.json";
import type { ProfileDetailResponse } from "@/types";

type ProfileModule = ProfileDetailResponse & {
  default?: ProfileDetailResponse;
};

const profileModules: ProfileModule[] = [
  MrBeast6000Profile as ProfileModule,
  cristianoProfile as ProfileModule,
  instagramProfile as ProfileModule,
  khabyLameProfile as ProfileModule,
  mrbeastProfile as ProfileModule,
  tseriesProfile as ProfileModule,
];

/** Prefer bundled profile-detail pictures when they differ from search summaries. */
const profilePictureOverrides = new Map<string, string>();

for (const module of profileModules) {
  const data = module.default ?? module;
  const picture = data.data?.user_profile?.picture?.trim();
  const username = data.data?.user_profile?.username?.trim();

  if (username && picture) {
    profilePictureOverrides.set(username, picture);
  }
}

/**
 * Resolve the best available avatar URL for a profile.
 * Detail JSON pictures take precedence over search summaries.
 */
export function resolveProfilePicture(
  username: string,
  picture?: string | null
): string {
  const override = profilePictureOverrides.get(username);
  if (override) return override;

  return picture?.trim() ?? "";
}