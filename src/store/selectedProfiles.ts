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

  /** Reorder profiles (drag-and-drop) */
  reorderProfiles: (profiles: UserProfileSummary[]) => void;

  /** Clear the entire list */
  clear: () => void;
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

      reorderProfiles: (reordered) => {
        set({ profiles: reordered });
      },

      clear: () => {
        set({ profiles: [] });
      },
    }),
    {
      name: "wobb-selected-profiles",
      partialize: (state) => ({ profiles: state.profiles }),
    }
  )
);
