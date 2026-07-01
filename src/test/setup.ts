import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { clearProfileCache } from "@/utils/dataHelpers";
import { useSelectedProfiles } from "@/store/selectedProfiles";

beforeEach(() => {
  localStorage.clear();
  clearProfileCache();
  useSelectedProfiles.setState({ profiles: [] });
});

afterEach(() => {
  cleanup();
});