---
sidebar_position: 10
---

# Updating to PostgreSQL 17 with Postgis

As of January 2025, Dawarich uses kinda obsolete version of PostgreSQL, so to make sure we'll be able to improve and expand the project, we need to update it to the most recent version.

This post will serve you as an instruction on how to do that.

:::danger

Be careful with this process. Make sure you're aware of the risks and have a local backup of the database.

Also, make sure your Dawarich app is not running. All four containers (`dawarich_app`, `dawarich_sidekiq`, `dawarich_db`, `dawarich_redis`) should be stopped after performing the local backup in step 0.

:::

## What we'll do

1. Dump the entire database to a file so we could have a local backup
2. Add a new PostgreSQL container to the `docker-compose.yml` file
3. Create a PostgreSQL 14 database dump in the container
4. Restore the dump into the new PostgreSQL 17 database
5. Validate the data presence in the new database

We'll also be able to roll back to the previous version if something goes wrong.

:::info
If you're looking for a compatible PostgreSQL image with PostGIS, you can find list of images for different architectures [here](/docs/self-hosting/maintenance/moving-to-postgis).
:::

## 0. Preparing local backup

First, we need to create a local backup of the existing database. The instructions on that you can find on the [Backup and restore](/docs/self-hosting/maintenance/backup-and-restore) page.

## 1. Preparing the `docker-compose.yml` file

Let's update our `docker-compose.yml` to add an updated version of PostgreSQL container. Note that we're not removing the old container yet.

Add a new service to the `services` section:

```yaml
...

dawarich_db_pg_17:
  image: postgis/postgis:17-3.5-alpine
  shm_size: 1G
  container_name: dawarich_db_pg_17
  volumes:
    - dawarich_db_data_pg_17:/var/lib/postgresql/data
    - dawarich_shared:/var/shared
  networks:
    - dawarich
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
  restart: always
  healthcheck:
    test: [ "CMD-SHELL", "pg_isready -U postgres -d dawarich_development" ]
    interval: 10s
    retries: 5
    start_period: 30s
    timeout: 10s
...
```

Add new `dawarich_db_data_pg_17` volume:

```yaml
...
volumes:
  dawarich_db_data:
  dawarich_shared:
  dawarich_public:
  dawarich_watched:
  dawarich_db_data_pg_17:
```

## 2. Creating a database dump

1. Start the database container:

```bash
docker compose -f docker/docker-compose.yml up dawarich_db -d
```

2. Create a database dump. It may take some time, so be patient:

```bash
docker exec dawarich_db pg_dump -U postgres -Fc -f /var/shared/backup.pg14.dump dawarich_development
```

## 3. Creating a new database

1. Start the new database container:

```bash
docker compose -f docker/docker-compose.yml up -d dawarich_db_pg_17
```

2. Create a new database in the new container:

```bash
docker exec dawarich_db_pg_17 psql -U postgres -c "CREATE DATABASE dawarich_development;"
```

## 4. Restore the dump into the new database

1. Restore the dump into the new database. It may take some time, so be patient:

```bash
docker exec dawarich_db_pg_17 pg_restore -U postgres -d dawarich_development /var/shared/backup.pg14.dump
```

2. Validate the data presence in the new database:

```bash
docker exec dawarich_db_pg_17 psql -U postgres -d dawarich_development -c "SELECT COUNT(*) FROM points;"
```

If the data is present, we're good to go.

## 5. Renaming the database container

1. Stop both database containers:

```bash
docker compose -f docker/docker-compose.yml stop dawarich_db_pg_17 dawarich_db
```

2. Rename both database containers:

```bash
docker rename dawarich_db dawarich_db_old
docker rename dawarich_db_pg_17 dawarich_db
```

## 6. Validating the app is working

1. Remove the `dawarich_db` service from the `docker-compose.yml` file

2. Everywhere in the `docker-compose.yml` file where you see `dawarich_db_pg_17` replace it with `dawarich_db`. The resulting `docker-compose.yml` file should look something like this (considering you have no custom changes):

