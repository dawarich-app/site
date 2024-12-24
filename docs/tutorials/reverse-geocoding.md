---
sidebar_position: 6
---

# Reverse geocoding

Reverse geocoding is the process of converting geographic coordinates into a human-readable address. By default, Dawarich provides reverse geocoding functionality using the [Nominatim](https://nominatim.org/) service. This service is free to use, but it asks users to limit the number of requests per second to 1 request per second. Dawarich will automatically limit the number of requests per second to 1 request per second, but if you have a lot of points in your location history data, the reverse geocoding process might take some time. To speed up the process, you can set up [your own reverse geocoding service](#setting-up-your-own-reverse-geocoding-service).

If you don't want to be limited by the number of requests per second, you can support Dawarich development on [Patreon](https://www.patreon.com/c/freika/membership) and use the Photon API instance hosted by Freika without any limits, or you can set up [your own reverse geocoding service](#setting-up-your-own-reverse-geocoding-service).


## How to enable reverse geocoding

To enable reverse geocoding, you need to set the `REVERSE_GEOCODING_ENABLED` environment variable to `true` in the `docker-compose.yml` file. Here is an example of how to do it:


<details>
  <summary>Show me!</summary>

  ```yml
  version: '3'
  networks:
    dawarich:
  services:
    dawarich_app:
      image: freikin/dawarich:latest
      ...
      environment:
        RAILS_ENV: development
        ...
        APPLICATION_PROTOCOL: http
        REVERSE_GEOCODING_ENABLED: true # or false to disable reverse geocoding
      logging:
      ...
    dawarich_sidekiq:
      image: freikin/dawarich:latest
      ...
      environment:
        RAILS_ENV: development
        ...
        APPLICATION_PROTOCOL: http
        REVERSE_GEOCODING_ENABLED: true # or false to disable reverse geocoding
      logging:
      ...
  ```
</details>

## Using Photon API hosted by Freika

If you support Dawarich development on [Patreon](https://www.patreon.com/c/freika/membership) (starting from `Buy me a Döner` tier), you can use the Photon API instance hosted by Freika without any limits. To do that, set the `PHOTON_API_KEY` environment variable to the key that you will receive on Patreon in private messages after signing up for `Buy me a Döner` tier. The `PHOTON_API_HOST` environment variable should be set to `photon.dawarich.app`.

If you're using reverse proxy that might override headers sent from your Dawarich instance, make sure that the `X-Api-Key` header is set to the correct value in your reverse proxy configuration.

:::info

This service is based on [Photon](https://github.com/komoot/photon), an open-source project distributed under the Apache 2.0 license.

The Service is provided "as is," without warranties of any kind, either express or implied, as specified under the Apache 2.0 license. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.

**No logs or analytics are collected, except the ones required for the service to work. No user data is collected, stored, or shared with any third parties.**

The original authors retain all rights as specified in the license.

:::

## Setting up your own reverse geocoding service

If you want to use your own reverse geocoding service, you can do it by deploying your own instance of the [Photon](https://github.com/komoot/photon) service by Komoot on your server. You can run it in Docker, using a [guide](https://tonsnoei.nl/en/post/2023/03/20/set-up-your-own-geocoder-api/) from Ton Snoei. After you deploy your own instance of the Photon service, you need to set the `PHOTON_API_HOST` environment variable to the URL of your Photon service in the `docker-compose.yml` file. Here is an example of how to do it:

<details>
  <summary>Show me!</summary>

  ```yaml
  version: '3'
  networks:
    dawarich:
  services:
    dawarich_app:
      image: freikin/dawarich:latest
      ...
      environment:
        RAILS_ENV: development
        ...
        APPLICATION_PROTOCOL: http
        REVERSE_GEOCODING_ENABLED: true
        PHOTON_API_HOST: photon.yourdomain.com # remove this line if you want to use the default Nominatim service
      logging:
      ...
    dawarich_sidekiq:
      image: freikin/dawarich:latest
      ...
      environment:
        RAILS_ENV: development
        ...
        APPLICATION_PROTOCOL: http
        REVERSE_GEOCODING_ENABLED: true
        PHOTON_API_HOST: photon.yourdomain.com # remove this line if you want to use the default Nominatim service
      logging:
      ...
  ```
</details>

Also, [@rtuszik](https://github.com/rtuszik/) was kind enough to build a new Docker image with the latest version of the Photon API. The source code with the usage instructions can be found on [GitHub](https://github.com/rtuszik/photon-docker).

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
