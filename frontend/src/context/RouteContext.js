import { createContext, useContext, useMemo, useState } from 'react';
import { ROUTES, DEFAULT_ROUTE_ID, getRoute } from '../api/routes';

const RouteContext = createContext(null);

// Holds which of the two fixed backend routes is currently selected. Everything
// route-scoped (alerts, broadcast, map) reads `selectedRouteId` from here.
// (plan.md part C — no dynamic GET /routes for the prototype.)
export function RouteProvider({ children }) {
  const [selectedRouteId, setSelectedRouteId] = useState(DEFAULT_ROUTE_ID);

  const value = useMemo(
    () => ({
      routes: ROUTES,
      selectedRouteId,
      setSelectedRouteId,
      selectedRoute: getRoute(selectedRouteId),
    }),
    [selectedRouteId]
  );

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

// Usage: const { selectedRouteId, setSelectedRouteId, selectedRoute, routes } = useRoute();
export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
}
