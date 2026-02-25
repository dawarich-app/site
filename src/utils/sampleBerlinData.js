// Sample location data for Berlin, Germany.
// Used as demo data on the Timeline Visualizer before users upload their own files.
// All coordinates are in central Berlin — obviously fake, not real user data.

const SAMPLE_POINTS = [
  // Day 1: Walking around Mitte
  { id: 's1', lat: 52.5200, lng: 13.4050, type: 'place_visit', name: 'Alexanderplatz', timestamp: '2024-06-15T09:00:00Z' },
  { id: 's2', lat: 52.5186, lng: 13.3762, type: 'location_record', timestamp: '2024-06-15T09:25:00Z' },
  { id: 's3', lat: 52.5163, lng: 13.3777, type: 'place_visit', name: 'Museumsinsel', timestamp: '2024-06-15T10:00:00Z' },
  { id: 's4', lat: 52.5145, lng: 13.3501, type: 'location_record', timestamp: '2024-06-15T11:15:00Z' },
  { id: 's5', lat: 52.5163, lng: 13.3778, type: 'location_record', timestamp: '2024-06-15T11:30:00Z' },
  { id: 's6', lat: 52.5208, lng: 13.4094, type: 'place_visit', name: 'Fernsehturm', timestamp: '2024-06-15T12:00:00Z' },
  { id: 's7', lat: 52.5234, lng: 13.4115, type: 'location_record', timestamp: '2024-06-15T13:00:00Z' },
  { id: 's8', lat: 52.5219, lng: 13.4133, type: 'location_record', timestamp: '2024-06-15T13:20:00Z' },
  { id: 's9', lat: 52.5244, lng: 13.4012, type: 'place_visit', name: 'Hackescher Markt', timestamp: '2024-06-15T14:00:00Z' },
  { id: 's10', lat: 52.5270, lng: 13.3890, type: 'location_record', timestamp: '2024-06-15T15:00:00Z' },

  // Day 1 afternoon: Tiergarten area
  { id: 's11', lat: 52.5145, lng: 13.3501, type: 'place_visit', name: 'Brandenburger Tor', timestamp: '2024-06-15T16:00:00Z' },
  { id: 's12', lat: 52.5096, lng: 13.3762, type: 'location_record', timestamp: '2024-06-15T16:30:00Z' },
  { id: 's13', lat: 52.5125, lng: 13.3275, type: 'location_record', timestamp: '2024-06-15T17:00:00Z' },
  { id: 's14', lat: 52.5144, lng: 13.3501, type: 'location_record', timestamp: '2024-06-15T17:30:00Z' },
  { id: 's15', lat: 52.5083, lng: 13.3761, type: 'place_visit', name: 'Gendarmenmarkt', timestamp: '2024-06-15T18:00:00Z' },

  // Day 2: Kreuzberg + Neukölln
  { id: 's16', lat: 52.4990, lng: 13.4180, type: 'place_visit', name: 'Görlitzer Park', timestamp: '2024-06-16T10:00:00Z' },
  { id: 's17', lat: 52.4952, lng: 13.4230, type: 'location_record', timestamp: '2024-06-16T10:30:00Z' },
  { id: 's18', lat: 52.4893, lng: 13.4325, type: 'location_record', timestamp: '2024-06-16T11:00:00Z' },
  { id: 's19', lat: 52.4860, lng: 13.4247, type: 'place_visit', name: 'Tempelhofer Feld', timestamp: '2024-06-16T11:30:00Z' },
  { id: 's20', lat: 52.4745, lng: 13.4038, type: 'location_record', timestamp: '2024-06-16T12:15:00Z' },
  { id: 's21', lat: 52.4833, lng: 13.4400, type: 'location_record', timestamp: '2024-06-16T13:00:00Z' },
  { id: 's22', lat: 52.4879, lng: 13.4282, type: 'location_record', timestamp: '2024-06-16T13:30:00Z' },
  { id: 's23', lat: 52.4948, lng: 13.4197, type: 'place_visit', name: 'Markthalle Neun', timestamp: '2024-06-16T14:00:00Z' },
  { id: 's24', lat: 52.5015, lng: 13.4110, type: 'location_record', timestamp: '2024-06-16T15:00:00Z' },
  { id: 's25', lat: 52.5055, lng: 13.4195, type: 'location_record', timestamp: '2024-06-16T15:30:00Z' },

  // Day 2 evening: Friedrichshain
  { id: 's26', lat: 52.5074, lng: 13.4420, type: 'place_visit', name: 'East Side Gallery', timestamp: '2024-06-16T16:30:00Z' },
  { id: 's27', lat: 52.5112, lng: 13.4540, type: 'location_record', timestamp: '2024-06-16T17:00:00Z' },
  { id: 's28', lat: 52.5160, lng: 13.4540, type: 'location_record', timestamp: '2024-06-16T17:30:00Z' },
  { id: 's29', lat: 52.5193, lng: 13.4538, type: 'place_visit', name: 'Volkspark Friedrichshain', timestamp: '2024-06-16T18:00:00Z' },
  { id: 's30', lat: 52.5235, lng: 13.4410, type: 'location_record', timestamp: '2024-06-16T18:45:00Z' },

  // Day 3: Prenzlauer Berg + Pankow
  { id: 's31', lat: 52.5388, lng: 13.4244, type: 'place_visit', name: 'Mauerpark', timestamp: '2024-06-17T10:00:00Z' },
  { id: 's32', lat: 52.5410, lng: 13.4200, type: 'location_record', timestamp: '2024-06-17T10:30:00Z' },
  { id: 's33', lat: 52.5340, lng: 13.4130, type: 'location_record', timestamp: '2024-06-17T11:00:00Z' },
  { id: 's34', lat: 52.5313, lng: 13.4209, type: 'place_visit', name: 'Kulturbrauerei', timestamp: '2024-06-17T11:30:00Z' },
  { id: 's35', lat: 52.5290, lng: 13.4140, type: 'location_record', timestamp: '2024-06-17T12:00:00Z' },
  { id: 's36', lat: 52.5350, lng: 13.4080, type: 'location_record', timestamp: '2024-06-17T12:30:00Z' },
  { id: 's37', lat: 52.5425, lng: 13.4130, type: 'place_visit', name: 'Schönhauser Allee', timestamp: '2024-06-17T13:00:00Z' },
  { id: 's38', lat: 52.5475, lng: 13.4090, type: 'location_record', timestamp: '2024-06-17T13:30:00Z' },
  { id: 's39', lat: 52.5510, lng: 13.4050, type: 'location_record', timestamp: '2024-06-17T14:00:00Z' },
  { id: 's40', lat: 52.5388, lng: 13.3984, type: 'location_record', timestamp: '2024-06-17T14:30:00Z' },

  // Day 3 afternoon: Charlottenburg
  { id: 's41', lat: 52.5197, lng: 13.3327, type: 'place_visit', name: 'Siegessäule', timestamp: '2024-06-17T15:30:00Z' },
  { id: 's42', lat: 52.5108, lng: 13.3389, type: 'location_record', timestamp: '2024-06-17T16:00:00Z' },
  { id: 's43', lat: 52.5070, lng: 13.3327, type: 'place_visit', name: 'KaDeWe', timestamp: '2024-06-17T16:30:00Z' },
  { id: 's44', lat: 52.5047, lng: 13.3388, type: 'location_record', timestamp: '2024-06-17T17:00:00Z' },
  { id: 's45', lat: 52.5050, lng: 13.3295, type: 'location_record', timestamp: '2024-06-17T17:30:00Z' },
  { id: 's46', lat: 52.5192, lng: 13.2934, type: 'place_visit', name: 'Schloss Charlottenburg', timestamp: '2024-06-17T18:00:00Z' },
  { id: 's47', lat: 52.5165, lng: 13.2950, type: 'location_record', timestamp: '2024-06-17T18:30:00Z' },
  { id: 's48', lat: 52.5130, lng: 13.2990, type: 'location_record', timestamp: '2024-06-17T19:00:00Z' },

  // Commute paths (scattered points along routes)
  { id: 's49', lat: 52.5215, lng: 13.4130, type: 'location_record', timestamp: '2024-06-16T09:15:00Z' },
  { id: 's50', lat: 52.5130, lng: 13.4200, type: 'location_record', timestamp: '2024-06-16T09:30:00Z' },
  { id: 's51', lat: 52.5060, lng: 13.4170, type: 'location_record', timestamp: '2024-06-16T09:45:00Z' },
  { id: 's52', lat: 52.5280, lng: 13.4100, type: 'location_record', timestamp: '2024-06-17T09:00:00Z' },
  { id: 's53', lat: 52.5330, lng: 13.4160, type: 'location_record', timestamp: '2024-06-17T09:15:00Z' },
  { id: 's54', lat: 52.5370, lng: 13.4210, type: 'location_record', timestamp: '2024-06-17T09:30:00Z' },
];

