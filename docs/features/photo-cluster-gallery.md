---
title: "Photo cluster gallery"
sidebar_position: 40
description: "Photo cluster gallery in Dawarich 1.20.0."
---

# Photo cluster gallery

This guide covers Dawarich 1.20.0.

## Behavior

Clicking a photo cluster opens a modal gallery without changing the map zoom.
The gallery replaces its page of up to 24 thumbnails when Previous/Next is pressed.
Selecting a thumbnail opens the existing photo preview with filename, capture time,
location, source and media type. Back returns to the same page and focused thumbnail.
Only thumbnail URLs are used; originals and videos are not downloaded or played.

The close button, Escape and clicking the backdrop dismiss the gallery. Focus returns
to the map canvas. With the canvas focused, Enter opens the visible photo cluster
nearest the map centre; arrow keys retain MapLibre's map navigation. Native modal
behavior makes the underlying page inert while the gallery is open. On phones,
the thumbnail area scrolls independently so close and paging controls stay visible.
Loading, failed page requests (with Retry), empty results and missing thumbnails
have explicit messages. Strings are provided in all seven supported locales.

The source uses `maxzoom: 24` / `clusterMaxZoom: 23`, keeping coincident photos
clustered throughout MapLibre's default map zoom range (maximum 22). Nearby photos
still separate as the map zooms. Individual photo markers retain their popup and
overlap layout. Cluster circle/count ordering is unchanged.

## Implementation and boundaries

- `app/javascript/maps_maplibre/layers/photos_layer.js` owns the gallery and binds
  its lifetime to that layer/source. Update, hide, remove, map removal and source
  replacement close the gallery. Style restoration already removes old layers.
- `app/javascript/maps_maplibre/components/photo_cluster_gallery.js` uses the
  Promise API `GeoJSONSource.getClusterLeaves(clusterId, 24, offset)` in MapLibre
  GL JS 6.16.0. It never requests `Infinity` or expands every leaf into markers.
  A request generation and destroyed flag discard stale responses, including
  rejected responses after closing or a data/style change. The worker request
  itself cannot be aborted through this API.
- One page's metadata and image elements are retained, plus the selected preview;
  earlier pages are replaced. Image loading is lazy. Provider listing/source data
  loading remains unchanged: this paginates cluster leaves in the existing source,
  not the upstream Immich/PhotoPrism listing endpoint.
- `PhotoPopupFactory` supplies the existing escaped preview markup and timezone
  formatting. Thumbnail buttons use DOM properties/text, not interpolated HTML.
- The existing feature's `thumbnail_url` is reused unchanged, preserving the
  application proxy, authentication and provider/share scope. No integration key,
  URL or original media URL is constructed or logged by the gallery.
- Presentation is scoped under `.photo-cluster-gallery` in
  `app/assets/stylesheets/maps_maplibre.css`. A modal remains within the viewport
  and supports light/dark themes.

API reference: [MapLibre GeoJSONSource#getClusterLeaves](https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/#getclusterleaves).
