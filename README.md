# VV Work

VV Work is a job-matching platform for workers and employers in Europe. This repository is a frontend test assignment: a public homepage, a dynamic partner/employer page with a searchable, filterable vacancy list, and a contacts page with an application form.

## Stack

Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 + React Router + Vitest + Testing Library + ESLint + Prettier.

No UI kit, no Redux/Zustand — state management is explained below.

## Getting started

```bash
npm install
npm run dev         # local dev server
npm run build        # production build
npm run preview      # preview production build
npm run test         # unit tests (Vitest)
npm run test -- --coverage
npm run lint
npm run typecheck
npm run format
```

## Architecture

```
src/
  app/            # RouterProvider, route definitions, lazy-loaded pages
  api/            # mock API layer: client.ts (mockFetch), partners.ts, vacancies.ts, types.ts
  data/           # local JSON "backend": partners.json, vacancies.json, categories.json
  hooks/          # useAsyncResource (status/data/error/retry), useDebouncedValue
  components/
    layout/       # Header, Footer, PageLayout, Container
    ui/           # Button, Skeleton, ErrorState, EmptyState — shared primitives
    vacancies/    # VacancyFilters, VacancySearchInput, VacancyList, VacancyCard
  pages/          # HomePage, PartnerPage, ContactsPage, NotFoundPage
  lib/            # pure helper functions (format.ts, validation.ts)
```

There is no backend: `api/client.ts` exposes a single `mockFetch(loader, opts)` wrapper that simulates a real network call — random 300–800ms latency, a ~1-in-5 chance of a 500 error, and `AbortSignal` support — around synchronous reads of the local JSON files in `data/`. `getPartnerBySlug`, `getPartners`, and `getVacancies` are the only functions that touch that layer.

## My decisions

1. **State management without Redux/Zustand** — three levels (local `useState` → `useSearchParams` → `useAsyncResource`), because nothing needs to survive navigation or be shared between unrelated components — a global store would only add indirection.
2. **Filters live in the URL, not in component state** — shareable links, works with back/forward; `VacancyFilters` is the only writer to `useSearchParams`, `PartnerPage` only reads.
3. **Fighting unnecessary re-renders** — the search input writes to the URL instantly (cheap), while the expensive filtering/list render runs off a debounced value + `useMemo` + `memo` on the cards; verified in the Profiler.
4. **Own `mockFetch` instead of MSW** — explicitly required by the brief; randomness is injected as a parameter, which is what makes the tests deterministic.
5. **Partner hero and vacancy list are two independent resources** — so a slow/broken vacancy fetch doesn't block the header, and vice versa; if the partner isn't found (404), the vacancies section isn't rendered at all.
6. **Category grid is derived from vacancy data, not a separate partner field** — the homepage used to carry its own `Partner.primaryCategorySlug`, a second source of truth that could drift from the vacancies' own `categorySlug`; it's gone, and `HomePage` now builds a `categorySlug → Partner[]` map straight from each partner's vacancies. A category tile lists every partner with a matching vacancy instead of picking one winner, so two partners sharing a category no longer silently overwrite each other.
7. **Category filters on the partner page only offer categories that partner actually has** — showing all seven categories regardless of the partner's own vacancies means most pills would deterministically return "No vacancies match your filters"; `PartnerPage` intersects the category list with the partner's vacancy categories before handing it to `VacancyFilters`.

## Testing

Unit tests (Vitest + Testing Library) cover the logic the brief calls out specifically: `mockFetch`'s latency/error/abort behavior, `useAsyncResource`'s status transitions and cancellation-on-unmount, `useDebouncedValue`'s collapsing of rapid updates, and the vacancy filtering/search flow end-to-end on `PartnerPage`. `hooks/`, `lib/`, and `api/` each stay well above the brief's 60% statement/branch coverage bar — run `npm run test -- --coverage` to see the current numbers.
