---
sidebar_position: 2
---

# Dawarich vs OwnTracks

OwnTracks is a combination of a mobile app for iOS and Android and a backend service that stores the location data. It is a self-hosted solution that can be run on your own server.

This page compares Dawarich with OwnTracks to help you understand the differences and choose the best option for your needs.

## Legend

- ✅ **Fully supported** - Feature is available and well-implemented
- ⚠️ **Partially supported** - Feature exists but with limitations
- ❌ **Not supported** - Feature is not available

## Feature Comparison

| Feature | Dawarich | OwnTracks |
|---------|----------|-----------|
| **Privacy & Data Control** |
| Own your data | ✅ | ✅ |
| No data sharing with third parties | ✅ | ✅ |
| Self-hosted | ✅ | ✅ |
| Cloud-based subscription | ✅ | ❌ |
| **Location Tracking** |
| Automatic location tracking | ✅ (iOS) | ✅ |
| Manual location logging | ✅ (iOS) | ❌ |
| GPS accuracy settings | ✅ (iOS) | ✅ |
| Geofencing | ❌ | ✅ |
| **Data Import/Export** |
| Google Takeout import | ✅ (web) | ❌ |
| GPX import | ✅ (web) | ❌ |
| GeoJSON import | ✅ (web) | ❌ |
| JSON export | ✅ (web) | ❌ |
| GPX export | ✅ (web) | ❌ |
| **Visualization** |
| Interactive map | ✅ (web, iOS) | ⚠️ (basic web) |
| Timeline view | ⚠️ (planned) | ❌ |
| Heatmap | ✅ (web) | ✅ |
| Statistics dashboard | ✅ | ❌ |
| **Places & Areas** |
| Custom areas | ✅ (web) | ✅ |
| Place detection | ✅ | ❌ |
| Visit duration tracking | ✅ | ❌ |
| **Photos** |
| Photo geotagging | ❌ | ❌ |
| Photo timeline integration | ✅ (web<sup>1</sup>) | ❌ |
| **Trips & Analysis** |
| Trip creation | ✅ (web) | ❌ |
| Distance tracking | ✅ (web) | ❌ |
| Transport mode detection | ⚠️ (planned) | ❌ |
| **Technical Features** |
| API access | ✅ | ✅ |
| MQTT support | ❌ | ✅ |
| HTTP mode | ✅ | ✅ |
| **Platform Support** |
| Web interface | ✅ | ⚠️ (basic) |
| iOS app | ✅ | ✅ |
| Android app | ⚠️ (planned) | ✅ |
| **Setup & Maintenance** |
| Easy installation | ✅ (Docker) | ⚠️ (technical) |
| User management | ✅ | ❌ |

<sup>1</sup> Photo timeline integration is available in the web interface, but currently only works with Immich and Photoprism.
