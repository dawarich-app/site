---
sidebar_position: 1
title: Track Your Location
description: Set up location tracking using the Dawarich app, Overland, OwnTracks, Traccar, or GPSLogger mobile applications.
---

# Track your location

Dawarich allows you to track your location using [Overland](https://overland.p3k.app/), [OwnTracks](https://owntracks.org/), [Traccar Client](https://www.traccar.org/client/) or [GPSLogger](https://gpslogger.app/) mobile application.

## API

Dawarich provides an API for tracking your location. You can use the API to send your location data to Dawarich. Overland and OwnTracks are supposed to send their data to appropriate endpoints. You can find the API documentation at `/api-docs` endpoint of your Dawarich instance, and you can find the API key in the *Account* section.

## Dawarich iOS

1. Install the Dawarich iOS app on your mobile device.
2. Open the app and go to the settings.
3. Set your API key.
4. Tap on the "Save" button.
5. You're all set! Dawarich will start tracking your location.

## Dawarich Android

### Official
1. Install the Dawarich Android app on your mobile device.
2. Open the app and go to the settings.
3. Set your server URL and API key.
4. Tap on the "Save" button.
5. You're all set! Dawarich will start tracking your location.

### Community
1. Install the Dawarich Community app on your mobile device.
   Download:
   - [GitHub Releases](https://github.com/sunstep/dawarich-android/releases)
   - [Google Play Store](https://play.google.com/store/apps/details?id=com.sunstep.dawarich)
2. Open the app and choose whether you are self-hosting or using a hosted instance.
3. Enter your server URL if you connect to a self hosted instance and API key, or scan the QR code from your Dawarich account settings.
4. Connect and complete the permissions onboarding flow.
5. Enable tracking from the tracker page, and the app starts tracking.

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

## Traccar Client

Dawarich accepts data from [Traccar Client](https://www.traccar.org/client/) (Android and iOS) using its modern JSON protocol (Traccar Client v9.0 or newer).

1. Install Traccar Client on your mobile device.
2. Open the app and go to settings.
3. Set the **Server URL** to: `http://<your-dawarich-instance>/api/v1/traccar/points?api_key=<your-api-key>`.
4. Pick a **Device Identifier** — this is stored on the point as `tracker_id`, useful if you push from multiple devices to one account.
5. Enable the service. Traccar Client will start sending your location to Dawarich.

:::note
Dawarich only supports the JSON payload sent by Traccar Client v9+. The legacy OsmAnd query-string protocol used by older clients and some third-party trackers is not supported on this endpoint — use the OwnTracks endpoint with those instead.
:::

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

## PhoneTrack

[PhoneTrack](https://f-droid.org/packages/net.eneiluj.nextcloud.phonetrack/) supports logging to any backend using [Custom Log Jobs](https://gitlab.com/eneiluj/phonetrack-android/-/wikis/userdoc#custom-log-jobs), which can be used with Dawarich's OwnTracks API endpoint.

Simply create a new Custom Log Job in PhoneTrack with the following details:

- Target address: `https://<your-dawarich-instance>/api/v1/owntracks/points?api_key=<your-api-key>&_type=location&acc=%ACC&alt=%ALT&batt=%BATT&bs=0&cog=%DIR&lat=%LAT&lon=%LON&tst=%TIMESTAMP&vel=%SPD`
- Use POST method: ✅ Yes
- Send JSON payload instead of key/value pairs: ❌ No
- HTTP login: _(blank)_
- HTTP password: _(blank)_

Note that we have to disable Send JSON payload because it also moves api_key into the JSON entity, which Dawarich does not accept. Fortunately, Dawarich happens to support accepting the data as querystring parameters.

The data sent includes vel (velocity) in meters per second, defined in the [OwnTracks JSON format](https://owntracks.org/booklet/tech/json/) in kilometers per hour. This works so long as we don't include a topic thanks to Dawarich's special handling documented in https://github.com/Freika/dawarich/releases/tag/0.24.0

It also includes _cog_ (Course over ground) as a float, defined in the OwnTracks JSON format as an integer, although this is not currently used by Dawarich.

PhoneTrack offers two more datapoints that don't seem to have a direct mapping to the OwnTracks JSON format:

    %SAT : the number of satellites used to get the position (integer)
    %UA : user agent, something like PhoneTrack/v0.0.1

You may include %SAT as part of an OwnTracks tag like `&tag=satellites/%SAT`, although this is not currently used by Dawarich.

## Home Assistant

There is a way to have your geolocation data from Home Assistant in Dawarich. It might be useful for those who already have Home Assistant and don't want to use another app for tracking.

For a customized integration, follow the guide available on GitHub: [Home Assistant integration](https://github.com/Freika/dawarich/discussions/77#discussioncomment-9904099).
Alternatively, you can install the HACS integration: [dawarich-home-assistant](https://github.com/AlbinLind/dawarich-home-assistant).
