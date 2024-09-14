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
| `APPLICATION_HOSTS`  | `localhost`   | Application hosts, provide multiple if you want your Dawarich instance to be available by multiple domains/ip addresses |
| `TIME_ZONE`          | `Europe/London` | Time zone. Full list of supported timezones available on [Github](https://github.com/Freika/dawarich/issues/27#issuecomment-2094721396) |
| `APPLICATION_PROTOCOL` | `http` | Application protocol. Change to `https` if you want your Dawarich instance to be served via SSL |
| `DISTANCE_UNIT` | `km` | Distance unit. For miles, change to `mi`. All settings still should be provided in meters/kilometers |
| `REVERSE_GEOCODING_ENABLED` | | Reverse geocoding enabled |
| `PHOTON_API_HOST` | `photon.komoot.io` | Photon API host. Useful if you're self-hosting your own Photon instance |
| `RAILS_MAX_THREADS` | `5` | Connection pool size for the Dawarich database |
| `BACKGROUND_PROCESSING_CONCURRENCY` | `10` | Background processing concurrency. Should not be higher than `RAILS_MAX_THREADS`. More info on [Sidekiq docs](https://github.com/sidekiq/sidekiq/wiki/Advanced-Options#concurrency) |
