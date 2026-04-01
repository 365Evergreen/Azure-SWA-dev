# Copilot Instructions — 365 Evergreen React App

## Overview

SPA built with React 19 + TypeScript 5.9 + Vite 7. Deployed to Azure Static Web Apps.

- **Entry:** `src/App.tsx` — router setup (React Router v7) and top-level layout
- **UI library:** Fluent UI React Components v9 (`@fluentui/react-components`), wrapped in `<FluentProvider>`
- **Animation:** Framer Motion v11 — use presets from `src/components/motionPresets.ts`; wrap animated lists in `<AnimatePresence>`
- **No global state libraries** — use local `useState` and prop-drilling; custom hooks in `src/lib/` for data

## Commands

```bash
pnpm dev          # Vite dev server with HMR
pnpm build        # tsc -b && vite build (mirrors CI)
pnpm preview      # Preview production build locally
pnpm lint         # ESLint (flat config v9)
tsc -b            # Type-check only, no emit
```

Run `pnpm build` (not just `pnpm dev`) to surface TypeScript errors that HMR can hide.

## Architecture

### Component conventions
- Each component lives in its own subdirectory: `src/components/MyName/MyName.tsx` with co-located styles `src/components/MyName/MyName.module.css`
- **No inline styles, no global side-effect CSS** — CSS Modules only
- CSS custom properties (defined in `src/index.css` under `:root`) are used for colors: `--themePrimary`, `--neutralPrimary`, `--themeSecondary`, etc.
- Fluent UI typography classes (`fluent-body1`, `fluent-title2`, etc.) are defined globally in `src/index.css` — prefer these over ad-hoc font sizing
- `src/fluent-theme.ts` exists as the theme customization point but is currently empty; add Fluent UI token overrides there

### Route-level code splitting
Heavy page components are loaded with `React.lazy()` in `App.tsx`. Follow this pattern for any new full-page route:
```tsx
const MyPage = lazy(() => import('./components/MyPage/MyPage'));
// then inside Routes:
<Route path="/my-page" element={<Suspense fallback={<RouteLoader />}><MyPage /></Suspense>} />
```

### Data fetching layers (three sources)

**1. WPGraphQL** (`https://365evergreendev.com/graphql`)
Custom hooks in `src/lib/` POST queries and map results. Raw API shapes use `Raw*` prefix interfaces; map to clean UI types inside the hook before returning.
Reference: `src/lib/useSiteFeatures.ts`, `src/lib/usePageBySlug.ts`

**2. Azure Blob Storage** (`https://365evergreendev.blob.core.windows.net/365evergreen/`)
Hooks must handle three response shapes — the blob may return an array, a `{ body: [...] }` wrapper, or a single object:
```ts
if (Array.isArray(data)) setData(data);
else if (data.body && Array.isArray(data.body)) setData(data.body);
else setData([data]);
```
Reference: `src/lib/useAllAzureAccordions.ts`, `src/lib/useFeatureButtons.ts`

**3. Local JSON fixtures** (root-level files)
`page-components.json`, `feature-buttons.json`, `carousel-items.json`, `CTAJourneyQuestions.json`, `CTAJourneyChoices.json` are used as dev fallbacks and for local preview. Update these when adding new CMS-driven content so reviewers can preview without a live backend.

### Accessibility patterns
Mirror patterns from `src/components/DynamicAccordion/` and `src/components/FloatingDrawer/`:
- Keyboard: `onKeyDown` checking `e.key === 'Enter' || e.key === ' '`
- ARIA: `role="button"`, `aria-expanded`, `aria-label` on interactive non-button elements

## Key files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Router, layout, lazy imports |
| `src/index.css` | CSS custom properties (color palette, typography scale) |
| `src/components/motionPresets.ts` | Framer Motion variants (`fadeVariants`, etc.) |
| `src/lib/useAllAzureAccordions.ts` | Blob fetch with tolerant payload parsing |
| `src/lib/useSiteFeatures.ts` | WPGraphQL fetch + `Raw*` mapping pattern |
| `src/components/CopilotChat/CopilotChat.tsx` | AI integration example |
| `page-components.json` | Hero, pages, resources content fixture |
| `staticwebapp.config.json` | Azure SWA routing (SPA fallback to `index.html`) |

## Validation & PRs

There are no automated unit tests. Validate manually with `pnpm dev`.

Before opening a PR:
1. `pnpm lint` — must pass
2. `pnpm build` — must pass (this is what CI runs)
3. Update root JSON fixtures if new content-driven components were added
4. Document integration changes under `docs/`