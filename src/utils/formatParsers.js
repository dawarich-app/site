/**
 * Parse GPX format to internal format
 */
export function parseGPX(gpxText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxText, 'text/xml');

  const points = [];

  // Parse waypoints
  const wpts = xmlDoc.querySelectorAll('wpt');
  wpts.forEach(wpt => {
    const lat = parseFloat(wpt.getAttribute('lat'));
    const lon = parseFloat(wpt.getAttribute('lon'));
    const name = wpt.querySelector('name')?.textContent || '';
    const ele = wpt.querySelector('ele')?.textContent || '';
    const time = wpt.querySelector('time')?.textContent || '';

    points.push({
      type: 'waypoint',
      lat,
      lon,
      name,
      elevation: ele ? parseFloat(ele) : undefined,
      time: time || undefined
    });
  });

  // Parse track points
  const trkpts = xmlDoc.querySelectorAll('trkpt');
  trkpts.forEach(trkpt => {
    const lat = parseFloat(trkpt.getAttribute('lat'));
    const lon = parseFloat(trkpt.getAttribute('lon'));
    const ele = trkpt.querySelector('ele')?.textContent || '';
    const time = trkpt.querySelector('time')?.textContent || '';

    points.push({
      type: 'trackpoint',
      lat,
      lon,
      elevation: ele ? parseFloat(ele) : undefined,
      time: time || undefined
    });
  });

  // Parse routes
  const rtepts = xmlDoc.querySelectorAll('rtept');
  rtepts.forEach(rtept => {
    const lat = parseFloat(rtept.getAttribute('lat'));
    const lon = parseFloat(rtept.getAttribute('lon'));
    const name = rtept.querySelector('name')?.textContent || '';
    const ele = rtept.querySelector('ele')?.textContent || '';

    points.push({
      type: 'routepoint',
      lat,
      lon,
      name,
      elevation: ele ? parseFloat(ele) : undefined
    });
  });

  return points;
}

/**
 * Parse GeoJSON format to internal format
 */
export function parseGeoJSON(geojsonText) {
  const geojson = JSON.parse(geojsonText);
  const points = [];

  const processFeature = (feature) => {
    if (feature.geometry.type === 'Point') {
      const [lon, lat, elevation] = feature.geometry.coordinates;
      points.push({
        type: 'point',
        lat,
        lon,
        elevation,
        properties: feature.properties || {}
      });
    } else if (feature.geometry.type === 'LineString') {
      feature.geometry.coordinates.forEach(coord => {
        const [lon, lat, elevation] = coord;
        points.push({
          type: 'linepoint',
          lat,
          lon,
          elevation,
          properties: feature.properties || {}
        });
      });
    }
  };

  if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach(processFeature);
  } else if (geojson.type === 'Feature') {
    processFeature(geojson);
  }

  return points;
}

/**
 * Parse KML format to internal format
 */
export function parseKML(kmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlText, 'text/xml');

  const points = [];

  // Parse Placemarks
  const placemarks = xmlDoc.querySelectorAll('Placemark');
  placemarks.forEach(placemark => {
    const name = placemark.querySelector('name')?.textContent || '';
    const description = placemark.querySelector('description')?.textContent || '';

    // Point coordinates
    const point = placemark.querySelector('Point coordinates');
    if (point) {
      const coords = point.textContent.trim().split(',');
      const lon = parseFloat(coords[0]);
      const lat = parseFloat(coords[1]);
      const elevation = coords[2] ? parseFloat(coords[2]) : undefined;

      points.push({
        type: 'placemark',
        lat,
        lon,
        elevation,
        name,
        description
      });
    }

    // LineString coordinates
    const lineString = placemark.querySelector('LineString coordinates');
    if (lineString) {
      const coordsText = lineString.textContent.trim().split(/\s+/);
      coordsText.forEach(coordText => {
        const coords = coordText.split(',');
        const lon = parseFloat(coords[0]);
        const lat = parseFloat(coords[1]);
        const elevation = coords[2] ? parseFloat(coords[2]) : undefined;

        points.push({
          type: 'linepoint',
          lat,
          lon,
          elevation,
          name,
          description
        });
      });
    }
  });

  return points;
}
