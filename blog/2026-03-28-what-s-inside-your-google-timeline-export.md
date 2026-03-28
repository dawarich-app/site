---
slug: whats-inside-your-google-timeline-export
title: "What's Inside Your Google Timeline Export (And What You Can Do With It)"
authors: evgenii
tags: [guides, google-timeline]
---

So you've exported your Google Timeline data. Maybe you heard about the shutdown and panic-downloaded everything. Maybe you just wanted to see what Google knows about you. Either way, you now have a ZIP file sitting on your desktop, and you're staring at a bunch of JSON thinking "what am I looking at?"

I maintain [Dawarich](https://dawarich.app), which imports all of these formats, so I've spent more time than I'd like reading Google's location JSON. Here's everything I know about what's inside your export — every field, every quirk, every format Google has shipped over the years.

<!-- truncate -->

## Three formats, one mess

Google has shipped three different export formats over the years. Which one you get depends on when you exported, how you exported, and seemingly what mood their servers were in that day. Some people get one, some get all three. So the first thing is figuring out what you're dealing with.

Here's the quick version:

- **Records.json** — Raw GPS pings. Every location reading your phone ever reported. The oldest and most common format from Google Takeout.
- **Semantic Location History** — Monthly JSON files with Google's *interpretation* of your movements. Place visits, activity segments, confidence scores. Structured and readable, but heavily processed.
- **Phone Takeout format** — The newer format you get when exporting directly from Google Maps on your phone. Contains `semanticSegments`, `rawSignals`, and `userLocationProfile`. Same data, completely different structure. Because consistency is apparently optional at Google.

Let's go through each one, field by field.

---

## Format 1: Records.json

This is the big one. A single JSON file containing every raw GPS ping Google ever collected from your devices. I've seen people with Records.json files north of 500MB, spanning a decade of tracking. It's a flat array of location objects wrapped in a `locations` key.

Here's what a typical entry looks like:

```json
{
  "locations": [
    {
      "latitudeE7": 533690550,
      "longitudeE7": 836950010,
      "accuracy": 22,
      "altitude": 150,
      "verticalAccuracy": 10,
      "heading": 270,
      "velocity": 15,
      "source": "WIFI",
      "deviceTag": 1184882232,
      "platformType": "ANDROID",
      "batteryCharging": true,
      "timestamp": "2024-06-15T14:21:29.460Z",
      "activity": [
        {
          "timestampMs": "1718460089460",
          "activity": [
            { "type": "STILL", "confidence": 100 }
          ]
        }
      ]
    }
  ]
}
```

Now let's go through every field.

### latitudeE7, longitudeE7

Your coordinates, stored as integers in "E7" format. Divide by 10,000,000 (10⁷) to get actual decimal degrees.

So `latitudeE7: 533690550` means latitude `53.3690550`. And `longitudeE7: 836950010` means longitude `83.6950010`.

Why E7? Because integers are faster to process and compare than floating-point numbers, and seven decimal places gives you about 1.1 centimeter precision — way more than any phone GPS can actually deliver. It's an engineering decision that makes sense at Google's scale but makes your export files annoying to read by eye.

### timestamp / timestampMs

When the location was recorded. Google has used two different formats over the years:

- **`timestamp`** — ISO 8601 string like `"2024-06-15T14:21:29.460Z"`. The newer format. Sometimes it's a Unix timestamp in seconds as a string, sometimes milliseconds as a string. Google is not consistent here.
- **`timestampMs`** — Unix timestamp in milliseconds, stored as a string (not a number, because JavaScript has integer precision issues at these magnitudes). `"1718460089460"` means June 15, 2024 at 14:21:29 UTC.

Older exports tend to have `timestampMs`. Newer ones have `timestamp`. Some entries have both.

### accuracy

Horizontal accuracy in meters. How confident the device was about the location reading. Lower is better.

- `accuracy: 3-10` — GPS lock, outdoors, good conditions. Your reading is within a few meters of reality.
- `accuracy: 15-50` — Mixed GPS/WiFi positioning. Good enough for street-level accuracy.
- `accuracy: 100-200` — WiFi-only or cell tower positioning. You're probably in the right neighborhood.
- `accuracy: 1000+` — Cell tower triangulation only. Could be off by a kilometer. Google still recorded it.

This field is important because it tells you how trustworthy each data point is. A point with accuracy of 18,000 meters is essentially useless for precise location tracking — but Google saved it anyway.

### altitude

Elevation above sea level in meters, as reported by the device. This comes from the phone's barometer or GPS altitude estimate.

GPS altitude is notoriously inaccurate — it can easily be off by 10-30 meters because GPS satellites are optimized for horizontal positioning. Phone barometers are more accurate for relative changes (like climbing stairs) but need calibration for absolute altitude.

Not every location entry has this field. It depends on whether the device's sensors provided it.

### verticalAccuracy

The estimated accuracy of the altitude reading, in meters. Same concept as `accuracy` but for the vertical dimension. If `altitude` is 150 and `verticalAccuracy` is 10, the true altitude is likely between 140 and 160 meters.

This field appears less frequently than `altitude` itself.

### heading

The direction the device was moving, in degrees from true north (0-360). 0 is north, 90 is east, 180 is south, 270 is west.

Only present when the device was actually moving and had a reliable heading reading. Static readings won't have this field.

### velocity

Speed in meters per second at the time of recording. Multiply by 3.6 to get km/h, or by 2.237 for mph.

So `velocity: 15` means roughly 54 km/h — probably driving in a city. Like `heading`, this is only present when the device detected movement.

### source

Where the location reading came from. Values I've seen in the wild:

- `"GPS"` — Satellite positioning. The gold standard for outdoor locations.
- `"WIFI"` — WiFi access point triangulation. Common indoors.
- `"CELL"` — Cell tower triangulation. Least accurate but works everywhere with signal.
- `"UNKNOWN"` — Google doesn't know or won't say. Early exports tend to have a lot of these.

This tells you a lot about the quality of individual data points. A `GPS` reading with `accuracy: 5` is very reliable. An `UNKNOWN` reading with `accuracy: 18000` is barely useful.

### deviceTag

A numeric identifier for which device recorded this location. It's a hash, not a human-readable device name. If you used multiple phones over the years, you'll see different `deviceTag` values.

Google doesn't include a mapping from deviceTag to device names in the export. So if you want to know which device produced which points, you'd have to correlate based on time periods and cross-reference with your account's device history.

### platformType

The operating system of the device. Values include `"ANDROID"` and `"IOS"`. Pretty self-explanatory.

### batteryCharging

A boolean (`true`/`false`) indicating whether the device was plugged in when the location was recorded. Might seem like an odd thing to track, but it's useful for Google's algorithms — a phone that's been charging at the same location for 8 hours is probably at home, not in transit.

### activity

This is the most complex field in Records.json. It's an array of activity recognition snapshots, each with its own timestamp and a list of probable activity types with confidence scores.

```json
"activity": [
  {
    "timestampMs": "1718460089460",
    "activity": [
      { "type": "STILL", "confidence": 100 },
      { "type": "IN_VEHICLE", "confidence": 2 },
      { "type": "ON_FOOT", "confidence": 1 },
      { "type": "WALKING", "confidence": 1 }
    ]
  }
]
```

The `type` values come from Android's Activity Recognition API:

- `STILL` — Not moving
- `ON_FOOT` — Walking or running (generic)
- `WALKING` — Walking specifically
- `RUNNING` — Running specifically
- `ON_BICYCLE` — Cycling
- `IN_VEHICLE` — In a motorized vehicle (car, bus, train — it doesn't distinguish)
- `IN_ROAD_VEHICLE` — More specific: in a car/bus
- `IN_RAIL_VEHICLE` — On a train or subway
- `TILTING` — Device orientation changed
- `UNKNOWN` — Couldn't determine

The `confidence` is a percentage (0-100). Multiple activities can have non-zero confidence — the device is essentially saying "I'm 70% sure you're in a vehicle, 20% sure you're on foot, 10% no idea."

The activity timestamp is separate from the location timestamp because activity recognition runs on a different schedule than GPS readings. Sometimes you'll see activity data without a corresponding location update, or vice versa.

---

## Format 2: Semantic Location History

These are monthly JSON files, organized in folders by year: `Semantic Location History/2024/2024_MARCH.json`. Instead of raw GPS pings, these contain Google's *interpreted* version of your movements — place visits and activity segments.

The top-level structure:

```json
{
  "timelineObjects": [
    { "activitySegment": { ... } },
    { "placeVisit": { ... } },
    { "activitySegment": { ... } },
    ...
  ]
}
```

The `timelineObjects` array alternates between two types: activity segments (you were moving) and place visits (you were stationary at a known location). Let's look at each.

### activitySegment

An activity segment represents a period of movement from one location to another.

```json
{
  "activitySegment": {
    "startLocation": {
      "latitudeE7": 533407440,
      "longitudeE7": 837026901,
      "accuracyMetres": 25
    },
    "endLocation": {
      "latitudeE7": 533519706,
      "longitudeE7": 837596359,
      "accuracyMetres": 30
    },
    "duration": {
      "startTimestamp": "2024-03-15T07:05:14.222Z",
      "endTimestamp": "2024-03-15T07:11:13.214Z"
    },
    "distance": 3853,
    "confidence": "LOW",
    "activities": [
      { "activityType": "IN_VEHICLE", "probability": 0.0 },
      { "activityType": "WALKING", "probability": 0.0 },
      { "activityType": "CYCLING", "probability": 0.0 }
    ],
    "waypointPath": {
      "waypoints": [
        { "latE7": 533410301, "lngE7": 837051010 },
        { "latE7": 533519706, "lngE7": 837596359 }
      ],
      "source": "BACKFILLED",
      "distanceMeters": 4877.0,
      "travelMode": "DRIVE",
      "confidence": 1.0
    },
    "editConfirmationStatus": "NOT_CONFIRMED"
  }
}
```

**startLocation / endLocation** — Where the movement began and ended. Same E7 coordinate format as Records.json, with an `accuracyMetres` field.

**duration** — `startTimestamp` and `endTimestamp` define the time window. Can be ISO 8601 strings or millisecond timestamps (`startTimestampMs`), depending on export age.

**distance** — Total distance in meters, as estimated by Google.

**confidence** — How confident Google is about this segment. Values: `HIGH`, `MEDIUM`, `LOW`. A `LOW` confidence segment means Google is guessing about your movement. `BACKFILLED` segments (see `waypointPath.source`) are particularly unreliable — Google is reconstructing movement it didn't actually track in real time.

**activities** — An array of possible transportation modes with probability scores. The `activityType` values are the same as in Records.json (`WALKING`, `CYCLING`, `IN_VEHICLE`, etc.). The `probability` values are floats from 0.0 to 1.0. Annoyingly, you'll often see all probabilities at 0.0 — Google knows you moved but can't determine how.

**waypointPath** — The actual route taken, as a series of coordinate waypoints.
- `waypoints` — Array of intermediate positions (note: uses `latE7`/`lngE7`, not `latitudeE7`/`longitudeE7` — because consistency).
- `source` — Where the path data came from. `"BACKFILLED"` means Google reconstructed it after the fact, not from real-time tracking.
- `distanceMeters` — Total path distance.
- `travelMode` — Google's best guess: `"WALK"`, `"DRIVE"`, `"CYCLE"`, etc. Note these are different strings from the `activityType` values — `"DRIVE"` here vs. `"IN_VEHICLE"` in activities.
- `confidence` — A float from 0.0 to 1.0 for the travel mode classification.

**editConfirmationStatus** — Whether you manually confirmed or edited this segment in Google Maps. Values: `"NOT_CONFIRMED"`, `"CONFIRMED"`. Most entries will be `NOT_CONFIRMED` because most people never edited their Timeline.

### placeVisit

A place visit represents a period where you were stationary at a known location.

```json
{
  "placeVisit": {
    "location": {
      "latitudeE7": 533690550,
      "longitudeE7": 836950010,
      "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
      "address": "123 Main Street, Anytown",
      "name": "Joe's Coffee",
      "semanticType": "TYPE_CAFE",
      "accuracyMetres": 15
    },
    "duration": {
      "startTimestamp": "2024-03-15T07:11:13.214Z",
      "endTimestamp": "2024-03-15T08:25:17.226Z"
    },
    "placeConfidence": "HIGH_CONFIDENCE",
    "otherCandidateLocations": [
      {
        "latitudeE7": 533691200,
        "longitudeE7": 836948800,
        "placeId": "ChIJABC...",
        "address": "125 Main Street, Anytown",
        "name": "Corner Bookshop",
        "semanticType": "TYPE_SHOPPING",
        "accuracyMetres": 20
      }
    ],
    "editConfirmationStatus": "NOT_CONFIRMED"
  }
}
```

**location** — The place Google thinks you visited.
- `placeId` — A Google Maps place identifier. Useful if you want to look up the place on Google Maps.
- `address` — Human-readable address. Not always present.
- `name` — Business or place name, if known. Not always present.
- `semanticType` — What kind of place it is: `"TYPE_CAFE"`, `"TYPE_HOME"`, `"TYPE_WORK"`, `"TYPE_SHOPPING"`, etc. Google's classification, not yours.
- `accuracyMetres` — How confident Google is about the specific spot within the location.

**placeConfidence** — Overall confidence that you actually visited this place. Values include `"HIGH_CONFIDENCE"`, `"MEDIUM_CONFIDENCE"`, `"LOW_CONFIDENCE"`.

**otherCandidateLocations** — Alternative places Google considered. If you were at an intersection with three coffee shops, this array lists the ones Google *didn't* pick as the top candidate. Same structure as the main `location` object. Useful if Google guessed wrong — the real place might be in here.

This is important for importing: if the primary location has no coordinates (it happens), Dawarich falls back to the first candidate in `otherCandidateLocations`. Better than losing the data point entirely.

---

## Format 3: Phone Takeout

If you exported from the Google Maps app on your phone (Settings → Personal Content → Export Timeline data), you get a completely different JSON structure. The file is usually called `location-history.json` or `Timeline.json`.

This format has three main sections: `semanticSegments`, `rawSignals`, and `userLocationProfile`.

### semanticSegments

Similar concept to Semantic Location History's `timelineObjects`, but with different field names.

**Timeline paths:**

```json
{
  "startTime": "2024-04-03T08:00:00.000+02:00",
  "endTime": "2024-04-03T10:00:00.000+02:00",
  "timelinePath": [
    {
      "point": "50.0506312°, 14.3439906°",
      "time": "2024-04-03T08:14:00.000+02:00"
    },
    {
      "point": "50.0506312°, 14.3439906°",
      "time": "2024-04-03T08:46:00.000+02:00"
    }
  ]
}
```

Notice the coordinate format here: `"50.0506312°, 14.3439906°"` — a string with degree symbols and a comma separator. Not E7 integers or decimal numbers. A formatted string with Unicode degree signs. This is a completely different convention from both Records.json and Semantic Location History.

Some timeline paths also include a `durationMinutesOffsetFromStartTime` on each point, which lets you calculate the exact timestamp for each waypoint relative to `startTime`.

**Visits:**

```json
{
  "startTime": "2024-04-03T08:13:57.000+02:00",
  "endTime": "2024-04-03T20:10:18.000+02:00",
  "startTimeTimezoneUtcOffsetMinutes": 120,
  "endTimeTimezoneUtcOffsetMinutes": 120,
  "visit": {
    "hierarchyLevel": 0,
    "probability": 0.85,
    "topCandidate": {
      "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
      "semanticType": "UNKNOWN",
      "probability": 0.45,
      "placeLocation": {
        "latLng": "50.0506312°, 14.3439906°"
      }
    }
  }
}
```

**startTimeTimezoneUtcOffsetMinutes** — The timezone offset at the start of the visit, in minutes. `120` means UTC+2. This is actually useful — it's the first time Google includes timezone info in the export, which means you can reconstruct local time without guessing.

**visit.hierarchyLevel** — Nesting level for location hierarchy. `0` is the top level. I've never seen this go above 0 in practice.

**visit.probability** — Confidence that you actually visited this place (0.0 to 1.0).

**visit.topCandidate** — The most likely place, with its own probability score, placeId, and location in that string-with-degree-signs format.

**Activities in semanticSegments** follow the same pattern but with `activity.start.latLng` and `activity.end.latLng` coordinates, plus `activity.topCandidate.type` for transportation mode (`"IN_PASSENGER_VEHICLE"`, `"WALKING"`, `"CYCLING"`, etc.).

### rawSignals

This is the stuff most people don't expect to find. Raw sensor data from your device.

**Position readings:**

```json
{
  "position": {
    "LatLng": "48.833657°, 2.256223°",
    "accuracyMeters": 13,
    "altitudeMeters": 90.7,
    "source": "WIFI",
    "timestamp": "2024-06-06T11:44:37.000+01:00",
    "speedMetersPerSecond": 0.07
  }
}
```

These are raw GPS/WiFi position readings — similar to Records.json entries but in the phone takeout's string coordinate format. Note the field names here: `accuracyMeters` instead of `accuracy`, `altitudeMeters` instead of `altitude`, `speedMetersPerSecond` instead of `velocity`. Same data, different names. Classic Google.

**WiFi scan data:**

```json
{
  "wifiScan": {
    "deliveryTime": "2024-06-06T11:44:37.000+01:00",
    "devicesRecords": [
      { "mac": 70474800562644, "rawRssi": -76 },
      { "mac": 193560579751752, "rawRssi": -50 }
    ]
  }
}
```

Yes, Google was recording every WiFi access point your phone could see, with signal strength (RSSI). The `mac` values are the MAC addresses of nearby routers, stored as integers. This is how WiFi-based positioning works — by matching the set of visible access points against Google's database of known AP locations.

This is probably the most surprising thing in the export for most people. You expected GPS coordinates, not Google to have a log of every WiFi network your phone has ever detected.

**Activity recognition records:**

```json
{
  "activityRecord": {
    "probableActivities": [
      { "type": "STILL", "confidence": 0.96 },
      { "type": "IN_VEHICLE", "confidence": 0.01 },
      { "type": "ON_FOOT", "confidence": 0.01 },
      { "type": "WALKING", "confidence": 0.01 }
    ],
    "timestamp": "2024-04-26T20:54:38.000+02:00"
  }
}
```

Same activity types as Records.json, but confidence values are floats (0.0-1.0) instead of integers (0-100). Because why use the same scale twice.

### userLocationProfile

```json
{
  "userLocationProfile": {
    "frequentPlaces": [
      {
        "placeId": "ChIJN1t...",
        "placeLocation": "50.0506312°, 14.3439906°",
        "label": "WORK"
      },
      {
        "placeId": "ChIJABC...",
        "placeLocation": "48.8336570°, 2.2562230°",
        "label": "HOME"
      }
    ]
  }
}
```

A list of places Google has identified as your frequent locations, with labels like `"HOME"` and `"WORK"`. This is Google's model of your daily routine, neatly summarized. Most people have 2-5 entries here.

The coordinates here use the same degree-sign string format as the rest of the phone takeout.

---

## The format detection problem

So you've unzipped your export and you see some JSON files. Which format are they? Here's how to tell:

- Top-level key is `"locations"` with entries containing `latitudeE7` → **Records.json**
- Top-level key is `"timelineObjects"` with `activitySegment`/`placeVisit` entries → **Semantic Location History**
- Top-level key is `"semanticSegments"` or `"rawSignals"` → **Phone Takeout**
- It's an array of objects with `visit.topCandidate` or `activity.start` → **Phone Takeout (array variant)**

Some ZIP exports contain all three. Some contain just one. The Google Takeout web interface tends to give you Records.json and Semantic Location History. The phone export gives you the phone takeout format. Sometimes you get a mix. I've seen exports where some months are in one format and other months in another.

## What you can actually do with this data

Staring at JSON isn't particularly useful. Here are some concrete things:

### Visualize it

All of these formats can be loaded into the [Google Timeline Visualizer](/tools/timeline-visualizer) and rendered on an interactive map. It runs entirely in your browser — no server upload. For a Records.json with 600k+ points, expect 20-30 seconds of processing time.

### Convert to standard formats

Google's formats are proprietary. If you want your data in GPX, GeoJSON, or KML for use with hiking apps, mapping software, or GIS tools, the [Google Timeline Converter](/tools/google-timeline-converter) handles all three formats.

### Import into Dawarich

This is the long-term play. Exporting your data preserves the past, but what about the location data you're generating right now? Google's Timeline was useful because it ran continuously in the background. Without it, that data just stops.

Dawarich imports all three Google formats — Records.json, Semantic Location History, and the phone takeout format. You bring your historical data, then set up continuous tracking going forward using OwnTracks or Overland on your phone. All the activity types, waypoints, accuracy data, and place visits get preserved.

The difference from Google? Your data stays on your server. No one's mining it for ads, no one's going to randomly deprecate the feature, and you get proper [statistics](/statistics), [trip detection](/trips), and a [map](/interactive-map) that actually works on the web — unlike Google's new mobile-only Timeline.

Either self-host it or use [Dawarich Cloud](https://my.dawarich.app/users/sign_in?utm_source=blog&utm_medium=post-cta&utm_campaign=whats-inside-your-google-timeline-export) if you don't want to manage a server. 7-day free trial, no credit card required.

## Export your data now

If you haven't done it yet: do it today. Google has already lost data for some users during the Timeline transition, and the longer you wait, the less data you'll have.

1. **Google Takeout**: Go to [takeout.google.com](https://takeout.google.com), select "Location History (Timeline)", download the archive
2. **Phone export**: Google Maps → Settings → Personal Content → Export Timeline data
3. Unzip it, look at what you got
4. Import it somewhere you control, or at least keep the files backed up

Your location history is years of your life, compressed into JSON. It's worth understanding what's in there, and it's worth keeping.
