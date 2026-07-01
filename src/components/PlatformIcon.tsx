import { useId } from "react";
import type { Platform } from "@/types";

interface IconProps {
  className?: string;
  size?: number | string;
  "aria-label"?: string;
  active?: boolean;
}

export function InstagramIcon({ className = "w-5 h-5", size, "aria-label": ariaLabel, active = false }: IconProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      width={size}
      height={size}
      fill="none"
      stroke="none"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    >
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="107%" r="130%" fx="30%" fy="107%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285aeb" />
        </radialGradient>
      </defs>
      <path
        fill={active ? "#FFFFFF" : `url(#${gradientId})`}
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      />
    </svg>
  );
}

export function YouTubeIcon({ className = "w-5 h-5", size, "aria-label": ariaLabel, active = false }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      width={size}
      height={size}
      fill="none"
      stroke="none"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    >
      <path
        fill={active ? "#FFFFFF" : "#FF0000"}
        d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 002.11 2.11c1.858.507 9.388.507 9.388.507s7.53 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837z"
      />
      <polygon fill={active ? "#FF0000" : "#FFFFFF"} points="9.545,15.568 15.818,12 9.545,8.432" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-5 h-5", size, "aria-label": ariaLabel, active = false }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      width={size}
      height={size}
      fill="none"
      stroke="none"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
    >
      {/* Cyan offset note */}
      <path
        fill="#00f2fe"
        d="M12.225.22c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.52-4.06-1.39-.78-.57-1.4-1.34-1.85-2.22-.07-.15-.12-.3-.15-.46-.03.02-.04.05-.06.07v6.62c.03 2.14-.73 4.31-2.23 5.85-1.55 1.6-3.87 2.41-6.11 2.21-2.27-.15-4.45-1.44-5.55-3.47-1.2-2.17-1.12-4.99.23-7.07 1.22-1.92 3.42-3.1 5.71-3.08.01 1.34-.01 2.68.01 4.02-1.23-.05-2.5.39-3.27 1.38-.72.87-.79 2.15-.31 3.16.44.97 1.45 1.64 2.51 1.72 1.16.1 2.37-.34 2.99-1.33.45-.69.57-1.54.55-2.35V.22Z"
        transform="translate(-0.6, -0.6)"
      />
      {/* Red offset note */}
      <path
        fill="#fe0979"
        d="M12.825-.18c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.52-4.06-1.39-.78-.57-1.4-1.34-1.85-2.22-.07-.15-.12-.3-.15-.46-.03.02-.04.05-.06.07v6.62c.03 2.14-.73 4.31-2.23 5.85-1.55 1.6-3.87 2.41-6.11 2.21-2.27-.15-4.45-1.44-5.55-3.47-1.2-2.17-1.12-4.99.23-7.07 1.22-1.92 3.42-3.1 5.71-3.08.01 1.34-.01 2.68.01 4.02-1.23-.05-2.5.39-3.27 1.38-.72.87-.79 2.15-.31 3.16.44.97 1.45 1.64 2.51 1.72 1.16.1 2.37-.34 2.99-1.33.45-.69.57-1.54.55-2.35V-.18Z"
        transform="translate(0.6, 0.6)"
      />
      {/* Main note (adapts dynamically: black/white or solid dark) */}
      <path
        fill="currentColor"
        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.52-4.06-1.39-.78-.57-1.4-1.34-1.85-2.22-.07-.15-.12-.3-.15-.46-.03.02-.04.05-.06.07v6.62c.03 2.14-.73 4.31-2.23 5.85-1.55 1.6-3.87 2.41-6.11 2.21-2.27-.15-4.45-1.44-5.55-3.47-1.2-2.17-1.12-4.99.23-7.07 1.22-1.92 3.42-3.1 5.71-3.08.01 1.34-.01 2.68.01 4.02-1.23-.05-2.5.39-3.27 1.38-.72.87-.79 2.15-.31 3.16.44.97 1.45 1.64 2.51 1.72 1.16.1 2.37-.34 2.99-1.33.45-.69.57-1.54.55-2.35V.02Z"
        className={active ? "text-white" : "text-black dark:text-white"}
      />
    </svg>
  );
}

interface PlatformIconProps extends IconProps {
  platform: Platform;
}

export function PlatformIcon({ platform, className, size, "aria-label": ariaLabel, active = false }: PlatformIconProps) {
  switch (platform) {
    case "instagram":
      return <InstagramIcon className={className} size={size} aria-label={ariaLabel} active={active} />;
    case "youtube":
      return <YouTubeIcon className={className} size={size} aria-label={ariaLabel} active={active} />;
    case "tiktok":
      return <TikTokIcon className={className} size={size} aria-label={ariaLabel} active={active} />;
    default:
      return null;
  }
}
