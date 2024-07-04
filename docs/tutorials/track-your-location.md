---
sidebar_position: 1
---

# Track your location

Dawarich allows you to track your location using [Overland](https://overland.p3k.app/) or [OwnTracks](https://owntracks.org/) mobile application.

## API

Dawarich provides an API for tracking your location. You can use the API to send your location data to Dawarich. Overland and OwnTracks are supposed to send their data to appropriate endpoints. You can find the API documentation at `/api-docs` endpoint of your Dawarich instance, and you can find the API key in the *Account* section.

## Overland

1. Install the Overland app on your mobile device.
2. Open the app and go to the settings.
3. Slide to unlock the settings.
4. Tap on the "Receiver Endpoint URL" field.
5. Paste the following URL: `http://<your-dawarich-instance>/api/v1/overland/batches?api_key=<your-api-key>`.
6. You can also set something to the "Device ID" field.
7. Tap on the "Save" button.
8. You're all set! Overland will start sending your location data to Dawarich.

## OwnTracks

1. Install the OwnTracks app on your mobile device.
2. Open the app and go to the settings ("i" icon in top left corner).
3. Tap on the "Settings" button.
4. Select "HTTP" mode.
5. Set the "Host" field to `<your-dawarich-instance>`.
6. Tap on the "URL" field.
7. Paste the following URL: `http://<your-dawarich-instance>/api/v1/owntracks/points?api_key=<your-api-key>`.
8. Tap on "Back" button (top left corner).
9. You're all set! OwnTracks will start sending your location data to Dawarich.
