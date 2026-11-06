# Farmacare

Offline-first livestock and poultry PWA for Kenyan farmers: animal records and history, birth and hatch planning, breed and genetics education, feeding, health, myths and facts, and weather-aware advice.

Built to match the `sisi-proj` stack: **React 19, TypeScript, Vite, React Router 7, Tailwind CSS v4**. No backend is needed for this MVP. Records live in the browser (`localStorage`).

## Run it

```bash
npm install
npm run dev          # development (service worker is off in dev)
npm run pwa          # production build + preview, to test install and offline
npm run test:logic   # unit checks for dates, pedigree, reminders, store
```

Offline test: run `npm run pwa`, open the app once online, then switch the browser to offline (DevTools, Network, Offline) and reload.

Deploying: any static host. `public/_redirects` (Netlify) and `vercel.json` already send deep links to `index.html`. Serve over HTTPS so the service worker and install prompt work.

## What is in the MVP

The proposal's Appendix A7 list, implemented as routes:

| MVP item | Route |
| --- | --- |
| Home / Dashboard | `/` |
| Animal Register, Add, Edit | `/animals`, `/animals/new`, `/animals/:id/edit` |
| Animal Profile (Overview, History, Health, Breeding, Growth and production tabs) | `/animals/:id?tab=` |
| Breeding and Lifecycle Calculator | `/calculator` |
| Breed Library, Detail, Compare, Matcher | `/breeds`, `/breeds/:id` |
| Genetics and GMO Education, status checker | `/genetics` |
| Feeding and Nutrition | `/feeding` |
| Health and Preventive Care (prevention, warning signs, welfare, food safety) | `/health` |
| Myths and Facts + detail | `/myths`, `/myths/:id` |
| Location and Weather | `/weather` |
| Saved Guides and Offline Status | `/saved` |
| Settings, Sources, Privacy | `/settings`, `/sources` |
| Also: Learn hub, More, Glossary | `/learn`, `/more`, `/glossary` |

Not built (by design, per the proposal): accounts and login (pages 4 to 6, 54), admin (60 to 65), map (45), push notifications, species directory pages (26, 27), a calendar view (25), historic rainfall and real soil data (44, 46).

## What it does beyond CRUD

- **Estimated, never invented.** Due dates carry an "Estimate" label. Unknown source, parentage and genetic status stay "unknown". Farmer observations are distinguished from professional assessments.
- **Pedigree check.** Warns about parent-offspring, full-sibling and half-sibling matings, and about inbred parentage, using only recorded sire and dam tags.
- **Reminders engine** (`src/lib/schedule.ts`, `advisories.ts`): expected births, pregnancy-check, dry-off and pen-prep milestones, vaccination follow-ups, milk/meat/egg withdrawal periods, overdue births, records needing verification, plus season and weather advice.
- **Record quality score** per animal.
- **Feeding guides matched to each animal** by age, sex, pregnancy and lactation.
- **Breed matcher** gives reasons by goal, climate, feed and management. It is not a ranking.
- **Weather:** Open-Meteo forecast, cached for offline use, with heat, rain and cold advice for the species you keep.
- **Backup and export:** JSON backup and restore, CSV export, delete-all.

## Structure

```
src/
  types.ts            data model (Animal, AnimalEvent, Farm, Db)
  lib/                store (localStorage), dates, lifecycle, relations, quality, schedule, advisories, weather, hooks
  data/               species, breeds, feeding, health, genetics, myths, glossary, counties, sources, sample
  components/         Layout (bottom nav on mobile, sidebar on desktop), ui kit, EventForm, AdvisoryList
  pages/              one file per screen
public/               manifest, service worker (sw.js), icons
tests/selftest.ts     logic tests
```

## Design

The ear tag is the signature element: every animal ID is shown as a yellow tag with a punched hole. Palette comes from the farm: Napier green, tag yellow, murram red, rift blue, chalk and humus. Type is Bricolage Grotesque (headings) and Figtree (text), bundled via Fontsource so they work offline. Touch targets are at least 44px, focus rings are visible, and reduced motion is respected.

## Important: content status

All guidance is **Draft 0.1, pending review by a qualified veterinarian and animal nutritionist.** This is shown in the app on every guide. The app gives no drug doses or exact rations. Breed figures are indicative. Before a public pilot, have professionals review `src/data/*`, replace organisation-level sources with specific citations, and add reviewer names and dates (the `CONTENT_STATUS` object and the `ReviewBadge` are the hooks).

## Path to the production architecture

The data model maps directly to Django REST models (`Animal`, `AnimalEvent`, `Farm`). To add sync: give each record a `serverId` and `updatedAt`, keep a queue of pending changes in `lib/store.ts`, and replace the "no sync queue" notice on `/saved`. Add authentication before storing data server-side, and review handling against Kenya's Data Protection Act, 2019.

## Service worker notes

`public/sw.js` caches the app shell and assets at runtime (network first for pages, cache first with background refresh for assets). Bump `VERSION` in that file on each release to clear old caches. Cross-origin requests (weather) are never cached by the worker. The app itself stores the last forecast.
