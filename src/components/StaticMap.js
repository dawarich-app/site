import React, { useEffect, useRef } from 'react';
import styles from './StaticMap.module.css';

// This component renders a static Leaflet map with a predefined route
export default function StaticMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Only run this effect in the browser, not during SSR
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet to avoid SSR issues
    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    // Fix the broken icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
      iconUrl: require('leaflet/dist/images/marker-icon.png').default,
      shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
    });

    // Helper function to calculate distance between coordinates in kilometers
    function calculateDistance(coords) {
      let totalDistance = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        const lat1 = coords[i][0];
        const lon1 = coords[i][1];
        const lat2 = coords[i + 1][0];
        const lon2 = coords[i + 1][1];

        // Haversine formula to calculate distance between points
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        totalDistance += distance;
      }
      return totalDistance;
    }

    // Helper function to format distance
    function formatDistance(distance, unit = 'km') {
      return `${distance.toFixed(2)} ${unit}`;
    }

    // Helper function to format duration as hours and minutes
    function formatDuration(durationInHours) {
      const hours = Math.floor(durationInHours);
      const minutes = Math.round((durationInHours - hours) * 60);
      return `${hours}h ${minutes}m`;
    }

    // Berlin Mitte coordinates (simplified track)
    const berlinTrack = [
      [52.52072585114311, 13.41213233334774], // Alexanderplatz
      [52.519889254705014, 13.41359120643196],
      [52.517539485860915, 13.408526901394064],
      [52.516833821774746, 13.40865631951193],
      [52.514144180703724, 13.4057803504879],
      [52.51649479414644, 13.402605088823949],
      [52.518093822002676, 13.400453827412319],
      [52.51737516342179, 13.39317136531519],
      [52.51664063648547, 13.380808897886093],
      [52.518065250030794, 13.380490982708729],
      [52.51784149124944, 13.377041036703739],
      [52.517827548742346, 13.37506309874189],
      [52.51868126434896, 13.375293142338085],
    ];

    // Calculate total distance
    const totalDistance = calculateDistance(berlinTrack);

    // Calculate journey information based on 15 km/h average speed
    const avgSpeed = 15; // km/h
    const durationHours = totalDistance / avgSpeed;

    // Generate timestamps for yesterday between 12-17 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12 + Math.floor(Math.random() * 5)); // Random hour between 12-17
    yesterday.setMinutes(Math.floor(Math.random() * 60));

    const startTimestamp = new Date(yesterday);
    const endTimestamp = new Date(startTimestamp);
    endTimestamp.setTime(startTimestamp.getTime() + (durationHours * 60 * 60 * 1000));

    // Format timestamps
    const formatTime = (date) => {
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const firstTimestamp = formatTime(startTimestamp);
    const lastTimestamp = formatTime(endTimestamp);
    const timeOnRoute = formatDuration(durationHours);
    const speed = avgSpeed;

    // Initialize map if not already initialized
    if (!mapRef.current._leaflet_id) {
      const map = L.map(mapRef.current, {
        center: [52.51737516342179, 13.39317136531519], // Center on Gendarmenmarkt
        zoom: 14,
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add route as polyline with hover effect and click popup
      const routeLine = L.polyline(berlinTrack, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div class="${styles.routePopup}">
          <p>
            <strong>Start:</strong> ${firstTimestamp}<br>
            <strong>End:</strong> ${lastTimestamp}<br>
            <strong>Duration:</strong> ${timeOnRoute}<br>
            <strong>Total Distance:</strong> ${formatDistance(totalDistance)}<br>
            <strong>Average Speed:</strong> ${Math.round(speed)} km/h
          </p>
        </div>
      `;

      // Add popup to the middle of the route
      const popupLocation = berlinTrack[Math.floor(berlinTrack.length / 2)];
      const popup = L.popup({
        closeButton: true,
        className: styles.customPopup,
        maxWidth: 300
      })
        .setLatLng(popupLocation)
        .setContent(popupContent);

      // Add hover effect
      routeLine.on('mouseover', function(e) {
        routeLine.setStyle({
          color: 'yellow', // Yellow color on hover
          weight: 6
        });
      });

      routeLine.on('mouseout', function(e) {
        routeLine.setStyle({
          color: '#3b82f6', // Return to blue when not hovering
          weight: 4
        });
      });

      // Add click handler to show popup
      routeLine.on('click', function(e) {
        map.openPopup(popup);
      });

      // Add start marker with traffic light emoji 🚥
      L.marker(berlinTrack[0], {
        icon: L.divIcon({
          className: styles.emojiMarker,
          html: '🚥',
          iconSize: [48, 48],
          iconAnchor: [24, 24], // Center point of the icon
        }),
      }).addTo(map);

      // Add finish marker with checkered flag emoji 🏁
      L.marker(berlinTrack[berlinTrack.length - 1], {
        icon: L.divIcon({
          className: styles.emojiMarker,
          html: '🏁',
          iconSize: [48, 48],
          iconAnchor: [24, 24], // Center point of the icon
        }),
      }).addTo(map);

      // Add intermediate waypoints
      berlinTrack.slice(1, -1).forEach(coord => {
        L.circleMarker(coord, {
          radius: 4,
          fillColor: '#3b82f6',
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
        }).addTo(map);
      });
    }

    // Cleanup function
    return () => {
      if (mapRef.current && mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }
    };
  }, []);

  return (
    <div ref={mapRef} className={styles.mapContainer} />
  );
}
