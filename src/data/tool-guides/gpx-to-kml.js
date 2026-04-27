// Editorial content for /tools/gpx-to-kml/. Powers <ToolGuide />.

const content = {
  whenToConvert: {
    subject: 'GPX to KML',
    body: [
      "GPX is the format your GPS device, fitness watch, or recording app produces. KML is the format Google Earth, Google My Maps, and most desktop GIS tools want as input. Converting GPX to KML is what you do when you want to actually see your tracks in a mapping app — not just store them.",
      "Typical reasons people land on this page: a Strava export they want to drop into Google Earth, a Garmin watch ride they want to share via Google My Maps, a hiking GPX from AllTrails or OsmAnd they want to annotate visually, or a track from an old GPS unit they're moving into a long-term mapping archive.",
      "Both formats are XML and both are well-defined, so the conversion is lossless for the data fields they share. The interesting question — covered below — is which fields they don't share.",
    ],
  },

  preservation: {
    intro: "Here's exactly what survives a GPX → KML conversion and what doesn't:",
    rows: [
      { field: 'GPS coordinates (lat/lon)', preserved: '✅ Yes', notes: 'Both formats use WGS-84 decimal degrees. Identical precision.' },
      { field: 'Elevation', preserved: '✅ Yes', notes: 'GPX <ele> maps to the third coordinate in KML <coordinates>. Metres in both.' },
      { field: 'Timestamps', preserved: '✅ Yes', notes: 'GPX <time> becomes KML <TimeStamp> on each placemark. ISO-8601 UTC in both.' },
      { field: 'Track structure (track → segments → points)', preserved: '✅ Yes', notes: 'GPX <trk>/<trkseg> render as KML <Placemark> with <LineString> geometry.' },
      { field: 'Waypoints', preserved: '✅ Yes', notes: 'GPX <wpt> becomes KML <Placemark> with <Point> geometry and the waypoint name.' },
      { field: 'Routes', preserved: '✅ Yes', notes: 'GPX <rte> is rendered as a separate KML <LineString>, distinct from tracks.' },
      { field: 'Track / waypoint names and descriptions', preserved: '✅ Yes', notes: 'Mapped to KML <name> and <description>.' },
      { field: 'Heart rate, cadence, power (TrackPointExtension)', preserved: '⚠️ No', notes: 'KML has no fitness-data namespace. If you need HR/cadence/power, convert to TCX or keep the GPX.' },
      { field: 'GPX <extensions> blocks (custom data)', preserved: '⚠️ Partial', notes: 'Generic extensions are dropped. Use GeoJSON if you need to carry arbitrary properties.' },
      { field: 'Styling (line colour, width, icons)', preserved: '➕ Defaults applied', notes: 'GPX has no styling; this converter applies a sensible default KML <Style>. You can edit it in Google Earth Pro.' },
    ],
  },

  apps: {
    intro: "Once you have your .kml file, here's where you can open it:",
    items: [
      { name: 'Google Earth (web and Pro)', url: 'https://earth.google.com/', note: 'Drag the .kml directly into the browser version, or File → Import in Earth Pro. Best 3D visualisation.' },
      { name: 'Google My Maps', url: 'https://mymaps.google.com/', note: 'Create a new map, then "Import" your KML to share an annotated map with anyone.' },
      { name: 'QGIS', url: 'https://qgis.org/', note: 'Open-source desktop GIS. Add as a vector layer for serious analysis, joining with other geographic data.' },
      { name: 'Marble', url: 'https://marble.kde.org/', note: 'Open-source virtual globe. Cross-platform, no Google account.' },
      { name: 'Locus Map (Android)', url: 'https://www.locusmap.app/', note: 'Imports KML for offline navigation and route playback.' },
      { name: 'Caltopo', url: 'https://caltopo.com/', note: 'Backcountry mapping. Imports KML for trip planning with terrain overlays.' },
      { name: 'Dawarich', url: '/import-export/', note: 'Yes, you can also import KML directly into your Dawarich timeline alongside everything else.' },
    ],
  },

  example: {
    intro: "Minimal GPX in, minimal KML out — illustrating the field mapping in practice:",
    fromLabel: 'GPX',
    toLabel: 'KML',
    input: `<?xml version="1.0"?>
<gpx version="1.1" creator="Garmin">
  <trk>
    <name>Morning Run</name>
    <trkseg>
      <trkpt lat="52.5200" lon="13.4050">
        <ele>34</ele>
        <time>2026-04-27T07:14:00Z</time>
      </trkpt>
      <trkpt lat="52.5210" lon="13.4060">
        <ele>36</ele>
        <time>2026-04-27T07:14:30Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`,
    output: `<?xml version="1.0"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Morning Run</name>
    <Placemark>
      <name>Morning Run</name>
      <LineString>
        <coordinates>
          13.4050,52.5200,34
          13.4060,52.5210,36
        </coordinates>
      </LineString>
      <TimeSpan>
        <begin>2026-04-27T07:14:00Z</begin>
        <end>2026-04-27T07:14:30Z</end>
      </TimeSpan>
    </Placemark>
  </Document>
</kml>`,
  },

  reference: {
    heading: 'GPX vs KML, briefly',
    body: [
      "GPX (GPS Exchange Format) was published by Topografix in 2002 specifically for GPS devices: it carries tracks, routes, waypoints, and basic per-point metadata. Almost every GPS device, sports watch, and outdoor app reads and writes it. It's a small, focused format — there's effectively only one way to express a track.",
      "KML (Keyhole Markup Language) was created by Keyhole, the company Google bought to build Google Earth. It's much broader — it carries geometry, styling, time animation, 3D models, network links, and overlays. KML is a presentation format. GPX is an exchange format.",
      "If your goal is to share or visualise a track, KML is what the receiving software wants. If your goal is to feed it back into another GPS device or analyse it in fitness software, keep it as GPX.",
    ],
  },

  faqs: [
    {
      q: 'Does this converter upload my GPX file to a server?',
      a: 'No. Conversion happens entirely in your browser using JavaScript. Your file never leaves your device, and there is no analytics on the file contents. You can verify this — Dawarich is open source and the converter code is in the same public repository.',
    },
    {
      q: 'Can I convert multiple GPX files at once?',
      a: 'This converter handles one file at a time. If you need to combine several GPX files into a single KML, run them through the GPX Merger first and then convert the merged file.',
    },
    {
      q: 'Will my heart rate and cadence data be preserved?',
      a: 'No. KML has no defined extension for fitness sensor data. If you need to keep heart rate, cadence, or power, either keep the original GPX (most fitness apps prefer it) or convert to TCX, which is designed for fitness activities.',
    },
    {
      q: 'How do I open the resulting KML in Google Earth?',
      a: 'On the web version, drag the .kml file onto the Earth interface. In Google Earth Pro on desktop, use File → Open and select the file. The track will appear in the "Temporary Places" tree on the left; right-click to save it permanently.',
    },
    {
      q: 'Why does my track look like a flat line in Google Earth?',
      a: 'By default, KML LineStrings are clamped to the ground. To see the actual elevation profile, right-click your imported track in Google Earth Pro and set the altitude mode to "Absolute" or "Relative to ground."',
    },
    {
      q: 'Is there a file size limit?',
      a: 'The converter runs in your browser, so the practical limit is your browser\'s memory. Files up to several hundred megabytes work fine on a modern laptop. For very large GPX exports (e.g. multi-year archives), use the GPS File Splitter first.',
    },
  ],
};

export default content;
