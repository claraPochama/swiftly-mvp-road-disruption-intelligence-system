// Mock data standing in for real incident coordination data from the backend.
// Only "bob" has a live incident thread —
// the others get a simple placeholder thread since no detailed content
// exists for them yet.
export const COMMS_THREADS = {
  bob: {
    incident: {
      id: 'INC:4821',
      location: 'M50 J6',
      units: 'R-24, R-18',
      timestamp: 'Today 12:41',
    },
    messages: [
      { id: '1', sender: 'Control', priority: true, text: 'Unit R-24, confirm casualty count at M50 J6.' },
      { id: '2', sender: 'Unit R-24', text: 'Two walking wounded. One serious. Ambulance en route.' },
      { id: '3', sender: 'Unit R-18', text: 'En route to M7 J8. ETA four minutes.' },
      { id: '4', sender: 'Control', priority: true, text: 'R-18, advise on lane closure status when on scene.' },
      { id: '5', sender: 'Unit R-24', text: 'M50 NB J6: two lanes blocked. Diversion via slip active.' },
    ],
    aiSuggestion:
      'Based on confirmed lane closure, recommend pushing public alert: M50 NB blocked - use N3 diversion. Confidence: 94%',
  },
};