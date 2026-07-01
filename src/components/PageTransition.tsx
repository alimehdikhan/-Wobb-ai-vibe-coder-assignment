import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/** Subtle enter animation when a route mounts. */
export function PageTransition({ children }: PageTransitionProps) {
  return <div className="page-transition">{children}</div>;
}