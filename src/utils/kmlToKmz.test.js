import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { kmlToKmz } from './formatConverters';

const KML = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>
<Style id="red"><LineStyle><color>ff0000ff</color></LineStyle></Style>
<Folder><name>Trip</name>
<Placemark><name>Lake</name><Polygon><outerBoundaryIs><LinearRing><coordinates>12.3,51.3 12.4,51.3 12.4,51.4 12.3,51.3</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>
<Placemark><name>Ride</name><styleUrl>#red</styleUrl><TimeStamp><when>2024-05-01T10:00:00Z</when></TimeStamp><LineString><coordinates>12.3,51.3 12.31,51.31</coordinates></LineString></Placemark>
</Folder></Document></kml>`;

describe('kmlToKmz', () => {
  it('should pack the original KML unchanged as doc.kml', async () => {
    const blob = await kmlToKmz(KML);
    const zip = await JSZip.loadAsync(blob);
    expect(Object.keys(zip.files)).toEqual(['doc.kml']);
    expect(await zip.file('doc.kml').async('string')).toBe(KML);
  });

  it('should reject text that is not KML', async () => {
    await expect(kmlToKmz('<gpx><trk/></gpx>')).rejects.toThrow('Not a KML file');
    await expect(kmlToKmz('not xml at all')).rejects.toThrow('Not a KML file');
  });
});
