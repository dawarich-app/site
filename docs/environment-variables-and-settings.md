---
sidebar_position: 98
---

# Environment Variables and Settings

## Environment Variables

As many other applications, Dawarich uses environment variables to configure its behavior. The following environment variables are supported:

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `RAILS_ENV`          | `development` | Application environment. `development` value makes sure all errors will be shown explicitly, making easier remote debugging |
| `REDIS_URL`          | `redis://dawarich_redis:6379` | Redis URL |
| `RAILS_CACHE_DB`     | `0` | Redis cache database |
| `RAILS_JOB_QUEUE_DB` | `1` | Redis job queue database |
| `RAILS_WS_DB` | `2` | Redis WebSocket database |
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
| `BACKGROUND_PROCESSING_CONCURRENCY` | `5` | Background processing concurrency. Should not be higher than `RAILS_MAX_THREADS`. More info on [Sidekiq docs](https://github.com/sidekiq/sidekiq/wiki/Advanced-Options#concurrency) |
| `PROMETHEUS_EXPORTER_ENABLED` | `false` | Prometheus exporter enabled |
| `PROMETHEUS_EXPORTER_HOST` | `0.0.0.0` | Prometheus exporter host |
| `PROMETHEUS_EXPORTER_PORT` | `9394` | Prometheus exporter port |
| `PHOTON_API_USE_HTTPS` | `nil` | Use HTTPS for Photon API requests |
| `PHOTON_API_HOST` | `nil` | Photon API host. Useful if you're self-hosting your [own Photon instance](https://dawarich.app/docs/tutorials/reverse-geocoding#setting-up-your-own-reverse-geocoding-service) |
| `PHOTON_API_KEY` | `nil` | Photon API key. Useful if you're supporting Dawarich development on [Patreon](https://www.patreon.com/c/freika/membership) and want to use Photon API instance hosted by Freika without any limits |
| `PHOTON_API_USE_HTTPS` | `nil` | Use HTTPS for Photon API requests. Set to true if you're using your own Photon instance behind a reverse proxy with SSL |
| `GEOAPIFY_API_KEY` | `nil` | Geoapify API key. Provide your own key if you want to use Geoapify reverse geocoding service |
| `NOMINATIM_API_HOST` | `nil` | Nominatim API host. Useful if you're self-hosting your own Nominatim instance |
| `NOMINATIM_API_KEY` | `nil` | Nominatim API key. Provide your own key if you want to use Nominatim reverse geocoding service |
| `NOMINATIM_API_USE_HTTPS` | `nil` | Use HTTPS for Nominatim API requests. Set to true if you're using a Nominatim instance behind a reverse proxy with SSL |
| `SMTP_SERVER` | `nil` | Your SMTP server |
| `SMTP_PORT` | `nil` | Your SMTP port |
| `SMTP_DOMAIN` | `nil` | Your SMTP domain |
| `SMTP_USERNAME` | `nil` | Your SMTP username |
| `SMTP_PASSWORD` | `nil` | Your SMTP password |
| `SMTP_FROM` | `nil` | Email address to send emails from |
| `SIDEKIQ_USERNAME` | `nil` | Sidekiq username |
| `SIDEKIQ_PASSWORD` | `nil` | Sidekiq password |
| `SELF_HOSTED` | `true` | Set to `true` if you're self-hosting Dawarich |
| `STORE_GEODATA` | `false` | Set to `true` if you want to store geodata in the database. This will increase the size of the database and will require more disk space. |
| `OIDC_CLIENT_ID` | `nil` | Your OIDC Client ID |
| `OIDC_CLIENT_SECRET` | `nil` | Your OIDC Client Secret |
| `OIDC_ISSUER` | `nil` | Your OIDC Issuer URL |
| `OIDC_REDIRECT_URI` | `nil` | Your OIDC redirect URL (https://your-dawarich-url.com/users/auth/openid_connect/callback) |
| `OIDC_AUTO_REGISTER` | `false` | Set to `true` if you want to automatically register new users logging in over OIDC |
| `OIDC_PROVIDER_NAME` | `OpenID Connect` | Your OIDC Provider Name |
| `ALLOW_EMAIL_PASSWORD_REGISTRATION` | `true` | Set to `false` if you want to disable email/password registration |


Important note on Prometheus exporter: even if you want to use it, make sure you have `PROMETHEUS_EXPORTER_ENABLED` set to `false` in `dawarich_sidekiq` container. Otherwise, you'll end up with two exporters and will have to deal with duplicate metrics. The `PROMETHEUS_EXPORTER_HOST` for `dawarich_sidekiq` should be set to `dawarich_app` or your name of the container.
