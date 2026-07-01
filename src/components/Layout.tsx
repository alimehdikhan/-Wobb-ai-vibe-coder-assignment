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

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-gray-950 flex flex-col">
      {/* ── Header — glassmorphism + tonal layering ──── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="WobbSearch home">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white text-sm font-extrabold shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
              W
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Wobb<span className="text-purple-600 dark:text-purple-400">Search</span>
            </span>
          </Link>

          {/* Nav — pill-shaped links */}
          <nav className="flex items-center gap-1.5" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-4 py-1.5 rounded-full text-[14px] font-semibold tracking-wide transition-all duration-200 ${
                location.pathname === "/"
                  ? "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
              }`}
            >
              Search
            </Link>
            <Link
              to="/list"
              className={`px-4 py-1.5 rounded-full text-[14px] font-semibold tracking-wide transition-all duration-200 inline-flex items-center gap-2 ${
                location.pathname === "/list"
                  ? "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
              }`}
            >
              My List
              {count > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-purple-600 rounded-full leading-none">
                  {count}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main — max-width container ──────────────── */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-8 py-10">
        {children}
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 py-6 bg-white/50 dark:bg-gray-950/50">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex items-center justify-between text-[12px] text-gray-400 dark:text-gray-600">
          <span>© 2026 WobbSearch</span>
          <span className="hidden sm:inline">Influencer Discovery Platform</span>
        </div>
      </footer>
    </div>
  );
}
