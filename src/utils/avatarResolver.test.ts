import { describe, expect, it } from "vitest";
import { resolveProfilePicture } from "@/utils/avatarResolver";

describe("resolveProfilePicture", () => {
  it("prefers bundled detail JSON pictures for known profiles", () => {
    const resolved = resolveProfilePicture(
      "MrBeast6000",
      "https://example.com/stale.jpg"
    );

    expect(resolved).toContain("yt3.googleusercontent.com");
    expect(resolved).not.toBe("https://example.com/stale.jpg");
  });

  it("returns trimmed search picture when no override exists", () => {
    const picture = "  https://example.com/avatar.png  ";
    expect(resolveProfilePicture("unknown_user", picture)).toBe(
      "https://example.com/avatar.png"
    );
  });

  it("returns empty string when picture is missing", () => {
    expect(resolveProfilePicture("unknown_user", null)).toBe("");
    expect(resolveProfilePicture("unknown_user", undefined)).toBe("");
  });
});