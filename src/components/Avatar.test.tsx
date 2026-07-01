import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar } from "@/components/Avatar";

describe("Avatar", () => {
  it("renders initials when src is empty", () => {
    render(<Avatar src="" alt="Cristiano Ronaldo" />);
    expect(screen.getByRole("img", { name: "Cristiano Ronaldo" })).toHaveTextContent(
      "CR"
    );
  });

  it("renders an image when src is provided", () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Cristiano Ronaldo" />);
    const image = document.querySelector(".avatar__image") as HTMLImageElement;
    expect(image).toBeTruthy();
    expect(image.src).toContain("https://example.com/avatar.jpg");
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar src="https://example.com/broken.jpg" alt="Leo Messi" />);
    const image = document.querySelector(".avatar__image") as HTMLImageElement;
    fireEvent.error(image);
    expect(screen.getByRole("img", { name: "Leo Messi" })).toHaveTextContent("LM");
  });

  it("resets fallback when src changes", () => {
    const { rerender } = render(
      <Avatar src="https://example.com/broken.jpg" alt="Leo Messi" />
    );
    fireEvent.error(document.querySelector(".avatar__image") as HTMLImageElement);

    rerender(<Avatar src="https://example.com/fixed.jpg" alt="Leo Messi" />);
    expect(document.querySelector(".avatar__image")).toBeTruthy();
  });

  it("marks image as loaded on successful load", () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Test User" />);
    const image = document.querySelector(".avatar__image") as HTMLImageElement;
    fireEvent.load(image);
    expect(image.className).toContain("avatar__image--loaded");
  });
});