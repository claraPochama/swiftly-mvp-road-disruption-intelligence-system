// The backend serves exactly two fixed, pre-seeded routes (plan.md part C), so
// the prototype hardcodes their ids instead of calling GET /routes. Each route
// also carries a demo "current" spot + a valid segment_id used when a passenger
// files a report (plan.md part D) — no GPS, no segment picker.

export const ROUTES = [
  {
    routeId: 'cork-killarney',
    label: 'Cork → Killarney',
    origin: 'Cork',
    destination: 'Killarney',
    // Demo current-location for the report screen, mapped to a real segment.
    reportSegmentId: 'n22-seg-1',
    reportLocationLabel: 'College Road, Cork',
  },
  {
    routeId: 'cork-carrigaline',
    label: 'Cork → Carrigaline',
    origin: 'Cork',
    destination: 'Carrigaline',
    reportSegmentId: 'r613-seg-1',
    reportLocationLabel: 'South Douglas Road, Cork',
  },
];

export const DEFAULT_ROUTE_ID = 'cork-carrigaline';

export function getRoute(routeId) {
  return ROUTES.find((r) => r.routeId === routeId) ?? ROUTES[0];
}
