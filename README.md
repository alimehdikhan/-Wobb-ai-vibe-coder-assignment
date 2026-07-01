# WobbSearch — Influencer Discovery Platform

A modern React application for searching, exploring, and curating influencer profiles across Instagram, YouTube, and TikTok.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start development server |
| `npm run build`  | Production build         |
| `npm run lint`   | Run ESLint               |
| `npm run preview`| Preview production build |

---

## Changes Made

### 1. Bug Fixes

| Bug | Fix |
|-----|-----|
| **`react-beautiful-dnd` incompatible with React 19** — uses deprecated `findDOMNode`, crashes on drag operations | Replaced with `@dnd-kit/core` + `@dnd-kit/sortable` (actively maintained, React 19 compatible) |
| **Duplicate formatter functions** — `formatFollowersLocal` in ProfileCard, `formatFollowersDetail` in ProfileDetailPage, inline formatting in SelectedList | Consolidated into single `formatCount()` in `utils/formatters.ts` |
| **Race condition in ProfileDetailPage** — no cleanup on unmount could set state after navigation | Added cancellation flag in useEffect cleanup |
| **Unprofessional `<title>`** — was "assignment" | Changed to "WobbSearch — Influencer Discovery Platform" |
| **Missing meta description** | Added SEO meta tags |
| **Platform param not validated** — any string accepted | Added runtime validation defaulting to "instagram" |
| **YouTube search filtering crash** — typing query when viewing YouTube tab crashed React | Safely wrapped username and fullname in filter helper to handle missing fields |

### 2. State Management — Zustand

Replaced the manual localStorage persistence pattern with Zustand's built-in `persist` middleware:
- **Before**: Manual `localStorage.getItem/setItem` calls in every action
- **After**: `persist()` middleware handles serialization, deserialization, and error recovery automatically
- Added `toggleProfile` action and `isSelected` helper

### 3. UI/UX Redesign

- **Official Platform SVGs**: Integrated official platform SVG brand assets for Instagram (radial gradient camera), YouTube (red-white play button), and TikTok (offset cyan/magenta note).
- **Platform Badges**: Added small platform SVG badge overlays on avatars across the search page grid, detail page header, and curation list.
- **Typography**: Inter font from Google Fonts for a modern, professional feel
- **Layout**: Glassmorphism header with `backdrop-blur`, responsive navigation with active states, footer
- **Search Page**: Hero section with gradient heading, 2-column responsive grid for profile cards
- **Profile Cards**: Platform accent bars, engagement rate display, responsive stat layout, image error fallback
- **Profile Detail**: Staggered stat card animations, proper platform badge
- **Dark Mode**: Full dark mode support via `prefers-color-scheme`
- **Animations**: `fadeIn`, `slideUp` keyframes, staggered animation delays
- **Empty States**: Reusable `EmptyState` component with icon, title, description, and action

### 4. "Add to List" Feature — Full Implementation

- **Add profiles**: Click "Add to List" on any profile card or detail page
- **Duplicate prevention**: Button disables and shows checkmark when already added
- **View selected list**: Dedicated `/list` route + inline preview on search page
- **Remove profiles**: Delete button on each item in the selected list
- **Reorder profiles**: Drag-and-drop with `@dnd-kit` (keyboard accessible)
- **Persistence**: Zustand `persist` middleware automatically saves to `localStorage`
- **Navigation**: "My List" nav link with live count badge

### 5. Architecture Refactoring

- **Centralized types**: `PLATFORM_VALUES`, `PLATFORM_META` in `types/index.ts` — single source of truth for platform labels, icons, and gradient colors
- **Shared formatters**: `formatCount()`, `formatFollowers()`, `formatEngagementRate()` — no more duplicated formatting logic
- **Reusable components**: `Avatar` (with error fallback), `EmptyState`, `VerifiedBadge` (proper SVG)
- **Removed dead code**: Unused `onProfileClick` prop drilling, duplicate platform config objects
- **Extracted helpers**: `buildStats()` in ProfileDetailPage for cleaner rendering logic

### 6. Performance Optimizations

- **`React.memo`**: Applied to `ProfileCard`, `ProfileList`, `PlatformFilter`, `VerifiedBadge`, `Avatar` — prevents re-renders when Zustand store updates
- **`useMemo`**: Memoized `extractProfiles()` and `filterProfiles()` in SearchPage
- **`useCallback`**: Stable references for event handlers passed as props
- **Zustand selectors**: Fine-grained selectors like `(s) => s.profiles.length` for count-only subscriptions
- **Image lazy loading**: `loading="lazy"` on all profile images
- **Data memoization**: `extractProfiles()` caches results by platform to avoid re-mapping
- **Bundle size**: Reduced main JS bundle from 376KB → 323KB by removing `react-beautiful-dnd` dependency tree

