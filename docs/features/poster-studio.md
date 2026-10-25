---
sidebar_position: 2.1
title: Poster Studio
description: Turn your routes into a printable map poster. Pick a layout and theme, add a title, export a PNG or PDF, save it to your gallery or order a print.
---

# Poster Studio

Poster Studio turns the routes on your map into a poster. You frame the area, choose a layout and a color theme, add a title, and export the result as a PNG or a PDF. You can also keep a server-rendered copy in your gallery, or order a printed poster.

## Opening the studio

- **From the map:** click **Poster Studio** in the button strip on the left of the [map](/docs/features/map). The studio opens with the dates selected on the map.
- **From a trip:** on a trip's page, click **Create a poster of this trip**. The studio opens with the trip's route, dates and name. The button becomes available once the trip's route has been calculated.

Poster Studio and [Video Studio](/docs/features/video-studio) share the same switch in the studio's top-left corner, so you can move between them in one click. **Close studio** closes it.

## Choosing the dates

The date bar at the top selects which routes are drawn. Pick a start and an end and click **Load**, or use **Today**, **Last 7 days** or **Last month**. If the range has no tracks, the studio says so and asks for another range.

## Framing the poster

Drag the preview to pan and scroll to zoom. The frame is exactly what gets exported. **Recenter** brings your route back into view.

## Layout

**Layout** sets the shape and size of the poster. Layouts are grouped in three categories:

| Category | Layouts |
|----------|---------|
| **Print** | A5, A4, A3, A2, A1 and A0 portrait; 30 × 40 cm, 50 × 70 cm and 70 × 100 cm; Letter (US); A4 and A3 landscape |
| **Social** | Instagram Square, Instagram Portrait, Story (9:16), X Header, YouTube Thumbnail |
| **Wallpaper** | Desktop Full HD, Desktop 4K, Desktop Ultrawide, Phone, Tablet |

The default is A3 portrait.

## Theme and colors

**Theme** offers 17 color themes for the map and the route. **Customize colors** changes individual colors on top of the theme: background, water, parks, buildings, railways, boundaries, motorway, primary, residential and other roads, the track and the text.

Under **Layers** you can switch roads, water, parks and land use, buildings, railways and boundaries on or off. **Track opacity** and **Track width** control the route line; the width goes from 50% to 300%.

## Text

Turn on **Show text** to print a caption on the poster:

- **Title** and **Subtitle**, for example a city and a country
- **Coordinates line**, the coordinates of the poster's center
- **Font**, the typeface for all of the text

## Exporting a file

Under **Export a file**, choose **PNG** or **PDF** and click **Download**. For print layouts, **Print DPI** sets the resolution: 96, 150 or 300 dpi. The file is rendered in your browser. If your device can't render a large poster at the chosen resolution, the studio lowers the DPI and tells you which value it used.

When the [AirTrail](/docs/features/integrations#airtrail) Flights layer is on, a downloaded trip poster includes your flight arcs.

## Saving to the gallery

**Save to gallery** renders the current area on the server as a classic 3:4 print poster and keeps it under **Recent posters**, where it stays across sessions. Gallery posters use GPS routes only, without flight arcs. The route must be inside the frame for the save to work.

## Ordering a print

**Order a print** sends the poster to a print service. Printed posters come in 30 × 40 cm, 50 × 70 cm and 70 × 100 cm. If the current layout can't be printed, the studio asks you to choose one of these sizes.

1. Click **Order a print**, choose a size if asked, and click **Order this poster**.
2. The studio prepares and uploads the poster.
3. Click **Continue to payment** to pay via Stripe.

Posters are printed by Gelato, exactly as previewed, with free shipping within the EU. Because each poster is made to order, the 14-day right of withdrawal no longer applies once production starts.

## Self-hosted instances

- **Gallery rendering** uses a renderer bundled in the Docker image. It is not available on 32-bit ARM (armv7) hosts; downloading a PNG or PDF still works there.
- **Print ordering** is on by default and uses the Dawarich print service. To hide **Order a print**, set the `PRINT_ORDER_URL` environment variable to an empty value.
