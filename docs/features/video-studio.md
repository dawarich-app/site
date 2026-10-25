---
sidebar_position: 2.2
title: Video Studio
description: Turn a route or a trip into an animated MP4 replay with a distance and date readout. Rendered in your browser, in vertical, widescreen or square format.
---

# Video Studio

Video Studio turns a route on your map, or a whole trip, into a short animated video. The route draws itself across the map while a readout shows the distance and the date, and the video ends on a summary frame. The result is an MP4 file you keep in your gallery and download from there.

The video is rendered on your own device. Nothing leaves your browser until you click **Save to gallery**.

## Opening the studio

- **From the map:** click **Video Studio** in the button strip on the left of the [map](/docs/features/map).
- **From a trip:** on a trip's page, click **Create a replay video of this trip**. The button becomes available once the trip's route has been calculated.

Video Studio and [Poster Studio](/docs/features/poster-studio) share the same switch in the studio's top-left corner, so you can move between them in one click.

## Choosing the dates

Set the **Start date and time** and **End date and time** at the top and click **Load**. You can pick exact times, for example to cut a video down to a single afternoon.

## Format

| Format | Size | Good for |
|--------|------|----------|
| **Story · 9:16** | 1080 × 1920, vertical | Stories, Reels, Shorts |
| **Wide · 16:9** | 1920 × 1080, widescreen | YouTube, presentations |
| **Feed · 1:1** | 1080 × 1080, square | Feed posts |

## Visualization

**Mode** chooses how the route is shown:

- **Route replay** draws the route as a line, with a marker at the current position.
- **Fog of War** covers the map and clears it along your route. **Overlay colour** and **Overlay opacity** set the look of the fog; **Reset** restores the default color.

**Theme** picks one of the map themes. Under **Route** you can turn **Show route** and **Show marker** on or off independently, and set the **Route colour** and **Route width**.

## Playback

- **Length** — the video's duration, from 8 to 30 seconds.
- **Camera** — **Whole route** keeps the entire route in view; **Follow the line** moves the camera along with the marker.
- **Units** — **Kilometres** or **Miles** for the distance readout.
- **Overlay size** — scales the distance and date readout.
- **Show dawarich.app on the video** — a small watermark; turn it off to leave it out.

## Rendering and saving

1. Click **Render video**. Rendering runs in your browser; keep the tab open until it finishes. **Cancel** stops it.
2. The finished video plays in the preview. To keep it, give it a **Name** and click **Save to gallery**. It then appears under **Recent videos**, where **Download MP4** saves the file.

Rendering needs a browser that can encode video, such as a current Chrome, Edge, Safari or Firefox. Other browsers show a message instead.

Saved videos stay in **Recent videos** until you delete them, or until retention removes the file to save space. The video's settings are kept when the file is removed, so **Re-render** makes it again.

## Self-hosted instances

Two environment variables limit how much space saved videos take. Set either to `0` to turn that limit off.

| Variable | Default | What it does |
|----------|---------|--------------|
| `VIDEO_RETENTION_DAYS` | `30` | Removes video files older than this many days. |
| `VIDEO_MAX_PER_USER` | `10` | Keeps at most this many video files per user; the oldest are removed first. |

Removed files are cleaned up by a nightly job. As a rough guide, a 15-second vertical video is about 17 MB.
