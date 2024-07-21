---
sidebar_position: 5
---

# Reverse geocoding

Reverse geocoding is the process of converting geographic coordinates into a human-readable address. Dawarich provides reverse geocoding functionality using the [Nominatim](https://nominatim.org/) service. In the future there will be support for other services as well.

## Reverse geocoding and importing process.

When you import your location history data, the reverse geocoding process starts for each point imported. The Sidekiq queues will be filled with reverse geocoding jobs, and there will be a lot of them, depending on how many points you imported. Important thing to understand, is that although the queue will be filled with jobs, the importing process itself is not dependent on the reverse geocoding process. The reverse geocoding process is done in the background even when importing process is finished.

Before Dawarich 0.9.0 the reverse geocoding process was fetching only city and country value for each point. Starting 0.9.0, a lot more data is fetched for each point, including street, house number, postal code, and more. This change was made to provide more detailed information about each point.

Here is an example of data that is fetched for each point:

```json
{
  "place_id": 127850637,
  "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
  "osm_type": "way",
  "osm_id": 718035022,
  "lat": "52.51450815",
  "lon": "13.350110811262352",
  "class": "historic",
  "type": "monument",
  "place_rank": 30,
  "importance": 0.4155071896625501,
  "addresstype": "historic",
  "name": "Victory Column",
  "display_name": "Victory Column, Großer Stern, Botschaftsviertel, Tiergarten, Mitte, Berlin, 10785, Germany",
  "address": {
    "historic": "Victory Column",
    "road": "Großer Stern",
    "neighbourhood": "Botschaftsviertel",
    "suburb": "Tiergarten",
    "borough": "Mitte",
    "city": "Berlin",
    "ISO3166-2-lvl4": "DE-BE",
    "postcode": "10785",
    "country": "Germany",
    "country_code": "de"
  },
  "boundingbox": [
    "52.5142449",
    "52.5147775",
    "13.3496725",
    "13.3505485"
  ]
}
```

Later on, reverse geocode data will be used to provide more insights into your location history data, as well as to provide more detailed information about your points on the map.
