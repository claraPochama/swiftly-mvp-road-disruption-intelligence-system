import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { toAlert } from '../api/mapping';
import { useRoute } from './RouteContext';

const AlertsContext = createContext(null);

// The single live-data hub. On mount / route change it fetches the selected
// route's disruptions from the backend (replacing the old mock array), maps
// them to the frontend alert shape, and exposes the write actions (report,
// verify, update) which POST to the backend and then re-read so every screen
// sees the change. useAlerts() keeps the same surface screens already used.
export function AlertsProvider({ children }) {
  const { selectedRouteId } = useRoute();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!selectedRouteId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDisruptions(selectedRouteId);
      setAlerts(data.map(toAlert));
    } catch (e) {
      setError(e.message);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRouteId]);

  useEffect(() => {
    load();
  }, [load]);

  const getAlert = (id) => alerts.find((a) => a.id === id);

  // Verify Incident: Confirm -> status "confirmed"; Reject has no backend status,
  // so it is recorded as a "cleared" update whose note flags the rejection
  // (plan.md decided approach for B).
  const verifyAlert = async (id, { verified, method }) => {
    const status = verified ? 'confirmed' : 'cleared';
    const note = verified
      ? `Verified by emergency personnel${method ? ` (${method})` : ''}.`
      : `Rejected by emergency personnel${method ? ` (${method})` : ''}.`;
    await api.addUpdate(id, { status, note });
    await load();
  };

  // Update Incident: close -> cleared, update -> confirmed. Escalate can't change
  // severity via the contract (plan.md H, deferred), so it is recorded as a
  // status note only, keeping the item confirmed.
  const applyIncidentUpdate = async (id, { action, notes }) => {
    const STATUS_BY_ACTION = { close: 'cleared', update: 'confirmed', escalate: 'confirmed' };
    const PREFIX_BY_ACTION = { close: 'Closed', update: 'Updated', escalate: 'Escalated' };
    const status = STATUS_BY_ACTION[action] ?? 'confirmed';
    const prefix = PREFIX_BY_ACTION[action] ?? 'Updated';
    const note = notes ? `${prefix}: ${notes}` : `${prefix} by emergency personnel.`;
    await api.addUpdate(id, { status, note });
    await load();
  };

  // Passenger report: POST a community report for the current route.
  const submitReport = async ({ segmentId, disruptionType, severity, description }) => {
    await api.submitReport(selectedRouteId, {
      segment_id: segmentId,
      disruption_type: disruptionType,
      severity,
      description,
    });
    await load();
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        loading,
        error,
        reload: load,
        getAlert,
        verifyAlert,
        applyIncidentUpdate,
        submitReport,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

// Usage: const { alerts, loading, getAlert, verifyAlert, applyIncidentUpdate, submitReport } = useAlerts();
export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
}
