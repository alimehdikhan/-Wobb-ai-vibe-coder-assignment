import { describe, expect, it } from "vitest";
import {
  formatCount,
  formatEngagementRate,
  formatFollowers,
} from "@/utils/formatters";

describe("formatCount", () => {
  it("formats millions", () => {
    expect(formatCount(1_234_567)).toBe("1.2M");
    expect(formatCount(2_000_000)).toBe("2M");
  });

  it("formats thousands", () => {
    expect(formatCount(45_600)).toBe("45.6K");
    expect(formatCount(1_000)).toBe("1K");
  });

  it("formats small numbers with locale separators", () => {
    expect(formatCount(890)).toBe("890");
    expect(formatCount(0)).toBe("0");
  });
});

describe("formatFollowers", () => {
  it("appends followers suffix", () => {
    expect(formatFollowers(1_200_000)).toBe("1.2M followers");
    expect(formatFollowers(500)).toBe("500 followers");
  });
});

describe("formatEngagementRate", () => {
  it("converts decimal rate to percentage", () => {
    expect(formatEngagementRate(0.0523)).toBe("5.23%");
    expect(formatEngagementRate(0)).toBe("0.00%");
  });

  it("returns N/A for missing values", () => {
    expect(formatEngagementRate(undefined)).toBe("N/A");
    expect(formatEngagementRate(null as unknown as undefined)).toBe("N/A");
  });
});