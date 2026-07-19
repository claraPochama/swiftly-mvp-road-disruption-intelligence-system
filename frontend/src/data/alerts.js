// Mock data standing in for what will eventually come from the backend.
// Both AlertsScreen and IncidentDetailScreen read from this single source
// so the list and detail views always stay in sync.
export const ALERTS = [
  {
    id: '1',
    severity: 'disrupted',
    title: 'N22 Flooding - Road Closed',
    description: 'Heavy rainfall has caused significant flooding',
    location: 'Cork-Kerry Road, Killarney',
    timeAgo: '2 mins ago',
    area: 'Cork',
    detail: {
      reported: '09:45 Today',
      duration: 'Weather Dependent',
      status: 'Unverified',
      fullDescription:
        'Surface water flowing overnight rain. Reduced speed recommended. Conditions improving.',
      aiVerification:
        '3 crowdsourced reports received. Pattern matches known flood zone. Awaiting official source cross reference.',
    },
  },
  {
    id: '2',
    severity: 'caution',
    title: 'M50 Slowdown - Northbound',
    description: 'Minor accident at J11 Tallaght. Expect delays',
    location: 'M50 Motorway, Dublin',
    timeAgo: '15 mins ago',
    area: 'Dublin',
    detail: {
      reported: '10:12 Today',
      duration: '45–60 minutes',
      status: 'Verified',
      fullDescription:
        'Two lanes blocked following a minor collision. Emergency services on scene. Drivers advised to use the N3 as an alternative.',
      aiVerification:
        'Confirmed via TII live feed. Matches 2 independent driver reports at the same junction.',
    },
  },
  {
    id: '3',
    severity: 'clear',
    title: 'R586 Bandon - Reopened',
    description: 'The roadworks near the bridge are now',
    location: 'Bandon, West Cork',
    timeAgo: '45 mins ago',
    area: 'Cork',
    detail: {
      reported: '08:30 Today',
      duration: 'Resolved',
      status: 'Verified',
      fullDescription:
        'Overnight maintenance complete. All lanes open. Traffic flowing normally at the junction.',
      aiVerification:
        'Scheduled works confirmed complete via council road team. No contradicting reports found.',
    },
  },
  {
    id: '4',
    severity: 'caution',
    title: 'Heavy Fog - N7 Route',
    description: 'Visibility reduced to less than 50 meters in',
    location: 'N7 Naas Road',
    timeAgo: '1 hour ago',
    area: 'Naas',
    detail: {
      reported: '07:50 Today',
      duration: 'Weather Dependent',
      status: 'Unverified',
      fullDescription:
        'Dense fog patch reducing visibility significantly. Reduced speed strongly advised, particularly for high-sided vehicles.',
      aiVerification:
        '5 crowdsourced reports received. Matches current Met Éireann fog warning for the region.',
    },
  },
];