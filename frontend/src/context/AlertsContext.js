import { createContext, useContext, useState } from 'react';
import { ALERTS as INITIAL_ALERTS } from '../data/alerts';

const AlertsContext = createContext(null);

// Wrap the app in this once (see App.js) so alert data is real shared state
// instead of a static imported array — any screen can read the current
// alerts, and Verify/Update actions actually change what every other screen
// sees, instead of just navigating back with nothing changed.
export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const getAlert = (id) => alerts.find((a) => a.id === id);

  // Called from Verify Incident: Confirm marks it Verified, Reject marks it Rejected.
  const verifyAlert = (id, { verified, method }) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              detail: {
                ...alert.detail,
                status: verified ? 'Verified' : 'Rejected',
                verificationMethod: method,
              },
            }
          : alert
      )
    );
  };

  // Called from Update Incident: applies the chosen action (close/escalate/
  // update) and appends any notes to the description.
  const applyIncidentUpdate = (id, { action, notes }) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id !== id) return alert;

        let severity = alert.severity;
        let status = alert.detail.status;
        let duration = alert.detail.duration;

        if (action === 'close') {
          severity = 'clear';
          status = 'Verified';
          duration = 'Resolved';
        } else if (action === 'escalate') {
          severity = alert.severity === 'caution' ? 'disrupted' : alert.severity;
          status = 'Verified';
        } else if (action === 'update') {
          status = 'Verified';
        }

        const fullDescription = notes
          ? `${alert.detail.fullDescription}\n\nUpdate: ${notes}`
          : alert.detail.fullDescription;

        return {
          ...alert,
          severity,
          detail: { ...alert.detail, status, duration, fullDescription },
        };
      })
    );
  };

  return (
    <AlertsContext.Provider value={{ alerts, getAlert, verifyAlert, applyIncidentUpdate }}>
      {children}
    </AlertsContext.Provider>
  );
}

// Usage: const { alerts, getAlert, verifyAlert, applyIncidentUpdate } = useAlerts();
export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
}