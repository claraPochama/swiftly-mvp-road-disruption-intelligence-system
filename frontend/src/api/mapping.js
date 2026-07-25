// Translation layer between the backend contract (docs/api-contract.md) and the
// shapes/vocabulary the frontend screens use. Read side: DisruptionOut -> alert.
// Write side helpers live in the API client / contexts.
//
// Vocabulary decisions (plan.md A & B):
//   severity: backend `low | medium | high` is used directly as the key (the
//     severity theme is re-keyed to match — see SeverityBadge).
//   status:   `reported -> Unverified`, `confirmed -> Verified`, `cleared -> Cleared`.

export const STATUS_LABELS = {
  reported: 'Unverified',
  confirmed: 'Verified',
  cleared: 'Cleared',
};

export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

// e.g. "high_temperature" -> "High Temperature", "roadworks" -> "Roadworks".
export function prettifyType(type) {
  if (!type) return 'Disruption';
  return type
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function relativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function formatClock(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });
}

// DisruptionOut (backend) -> the alert object every screen reads.
export function toAlert(d) {
  const roadRef = d.road_ref || d.segment_id;
  const location = d.segment_label || roadRef;
  return {
    id: d.id,
    segmentId: d.segment_id,
    severity: d.severity, // 'low' | 'medium' | 'high' — matches SeverityBadge keys
    status: d.status, // raw backend status
    statusLabel: statusLabel(d.status),
    sourceCategory: d.source_category,
    statedOrInferred: d.stated_or_inferred,
    confidence: d.confidence,
    disruptionType: d.disruption_type,
    title: `${roadRef} — ${prettifyType(d.disruption_type)}`,
    description: d.description,
    location,
    roadRef,
    area: roadRef, // used by the Alerts search filter
    reportedAt: formatClock(d.created_at),
    timeAgo: relativeTime(d.created_at),
    expiry: d.expiry,
    updates: (d.updates ?? []).map((u) => ({
      id: u.id,
      status: u.status,
      statusLabel: statusLabel(u.status),
      note: u.note,
      at: formatClock(u.created_at),
    })),
  };
}
