# Performance: Initial Load & API Call Strategy

## Problem Statement

The app suffers from slow initial render because too many API calls are fired simultaneously the moment the page loads. Every component that uses a data-fetching hook calls its GraphQL or Blob Storage endpoint on mount, regardless of whether it is visible or has been interacted with. This creates a waterfall of parallel network requests that compete for bandwidth, delay Time to Interactive (TTI), and cause visible layout shifts as sections render asynchronously one by one.

---

## Causes

### 1. Eagerly-mounted home-page sections each own their own fetch

All four home-page sections are rendered unconditionally on the `/` route and each one triggers its own network request at mount time:

| Component | Hook | Endpoint |
|---|---|---|
| `Pillars` | `usePillars(3)` | GraphQL `featurePages` |
| `Features` | *(internal hook)* | GraphQL |
| `LatestPosts` | `useLatestPosts(limit)` | GraphQL `allPosts` |
| `ContactForm` | *(none at mount)* | Power Automate (submit only) |

Because these components are all rendered in the same `AnimatePresence` tree, React mounts them in one pass and all four fetches fire at once on the very first paint.

### 2. `prefetchLatestPosts` and `prefetchPillars` are called unconditionally in `App` on every mount

```ts
// App.tsx – fires immediately for every visitor on every page
useEffect(() => {
  prefetchPillars(4).catch(() => {});
  prefetchLatestPosts(6).catch(() => {});
}, []);
```

These calls run regardless of which route the user lands on. A visitor going directly to `/post/:slug` still triggers both home-page prefetches, wasting bandwidth.

### 3. `PageView` fires multiple sequential fallback queries

`PageView` uses `usePageBySlug`, which tries four different query strategies in sequence:
1. `e365pageQuery` → 2. `pageByUri` → 3. `pages` (full list scan) → 4. REST fallback

Each failure cascades into the next, meaning a single navigation can produce 3–4 serial round-trips before content appears.

### 4. No shared cache or deduplication across hooks

Each hook manages its own `useState` + `useEffect` fetch. If two components on the same page call `useLatestPosts`, two identical network requests are made. There is no query-level deduplication or cache layer (e.g., React Query / SWR).

### 5. `HowWeDoItStatic` is imported eagerly

```ts
// App.tsx – not lazy-loaded
import HowWeDoItStatic from './components/HowWeDoIt/HowWeDoItStatic';
```

Unlike every other route-level component, `HowWeDoItStatic` is eagerly bundled and evaluated, increasing the initial JS parse cost.

---

## Effects

- **Slow Time to First Contentful Paint (FCP):** The browser must wait for multiple GraphQL responses before above-the-fold content is hydrated.
- **Visible cumulative layout shift (CLS):** Sections that depend on async data render empty shells first, then reflow when data arrives.
- **Wasted bandwidth on non-home routes:** Prefetch calls for `Pillars` and `LatestPosts` run even when the user never visits the home page.
- **Request queue congestion:** 4–6 parallel GraphQL POSTs on first load compete with CSS, fonts, and JS chunks, pushing critical resources further back in the network queue.
- **Poor experience on slow connections:** Without a loading hierarchy, the entire page appears broken until all fetches resolve.

---

## Solution

### Principle: Fetch only what is needed for the initial paint; defer everything else until interaction or visibility.

### 1. Restrict home-page prefetches to the `/` route

Only prefetch `Pillars` and `LatestPosts` when the user is actually on the home page.

```ts
// App.tsx
import { useLocation } from 'react-router-dom';

useEffect(() => {
  if (location.pathname === '/') {
    prefetchPillars(4).catch(() => {});
    prefetchLatestPosts(6).catch(() => {});
  }
}, [location.pathname]);
```

### 2. Lazy-load below-the-fold home-page sections with Intersection Observer

`Features`, `LatestPosts`, and `ContactForm` are below the fold. Defer their data fetches until the user scrolls them into view.

```tsx
// Example: wrap a section with a visibility sentinel
const [inView, setInView] = useState(false);
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) setInView(true);
  }, { rootMargin: '200px' });
  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);

return <div ref={ref}>{inView && <LatestPosts />}</div>;
```

This means only `Hero` and `Pillars` fetch on initial paint; everything else fetches on scroll.

### 3. Fetch only what `Hero` and `Pillars` need at load time

The minimum viable initial queries are:

| Data | Limit | Justification |
|---|---|---|
| `featurePages` (Pillars) | 4 | Above the fold, visible immediately |
| *(Hero is static/prop-driven — no fetch)* | — | — |

All other queries (`allPosts`, `Features`, `ContactForm`) should only run after the user scrolls to or interacts with those sections.

### 4. Introduce a shared query cache

Replace individual `useState` + `useEffect` fetch patterns with a lightweight shared cache. Either:

- **React Query (`@tanstack/react-query`)** — recommended; provides deduplication, background refetch, stale-while-revalidate, and built-in loading/error states.
- **SWR** — simpler alternative with the same deduplication benefits.

With React Query, two components calling `useLatestPosts` with the same key will share a single in-flight request and the same cached result.

```ts
// Example migration of useLatestPosts
import { useQuery } from '@tanstack/react-query';

export function useLatestPosts(limit: number) {
  return useQuery({
    queryKey: ['latestPosts', limit],
    queryFn: () => fetchLatestPosts(limit),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}
```

### 5. Fix `PageView` sequential fallback queries

Consolidate the four fallback strategies into a single smarter query that tries the most-likely match first and only falls back if the slug genuinely doesn't resolve. Avoid full `pages` list scans on every navigation; instead cache the slug→ID mapping after the first miss.

### 6. Lazy-load `HowWeDoItStatic`

```ts
// App.tsx – change to lazy
const HowWeDoItStatic = lazy(() => import('./components/HowWeDoIt/HowWeDoItStatic'));
```

### 7. Interaction-only queries (already correct — preserve this pattern)

The following correctly fire only on user interaction and should remain unchanged:

- `ContactForm` — POST fires on form submit only.
- `CopilotChat` — only mounts when `chatOpen === true`.
- `FloatingDrawer` / `JourneySurvey` — only mounts when `drawerOpen === true`.
- All lazy route components — only mount when the user navigates to that route.

---

## Priority Order

| Priority | Change | Impact |
|---|---|---|
| 🔴 High | Gate `prefetchPillars`/`prefetchLatestPosts` to `/` route only | Eliminates wasted fetches on all non-home routes |
| 🔴 High | Defer `LatestPosts`, `Features`, `ContactForm` until in-view | Reduces initial GraphQL calls from ~4 to 1 |
| 🟠 Medium | Introduce React Query for shared cache & deduplication | Eliminates duplicate requests; simplifies all hooks |
| 🟠 Medium | Fix `PageView` fallback query cascade | Reduces per-navigation round-trips from up to 4 → 1 |
| 🟡 Low | Lazy-load `HowWeDoItStatic` | Minor JS parse saving for non-home-page routes |

---

## Related Files

- `src/App.tsx` — prefetch calls, eager imports, route structure
- `src/lib/useLatestPosts.ts` — prefetch helpers and hook
- `src/lib/usePillars.ts` — prefetch helper and hook
- `src/lib/usePageBySlug.ts` — multi-fallback query chain
- `src/components/LatestPosts/LatestPosts.tsx` — below-fold section, auto-fetches on mount
- `src/components/Features/Features.tsx` — below-fold section
- `src/components/PageView/PageView.tsx` — multi-query resolver
