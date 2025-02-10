---
sidebar_position: 1
---

# Track your location

Dawarich allows you to track your location using [Overland](https://overland.p3k.app/), [OwnTracks](https://owntracks.org/) or [GPSLogger](https://gpslogger.app/) mobile application.

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
5. Tap on the "URL" field.
6. Paste the following URL: `http://<your-dawarich-instance>/api/v1/owntracks/points?api_key=<your-api-key>`.
7. Tap on "Back" button (top left corner).
8. You're all set! OwnTracks will start sending your location data to Dawarich.

## GPS Logger

*Kudos to @werner-kapferer-lgs for this! [Source](https://github.com/Freika/dawarich/discussions/118#discussion-6923665)*

The configuration of GPSLogger is pretty simple and straightforward, so I want to share it with you:

- URL: `http://<your-dawarich-instance>/api/v1/owntracks/points?api_key=YOUR_API_KEY`
- HTTP Body:

```json
{
    "_type" : "location",
    "t": "u",
    "acc": "%ACC",
    "alt": "%ALT",
    "batt": "%BATT",
    "bs": "%ISCHARGING",
    "lat": "%LAT",
    "lon": "%LON",
    "tst": "%TIMESTAMP",
    "vel": "%SPD"
}
```

- HTTP Headers:

```
Content-Type: application/json
```

- HTTP Method: `POST`

## Home Assistant

There is a way to have your geolocation data from Home Assistant in Dawarich. It might be useful for those who already have Home Assistant and don't want to use another app for tracking.

For a customized integration, follow the guide available on GitHub: [Home Assistant integration](https://github.com/Freika/dawarich/discussions/77#discussioncomment-9904099).
Alternatively, you can install the HACS integration: [dawarich-home-assistant](https://github.com/AlbinLind/dawarich-home-assistant).
