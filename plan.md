# Plan: Align the frontend with the backend API contract

## Context

The frontend and backend were built in parallel. The backend is documented in
[backend/Swiftly_Backend_Documentation.md](backend/Swiftly_Backend_Documentation.md)
and its exact response shapes are locked in
[docs/api-contract.md](docs/api-contract.md). This document audits whether the
frontend's data expectations line up with that contract, and lays out — in plain
language — what to change on the frontend so the two can be wired together.

**Direction:** the api-contract is locked (changes need a joint PR), so this plan
**adapts the frontend to the backend**. 

**The headline finding:** the frontend currently makes **no live API calls at
all**. A search for `fetch` / `axios` across `frontend/` returns nothing. Every
screen reads from hardcoded mock data ([src/data/alerts.js](frontend/src/data/alerts.js),
[src/data/weekAhead.js](frontend/src/data/weekAhead.js)) held in local state
([src/context/AlertsContext.js](frontend/src/context/AlertsContext.js)). So the
comparison below is between the **shapes and vocabulary the frontend assumes** and
the **contract the backend actually serves**. Wiring them together is not just
"add fetch" — several field names, value vocabularies, and one whole concept
(routes) don't match yet.

---

## What's OK (already aligned)

- **The transport is ready.** [app.config.js](frontend/app.config.js) already
  reads `API_BASE_URL` into `extra.apiBaseUrl`, so the base URL plumbing exists.
- **One clean seam for data.** `AlertsContext` is already the single source of
  truth for alerts — every screen reads through `useAlerts()`. Swapping mock data
  for live fetches happens in **one file**, not scattered everywhere.
- **Broadcast ↔ Route Radio is a near-perfect conceptual match.**
  [RouteRadioScreen.js](frontend/src/screens/driver/RouteRadioScreen.js) reads a
  hardcoded string into `expo-speech`. The backend's
  `POST /routes/{id}/broadcast` returns `{ script_text, generated_at }` — feed
  `script_text` straight into `Speech.speak()`. Only needs a `route_id`.
- **List / detail structure matches.** `AlertsScreen` (a list) → `IncidentDetail`
  (one item) maps cleanly onto `GET /routes/{id}/disruptions` (a `DisruptionOut[]`)
  → one `DisruptionOut`.
- **The write path exists on both sides.** The passenger
  [ReportIncidentScreen](frontend/src/screens/passenger/ReportIncidentScreen.js)
  ↔ `POST /routes/{id}/reports`, and the emergency
  [Verify](frontend/src/screens/emergency/VerifyIncidentScreen.js) /
  [Update](frontend/src/screens/emergency/UpdateIncidentScreen.js) actions ↔
  `POST /disruptions/{id}/updates`. The concepts line up; the fields don't (below).

---

## What's NOT OK (mismatches)

### A. Severity vocabulary differs
- **Frontend:** `disrupted | caution | clear` (drives `SEVERITY_CONFIG` and the
  theme's `severity` colour map).
- **Backend:** `low | medium | high`.
- Also, frontend `clear` isn't a severity in the backend — the backend expresses
  "resolved" as a **status** (`cleared`), not a severity.
- **Impact:** every severity badge and colour would mis-key against live data.

### B. Status vocabulary differs — and "Rejected" has no backend home
- **Frontend:** `Verified | Unverified | Rejected`.
- **Backend:** `reported | confirmed | cleared`.
- `reported`→Unverified and `confirmed`→Verified map fine. But the emergency
  **Reject** action (`AlertsContext.verifyAlert(..., {verified:false})`) has **no
  corresponding backend state** — the status enum can't represent a rejected report.

### C. The frontend has no concept of "routes" (biggest gap)
- The backend is **entirely route-scoped**: `GET /routes`, then everything hangs
  off `/routes/{route_id}/...`.
- The frontend never calls `GET /routes`, holds no `route_id`, and shows a **flat
  global alert list**. Its mock alerts even reference places off the two seeded
  routes (Dublin M50, N7 Naas) that the backend (`cork-killarney`,
  `cork-carrigaline`) doesn't cover.
- **Impact:** none of the route-scoped reads can be called until a route is
  selected and its id threaded through.

### D. Reports send free-text location, backend needs a `segment_id`
- [ReportIncidentScreen](frontend/src/screens/passenger/ReportIncidentScreen.js)
  uses a hardcoded free-text `CURRENT_LOCATION` ("M50 Northbound, near J6") and
  `handleSubmit` only flips a local `submitted` flag.
- `POST /routes/{id}/reports` **requires** a `segment_id` that must be one of the
  route's segments (else `422`). The frontend has no segment picker and never
  fetches `GET /routes/{id}/geometry` to get the segment list.
- The report's severity is also in the wrong vocabulary (see A).

### E. The `updates[]` timeline isn't modelled
- The contract says every `DisruptionOut` carries an ordered `updates[]` timeline
  and "the alert screen renders" it.
- The frontend `detail` object has flat fields (`reported`, `status`) and
  `IncidentDetail` shows a single STATUS line, no timeline.
  `AlertsContext.applyIncidentUpdate` **appends update text into the description
  string** instead of adding a timeline entry.

### F. Source/provenance (the project thesis) is invisible in the UI
- Backend: every disruption carries `source_category`
  (`met_eireann_warning | council_notice | community_report`) and
  `stated_or_inferred`. This institutional-vs-community distinction is the whole
  point of the system.
- The frontend data has neither field; the Verified/Unverified badge only partly
  stands in for it.

### G. The "AI confidence / verification" UI has no backend source
- [VerifyIncidentScreen](frontend/src/screens/emergency/VerifyIncidentScreen.js)
  shows an `AI_CONFIDENCE_PERCENT`, a "Report matches TII road data" bar, and a
  written AI explanation. `IncidentDetail` shows an `aiVerification` string.
- The backend uses AI (Claude) in **exactly one place — writing the broadcast**
  (backend doc §9). `DisruptionOut` has a numeric `confidence` field but **no
  AI-explanation text and no per-report TII matching**.
- **Impact:** this UI implies backend intelligence that doesn't exist. It must
  either be downgraded to display the numeric `confidence`, or treated as static
  demo text, or the backend scope must grow (a bigger decision).

### H. "Escalate" (raise severity) has no backend path
- The emergency [UpdateIncidentScreen](frontend/src/screens/emergency/UpdateIncidentScreen.js)
  offers close / escalate / update. `POST /disruptions/{id}/updates` only changes
  **status** (+ note) — it can't change **severity**. So `close`→`cleared` and
  `update`→`confirmed` map fine, but **escalate has nowhere to go**.

### I. The pending-review queue endpoint is unused
- Backend offers `GET /disruptions/pending` (the emergency review queue). The
  frontend reaches Verify from the general alerts list instead. Not a conflict —
  just an available endpoint the flow doesn't use yet.

---

## Recommended fixes (each tagged by where the change lands)

> Direction bias: the contract is **locked** and backend changes need a joint PR,
> so the default is **adapt the frontend** unless the backend genuinely lacks
> something the product needs.

**Phase 1 — make live data possible (structural)**
1. `[Frontend]` Add a small **API client** module (`src/api/client.js`) that reads
   `Constants.expoConfig.extra.apiBaseUrl` and wraps the endpoints.
2. `[Frontend]` Add **route selection**: call `GET /routes`, store the chosen
   `route_id` (a new context, or extend `UserTypeContext`), thread it into the
   route-scoped calls. *(Fixes C.)*
3. `[Frontend]` Turn `AlertsContext` into the live-data hub: on mount / route
   change, fetch `GET /routes/{id}/disruptions` instead of importing the mock
   array. Keep the same `useAlerts()` shape so screens don't change. *(Fixes the
   "no fetch" finding.)*

