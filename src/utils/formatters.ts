/**
 * Format a large number into a compact human-readable string.
 * Examples: 1234567 → "1.2M", 45600 → "45.6K", 890 → "890"
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toLocaleString();
}

/**
 * Format followers with "followers" suffix.
 * Examples: 1234567 → "1.2M followers", 890 → "890 followers"
 */
export function formatFollowers(count: number): string {
  return `${formatCount(count)} followers`;
}

/**
 * Format an engagement rate (0-1 decimal) into a percentage string.
 * Returns "N/A" when undefined.
 */
export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}