### 7. Accessibility

- ARIA `role="tablist"` / `role="tab"` / `aria-selected` on platform filters
- `aria-label` on all interactive elements
- `aria-live="polite"` on dynamic result count
- `aria-expanded` / `aria-controls` on collapsible selected list
- Keyboard navigation: `Enter`/`Space` on profile cards
- `focus-visible` ring styling
- Screen-reader friendly verified badge with `role="img"` and `aria-label`

---

## Libraries Added

| Library | Version | Justification |
|---------|---------|--------------|
| `@dnd-kit/core` | latest | Modern drag-and-drop — React 19 compatible, replaces broken `react-beautiful-dnd` |
| `@dnd-kit/sortable` | latest | Sortable preset for list reordering |
| `@dnd-kit/utilities` | latest | CSS transform utilities for smooth drag animations |

## Libraries Removed

| Library | Reason |
|---------|--------|
| `react-beautiful-dnd` | Deprecated, incompatible with React 19 (uses `findDOMNode`) |
| `@types/react-beautiful-dnd` | No longer needed |

---

## Assumptions

1. **Data is static JSON** — no API calls needed; data is imported at build time and code-split per profile
2. **Dark mode follows system preference** — uses `prefers-color-scheme` media query (no manual toggle)
3. **Username is a unique identifier** — used as the key for duplicate detection in the selected list
4. **Profile images may fail** — external CDN URLs in sample data may expire; Avatar component handles this with initial fallback
5. **Selected list is local-only** — persisted to `localStorage`, no backend sync needed

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| **@dnd-kit over native HTML drag** | Adds ~15KB but provides keyboard accessibility, mobile support, and smooth animations |
| **Zustand persist middleware** | Slightly opinionated storage format vs full control, but handles edge cases (SSR, errors) automatically |
| **Grid layout over virtualized list** | With only 10 profiles per platform, virtualization would add complexity without benefit |
| **System dark mode** | Simpler than a manual toggle; users who want dark mode already have it configured in OS |
| **No toast notifications** | Kept the UI clean; button state change (Add → ✓ Added) provides sufficient feedback |

## Future Improvements

- **Virtual scrolling** — if data scales beyond 10 profiles per platform, use `@tanstack/virtual` for performance
- **Search debouncing** — add debounce for API-backed search to reduce request frequency
- **Manual dark mode toggle** — allow users to override system preference
- **Export list** — CSV/JSON export of the curated influencer list
- **Comparison view** — side-by-side comparison of selected influencers
- **Toast notifications** — subtle feedback for add/remove actions
- **Testing** — unit tests with Vitest + React Testing Library, E2E with Playwright
- **Deployment** — Vercel/Netlify with automatic CI/CD
- **Skeleton loading** — shimmer placeholders while profile data loads (CSS is already in place)
- **API integration** — replace static JSON with real API calls and proper caching (React Query / SWR)

---

## Project Structure

```
src/
├── assets/data/          # Static JSON data (search results + profiles)
├── components/
│   ├── Avatar.tsx        # Reusable avatar with error fallback
│   ├── EmptyState.tsx    # Reusable zero-state component
│   ├── Layout.tsx        # App shell with header, nav, footer
│   ├── PlatformFilter.tsx # Platform tabs + search input
│   ├── ProfileCard.tsx   # Individual profile card
│   ├── ProfileList.tsx   # Grid of profile cards
│   ├── SelectedList.tsx  # Drag-and-drop selected profiles list
│   └── VerifiedBadge.tsx # Verified account badge
├── pages/
│   ├── ProfileDetailPage.tsx  # /profile/:username
│   ├── SearchPage.tsx         # / (home)
│   └── SelectedListPage.tsx   # /list
├── store/
│   └── selectedProfiles.ts    # Zustand store with persist
├── types/
│   └── index.ts               # TypeScript types + platform metadata
├── utils/
│   ├── dataHelpers.ts         # Data extraction + filtering
│   ├── formatters.ts          # Number formatting utilities
│   └── profileLoader.ts      # Dynamic profile JSON loader
├── App.tsx                    # Router setup
├── main.tsx                   # Entry point
└── index.css                  # Design system + animations
```
