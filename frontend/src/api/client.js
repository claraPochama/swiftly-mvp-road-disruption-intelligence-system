// Thin HTTP wrapper around the Swiftly backend (docs/api-contract.md). This is
// the ONE place fetch() appears — screens/contexts call these functions, never
// fetch directly.
//
// Base URL: set EXPO_PUBLIC_API_BASE_URL (Expo inlines EXPO_PUBLIC_* into the
// bundle at build time). On a device, point it at the machine's LAN IP, e.g.
// EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:8000. Defaults to localhost for
// web/emulator.

const BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000'
).replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (e) {
    throw new Error(`Network error reaching the Swiftly backend (${BASE_URL}). ${e.message}`);
  }
  if (!response.ok) {
    let detail = '';
    try {
      detail = (await response.json())?.detail ?? '';
    } catch {
      // non-JSON error body — ignore
    }
    throw new Error(`Request failed (${response.status}) for ${path}. ${detail}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  baseUrl: BASE_URL,

  // Reads
  getDisruptions: (routeId) => request(`/routes/${routeId}/disruptions`),
  getOverlay: (routeId) => request(`/routes/${routeId}/overlay`),
  getGeometry: (routeId) => request(`/routes/${routeId}/geometry`),
  getPending: () => request('/disruptions/pending'),

  // Writes
  submitReport: (routeId, body) =>
    request(`/routes/${routeId}/reports`, { method: 'POST', body: JSON.stringify(body) }),
  addUpdate: (disruptionId, body) =>
    request(`/disruptions/${disruptionId}/updates`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  generateBroadcast: (routeId) =>
    request(`/routes/${routeId}/broadcast`, { method: 'POST' }),
};

export default api;
