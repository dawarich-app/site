import exifr from 'exifr';

/**
 * Extract GPS coordinates and other metadata from a photo file
 * @param {File} file - The photo file
 * @returns {Promise<Object|null>} GPS data or null if not found
 */
export async function extractPhotoGeodata(file) {
  try {
    // Parse EXIF data - first try with full parsing to get GPS data
    const exif = await exifr.parse(file, {
      gps: true,
      tiff: true,
      xmp: true,
      icc: false,
      iptc: false,
      jfif: false,
      ihdr: false,
    });

    console.log(`[EXIF] Parsed data for ${file.name}:`, exif);

    if (!exif) {
      console.log(`[EXIF] No EXIF data found in ${file.name}`);
      return null;
    }

    // Check for GPS data - exifr returns latitude/longitude directly
    const latitude = exif.latitude;
    const longitude = exif.longitude;

    if (latitude === undefined || longitude === undefined) {
      console.log(`[EXIF] No GPS coordinates found in ${file.name} - lat: ${latitude}, lng: ${longitude}`);
      return null;
    }

    // Extract altitude
    const altitude = exif.GPSAltitude || exif.altitude || null;

    // Extract timestamp - try multiple fields
    let timestamp = null;
    if (exif.DateTimeOriginal) {
      timestamp = exif.DateTimeOriginal;
    } else if (exif.CreateDate) {
      timestamp = exif.CreateDate;
    } else if (exif.ModifyDate) {
      timestamp = exif.ModifyDate;
    } else if (exif.DateTime) {
      timestamp = exif.DateTime;
    }

    console.log(`[EXIF] ✓ Found GPS data in ${file.name} - lat: ${latitude}, lng: ${longitude}, alt: ${altitude}, time: ${timestamp}`);

    // Create thumbnail from the file
    const thumbnail = await createThumbnail(file);

    return {
      latitude,
      longitude,
      altitude,
      timestamp: timestamp ? new Date(timestamp).toISOString() : null,
      thumbnail,
    };
  } catch (error) {
    console.error(`[EXIF] Error parsing ${file.name}:`, error);
    return null;
  }
}

/**
 * Create a thumbnail from an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} Data URL of the thumbnail
 */
async function createThumbnail(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for thumbnail
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate thumbnail size (max 200x200, maintain aspect ratio)
        const maxSize = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw scaled image
        ctx.drawImage(img, 0, 0, width, height);

        // Return thumbnail as data URL
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      resolve(null);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Convert decimal GPS coordinates to degrees/minutes/seconds format
 * @param {number} decimal - Decimal coordinate
 * @param {boolean} isLatitude - True for latitude, false for longitude
 * @returns {string} Formatted coordinate
 */
export function formatGPSCoordinate(decimal, isLatitude) {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  const direction = isLatitude
    ? (decimal >= 0 ? 'N' : 'S')
    : (decimal >= 0 ? 'E' : 'W');

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}