const SAMPLE_PATHS = [
  // Day 1: Walk through Mitte
  {
    coordinates: [
      [52.5200, 13.4050], [52.5186, 13.3762], [52.5163, 13.3777],
      [52.5145, 13.3501], [52.5083, 13.3761],
    ],
    activityType: 'WALKING',
    startTime: '2024-06-15T09:00:00Z',
    endTime: '2024-06-15T18:00:00Z',
    startTimestamp: '2024-06-15T09:00:00Z',
    endTimestamp: '2024-06-15T18:00:00Z',
    distance: 4200,
  },
  // Day 2: Kreuzberg loop
  {
    coordinates: [
      [52.4990, 13.4180], [52.4952, 13.4230], [52.4893, 13.4325],
      [52.4860, 13.4247], [52.4948, 13.4197], [52.5074, 13.4420],
    ],
    activityType: 'CYCLING',
    startTime: '2024-06-16T10:00:00Z',
    endTime: '2024-06-16T16:30:00Z',
    startTimestamp: '2024-06-16T10:00:00Z',
    endTimestamp: '2024-06-16T16:30:00Z',
    distance: 7800,
  },
  // Day 3: Prenzlauer Berg to Charlottenburg
  {
    coordinates: [
      [52.5388, 13.4244], [52.5313, 13.4209], [52.5197, 13.3327],
      [52.5070, 13.3327], [52.5192, 13.2934],
    ],
    activityType: 'IN_BUS',
    startTime: '2024-06-17T10:00:00Z',
    endTime: '2024-06-17T18:00:00Z',
    startTimestamp: '2024-06-17T10:00:00Z',
    endTimestamp: '2024-06-17T18:00:00Z',
    distance: 12400,
  },
];

export { SAMPLE_POINTS, SAMPLE_PATHS };
