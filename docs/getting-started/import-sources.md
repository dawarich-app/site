---
sidebar_position: 3.5
title: Get Your Data Out of Other Apps
description: Step-by-step guides for exporting location history from Strava, Garmin Connect, Polarsteps, Google Photos, Google Earth, CSV tools and PhotoPrism, and importing it into Dawarich.
---

# Get your data out of other apps

Every app hides its export in a different place. This page shows where to find it for each source Dawarich can import, and which file to upload once you have it.

You don't need to tell Dawarich what kind of file you're uploading. Go to **Imports → New import**, select one or more files and submit the form — the format is detected automatically from the file itself.

## Which file do I need?

| Source | File to upload | Guide |
| --- | --- | --- |
| Google Maps Timeline (phone) | `Timeline.json` / `location-history.json` | [Google Maps app export](/docs/getting-started/import-existing-data#google-maps-app-export) |
| Google Takeout (old Location History) | `Records.json`, Semantic Location History `.json` | [Google Takeout](/docs/getting-started/import-existing-data#google-takeout-legacyoutdated) |
| Google Photos | Takeout `.zip` | [Google Photos](#google-photos) |
| Strava | `.gpx`, `.fit`, `.tcx` | [Strava](#strava) |
| Garmin Connect | `.fit`, `.gpx`, `.tcx` | [Garmin Connect](#garmin-connect) |
| Other fitness apps and watches | `.gpx`, `.fit`, `.tcx` | [Other fitness apps](#other-fitness-apps-and-devices) |
| Polarsteps | `locations.json` of each trip | [Polarsteps](#polarsteps) |
| Google Earth and other KML tools | `.kml`, `.kmz` | [KML and KMZ](#kml-and-kmz) |
| Spreadsheets and logger apps | `.csv` | [CSV](#csv) |
| OwnTracks | `.rec` | [OwnTracks](/docs/getting-started/import-existing-data#owntracks-and-dawarich) |
| Any GPX track | `.gpx` | [GPX routes](/docs/getting-started/import-existing-data#gpx-routes) |
| Foursquare Swarm | `checkins*.json` | [Foursquare Swarm](/docs/getting-started/import-existing-data#foursquare-swarm) |
| Immich, PhotoPrism | No file — connected by API | [Immich and PhotoPrism](#immich-and-photoprism) |
| Photos on your computer | `.gpx` built with exiftool | [GPS coordinates from photos](/docs/getting-started/import-existing-data#importing-gps-coordinates-from-photos) |
| Another Dawarich instance | Dawarich account export | [User data import](/docs/features/imports#user-data-import) |

### Uploading a ZIP archive

You can upload a `.zip` instead of individual files. Dawarich unpacks it and creates one import for every supported file inside (`.gpx`, `.json`, `.geojson`, `.kml`, `.kmz`, `.csv`, `.tcx`, `.fit`, `.rec`).

Two things are **not** unpacked for you:

- **Gzipped files** (`.gz`, such as `.fit.gz` or `.gpx.gz`). Decompress them first.
- **ZIP files inside the ZIP.** Extract them first and upload their contents.

Each import is named after its file name, without the folder. If two files in one archive share a name (for example `locations.json` in two different folders), only the first one is imported — rename them first.

An archive may hold at most 25,000 files and unpack to at most 2 GB. On a self-hosted instance, the size limit can be raised with the `ZIP_MAX_EXTRACTED_SIZE` environment variable (in bytes).

## Google Photos

Google Photos keeps the place and time of each photo in a separate `.json` file next to it in a Google Takeout export. Dawarich reads those files and adds one point for every photo that has a location.

1. Go to [Google Takeout](https://takeout.google.com/).
2. Click **Deselect all**, then select only **Google Photos**.
3. Choose `.zip` as the file type. Pick the smallest archive size offered, so each archive stays under the 2 GB unpack limit above.
4. Wait for Google's email and download every archive.
5. Upload the `.zip` files to Dawarich as they are. Dawarich picks out the `.json` files and ignores the photos themselves.

Google sometimes puts a photo and its `.json` file in different archives. That doesn't matter here: each `.json` file is read on its own.

Photos without a location (or with `0, 0` as their location) are skipped.

## Strava

Strava exports work from the website only, not from the app.

### Your whole history

1. On [strava.com](https://www.strava.com), hover over your name in the top-right corner and choose **Settings**.
2. Open **My Account** in the left menu.
3. Under **Download your account**, click **Get Started**, then **Request download**.
4. Strava emails you a link. This can take a few hours.

The archive contains an `activities` folder with one file per activity, in the format it was recorded in: `.gpx`, `.fit` or `.tcx`. Many of them are gzipped (`.fit.gz`, `.gpx.gz`), and Dawarich can't read gzipped files. Before uploading:

1. Unzip the archive.
2. Decompress every `.gz` file in the `activities` folder. On macOS and Linux, run `gunzip activities/*.gz`. On Windows, use a tool such as 7-Zip.
3. Upload the files from the `activities` folder, or zip that folder and upload the zip.

Don't upload the whole Strava archive as is: the gzipped activities would be skipped, and its other `.csv` and `.json` files aren't location history.

### A single activity

1. Open the activity on [strava.com](https://www.strava.com).
2. Open the **⋯** (more) menu.
3. Choose **Export GPX**, or **Export Original** to get the file as it was recorded (often `.fit`).

Activities recorded without GPS have no location data and import nothing.

## Garmin Connect

### A single activity

1. Open the activity on [connect.garmin.com](https://connect.garmin.com) in a web browser.
2. Click the gear icon at the top right of the activity page.
3. Choose **Export Original** for the `.fit` file, or export to GPX or TCX.

**Export Original** downloads a `.zip` with the `.fit` file inside. You can upload that zip directly.

### Your whole history

Garmin lets you request a full copy of your account from its **Account Data Management** page, under **Export Your Data**. Garmin emails you a download link when the archive is ready, which can take a while.

Your activities are inside that archive as `.zip` files nested within other folders. Dawarich doesn't open nested zips, so extract them first and upload the `.fit` files they contain.

## Other fitness apps and devices

Most sports watches, bike computers and workout apps can export an activity as **GPX**, **FIT** or **TCX**. Dawarich imports all three. Look for an "Export" or "Download" option on the activity in the app's website or desktop software.

- **GPX** — a recorded track. Planned routes are ignored, see [GPX routes](/docs/getting-started/import-existing-data#gpx-routes).
- **FIT** — the binary file most devices record natively. Dawarich imports the position, time, altitude, speed and sport of every record.
- **TCX** — Garmin's Training Center format. Dawarich imports trackpoints with position, time, altitude and speed.

When an app offers several formats, any of them works. Pick the original format if you want the sport type to carry over.

## Polarsteps

Polarsteps exports work from a desktop browser, not from the app.

1. Log in at [polarsteps.com](https://www.polarsteps.com) on a computer.
2. Click your name in the top-right corner and open **Account settings**.
3. In the privacy section, find **Download my data** and request your data.
4. Polarsteps emails you a download link. You'll be asked to confirm your identity before downloading.

Unzip the download. Each trip has its own folder with a `locations.json` (your route) and a `trip.json` (your steps and texts).

Upload the **`locations.json`** file of every trip you want to import. Don't upload `trip.json` or the whole archive — only `locations.json` holds the route Dawarich imports.

Every trip's file has the same name, so **rename each one before uploading** — for example `iceland-2024-locations.json`. Dawarich recognises the file by its content, not its name.

## KML and KMZ

KML is the format of Google Earth and many GPS logging apps. KMZ is a zipped KML. Dawarich imports both.

Dawarich builds your timeline from points that have a **time**. In a KML file, that means:

- tracks with a time for each position (`<gx:Track>` with `<when>` elements),
- placemarks with a `<TimeStamp>` or `<TimeSpan>`,
- placemarks named like `2024-05-01 08:00 - 2024-05-01 09:30`, whose line is spread evenly over that time range.

Placemarks without any time are skipped. Most maps you draw by hand in Google My Maps or Google Earth have no times, so they import 0 points.

To save a KML from Google Earth Pro, right-click the place or folder in the **Places** panel, choose **Save Place As**, and pick KML or KMZ.

If an app can export both KML and GPX, choose GPX: it is better supported.

## CSV

A CSV file works if it has a header row with at least a latitude, a longitude and a time column. Dawarich recognises common column names:

| Field | Accepted column names |
| --- | --- |
| Latitude | `lat`, `latitude`, `y` |
| Longitude | `lon`, `lng`, `long`, `longitude`, `x` |
| Time | `timestamp`, `time`, `date`, `datetime`, `when`, `created_at`, `recorded_at`, `fixTime`, `tst` — or separate `date` and `time` columns |
| Altitude (optional) | `altitude`, `alt`, `ele`, `elevation`, `height` |
| Speed (optional) | `speed`, `velocity`, `vel` |
| Accuracy (optional) | `accuracy`, `acc`, `horizontal_accuracy`, `hdop` |
| Battery (optional) | `battery`, `batt`, `bat`, `battery_level` |
| Heading (optional) | `heading`, `bearing`, `course` |
| Device (optional) | `tracker_id`, `tid`, `device_id`, `device` |

Column names are case-insensitive. Also accepted:

- **Separators:** comma, semicolon or tab. Semicolon-separated files may use a decimal comma (`52,5200`).
- **Coordinates:** decimal degrees (`52.52`), degrees with a direction letter (`52.52N`, `13.40E`), or E7 integers (`525200000`).
- **Times:** ISO 8601 (`2024-05-01T08:00:00Z`), Unix seconds or Unix milliseconds.

Times without a time zone are read in your Dawarich instance's time zone. Include an offset or `Z` to be safe.

```csv
latitude,longitude,timestamp,altitude
52.5200,13.4050,2024-05-01T08:00:00Z,34
52.5210,13.4070,2024-05-01T08:01:00Z,35
```

The file name must end in `.csv`.

## Immich and PhotoPrism

Immich and PhotoPrism don't need an export: Dawarich connects to them and reads the location of your photos directly.

1. Add your instance's URL and API key in Dawarich's settings — see [Photos](/docs/features/photos) for where to find the key.
2. On the **Imports** page, click **Import from Immich** or **Import from Photoprism**.

Every photo with a location becomes a point on your map.
