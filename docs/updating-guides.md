---
sidebar_position: 98
---

# Updating guides

Dawarich is a rapidly evolving project, and some changes may break compatibility with older versions. This page will serve as a record of the breaking changes and migration paths. Instructions for each version assume that you are updating from the previous version.

## 0.25.0

### Visits and places

The release page: https://github.com/Freika/dawarich/releases/tag/0.25.0

There is a known issue when data migrations are not being run automatically on some systems. If you're experiencing issues when opening map page, trips page or when trying to see visits, try executing the following command in the [Console](/docs/FAQ/#how-to-enter-dawarich-console):

### Errors on the map page

If on the map page you see errors like this:

```
undefined method `y' for nil:NilClass
```

This means that the data migration job that supposed to move coordinates from `longitude` and `latitude` columns to `lonlat` column on `points` table was not run. We can fix this by running the following command in the [Console](/docs/FAQ/#how-to-enter-dawarich-console):

```ruby
User.includes(:tracked_points).find_each do |user|
  user.tracked_points.where(lonlat: nil).update_all('lonlat = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)')
end
```

This will update the `lonlat` column for all the points. After this, the map should work again.

If this script failed with a `killed` message, you have ran out of memory. Simply repeat the command again, it will pick up from the last processed point.

If you experiencing something similar to the following error:

```
Caused by PG::UniqueViolation: ERROR:  duplicate key value violates unique constraint "index_points_on_lonlat_timestamp_user_id"
DETAIL:  Key (lonlat, "timestamp", user_id)=(0101000020E6100000E2E5E95C51522140B6D8EDB3CA184940, 1737716451, 2) already exists.
```

This means, you have some points with the same coordinates, timestamp and user_id. This usually should not happen, but we can remove the duplicates. Run the following command in the [Console](/docs/FAQ/#how-to-enter-dawarich-console):

```ruby
user_id = 2 # (your user id based on error message above)
timestamp = 1739235618 # (your problematic timestamp, based on error message above)
points = Point.where(user_id: user_id, timestamp: timestamp)

points.size # This will return number of duplicated points

points.drop(1).each(&:destroy) # This will remove all but the first point.
```

After this, run the script from the previous step again. Repeat, if you see the same for different timestamp or user_id.

### The "your user is not active" errors / 401 errors

In the [Console](/docs/FAQ/#how-to-enter-dawarich-console), run the following command:

```ruby
User.find_by(email: "your@email.com").update(status: :active)
```

This will activate your account.


## 0.23.6

In this release, Dawarich switched to using PostGIS as the database image.

[postgis/postgis:14-3.5](https://registry.hub.docker.com/r/postgis/postgis/tags?page=1&name=14-3.5)

In your `docker-compose.yml` change image for postgres:


```diff
dawarich_db:
-   image: postgres:14.2-alpine
+   image: postgis/postgis:14-3.5-alpine
    shm_size: 1G
    container_name: dawarich_db
```

If you're on an ARM system and already updated your postgres to 17, use `ghcr.io/baosystems/postgis:17-3.5` image instead of `postgis/postgis:14-3.5-alpine`. Depending on which postgres version you're using, you can select a fitting docker image to replace your old one here: https://github.com/ImreSamu/docker-postgis?tab=readme-ov-file#recommended-versions-for-new-users

Also, have a look at the [moving to postgis](/docs/guides/moving-to-postgis) guide.


## 0.22.1

- Gems caching volume from the `docker-compose.yml` file. #638

To update existing `docker-compose.yml` to new changes, refer to the following:

```diff
  dawarich_app:
    image: freikin/dawarich:latest
...
    volumes:
-      - dawarich_gem_cache_app:/usr/local/bundle/gems
...
  dawarich_sidekiq:
    image: freikin/dawarich:latest
...
    volumes:
-      - dawarich_gem_cache_app:/usr/local/bundle/gems
...

volumes:
  dawarich_db_data:
- dawarich_gem_cache_app:
- dawarich_gem_cache_sidekiq:
  dawarich_shared:
  dawarich_public:
  dawarich_watched:
