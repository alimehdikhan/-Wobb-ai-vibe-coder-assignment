import { memo, useState, useCallback } from "react";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "w-9 h-9",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24 sm:w-28 sm:h-28",
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

  const initials = alt
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (error) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0 ${className}`}
        aria-label={alt}
      >
        <span className={size === "xl" ? "text-2xl" : size === "lg" ? "text-lg" : "text-sm"}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={handleError}
      className={`${sizeClasses[size]} rounded-full object-cover shrink-0 ring-2 ring-gray-100 dark:ring-gray-700 ${className}`}
    />
  );
});
