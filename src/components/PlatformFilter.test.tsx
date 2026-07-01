import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlatformFilter } from "@/components/PlatformFilter";

describe("PlatformFilter", () => {
  it("renders platform tabs and search input", () => {
    render(
      <PlatformFilter
        selected="instagram"
        onChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByRole("tab", { name: /instagram/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: /youtube/i })).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("calls onChange when a platform tab is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <PlatformFilter
        selected="instagram"
        onChange={onChange}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole("tab", { name: /youtube/i }));
    expect(onChange).toHaveBeenCalledWith("youtube");
  });

  it("updates search query and supports clear", async () => {
    const onSearchChange = vi.fn();
    const user = userEvent.setup();

    render(
      <PlatformFilter
        selected="instagram"
        onChange={vi.fn()}
        searchQuery="cristiano"
        onSearchChange={onSearchChange}
      />
    );

    await user.type(screen.getByRole("searchbox"), "o");
    expect(onSearchChange).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /clear search/i }));
    expect(onSearchChange).toHaveBeenCalledWith("");
  });
});