```


## 0.22.0

Docker-related files were moved to the `docker` directory and some of them were renamed. Before upgrading, study carefully changes in the `docker/docker-compose.yml` file and update your docker-compose file accordingly, so it uses the new files and commands. Copying `docker/docker-compose.yml` blindly may lead to errors.

No volumes were removed or renamed, so with a proper docker-compose file, you should be able to upgrade without any issues.

To update existing `docker-compose.yml` to new changes, refer to the following:

```diff
  dawarich_app:
    image: freikin/dawarich:latest
...
-    entrypoint: dev-entrypoint.sh
-    command: ['bin/dev']
+    entrypoint: web-entrypoint.sh
+    command: ['bin/rails', 'server', '-p', '3000', '-b', '::']
...
  dawarich_sidekiq:
    image: freikin/dawarich:latest
...
-    entrypoint: dev-entrypoint.sh
-    command: ['bin/dev']
+    entrypoint: sidekiq-entrypoint.sh
+    command: ['bundle', 'exec', 'sidekiq']
```


## 0.21.0

The `dawarich_db` service now can use a custom `postgresql.conf` file.

As @tabacha pointed out in #549, the default `shm_size` for the `dawarich_db` service is too small and it may lead to database performance issues. This release introduces a `shm_size` parameter to the `dawarich_db` service to increase the size of the shared memory for PostgreSQL. This should help database with peforming vacuum and other operations. Also, it introduces a custom `postgresql.conf` file to the `dawarich_db` service.

To mount a custom `postgresql.conf` file, you need to create a `postgresql.conf` file in the `dawarich_db` service directory and add the following line to it:

```diff
  dawarich_db:
    image: postgres:14.2-alpine
    shm_size: 1G
    container_name: dawarich_db
    volumes:
      - dawarich_db_data:/var/lib/postgresql/data
      - dawarich_shared:/var/shared
+     - ./postgresql.conf:/etc/postgresql/postgresql.conf # Provide path to custom config
  ...
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres -d dawarich_development" ]
      interval: 10s
      retries: 5
      start_period: 30s
      timeout: 10s
+   command: postgres -c config_file=/etc/postgresql/postgresql.conf # Use custom config
```

To ensure your database is using custom config, you can connect to the container (`docker exec -it dawarich_db psql -U postgres`) and run `SHOW config_file;` command. It should return the following path: `/etc/postgresql/postgresql.conf`.

An example of a custom `postgresql.conf` file is provided in the `postgresql.conf.example` file.


## 0.19.6

The `dawarich_shared` volume now being mounted to `/data` instead of `/var/shared` within the container. It fixes Redis data being lost on container restart.

To change this, you need to update the `docker-compose.yml` file:

```diff
  dawarich_redis:
    image: redis:7.0-alpine
    container_name: dawarich_redis
    command: redis-server
    volumes:
+     - dawarich_shared:/data
    restart: always
    healthcheck:
```


## 0.19.4

The `GET /api/v1/trips/:id/photos` endpoint now returns a different structure of the response:

```diff
{
  id: 1,
  latitude: 10,
  longitude: 10,
  localDateTime: "2024-01-01T00:00:00Z",
  originalFileName: "photo.jpg",
  city: "Berlin",
  state: "Berlin",
  country: "Germany",
  type: "image",
+ orientation: "portrait",
  source: "photoprism"
}
```


## 0.19.0

The `GET /api/v1/photos` endpoint now returns following structure of the response:

```json
[
  {
    "id": "1",
    "latitude": 11.22,
    "longitude": 12.33,
    "localDateTime": "2024-01-01T00:00:00Z",
    "originalFileName": "photo.jpg",
    "city": "Berlin",
    "state": "Berlin",
    "country": "Germany",
    "type": "image", // "image" or "video"
    "source": "photoprism" // "photoprism" or "immich"
  }
]
```

### Volumes in docker-compose.yml were renamed:

```diff
volumes:
-  db_data:
-  gem_cache:
-  shared_data:
-  public:
-  watched:
+  dawarich_db_data:
+  dawarich_gem_cache_app:
+  dawarich_gem_cache_sidekiq:
+  dawarich_shared:
+  dawarich_public:
+  dawarich_watched:
```

For existing instances, there is _no need renaming them_.


## 0.16.7

Prometheus exporter is now bound to 0.0.0.0 instead of localhost. `PROMETHEUS_EXPORTER_HOST` and `PROMETHEUS_EXPORTER_PORT` env vars were added to the `docker-compose.yml` file to allow you to set the host and port for the Prometheus exporter. They should be added to both `dawarich_app` and `dawarich_sidekiq` services.

Example:

```diff
  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    environment:
      ...
      PROMETHEUS_EXPORTER_ENABLED: "true"
