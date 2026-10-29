---
title: Credits
---

# Credits

## Map and geographic data {#map-data}

Dawarich's maps, place names, time zones and achievements are built on open geographic data. This section lists every source the app ships or loads, with the notice its licence asks for.

### OpenStreetMap {#openstreetmap}

- **Notice:** © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **Licence:** [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/). The data is available under the ODbL; see [openstreetmap.org/copyright](https://www.openstreetmap.org/copyright).
- **Used in Dawarich for:**
  - Background map tiles, through the [Protomaps basemap](#protomaps).
  - [Time zone boundaries](#time-zones), through timezone-boundary-builder.
  - City and national park boundaries for achievements (Berlin, Hamburg, Dresden, Harz National Park, Saxon Switzerland National Park, Eifel National Park). Fetched from OpenStreetMap through the Overpass API on 2026-10-28. Changes: relation ways assembled into polygons, holes kept, coordinates rounded to seven decimals, city areas clipped to the [Natural Earth](#natural-earth) land mask. The bundled file is a derived database and is distributed under the ODbL.
  - Place names and addresses from reverse geocoding, when the geocoder serves OpenStreetMap data (for example [Photon](https://github.com/komoot/photon) or [Nominatim](https://nominatim.org/)).

### Protomaps basemap {#protomaps}

- **Source:** [Protomaps basemaps](https://github.com/protomaps/basemaps)
- **Notice:** [Protomaps](https://github.com/protomaps/basemaps) © [OpenStreetMap](https://www.openstreetmap.org/copyright)
- **Map data:** [OpenStreetMap](#openstreetmap), ODbL 1.0.
- **Licences** (from the project's [licence file](https://github.com/protomaps/basemaps/blob/main/LICENSE.md)):
  - Code: [BSD 3-Clause](https://opensource.org/license/bsd-3-clause), © Protomaps LLC, Kelso Cartography.
  - Visual design of the styles: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
  - Icons: derived from Mapzen's [tangrams/icons](https://github.com/tangrams/icons/blob/master/LICENSE.md), MIT.
  - Tile schema: adapted from [Tilezen](https://github.com/tilezen/vector-datasource), MIT.
  - Fonts (Noto Sans) and sprites from [basemaps-assets](https://github.com/protomaps/basemaps-assets): fonts under the [SIL Open Font License](https://github.com/protomaps/basemaps-assets/blob/main/fonts/OFL.txt), sprites derived from MIT-licensed tangrams/icons.
- **Used in Dawarich for:** the background map on the main map, trips, family, stats and shared pages, and in the poster and video studios.

### Time zone boundaries {#time-zones}

- **Source:** [timezone-boundary-builder](https://github.com/evansiroky/timezone-boundary-builder) by Evan Siroky, release [2026e](https://github.com/evansiroky/timezone-boundary-builder/releases/tag/2026e), file `timezones-with-oceans-1970`.
- **Notice:** © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **Licence:** data under the [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/); the code that builds it is MIT.
- **Changes:** polygons simplified with a coverage-preserving simplification (tolerance 0.005°, about 500 m), coordinates rounded to four decimals.
- **Used in Dawarich for:** showing visit times in the local time of the place.

### Natural Earth {#natural-earth}

- **Source:** [Natural Earth](https://www.naturalearthdata.com/), 1:10m vector data ([release 5.1.2](https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2/geojson) where pinned).
- **Licence:** [public domain](https://www.naturalearthdata.com/about/terms-of-use/). No credit is required; we credit it anyway: Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com.
- **Used in Dawarich for:**
  - Country boundaries: country detection, the countries map layer and country achievements.
  - Disputed areas (`ne_10m_admin_0_disputed_areas`): places where achievements credit no country.
  - Countries and lakes for exploration: land area and coverage percentages.
  - First-level regions (`admin-1` states and provinces) for region achievements, together with [geoBoundaries](#geoboundaries).
  - Land outlines for the achievement globe artwork.
- **Changes:** properties reduced to names and ISO codes, polygons regrouped under current ISO 3166-2 codes, simplified for display.

### geoBoundaries {#geoboundaries}

- **Source:** [geoBoundaries](https://www.geoboundaries.org/), William & Mary geoLab, gbOpen first-level (ADM1) boundaries.
- **Used in Dawarich for:** first-level region achievements in the seven countries below, where Natural Earth's regions are out of date.
- **Changes:** geometry simplified, ISO 3166-2 codes kept, merged with Natural Earth regions for all other countries, invalid geometry repaired.
- **Licences and original producers**, per country:
  - Côte d'Ivoire: World Bank Group, OCHA Côte d'Ivoire. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  - Kenya: RCMRD GeoPortal, Africa GeoPortal. Public domain.
  - Lebanon: geoBoundaries, Wikimedia Commons. Public domain.
  - Libya: Natural Earth. Public domain.
  - Nepal: Survey Department of Nepal, OCHA FISS. [CC BY 3.0 IGO](https://creativecommons.org/licenses/by/3.0/igo/).
  - Norway: Kartverket. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  - South Africa: OCHA ROSEA, South African Municipal Demarcation Board. [CC BY 3.0 IGO](https://creativecommons.org/licenses/by/3.0/igo/).

### Map software {#map-software}

- [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js) renders the maps. [BSD 3-Clause](https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt), © MapLibre contributors; includes code © Mapbox under BSD 3-Clause.
- [PMTiles](https://github.com/protomaps/PMTiles) by Protomaps reads the bundled map tile archives. [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

### Services you configure yourself {#self-configured-services}

Self-hosted instances can use other geocoding services (Photon, Nominatim, Geoapify, LocationIQ) or their own map tile server. When you do, that provider's terms and attribution requirements apply to your instance.

## Icons and Illustrations

We use icons from [Lucide](https://lucide.dev/).

Stats page feature illustrations from Unsplash:
- <a href="https://unsplash.com/@polarmermaid?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Anne Nygård</a> on <a href="https://unsplash.com/photos/snow-covered-field-and-trees-during-daytime-VwzfdVT6_9s?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@nofal24?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">AHMAD HASAN</a> on <a href="https://unsplash.com/photos/a-snow-covered-path-through-a-forest-filled-with-trees-xEYWelDHYF0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@babigraf?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">BĀBI</a> on <a href="https://unsplash.com/photos/a-trail-in-the-woods-is-covered-in-leaves-hdNa4GCCgbg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@gracehues?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">GraceHues Photography</a> on <a href="https://unsplash.com/photos/brown-maple-leaves-in-tilt-shift-lens-AYtup7uqimA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@still_loony?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Nadiia Ploshchenko 🇺🇦</a> on <a href="https://unsplash.com/photos/brown-wheat-field-during-sunset-ZnDtJaIec_E?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@iriser?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Irina Iriser</a> on <a href="https://unsplash.com/photos/purple-flowers-fKAl8Oid6zM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@lianamikah?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Liana Mikah</a> on <a href="https://unsplash.com/photos/a-field-full-of-red-and-orange-flowers-6B05zlnPOEc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@mdc_photography2000?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Milan De Clercq</a> on <a href="https://unsplash.com/photos/green-grass-field-near-river-YtllSzi2JLY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@lilysphotography?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Lily</a> on <a href="https://unsplash.com/photos/pink-flower-field-under-blue-sky-during-daytime-Rg1nSqXNPN4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@schneiderhenry?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Henry Schneider</a> on <a href="https://unsplash.com/photos/a-forest-filled-with-lots-of-trees-covered-in-snow-FqKPySIaxuE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@j_b_foto?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Foto Phanatic</a> on <a href="https://unsplash.com/photos/brown-trees-beside-river-under-blue-sky-during-daytime-8LaUOtP-de4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@ainarscekuls?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Ainārs Cekuls</a> on <a href="https://unsplash.com/photos/a-snow-covered-path-in-the-middle-of-a-forest-buAAKQiMfoI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
- <a href="https://unsplash.com/@debrupas?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Pascal Debrunner</a> on <a href="https://unsplash.com/photos/green-trees-under-white-sky-during-daytime-dppGOhcPBW0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
