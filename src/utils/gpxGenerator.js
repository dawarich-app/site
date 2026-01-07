/**
 * Generate a GPX (GPS Exchange Format) file from photo location data
 * @param {Array} points - Array of photo location points
 * @returns {string} GPX XML content
 */
export function generateGPX(points) {
  // Sort points by timestamp
  const sortedPoints = [...points].sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  // Generate GPX header
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"
     creator="Dawarich Photo Geodata Extraction - https://dawarich.app"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>Photo Locations</name>
    <desc>GPS coordinates extracted from photos using Dawarich Photo Geodata Extraction</desc>
    <author>
      <name>Dawarich</name>
      <link href="https://dawarich.app">
        <text>Dawarich - Location tracking platform</text>
      </link>
    </author>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  // Add waypoints for each photo
  sortedPoints.forEach(point => {
    gpx += `  <wpt lat="${point.lat}" lon="${point.lng}">
`;

    // Add altitude if available
    if (point.altitude !== null && point.altitude !== undefined) {
      gpx += `    <ele>${point.altitude}</ele>
`;
    }

    // Add timestamp if available
    if (point.timestamp) {
      gpx += `    <time>${point.timestamp}</time>
`;
    }

    // Add name (filename)
    if (point.filename) {
      gpx += `    <name>${escapeXML(point.filename)}</name>
`;
    }

    // Add description with coordinates
    gpx += `    <desc>Photo taken at ${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}</desc>
`;

    // Add type
    gpx += `    <type>Photo</type>
`;

    gpx += `  </wpt>
`;
  });

  // Optional: Add track connecting all waypoints in chronological order
  if (sortedPoints.length > 1) {
    gpx += `  <trk>
    <name>Photo Trail</name>
    <desc>Trail connecting photo locations in chronological order</desc>
    <trkseg>
`;

    sortedPoints.forEach(point => {
      gpx += `      <trkpt lat="${point.lat}" lon="${point.lng}">
`;

      if (point.altitude !== null && point.altitude !== undefined) {
        gpx += `        <ele>${point.altitude}</ele>
`;
      }

      if (point.timestamp) {
        gpx += `        <time>${point.timestamp}</time>
`;
      }

      gpx += `      </trkpt>
`;
    });

    gpx += `    </trkseg>
  </trk>
`;
  }

  // Close GPX
  gpx += `</gpx>`;

  return gpx;
}

/**
 * Escape special XML characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a KML (Keyhole Markup Language) file from photo location data
 * Alternative format for Google Earth and other mapping tools
 * @param {Array} points - Array of photo location points
 * @returns {string} KML XML content
 */
export function generateKML(points) {
  // Sort points by timestamp
  const sortedPoints = [...points].sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Photo Locations</name>
    <description>GPS coordinates extracted from photos using Dawarich Photo Geotagging Tool</description>
    <Style id="photoIcon">
      <IconStyle>
        <color>ff0000ff</color>
        <scale>1.0</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/shapes/camera.png</href>
        </Icon>
      </IconStyle>
    </Style>
`;

  // Add placemarks for each photo
  sortedPoints.forEach(point => {
    kml += `    <Placemark>
`;

    if (point.filename) {
      kml += `      <name>${escapeXML(point.filename)}</name>
`;
    }

    kml += `      <description>Photo taken at ${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`;
    if (point.timestamp) {
      kml += `\nTime: ${new Date(point.timestamp).toLocaleString()}`;
    }
    kml += `</description>
`;

    if (point.timestamp) {
      kml += `      <TimeStamp>
        <when>${point.timestamp}</when>
      </TimeStamp>
`;
    }

    kml += `      <styleUrl>#photoIcon</styleUrl>
      <Point>
        <coordinates>${point.lng},${point.lat}`;

    if (point.altitude !== null && point.altitude !== undefined) {
      kml += `,${point.altitude}`;
    } else {
      kml += ',0';
    }

    kml += `</coordinates>
      </Point>
    </Placemark>
`;
  });

  kml += `  </Document>
</kml>`;

  return kml;
}
