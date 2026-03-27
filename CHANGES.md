# BOCRA Frontend — Recent Changes Log

## Session: 27 March 2026

---

### 1. Portal Apply Page — `app/(portal)/apply/page.tsx` *(NEW)*

**Problem**: Clicking "Register Domain" or "Apply for a Licence" inside the portal redirected users to the public-facing `/apply-for-license` page (complete with Navbar/Footer), breaking the portal experience.

**Fix**: Created a new portal-native apply page at `/apply` that:
- Lives inside the authenticated portal layout (sidebar, no public Navbar/Footer)
- Supports `?type=domain` query param to pre-filter to domain-applicable licence types
- Has the same 3-step flow: type selection grid → form → success view with reference number
- Success CTA navigates to `/applications` (stays in portal)
- Full dark mode support
- Wraps `useSearchParams` in `<Suspense>` to satisfy Next.js static generation requirements

**Buttons updated**:
- `app/(portal)/domains/page.tsx` — "Register Domain" → `/apply?type=domain` (×2: header button + empty state CTA)
- `app/(portal)/licenses/page.tsx` — "Apply for a Licence" → `/apply`

---

### 2. Merge Conflict Resolution — `app/page.tsx` (Home Page)

**Context**: Local branch and `origin/main` diverged. Remote had polished card-style UI; local had live API data integration.

**3 conflicts resolved**:

| Conflict | Local (HEAD) | Remote (origin/main) | Resolution |
|---|---|---|---|
| State setup | Dynamic `useState`/`useEffect` for news + tenders | Static hardcoded `newsAndEvents[]` array | **Kept local's API state** + adopted remote's `tagColors` + `documentsAndLegislation` static data for the Documents panel |
| News section rendering | Old 2-column layout with plain `<ol>` list | New 3-column grid with styled hover cards | **Used remote's card UI** but populated from live API data (`news.map(item => ...)`) with `published_at` date and `category_display` badge |
| Closing tag | Misplaced `</main>` + extra Link element | Correct `</div>` | **Used remote's `</div>`** (structurally correct); the file-complaint Link already present from a prior edit |

**Net result**: The home page now shows the polished 3-column card layout (News & Events, Documents & Legislation, Apply for a Licence) with **live news data from the API** instead of hardcoded strings.

**Also dropped** unused imports `getTenders` and `TenderListItem` from the home page (tenders section removed from homepage grid in favour of the dedicated `/tenders` route).

---

### 3. Merge Conflict Resolution — `app/news-and-events/page.tsx`

**Context**: Remote had added a full static news archive page at `/news-and-events`. Local had replaced this with a redirect to `/news` (which is the canonical dynamic news page connected to the API).

**Resolution**: Kept the redirect (HEAD version). Rationale:
- `/news` already shows live API news with pagination
- Duplicating news content at `/news-and-events` with hardcoded data would go stale
- Both URLs work: `/news-and-events` silently redirects to `/news`

---

### Build Status

```
✓ 41 routes compiled, zero TypeScript errors
✓ All portal routes intact: /apply, /dashboard, /licenses, /domains, /complaints, /alerts
✓ All public routes intact: /, /news, /news-and-events, /tenders, /cybersecurity
```