+     PROMETHEUS_EXPORTER_HOST: 0.0.0.0
+     PROMETHEUS_EXPORTER_PORT: "9394"

  dawarich_sidekiq:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    environment:
      ...
      PROMETHEUS_EXPORTER_ENABLED: "true"
+     PROMETHEUS_EXPORTER_HOST: dawarich_app
+     PROMETHEUS_EXPORTER_PORT: "9394"
```

## 0.16.6

Dawarich now can export metrics to Prometheus. You can find the metrics at `your.host:9394/metrics` endpoint. The metrics are being exported in the Prometheus format and can be scraped by Prometheus server. To enable exporting, set the `PROMETHEUS_EXPORTER_ENABLED` env var in your docker-compose.yml to `true`.

Example:

```diff
  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    environment:
      ...
+     PROMETHEUS_EXPORTER_ENABLED: "true"
```


## 0.15.11

- ⚠️ The instruction to import `Records.json` from Google Takeout now mentions `tmp/imports` directory instead of `public/imports`. ⚠️ #326
- Hostname definition for Sidekiq healtcheck to solve #344. See the diff:

```diff
  dawarich_sidekiq:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    healthcheck:
-     test: [ "CMD-SHELL", "bundle exec sidekiqmon processes | grep $(hostname)" ]
+     test: [ "CMD-SHELL", "bundle exec sidekiqmon processes | grep ${HOSTNAME}" ]
```

- Renamed directories used by app and sidekiq containers for gems cache to fix #339:

```diff
  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    volumes:
-     - gem_cache:/usr/local/bundle/gems
+     - gem_cache:/usr/local/bundle/gems_app

...

  dawarich_sidekiq:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    volumes:
-     - gem_cache:/usr/local/bundle/gems
+     - gem_cache:/usr/local/bundle/gems_sidekiq
```


## 0.15.3

To expose the watcher functionality to the user, a new directory `/tmp/imports/watched/` was created. Add new volume to the `docker-compose.yml` file to expose this directory to the host machine.

```diff
  ...

  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    volumes:
      - gem_cache:/usr/local/bundle/gems
      - public:/var/app/public
+     - watched:/var/app/tmp/imports/watched

  ...

  dawarich_sidekiq:
      image: freikin/dawarich:latest
      container_name: dawarich_sidekiq
      volumes:
        - gem_cache:/usr/local/bundle/gems
        - public:/var/app/public
+       - watched:/var/app/tmp/imports/watched

    ...

volumes:
  db_data:
  gem_cache:
  shared_data:
  public:
+ watched:
```


## 0.13.3

- Support for miles. To switch to miles, provide `DISTANCE_UNIT` environment variable with value `mi` in the `docker-compose.yml` file. Default value is `km`.

It's recommended to update your stats manually after changing the `DISTANCE_UNIT` environment variable. You can do this by clicking the "Update stats" button on the Stats page.

⚠️IMPORTANT⚠️: All settings are still should be provided in meters. All calculations though will be converted to feets and miles if `DISTANCE_UNIT` is set to `mi`.

```diff
  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    environment:
      APPLICATION_HOST: "localhost"
      APPLICATION_PROTOCOL: "http"
      APPLICATION_PORT: "3000"
      TIME_ZONE: "UTC"
+     DISTANCE_UNIT: "mi"
  dawarich_sidekiq:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    environment:
      APPLICATION_HOST: "localhost"
      APPLICATION_PROTOCOL: "http"
      APPLICATION_PORT: "3000"
      TIME_ZONE: "UTC"
+     DISTANCE_UNIT: "mi"
```


## 0.13.0

Default exporting format is now GeoJSON instead of Owntracks-like JSON. This will allow you to use the exported data in other applications that support GeoJSON format. It's also important to highlight, that GeoJSON format does not describe a way to store any time-related data. Dawarich relies on the `timestamp` field in the GeoJSON format to determine the time of the point. The value of the `timestamp` field should be a Unix timestamp in seconds. If you import GeoJSON data that does not have a `timestamp` field, the point will not be imported.

Example of a valid point in GeoJSON format:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [13.350110811262352, 52.51450815]
  },
  "properties": {
    "timestamp": 1725310036
  }
}
```