```yaml

networks:
  dawarich:
services:
  dawarich_redis:
    image: redis:7.0-alpine
    container_name: dawarich_redis
    command: redis-server
    networks:
      - dawarich
    volumes:
      - dawarich_shared:/data
    restart: always
    healthcheck:
      test: [ "CMD", "redis-cli", "--raw", "incr", "ping" ]
      interval: 10s
      retries: 5
      start_period: 30s
      timeout: 10s
  dawarich_db:
    image: postgis/postgis:17-3.5-alpine
    shm_size: 1G
    container_name: dawarich_db
    volumes:
      - dawarich_db_data_pg_17:/var/lib/postgresql/data
      - dawarich_shared:/var/shared
    networks:
      - dawarich
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    restart: always
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres -d dawarich_development" ]
      interval: 10s
      retries: 5
      start_period: 30s
      timeout: 10s
  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    volumes:
      - dawarich_public:/var/app/public
      - dawarich_watched:/var/app/tmp/imports/watched
    networks:
      - dawarich
    ports:
      - 3000:3000
      # - 9394:9394 # Prometheus exporter, uncomment if needed
    stdin_open: true
    tty: true
    entrypoint: web-entrypoint.sh
    command: ['bin/rails', 'server', '-p', '3000', '-b', '::']
    restart: on-failure
    environment:
      RAILS_ENV: development
      REDIS_URL: redis://dawarich_redis:6379/0
      DATABASE_HOST: dawarich_db
      DATABASE_USERNAME: postgres
      DATABASE_PASSWORD: password
      DATABASE_NAME: dawarich_development
      MIN_MINUTES_SPENT_IN_CITY: 60
      APPLICATION_HOSTS: localhost
      TIME_ZONE: Europe/London
      APPLICATION_PROTOCOL: http
      DISTANCE_UNIT: km
      PROMETHEUS_EXPORTER_ENABLED: false
      PROMETHEUS_EXPORTER_HOST: 0.0.0.0
      PROMETHEUS_EXPORTER_PORT: 9394
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
    healthcheck:
      test: [ "CMD-SHELL", "wget -qO - http://127.0.0.1:3000/api/v1/health | grep -q '\"status\"\\s*:\\s*\"ok\"'" ]
      interval: 10s
      retries: 30
      start_period: 30s
      timeout: 10s
    depends_on:
      dawarich_db:
        condition: service_healthy
        restart: true
      dawarich_redis:
        condition: service_healthy
        restart: true
    deploy:
      resources:
        limits:
          cpus: '0.50'    # Limit CPU usage to 50% of one core
          memory: '4G'    # Limit memory usage to 4GB
  dawarich_sidekiq:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    volumes:
      - dawarich_public:/var/app/public
      - dawarich_watched:/var/app/tmp/imports/watched
    networks:
      - dawarich
    stdin_open: true
    tty: true
    entrypoint: sidekiq-entrypoint.sh
    command: ['sidekiq']
    restart: on-failure
    environment:
      RAILS_ENV: development
      REDIS_URL: redis://dawarich_redis:6379/0
      DATABASE_HOST: dawarich_db
      DATABASE_USERNAME: postgres
      DATABASE_PASSWORD: password
      DATABASE_NAME: dawarich_development
      APPLICATION_HOSTS: localhost
      BACKGROUND_PROCESSING_CONCURRENCY: 10
      APPLICATION_PROTOCOL: http
      DISTANCE_UNIT: km
      PROMETHEUS_EXPORTER_ENABLED: false
      PROMETHEUS_EXPORTER_HOST: dawarich_app
      PROMETHEUS_EXPORTER_PORT: 9394
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
    healthcheck:
      test: [ "CMD-SHELL", "bundle exec sidekiqmon processes | grep $${HOSTNAME}" ]
      interval: 10s
      retries: 30
      start_period: 30s
      timeout: 10s
    depends_on:
      dawarich_db:
        condition: service_healthy
        restart: true
      dawarich_redis:
        condition: service_healthy
        restart: true
      dawarich_app:
        condition: service_healthy
        restart: true
    deploy:
      resources:
        limits:
          cpus: '0.50'    # Limit CPU usage to 50% of one core
          memory: '4G'    # Limit memory usage to 4GB

volumes:
  dawarich_db_data:
  dawarich_shared:
  dawarich_public:
  dawarich_watched:
  dawarich_db_data_pg_17:
```

3. Start Dawarich as usual:

```bash
docker compose -f docker/docker-compose.yml up -d
```

## In case of failure: the rollback plan

1. Stop the application:

```bash
docker compose -f docker/docker-compose.yml stop
```

2. Rename the database containers back:

```bash
docker rename dawarich_db dawarich_db_failed
docker rename dawarich_db_old dawarich_db
```

3. Restart the application:

```bash
docker compose -f docker/docker-compose.yml up -d
```

4. Verify that the data is present in the old database  :

```bash
docker exec -it dawarich_db psql -U postgres -d dawarich_development -c "SELECT COUNT(*) FROM points;"
```

5. Optional: remove the failed database container:

```bash
docker stop dawarich_db_failed
docker rm dawarich_db_failed
docker volume rm dawarich_db_data_pg_17
```

## 7. Clean up

Once you're sure Dawarich is working with the new database, you can remove the old database container:

```bash
docker stop dawarich_db_old
docker rm dawarich_db_old
```

And remove the old volume:

```bash
docker volume rm dawarich_db_data
```

## 8. Well done!

You can celebrate now! 🎉
