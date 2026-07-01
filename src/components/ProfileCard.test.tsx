import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileCard } from "@/components/ProfileCard";
import { useSelectedProfiles } from "@/store/selectedProfiles";
import { renderWithRouter } from "@/test/utils";
import type { UserProfileSummary } from "@/types";

const profile: UserProfileSummary = {
  user_id: "173560420",
  username: "cristiano",
  url: "https://www.instagram.com/cristiano",
  picture: "https://example.com/cristiano.jpg",
  fullname: "Cristiano Ronaldo",
  is_verified: true,
  followers: 600_000_000,
  engagement_rate: 0.02,
};

describe("ProfileCard", () => {
  it("renders profile identity and stats", () => {
    renderWithRouter(<ProfileCard profile={profile} platform="instagram" />);

    expect(screen.getByText("@cristiano")).toBeInTheDocument();
    expect(screen.getByText("Cristiano Ronaldo")).toBeInTheDocument();
    expect(screen.getByText("600M")).toBeInTheDocument();
    expect(screen.getByText("2.00%")).toBeInTheDocument();
  });

  it("adds the profile to the selected list", async () => {
    const user = userEvent.setup();
    renderWithRouter(<ProfileCard profile={profile} platform="instagram" />);

    await user.click(screen.getByRole("button", { name: /add cristiano to list/i }));

    expect(useSelectedProfiles.getState().profiles).toHaveLength(1);
    expect(useSelectedProfiles.getState().profiles[0].username).toBe("cristiano");
    expect(useSelectedProfiles.getState().profiles[0].platform).toBe("instagram");
  });

  it("disables the button when the profile is already selected", () => {
    useSelectedProfiles.getState().addProfile({ ...profile, platform: "instagram" });
    renderWithRouter(<ProfileCard profile={profile} platform="instagram" />);

    const button = screen.getByRole("button", {
      name: /cristiano already in list/i,
    });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Added");
  });
});