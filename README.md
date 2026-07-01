# WobbSearch — Influencer Discovery Platform

A modern React application for searching, exploring, and curating influencer profiles across Instagram, YouTube, and TikTok.

Built for the [Wobb Vibe Coder Assignment](https://github.com/Wobb-ai/vibe-coder-assignment).

## Submission

| | |
|---|---|
| **Live demo** | [https://wobb-ai-vibe-coder-assignment.vercel.app/](https://wobb-ai-vibe-coder-assignment.vercel.app/) |
| **Repository** | [https://github.com/alimehdikhan/-Wobb-ai-vibe-coder-assignment](https://github.com/alimehdikhan/-Wobb-ai-vibe-coder-assignment) |

Deployed on **Vercel** with SPA rewrites (`vercel.json`) so `/`, `/list`, and `/profile/:username` all work on direct navigation and refresh.

## Features

- Search and filter influencers by platform (Instagram, YouTube, TikTok)
- Search by username or full name
- Profile detail pages with extended stats
- **Add to List** — curate, reorder, remove, and persist selections across refreshes
- Responsive layout with dark mode (`prefers-color-scheme`)
- Accessible keyboard navigation and ARIA patterns

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app locally.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Production build         |
| `npm run lint`    | Run ESLint               |
| `npm run preview` | Preview production build |

## Routes

| Path | Page |
|------|------|
| `/` | Search / dashboard |
| `/profile/:username?platform=` | Profile details |
| `/list` | Curated influencer list |
| `*` | Redirects to `/` |

---

## Changes Made

### 1. Bug Fixes

| Bug | Fix |
|-----|-----|
| Disabled **Add to List** stub | Fully implemented with Zustand store |
| **YouTube search crash** — missing `username`/`fullname` | Safe filtering + username fallback (`handle` → `user_id`) in `dataHelpers.ts` |
| **Duplicate formatters** across components | Consolidated into `formatCount()` and `formatEngagementRate()` |
| **Race condition** on profile detail navigation | Cancellation flag + async `try/catch/finally` loading |
| **Infinite loading** on rejected profile chunk | Error path always clears loading state |
| **Stale detail state** when platform query changes | Remount key `platform:username` + effect deps |
| **Unprofessional document title** | Dynamic titles via `Layout` |
| **Invalid platform query param** | Runtime validation with `instagram` default |
| **`react-beautiful-dnd` React 19 crash** | Replaced with `@dnd-kit/*` |
| **Duplicate SVG gradient IDs** | Unique IDs via `useId()` in `PlatformIcon` |
| **Nested interactive elements** on profile cards | Separated `<Link>` and Add button |

### 2. State Management — Zustand

- `useSelectedProfiles` store with `persist` middleware
- `partialize` saves only the `profiles` array to `localStorage`
- Actions: `addProfile`, `removeProfile`, `reorderProfiles`, `clear`
- Duplicate prevention by `username`

### 3. UI/UX Redesign

- **Design system** — CSS tokens for colors, surfaces, shadows, typography (`index.css`)
- **Shared components** — `PageHeader`, `Layout`, `EmptyState`, consistent `.btn` / `.surface-card` patterns
- **Platform branding** — official SVG icons with badge overlays on avatars
- **Search page** — filter panel, section labels, responsive profile grid
- **Profile cards** — platform accent bar, engagement stats, mobile-friendly layout
- **Profile detail** — breadcrumb nav, stat grid, polished loading/error states
- **Selected list** — inline preview (up to 3) on search page, full list on `/list`, drag-and-drop reorder
- **Dark mode** — system preference via `prefers-color-scheme`
- **Motion** — `fadeIn` / `slideUp` animations with `prefers-reduced-motion` support

### 4. "Add to List" Feature

- Add from profile card or detail page
- Duplicate prevention (button disables, shows "Added")
- View on `/list` and inline on search page
- Remove per item + Clear all (with confirmation)
- Drag-and-drop reorder (`@dnd-kit`)
- Persists after page refresh via Zustand `persist`

### 5. Architecture & Code Quality

- Clear folder structure: `components/`, `pages/`, `store/`, `utils/`, `types/`
- Centralized `PLATFORM_META` and TypeScript interfaces
- Reusable `Avatar`, `VerifiedBadge`, `PlatformIcon`, `PageHeader`
- Profile loader with JSON chunk fallback to search summary data
- `React.memo`, `useMemo`, `useCallback`, and fine-grained Zustand selectors

### 6. Performance

- Memoized profile extraction cache per platform
- Lazy-loaded avatars
- Code-split profile JSON via `import.meta.glob`
- Main production bundle ~330 KB (~105 KB gzip)

### 7. Accessibility

- Skip-to-main-content link
- `aria-current="page"` on active nav links
- Platform tabs: `tablist` / `tab` / `tabpanel`, Arrow/Home/End keyboard nav with focus management
- `aria-live` result count, `aria-expanded` on collapsible list
- Native keyboard navigation for profile links
- `focus-visible` rings, screen-reader labels on interactive controls
- `prefers-reduced-motion` respected

### 8. Deployment

- `vercel.json` SPA rewrite rule for client-side routing
- Catch-all route redirects unknown paths to `/`
- Auto-deploy on push to `main` via Vercel + GitHub integration

---

## Libraries Added

| Library | Version | Purpose |
|---------|---------|---------|
| `zustand` | `^5.0.14` | Selected list state + `localStorage` persistence |
| `@dnd-kit/core` | `^6.3.1` | Drag-and-drop (React 19 compatible) |
| `@dnd-kit/sortable` | `^10.0.0` | Sortable list preset |
| `@dnd-kit/utilities` | `^3.2.2` | Drag transform utilities |

## Libraries Removed

| Library | Reason |
|---------|--------|
| `react-beautiful-dnd` | Deprecated; incompatible with React 19 |
| `@types/react-beautiful-dnd` | No longer needed |

---

## Assumptions

1. **Static JSON data** — no backend API; profiles loaded at build time
2. **Username as unique key** — used for routing, dedup, and list storage
3. **YouTube handles as fallback** — some search entries lack `username`; `handle` or `user_id` is used instead
4. **Not all profiles have detail JSON** — loader falls back to search summary when no detail file exists
5. **Dark mode follows OS** — no manual theme toggle
6. **Selected list is local-only** — `localStorage`, no server sync

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| **@dnd-kit** over native drag | ~15 KB extra; better a11y and mobile support |
| **Zustand persist** | Opinionated storage format; simpler than manual `localStorage` |
| **No virtualization** | Fine for 10 profiles/platform; would add complexity at scale |
| **System dark mode** | No toggle; respects OS preference |
| **No toast notifications** | Button state change provides sufficient feedback |
| **Catch-all redirect** | Unknown URLs go to `/` instead of a dedicated 404 page |

## Future Improvements

- Unit tests (Vitest + React Testing Library) and E2E (Playwright)
- Manual dark mode toggle
- Export curated list as CSV/JSON
- Search debouncing for API-backed data
- Virtual scrolling for larger datasets
- Skeleton loading placeholders
- Real API integration (React Query / SWR)

---

## Project Structure

```
src/
├── assets/data/           # Static JSON (search + profile details)
├── components/
│   ├── Avatar.tsx
│   ├── EmptyState.tsx
│   ├── Layout.tsx         # App shell, skip link, nav
│   ├── PageHeader.tsx     # Shared page heading
│   ├── PlatformFilter.tsx # Platform tabs + search
│   ├── PlatformIcon.tsx   # Accessible platform SVGs
│   ├── ProfileCard.tsx
│   ├── ProfileList.tsx
│   ├── SelectedList.tsx   # Drag-and-drop curation list
│   └── VerifiedBadge.tsx
├── pages/
│   ├── SearchPage.tsx     # /
│   ├── ProfileDetailPage.tsx  # /profile/:username
│   └── SelectedListPage.tsx   # /list
├── store/
│   └── selectedProfiles.ts    # Zustand + persist
├── types/
│   └── index.ts
├── utils/
│   ├── dataHelpers.ts
│   ├── formatters.ts
│   └── profileLoader.ts
├── App.tsx
├── main.tsx
└── index.css              # Design tokens + utilities
vercel.json                # SPA routing for deployment
```