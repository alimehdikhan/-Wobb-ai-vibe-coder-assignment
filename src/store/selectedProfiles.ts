import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface SelectedProfilesState {
  /** Ordered list of selected profiles */
  profiles: UserProfileSummary[];

  /** Add a profile if not already selected */
  addProfile: (profile: UserProfileSummary) => void;

  /** Remove a profile by username */
  removeProfile: (username: string) => void;

  /** Toggle a profile — add if missing, remove if present */
  toggleProfile: (profile: UserProfileSummary) => void;

  /** Reorder profiles (drag-and-drop) */
  reorderProfiles: (profiles: UserProfileSummary[]) => void;

  /** Clear the entire list */
  clear: () => void;

  /** Check if a profile is selected */
  isSelected: (username: string) => boolean;
}

export const useSelectedProfiles = create<SelectedProfilesState>()(
  persist(
    (set, get) => ({
      profiles: [],

      addProfile: (profile) => {
        const { profiles } = get();
        if (profiles.some((p) => p.username === profile.username)) return;
        set({ profiles: [...profiles, profile] });
      },

      removeProfile: (username) => {
        set({ profiles: get().profiles.filter((p) => p.username !== username) });
      },

      toggleProfile: (profile) => {
        const { profiles } = get();
        const exists = profiles.some((p) => p.username === profile.username);
        if (exists) {
          set({ profiles: profiles.filter((p) => p.username !== profile.username) });
        } else {
          set({ profiles: [...profiles, profile] });
        }
      },

      reorderProfiles: (reordered) => {
        set({ profiles: reordered });
      },

      clear: () => {
        set({ profiles: [] });
      },

      isSelected: (username) => {
        return get().profiles.some((p) => p.username === username);
      },
    }),
    {
      name: "wobb-selected-profiles",
    }
  )
);