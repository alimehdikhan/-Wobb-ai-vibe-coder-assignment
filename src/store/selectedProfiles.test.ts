import { describe, expect, it } from "vitest";
import { useSelectedProfiles } from "@/store/selectedProfiles";
import type { UserProfileSummary } from "@/types";

const sampleProfile: UserProfileSummary = {
  user_id: "1",
  username: "cristiano",
  url: "https://www.instagram.com/cristiano",
  picture: "https://example.com/cristiano.jpg",
  fullname: "Cristiano Ronaldo",
  is_verified: true,
  followers: 600_000_000,
  platform: "instagram",
};

const secondProfile: UserProfileSummary = {
  ...sampleProfile,
  user_id: "2",
  username: "leomessi",
  fullname: "Leo Messi",
};

describe("useSelectedProfiles", () => {
  it("adds profiles to the list", () => {
    useSelectedProfiles.getState().addProfile(sampleProfile);
    expect(useSelectedProfiles.getState().profiles).toHaveLength(1);
    expect(useSelectedProfiles.getState().profiles[0].username).toBe("cristiano");
  });

  it("prevents duplicate usernames", () => {
    useSelectedProfiles.getState().addProfile(sampleProfile);
    useSelectedProfiles.getState().addProfile(sampleProfile);
    expect(useSelectedProfiles.getState().profiles).toHaveLength(1);
  });

  it("removes profiles by username", () => {
    useSelectedProfiles.getState().addProfile(sampleProfile);
    useSelectedProfiles.getState().addProfile(secondProfile);
    useSelectedProfiles.getState().removeProfile("cristiano");

    expect(useSelectedProfiles.getState().profiles).toHaveLength(1);
    expect(useSelectedProfiles.getState().profiles[0].username).toBe("leomessi");
  });

  it("reorders profiles", () => {
    useSelectedProfiles.getState().addProfile(sampleProfile);
    useSelectedProfiles.getState().addProfile(secondProfile);
    useSelectedProfiles.getState().reorderProfiles([
      secondProfile,
      sampleProfile,
    ]);

    expect(useSelectedProfiles.getState().profiles.map((p) => p.username)).toEqual([
      "leomessi",
      "cristiano",
    ]);
  });

  it("clears the list", () => {
    useSelectedProfiles.getState().addProfile(sampleProfile);
    useSelectedProfiles.getState().clear();
    expect(useSelectedProfiles.getState().profiles).toHaveLength(0);
  });
});