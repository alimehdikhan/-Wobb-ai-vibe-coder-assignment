import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelectedProfiles } from "@/store/selectedProfiles";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const location = useLocation();
  const count = useSelectedProfiles((s) => s.profiles.length);

  useEffect(() => {
    document.title = title
      ? `${title} — WobbSearch`
      : "WobbSearch — Influencer Discovery";
  }, [title]);

  const isSearch = location.pathname === "/";
  const isList = location.pathname === "/list";

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--surface-card)]/85 backdrop-blur-xl"
        style={{ height: "var(--header-height)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group rounded-lg focus-visible:outline-offset-4"
            aria-label="WobbSearch home"
          >
            <div
              className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-white text-sm font-extrabold shadow-sm transition-transform duration-200 group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
              aria-hidden="true"
            >
              W
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--color-text)]">
              Wobb<span className="text-[var(--color-primary)]">Search</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              to="/"
              className={`nav-link ${isSearch ? "nav-link-active" : ""}`}
              aria-current={isSearch ? "page" : undefined}
            >
              Search
            </Link>
            <Link
              to="/list"
              className={`nav-link ${isList ? "nav-link-active" : ""}`}
              aria-current={isList ? "page" : undefined}
            >
              My List
              {count > 0 && (
                <span className="badge-count" aria-label={`${count} selected`}>
                  {count}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
        tabIndex={-1}
      >
        {children}
      </main>

      <footer className="border-t border-[var(--color-border)] py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
          <span>© 2026 WobbSearch</span>
          <span>Influencer Discovery Platform</span>
        </div>
      </footer>
    </div>
  );
}