**Phase 2 — reconcile vocabularies & fields (translation layer)**
4. `[Frontend]` Add a **mapping layer** in the API client that converts backend →
   frontend display on read and frontend → backend on write:
   - severity: `high→disrupted`, `medium→caution`, `low→caution` (or a new
     "minor"); derive display **"clear" from `status==cleared`**, not from
     severity. *(Fixes A.)*
   - status: `reported→Unverified`, `confirmed→Verified`, `cleared→Resolved`.
     *(Fixes B, read side.)*
5. `[Frontend]` Model `updates[]` on the alert object and render it as a timeline
   in `IncidentDetail`; make `applyIncidentUpdate` post to
   `POST /disruptions/{id}/updates` and append a real timeline entry. *(Fixes E.)*
6. `[Frontend]` Rework the report screen: fetch `GET /routes/{id}/geometry`,
   let the user pick a **segment** (replacing the free-text location), and POST the
   correct body (`segment_id`, `disruption_type`, mapped `severity`, `description`).
   *(Fixes D.)*

**Phase 3 — thesis & polish**
7. `[Frontend]` Surface `source_category` / `stated_or_inferred` as a source badge
   (institutional vs community) so the app shows the provenance thesis. *(Fixes F.)*
8. `[Frontend]` Wire Route Radio to `POST /routes/{id}/broadcast`. *(Already easy.)*
9. `[Frontend, optional]` Add an emergency Pending queue screen backed by
   `GET /disruptions/pending`. *(Uses I.)*

**Decided approach for the three awkward cases (frontend-only, no backend change)**
- **Reject a report (B).** Represent reject as `POST /updates` with
  `status:"cleared"` + `note:"Rejected: <reason>"`. *(Later option, if the team
  agrees: add a `rejected` status to the backend enum.)*
- **AI verification UI (G).** Bind the confidence bar to the existing numeric
  `confidence`; treat the written AI explanation as static demo text (or remove
  it). *(Later option: add an AI-assessment field to `DisruptionOut` — new backend
  work, out of MVP scope.)*
- **Escalate / change severity (H).** Drop escalate for MVP, or record it as a
  status note only via `POST /updates`. *(Later option: let the updates endpoint
  accept a new `severity`.)*

---

## Verification (for whoever implements this later)

- **Static:** re-run a `fetch`/`axios` search — the API client should be the one
  place they appear. Confirm no screen imports the mock arrays directly once wired.
- **End-to-end (needs backend running, see backend doc §12):**
  set `API_BASE_URL` to the machine's LAN IP, `expo start`, then check each flow:
  route picker lists 2 routes → Alerts list populates from
  `GET /routes/{id}/disruptions` → Incident detail shows the `updates[]` timeline →
  passenger report posts a valid `segment_id` and returns `201` → emergency
  confirm/close moves the item's status → Route Radio speaks the fetched
  `script_text`.
- **Contract cross-check:** every value the UI renders should trace to a field in
  [docs/api-contract.md](docs/api-contract.md); anything that doesn't (AI
  explanation text, TII matching) is flagged as demo-only or a backend decision.
