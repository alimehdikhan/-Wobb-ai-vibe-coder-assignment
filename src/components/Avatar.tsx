import { memo, useState, useCallback, useEffect } from "react";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "card" | "lg" | "xl";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "avatar--sm",
  md: "avatar--md",
  card: "avatar--card",
  lg: "avatar--lg",
  xl: "avatar--xl",
};

const textSizeClasses: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
  card: "text-sm",
  lg: "text-lg",
  xl: "text-2xl",
};

/**
 * Avatar with centered, aspect-preserving image and initials fallback on load failure.
 */
export const Avatar = memo(function Avatar({
  src,
  alt,
  size = "md",
  className = "",
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const normalizedSrc = src?.trim() ?? "";

  useEffect(() => {
    setFailed(false);
  }, [normalizedSrc]);

  const handleError = useCallback(() => setFailed(true), []);

  const initials =
    (alt || "?")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const sizeClass = sizeClasses[size];
  const textClass = textSizeClasses[size];
  const showFallback = failed || !normalizedSrc;

  return (
    <div
      className={`avatar ${sizeClass} ${className}`.trim()}
      aria-label={alt || "Profile avatar"}
      role="img"
    >
      {!showFallback ? (
        <img
          key={normalizedSrc}
          src={normalizedSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          onError={handleError}
          className="avatar__image"
        />
      ) : (
        <span className={`avatar__initials ${textClass}`} aria-hidden="true">
          {initials}
        </span>
      )}
    </div>
  );
});