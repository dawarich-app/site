---
sidebar_position: 6
---

# Reverse geocoding

Reverse geocoding is the process of converting geographic coordinates into a human-readable address. By default, reverse geocoding is disabled in Dawarich.

Currently, Dawarich supports 4 options for reverse geocoding services:

- [Geoapify](https://www.geoapify.com/) (free, limited usage, see [Geoapify pricing](https://www.geoapify.com/pricing))
- [Photon](https://photon.komoot.io/) (free, limited usage, [1 request per second](https://photon.komoot.io/))
- [Self-hosted Photon](https://dawarich.app/docs/tutorials/reverse-geocoding#setting-up-your-own-reverse-geocoding-service) (free, unlimited usage)
- [Nominatim](https://nominatim.org/) (free, limited usage, see [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/)) or [self-hosted](https://github.com/mediagis/nominatim-docker) Nominatim instance (free, unlimited usage)

Please make sure you have read and understood the pricing and usage limits of each service before choosing one.

If you don't want to be limited by the number of requests per second, and you don't want to host your own reverse geocoding service, you can support Dawarich development on [Patreon](https://www.patreon.com/c/freika/membership) and use the Photon API instance hosted by Freika without any limits.

:::warning

Since https://photon.komoot.io/ is a free service with limited usage, in order to decrease the load on the service, I strongly encourage you to host your [own reverse geocoding service](#setting-up-your-own-reverse-geocoding-service), or use the Photon API [for Patreon supporters](#using-photon-api-for-patreon-supporters), to support Dawarich development.

Support for more reverse geocoding services is coming soon.

:::

:::danger

Please be aware that any external reverse geocoding service should be used at your own risk. There is no way to be sure that your data is not being used for other purposes than reverse geocoding. Hosting your own reverse geocoding service is the safest option.

:::


## How to enable reverse geocoding

To enable reverse geocoding, you need to provide correct ENV variables for the reverse geocoding service you want to use. Here is an example of how to do it:


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
        PHOTON_API_HOST: photon.yourdomain.com
        PHOTON_API_KEY: your_photon_api_key # If you're using Photon API instance for Patreon supporters
        PHOTON_API_USE_HTTPS: true # or false if you want to use HTTP instead of HTTPS
      logging:
      ...
    dawarich_sidekiq:
      image: freikin/dawarich:latest
      ...
      environment:
        RAILS_ENV: development
        ...
        APPLICATION_PROTOCOL: http
        PHOTON_API_HOST: photon.yourdomain.com
        PHOTON_API_KEY: your_photon_api_key # If you're using Photon API instance for Patreon supporters
        PHOTON_API_USE_HTTPS: true # or false if you want to use HTTP instead of HTTPS
      logging:
      ...
  ```
</details>

If you're using Geoapify, you need to provide the `GEOAPIFY_API_KEY` environment variable instead of `PHOTON_...` variables.

## Using Photon API for Patreon supporters

If you support Dawarich development on [Patreon](https://www.patreon.com/c/freika/membership) (starting from `Buy me a Döner` tier), you can use the Photon API instance hosted by Freika without any limits. To do that, set the `PHOTON_API_KEY` environment variable to the key that you will receive on Patreon in private messages after signing up for `Buy me a Döner` tier. The `PHOTON_API_HOST` environment variable should be set to `photon.dawarich.app`.

If you're using reverse proxy that might override headers sent from your Dawarich instance, make sure that the `X-Api-Key` header is set to the correct value in your reverse proxy configuration.

:::info

This service is based on [Photon](https://github.com/komoot/photon), an open-source project distributed under the Apache 2.0 license.

The Service is provided "as is," without warranties of any kind, either express or implied, as specified under the Apache 2.0 license. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.

**No logs or analytics are collected, except the ones required for the service to work. No user data is collected, stored, or shared with any third parties.**

The original authors retain all rights as specified in the license.

:::

## Setting up your own reverse geocoding service

If you want to use your own reverse geocoding service, you can do it by deploying your own instance of the [Photon](https://github.com/komoot/photon) service by Komoot on your server.

It is also possible to run your own Photon instance using Docker. If you want to create your own docker image, you can use this [guide](https://tonsnoei.nl/en/post/2023/03/20/set-up-your-own-geocoder-api/) by Ton Snoei to do so.

Alternatively, you can use the [Docker image provided by @rtuszik](https://github.com/rtuszik/photon-docker) which comes batteries included to automatically update the Index used by Photon from time to time. Instructions for installing his image can be found in his GitHub repository. Be aware, that that are different from the instructions provided by Ton Snoei, so please read them carefully.

After you deploy your own instance of the Photon service, you need to set the `PHOTON_API_HOST` environment variable to the URL of your Photon service in the `docker-compose.yml` file. Here is an example of how to do it:

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
        PHOTON_API_HOST: photon.yourdomain.com # remove this line if you want to use the default Nominatim service
      logging:
      ...
  ```

</details>

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
