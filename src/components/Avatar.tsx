import { memo, useState, useCallback } from "react";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "card" | "lg" | "xl";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "w-9 h-9",
  md: "w-12 h-12",
  card: "w-16 h-16",
  lg: "w-16 h-16",
  xl: "w-24 h-24 sm:w-28 sm:h-28",
};

const textSizeClasses: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
  card: "text-sm",
  lg: "text-lg",
  xl: "text-2xl",
};

/**
 * Avatar with graceful fallback to initials on image load error.
 */
export const Avatar = memo(function Avatar({
  src,
  alt,
  size = "md",
  className = "",
}: AvatarProps) {
  const [error, setError] = useState(false);

  const handleError = useCallback(() => setError(true), []);

  const initials = (alt || "?")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  const sizeClass = sizeClasses[size];
  const textClass = textSizeClasses[size];

  if (error || !src) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold shrink-0 aspect-square ${className}`}
        aria-label={alt || "Profile avatar"}
        role="img"
      >
        <span className={textClass}>{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleError}
      className={`${sizeClass} rounded-full object-cover object-center shrink-0 aspect-square ring-2 ring-[var(--color-border-subtle)] bg-[var(--surface-muted)] ${className}`}
    />
  );
});