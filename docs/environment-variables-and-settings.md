---
sidebar_position: 98
---

# Environment Variables and Settings

## Environment Variables

As many other applications, Dawarich uses environment variables to configure its behavior. The following environment variables are supported:

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `RAILS_ENV`          | `development` | Application environment. `development` value makes sure all errors will be shown explicitly, making easier remote debugging |
| `REDIS_URL`          | `redis://dawarich_redis:6379/0` | Redis URL |
| `DATABASE_HOST`      | `dawarich_db` | Database host |
| `DATABASE_USERNAME`  | `postgres`    | Database username |
| `DATABASE_PASSWORD`  | `password`    | Database password |
| `DATABASE_NAME`      | `dawarich_development` | Database name |
| `MIN_MINUTES_SPENT_IN_CITY` | `60`   | Minimum minutes spent in a city |
| `APPLICATION_HOST`   | `localhost`   | Default application host |
| `APPLICATION_HOSTS`  | `localhost,my.domain.com`   | Application hosts, provide multiple if you want your Dawarich instance to be available by multiple domains/ip addresses. Don't put protocols here, only host names. |
| `TIME_ZONE`          | `Europe/London` | Time zone. Full list of supported timezones available on [Github](https://github.com/Freika/dawarich/issues/27#issuecomment-2094721396) |
| `APPLICATION_PROTOCOL` | `http` | Application protocol. Change to `https` if you want your Dawarich instance to be served via SSL |
| `DISTANCE_UNIT` | `km` | Distance unit. For miles, change to `mi`. All settings still should be provided in meters/kilometers |
| `REVERSE_GEOCODING_ENABLED` | `true`/`false` | Reverse geocoding enabled |
| `PHOTON_API_HOST` | `photon.komoot.io` | Photon API host. Useful if you're self-hosting your [own Photon instance](https://dawarich.app/docs/tutorials/reverse-geocoding#setting-up-your-own-reverse-geocoding-service) |
| `RAILS_MAX_THREADS` | `5` | Connection pool size for the Dawarich database |
| `BACKGROUND_PROCESSING_CONCURRENCY` | `10` | Background processing concurrency. Should not be higher than `RAILS_MAX_THREADS`. More info on [Sidekiq docs](https://github.com/sidekiq/sidekiq/wiki/Advanced-Options#concurrency) |
| `PROMETHEUS_EXPORTER_ENABLED` | `false` | Prometheus exporter enabled |
| `PROMETHEUS_EXPORTER_HOST` | `0.0.0.0` | Prometheus exporter host |
| `PROMETHEUS_EXPORTER_PORT` | `9394` | Prometheus exporter port |
| `DISABLE_TELEMETRY` | `false` | Disable [telemetry](/docs/tutorials/telemetry) |
| `PHOTON_API_USE_HTTPS` | `true` | Use HTTPS for Photon API requests |
| `PHOTON_API_HOST` | `photon.komoot.io` | Photon API host. Useful if you're self-hosting your [own Photon instance](https://dawarich.app/docs/tutorials/reverse-geocoding#setting-up-your-own-reverse-geocoding-service) |

Important note on Prometheus exporter: even if you want to use it, make sure you have `PROMETHEUS_EXPORTER_ENABLED` set to `false` in `dawarich_sidekiq` container. Otherwise, you'll end up with two exporters and will have to deal with duplicate metrics. The `PROMETHEUS_EXPORTER_HOST` for `dawarich_sidekiq` should be set to `dawarich_app` or your name of the container.
