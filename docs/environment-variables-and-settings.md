---
sidebar_position: 98
---

# Environment Variables and Settings

## Environment Variables

As many other applications, Dawarich uses environment variables to configure its behavior. The following environment variables are supported:

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `RAILS_ENV`          | `development` | Application environment. `development` value makes sure all errors will be shown explicitly, making easier remote debugging |
| `DATABASE_HOST`      | `dawarich_db` | Database host |
| `DATABASE_USERNAME`  | `postgres`    | Database username |
| `DATABASE_PASSWORD`  | `password`    | Database password |
| `DATABASE_NAME`      | `dawarich_development` | Database name |
| `DATABASE_PORT`      | `5432` | Database port |
| `MIN_MINUTES_SPENT_IN_CITY` | `60`   | Minimum minutes spent in a city |
| `APPLICATION_HOSTS`  | `localhost,my.domain.com`   | Application hosts, provide multiple if you want your Dawarich instance to be available by multiple domains/ip addresses. Don't put protocols here, only host names. |
| `APPLICATION_PROTOCOL` | `http` | Application protocol. Change to `https` if you want your Dawarich instance to be served via SSL |
| `TIME_ZONE`          | `Europe/London` | Time zone. Full list of supported timezones available on [Github](https://github.com/Freika/dawarich/issues/27#issuecomment-2094721396) |
| `DISTANCE_UNIT` | `km` | Distance unit. For miles, change to `mi`. All settings still should be provided in meters/kilometers |
| `RAILS_MAX_THREADS` | `5` | Connection pool size for the Dawarich database |
| `BACKGROUND_PROCESSING_CONCURRENCY` | `10` | Background processing concurrency. Should not be higher than `RAILS_MAX_THREADS`. |
| `PROMETHEUS_EXPORTER_ENABLED` | `false` | Prometheus exporter enabled |
| `PROMETHEUS_EXPORTER_HOST` | `0.0.0.0` | Prometheus exporter host |
| `PROMETHEUS_EXPORTER_PORT` | `9394` | Prometheus exporter port |
| `PHOTON_API_USE_HTTPS` | `nil` | Use HTTPS for Photon API requests |
| `PHOTON_API_HOST` | `nil` | Photon API host. Useful if you're self-hosting your [own Photon instance](https://dawarich.app/docs/tutorials/reverse-geocoding#setting-up-your-own-reverse-geocoding-service) |
| `PHOTON_API_KEY` | `nil` | Photon API key. Useful if you're supporting Dawarich development on [Patreon](https://www.patreon.com/c/freika/membership) and want to use Photon API instance hosted by Freika without any limits |
| `GEOAPIFY_API_KEY` | `nil` | Geoapify API key. Provide your own key if you want to use Geoapify reverse geocoding service |
| `SMTP_SERVER` | `nil` | Your SMTP server |
| `SMTP_PORT` | `nil` | Your SMTP port |
| `SMTP_DOMAIN` | `nil` | Your SMTP domain |
| `SMTP_USERNAME` | `nil` | Your SMTP username |
| `SMTP_PASSWORD` | `nil` | Your SMTP password |
| `SMTP_FROM` | `nil` | Email address to send emails from |
