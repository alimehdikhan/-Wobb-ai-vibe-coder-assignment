import { memo } from "react";

interface VerifiedBadgeProps {
  verified: boolean;
}

/**
 * Verified badge with proper SVG icon and accessible title.
 */
export const VerifiedBadge = memo(function VerifiedBadge({
  verified,
}: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <span title="Verified account" className="inline-flex shrink-0">
      <svg
        className="w-4 h-4 text-[var(--color-secondary)]"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label="Verified"
        role="img"
      >
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    </span>
  );
});
