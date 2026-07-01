import { describe, expect, it } from "vitest";
import {
  clearProfileCache,
  extractProfiles,
  filterProfiles,
  getSearchData,
} from "@/utils/dataHelpers";

describe("getSearchData", () => {
  it("returns platform-specific search payloads", () => {
    expect(getSearchData("instagram").accounts).toHaveLength(10);
    expect(getSearchData("youtube").accounts).toHaveLength(10);
    expect(getSearchData("tiktok").accounts).toHaveLength(10);
  });
});

describe("extractProfiles", () => {
  it("normalizes username and platform for each profile", () => {
    const profiles = extractProfiles("instagram");

    expect(profiles).toHaveLength(10);
    expect(profiles[0].username).toBeTruthy();
    expect(profiles[0].platform).toBe("instagram");
    expect(profiles[0].picture).toBeTruthy();
  });

  it("falls back to handle or user_id for youtube usernames", () => {
    const profiles = extractProfiles("youtube");
    const vlad = profiles.find((p) => p.handle === "VladandNiki");

    expect(vlad?.username).toBe("VladandNiki");
  });

  it("memoizes results until cache is cleared", () => {
    const first = extractProfiles("tiktok");
    const second = extractProfiles("tiktok");

    expect(first).toBe(second);

    clearProfileCache();
    const third = extractProfiles("tiktok");

    expect(third).not.toBe(first);
    expect(third).toHaveLength(first.length);
  });
});

describe("filterProfiles", () => {
  const profiles = extractProfiles("instagram");

  it("returns all profiles for empty query", () => {
    expect(filterProfiles(profiles, "")).toHaveLength(profiles.length);
    expect(filterProfiles(profiles, "   ")).toHaveLength(profiles.length);
  });

  it("filters by username", () => {
    const result = filterProfiles(profiles, "cristiano");
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe("cristiano");
  });

  it("filters by fullname case-insensitively", () => {
    const result = filterProfiles(profiles, "RONALDO");
    expect(result.some((p) => p.username === "cristiano")).toBe(true);
  });
});