---
sidebar_position: 98
---

# Environment Variables and Settings

## Environment Variables

As many other applications, Dawarich uses environment variables to configure its behavior. The following environment variables are supported:

### Core Settings

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `RAILS_ENV`          | `development` | Application environment. `development` value makes sure all errors will be shown explicitly, making easier remote debugging |
| `SELF_HOSTED` | `true` | Set to `true` if you're self-hosting Dawarich |
| `APPLICATION_HOSTS`  | `localhost,my.domain.com`   | Application hosts, provide multiple if you want your Dawarich instance to be available by multiple domains/ip addresses. Don't put protocols here, only host names. |
| `APPLICATION_PROTOCOL` | `http` | Application protocol. Change to `https` if you want your Dawarich instance to be served via SSL |
| `TIME_ZONE`          | `Europe/London` | Time zone. Full list of supported timezones available on [Github](https://github.com/Freika/dawarich/issues/27#issuecomment-2094721396) |
| `DISTANCE_UNIT` | `km` | Distance unit. For miles, change to `mi`. All settings still should be provided in meters/kilometers |
| `MIN_MINUTES_SPENT_IN_CITY` | `60`   | Minimum minutes spent in a city |

### Database Settings

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `DATABASE_HOST`      | `dawarich_db` | Database host |
| `DATABASE_USERNAME`  | `postgres`    | Database username |
| `DATABASE_PASSWORD`  | `password`    | Database password |
| `DATABASE_NAME`      | `dawarich_development` | Database name |
| `DATABASE_PORT`      | `5432` | Database port |
| `RAILS_MAX_THREADS` | `5` | Connection pool size for the Dawarich database |

### Redis Settings

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `REDIS_URL`          | `redis://dawarich_redis:6379` | Redis URL |
| `RAILS_CACHE_DB`     | `0` | Redis cache database |
| `RAILS_JOB_QUEUE_DB` | `1` | Redis job queue database |
| `RAILS_WS_DB` | `2` | Redis WebSocket database |

### Background Processing

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `BACKGROUND_PROCESSING_CONCURRENCY` | `5` | Background processing concurrency. Should not be higher than `RAILS_MAX_THREADS`. More info on [Sidekiq docs](https://github.com/sidekiq/sidekiq/wiki/Advanced-Options#concurrency) |
| `SIDEKIQ_USERNAME` | `nil` | Sidekiq dashboard username |
| `SIDEKIQ_PASSWORD` | `nil` | Sidekiq dashboard password |

### Reverse Geocoding

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `PHOTON_API_HOST` | `nil` | Photon API host. Useful if you're self-hosting your [own Photon instance](/docs/self-hosting/configuration/reverse-geocoding#setting-up-your-own-reverse-geocoding-service) |
| `PHOTON_API_KEY` | `nil` | Photon API key. Useful if you're supporting Dawarich development on [Patreon](https://www.patreon.com/c/freika/membership) and want to use Photon API instance hosted by Freika without any limits |
| `PHOTON_API_USE_HTTPS` | `false` | Use HTTPS for Photon API requests. Set to true if you're using your own Photon instance behind a reverse proxy with SSL |
| `GEOAPIFY_API_KEY` | `nil` | Geoapify API key. Provide your own key if you want to use Geoapify reverse geocoding service |
| `NOMINATIM_API_HOST` | `nil` | Nominatim API host. Useful if you're self-hosting your own Nominatim instance |
| `NOMINATIM_API_KEY` | `nil` | Nominatim API key. Provide your own key if you want to use Nominatim reverse geocoding service |
| `NOMINATIM_API_USE_HTTPS` | `true` | Use HTTPS for Nominatim API requests. Set to true if you're using a Nominatim instance behind a reverse proxy with SSL |
| `STORE_GEODATA` | `false` | Set to `true` if you want to store geodata in the database. This will increase the size of the database and will require more disk space. |

### OIDC Authentication (Self-Hosted Only)

For detailed setup instructions, see the [OIDC Authentication Tutorial](/docs/self-hosting/configuration/oidc-authentication).

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `OIDC_CLIENT_ID` | `nil` | OIDC client ID from your identity provider |
| `OIDC_CLIENT_SECRET` | `nil` | OIDC client secret from your identity provider |
| `OIDC_ISSUER` | `nil` | OIDC issuer URL (enables auto-discovery) |
| `OIDC_REDIRECT_URI` | Auto-generated | Callback URL. Defaults to `{APPLICATION_URL}/users/auth/openid_connect/callback` |
| `OIDC_PROVIDER_NAME` | `Openid Connect` | Custom display name for the OIDC login button |
| `OIDC_AUTO_REGISTER` | `true` | Automatically create accounts for new OIDC users |
| `ALLOW_EMAIL_PASSWORD_REGISTRATION` | `false` | Allow traditional email/password registration alongside OIDC |

#### Manual OIDC Configuration (Alternative to Discovery)

If your identity provider doesn't support OIDC discovery, use these instead of `OIDC_ISSUER`:

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `OIDC_HOST` | `nil` | Hostname of your identity provider |
| `OIDC_SCHEME` | `https` | Protocol (`https` or `http`) |
| `OIDC_PORT` | `443` | Port number |
| `OIDC_AUTHORIZATION_ENDPOINT` | `/authorize` | Authorization endpoint path |
| `OIDC_TOKEN_ENDPOINT` | `/token` | Token endpoint path |
| `OIDC_USERINFO_ENDPOINT` | `/userinfo` | User info endpoint path |

### Email (SMTP)

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `SMTP_SERVER` | `nil` | Your SMTP server hostname |
| `SMTP_PORT` | `nil` | Your SMTP port (typically 587 for TLS) |
| `SMTP_DOMAIN` | `nil` | Your SMTP domain |
| `SMTP_USERNAME` | `nil` | Your SMTP username |
| `SMTP_PASSWORD` | `nil` | Your SMTP password |
| `SMTP_FROM` | `nil` | Email address to send emails from |

Email is required for:
- Password reset
- Year-end digest emails
- Family invitation emails

### Prometheus Monitoring

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `PROMETHEUS_EXPORTER_ENABLED` | `false` | Enable Prometheus metrics exporter |
| `PROMETHEUS_EXPORTER_HOST` | `0.0.0.0` | Prometheus exporter host |
| `PROMETHEUS_EXPORTER_PORT` | `9394` | Prometheus exporter port |

:::warning
Important note on Prometheus exporter: even if you want to use it, make sure you have `PROMETHEUS_EXPORTER_ENABLED` set to `false` in `dawarich_sidekiq` container. Otherwise, you'll end up with two exporters and will have to deal with duplicate metrics. The `PROMETHEUS_EXPORTER_HOST` for `dawarich_sidekiq` should be set to `dawarich_app` or your name of the container.
:::

### Data Archival

| Environment Variable | Default Value | Description |
| -------------------- | ------------- | ----------- |
| `ARCHIVE_RAW_DATA` | `false` | Enable archival of raw import data. When enabled, original import files are preserved for potential re-processing. |

## User Settings

In addition to environment variables, users can configure personal settings through the UI:

### Map Settings

| Setting | Description |
|---------|-------------|
| Preferred Map Layer | Default map style |
| Route Opacity | Transparency of route lines (0-100%) |
| Fog of War Meters | Resolution of fog of war tiles |
| Minutes Between Routes | Time gap to start a new route |
| Meters Between Routes | Distance gap to start a new route |
| Speed Colored Routes | Enable speed-based route coloring |
| Globe Projection | Enable 3D globe view (Map V2) |
| Live Map Enabled | Auto-update map with new points |

### Visit Settings

| Setting | Description |
|---------|-------------|
| Time Threshold Minutes | Minimum time at location for visit detection |
| Merge Threshold Minutes | Gap to merge nearby visits |
| Visits Suggestions Enabled | Enable automatic visit detection |

### Transportation Thresholds

| Setting | Description |
|---------|-------------|
| Walking Max Speed | Maximum speed considered walking (km/h) |
| Cycling Max Speed | Maximum speed considered cycling (km/h) |
| Driving Max Speed | Maximum speed considered driving (km/h) |
| Flying Min Speed | Minimum speed considered flying (km/h) |

### Notification Settings

| Setting | Description |
|---------|-------------|
| Digest Emails Enabled | Receive year-end digest emails |

### Photo Integration

| Setting | Description |
|---------|-------------|
| Immich URL | URL of your Immich instance |
| Immich API Key | API key for Immich |
| Photoprism URL | URL of your Photoprism instance |
| Photoprism API Key | API key for Photoprism |