## 0.12.3

- Resource limits to docke-compose.yml file to prevent server overload. Feel free to adjust the limits to your needs.

```diff
  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    ...
    depends_on:
      - dawarich_db
      - dawarich_redis
+   deploy:
+     resources:
+       limits:
+         cpus: '0.50'    # Limit CPU usage to 50% of one core
+         memory: '2G'    # Limit memory usage to 2GB

  dawarich_sidekiq:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    ...
    depends_on:
      - dawarich_db
      - dawarich_redis
      - dawarich_app
+   deploy:
+     resources:
+       limits:
+         cpus: '0.50'    # Limit CPU usage to 50% of one core
+         memory: '2G'    # Limit memory usage to 2GB
```


## 0.10.0

- Redis and DB containers are now being automatically restarted if they fail. Update your `docker-compose.yml` if necessary

```diff
  services:
  dawarich_redis:
    image: redis:7.0-alpine
    command: redis-server
    networks:
      - dawarich
    volumes:
      - shared_data:/var/shared/redis
+   restart: always
  dawarich_db:
    image: postgres:14.2-alpine
    container_name: dawarich_db
    volumes:
      - db_data:/var/lib/postgresql/data
      - shared_data:/var/shared
    networks:
      - dawarich
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
+   restart: always
```


## 0.8.7

- Added a logging config to the `docker-compose.yml` file to prevent logs from overflowing the disk. Now logs are being rotated and stored in the `log` folder in the root of the application. You can find usage example in the the repository's `docker-compose.yml` [file](https://github.com/Freika/dawarich/blob/master/docker-compose.yml#L50). Make sure to add this config to both `dawarich_app` and `dawarich_sidekiq` services.

```yaml
  logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
```


## 0.7.0

The `/api/v1/points` endpoint is removed. Please use `/api/v1/owntracks/points` endpoint to upload your points from OwnTracks mobile app instead.


## 0.6.1

Please update your `docker-compose.yml` file to include the following changes:

```diff
  dawarich_sidekiq:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    volumes:
      - gem_cache:/usr/local/bundle/gems
+     - public:/var/app/public
```


## 0.6.0

Volume, exposed to the host machine for placing files to import was changed. See the changes below.

Path for placing files to import was changed from `tmp/imports` to `public/imports`.

```diff
  ...

  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    volumes:
      - gem_cache:/usr/local/bundle/gems
-     - tmp:/var/app/tmp
+     - public:/var/app/public/imports

  ...
```

```diff
  ...

volumes:
  db_data:
  gem_cache:
  shared_data:
- tmp:
+ public:
```


## 0.4.0

- `/api/v1/points` is still working, but will be **deprecated** in nearest future. Please use `/api/v1/owntracks/points` instead.
- All existing points recorded directly to the database via Owntracks or Overland will be attached to the user with id 1.


## 0.3.2

In order to import `Records.json` from Google Takeout, you need to update your docker-compose.yml: https://github.com/Freika/dawarich/commit/b4116cfd72e643f5421b6f1bb33d49758f6e7e0f#diff-e45e45baeda1c1e73482975a664062aa56f20c03dd9d64a827aba57775bed0d3


## 0.2.0

This release changes how Dawarich handles a city visit threshold. Previously, the `MINIMUM_POINTS_IN_CITY` environment variable was used to determine the minimum *number of points* in a city to consider it as visited. Now, the `MIN_MINUTES_SPENT_IN_CITY` environment variable is used to determine the minimum *minutes* between two points to consider them as visited the same city.

The logic behind this is the following: if you have a lot of points in a city, it doesn't mean you've spent a lot of time there, especially if your OwnTracks app was in "Move" mode. So, it's better to consider the time spent in a city rather than the number of points.

In your docker-compose.yml file, you need to replace the `MINIMUM_POINTS_IN_CITY` environment variable with `MIN_MINUTES_SPENT_IN_CITY`. The default value is `60`, in minutes.
