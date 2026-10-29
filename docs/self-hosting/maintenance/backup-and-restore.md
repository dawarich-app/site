---
sidebar_position: 5
title: Backup & Restore
description: Back up and restore Dawarich's database, uploaded files, background jobs, and encryption secrets.
---

# Backup & Restore

A complete instance backup includes both PostgreSQL and persistent files. The database records which files belong to each user; it does not contain the file contents. A database-only restore can recover location points while leaving imports, exports, and archived raw data unavailable.

## What to keep

The paths below are inside the containers from the standard Docker Compose configuration. A bind-mounted or packaged installation may store the same data under a host path such as `/var/lib/dawarich/`. Check your own volume mappings or package configuration before backing up or restoring. The volume names in this table are Compose configuration keys; Docker normally prefixes the actual volume names with the Compose project name. The commands below copy through the containers, so you do not need to guess that prefix.

| Data | Standard location | Why it matters |
| --- | --- | --- |
| PostgreSQL | `dawarich_db_data` volume | Accounts, points, trips, settings, and attachment records. Use a database dump, not a copy of a running database's files. |
| Local file storage | `/var/app/storage` in `dawarich_app`, volume `dawarich_storage` | Active Storage attachments when using the default `STORAGE_BACKEND=local`, including uploaded imports, generated exports, and raw-data archives. The nested directories and opaque filenames are persistent data, not disposable cache. |
| Public files | `/var/app/public` in `dawarich_app`, volume `dawarich_public` | Legacy exports from older releases and any custom files. Generated assets share this volume. |
| Watched imports (optional) | `/var/app/tmp/imports/watched` in `dawarich_app`, volume `dawarich_watched` | Preserve this input directory if you use automatic imports and need to retain pending or original source files. It is separate from Active Storage. |
| Redis | `/data` in `dawarich_redis`, volume `dawarich_shared` | Pending, scheduled, and retrying background jobs, as well as cache. Stop Redis before copying its persisted files. |
| Configuration and secrets | Your Compose file, `.env`, secret files, and any configured external secret store | Keep the original values, including `SECRET_KEY_BASE`, `ARCHIVE_ENCRYPTION_KEY`, and any `OTP_ENCRYPTION_*` overrides. If your installation has `secrets/secret-key-base`, preserve that file too. |

Changing `SECRET_KEY_BASE` can do more than sign users out: raw-data archive encryption falls back to this value when `ARCHIVE_ENCRYPTION_KEY` is unset. In production, each unset `OTP_ENCRYPTION_PRIMARY_KEY`, `OTP_ENCRYPTION_DETERMINISTIC_KEY`, or `OTP_ENCRYPTION_KEY_DERIVATION_SALT` is derived from `SECRET_KEY_BASE`. These keys also protect encrypted settings. Preserve `SECRET_KEY_BASE` and any explicit encryption-key overrides; generating new keys during restore can make existing encrypted data unreadable. If your package stores the secret in `secrets/secret-key-base`, keep that original file; this is an installation-specific path, not a standard Docker path. Keep any Rails credentials files and their decryption key if your installation uses them.

For a non-Docker installation, local Active Storage lives at `Rails.root/storage` and the watcher reads `Rails.root/tmp/imports/watched`, unless your installation overrides those paths. You may omit the watched-directory backup and restore commands below if you do not use that directory. Omitting it does not replace the backup of attachments already stored in Active Storage.

The application image rebuilds generated assets in `dawarich_public`, but older releases also stored exports there. Those exports remain there until migrated to Active Storage. The commands below preserve the entire public directory so legacy exports and custom files are retained. Photo libraries managed by Immich or PhotoPrism need their own backups.

### S3-compatible storage

With `STORAGE_BACKEND=s3`, attachment contents live in the configured bucket instead of `Rails.root/storage`. Copying the local storage directory does not back up those objects. Back up the bucket objects and preserve the storage configuration (`AWS_BUCKET`, `AWS_REGION`, any `AWS_ENDPOINT_URL` or `AWS_ENDPOINT`) and credentials securely. Retain local attachments too if you previously used local storage and have not migrated them.

Use your storage provider's backup and restore procedure, keeping object keys unchanged. Capture the bucket backup while the app, workers, and any other object writers are stopped, in the same maintenance window as the database dump. On restore, make the matching objects available through the saved storage configuration before starting Dawarich. The local-file commands below do not perform a bucket backup or restore.

## Backup

Use a new backup directory outside the application's volumes. Restrict access to it: the backup contains private location history and secrets. Save your Compose configuration and secret files there without changing their values, and record the Dawarich and PostgreSQL/PostGIS image versions.

Run these commands in **Bash**, from the directory containing your Compose file. Adapt container and service names if you changed them. Stop the web app and worker so the database and files cannot change independently during the backup, then stop Redis to persist its queued jobs. Keep external writers to the watched directory paused too. Allow the worker to shut down cleanly before stopping Redis so unfinished jobs can return to the queue. The 60-second grace period below covers Sidekiq’s default shutdown timeout; if you customized that timeout, use a grace period at least five seconds longer. Check the logs for a clean shutdown before proceeding. Since 1.17.0 the default setup runs background jobs inside `dawarich_app`; add `dawarich_sidekiq` to the commands below only if you run a [separate worker](/docs/self-hosting/configuration/background-jobs#running-a-separate-worker).

The examples assume the standard container names and the PostgreSQL administrator `postgres`. If you changed the database administrator, replace `--username=postgres` in **all** dump, readiness, and restore commands. Keep the database running during the dump; do not copy its live data directory. Complete any external bucket backup before restarting writers.

```bash
set -o pipefail
umask 077
backup_dir="/path/to/backup"
mkdir -p "$backup_dir"

docker compose stop --timeout 60 dawarich_app
docker compose stop dawarich_redis

docker exec dawarich_db pg_dumpall --clean --if-exists --username=postgres \
  | gzip > "$backup_dir/dump.sql.gz"
docker cp dawarich_app:/var/app/storage/. - | gzip > "$backup_dir/storage.tar.gz"
docker cp dawarich_app:/var/app/public/. - | gzip > "$backup_dir/public.tar.gz"
docker cp dawarich_app:/var/app/tmp/imports/watched/. - | gzip > "$backup_dir/watched.tar.gz"
docker cp dawarich_redis:/data/. - | gzip > "$backup_dir/redis.tar.gz"
```

Check that **each command succeeds** before treating the backup as complete. Keep the configuration and secrets alongside these archives, then restart the services:

```bash
docker compose start dawarich_redis dawarich_app
```

[Docker can copy files from stopped containers](https://docs.docker.com/reference/cli/docker/container/cp/). Using a tar stream preserves the file metadata for restoration.

## Restore

Restore into an isolated installation with empty destination volumes first, using the saved configuration, encryption secrets, and the **same image versions** as the backup. Start it with the original `SECRET_KEY_BASE` and any encryption-key overrides from the backup; do not generate new ones. Test that restore before replacing your running installation or upgrading. Use a separate Docker host, or change container names, published ports, and any explicitly named volumes or bind mounts to avoid touching the source installation. A different Compose project name alone does not change the standard configuration's fixed `container_name` values. The database restore overwrites data; file extraction overwrites matching files and does not remove unrelated destination files.

:::warning
Do not run `docker compose down -v` against your existing installation as a routine restore step: it removes named volumes, including storage and watched imports. A database dump alone cannot recover those files.
:::

Create the destination containers without starting the web app or worker. Restore their file volumes and Redis data before starting those services:

```bash
set -o pipefail
backup_dir="/path/to/backup"

docker compose create
gunzip -c "$backup_dir/storage.tar.gz" | docker cp -a - dawarich_app:/var/app/storage/
gunzip -c "$backup_dir/public.tar.gz" | docker cp -a - dawarich_app:/var/app/public/
gunzip -c "$backup_dir/watched.tar.gz" | docker cp -a - dawarich_app:/var/app/tmp/imports/watched/
gunzip -c "$backup_dir/redis.tar.gz" | docker cp -a - dawarich_redis:/data/

docker start dawarich_db
```

Wait until `docker exec dawarich_db pg_isready --username=postgres` reports that PostgreSQL accepts connections, then restore the database:

```bash
gunzip -c "$backup_dir/dump.sql.gz" \
  | sed "s/SELECT pg_catalog.set_config('search_path', '', false);/SELECT pg_catalog.set_config('search_path', 'public, pg_catalog', true);/g" \
  | docker exec -i dawarich_db psql --username=postgres
```

Review the restore output for errors before starting the remaining services. Restore any external attachment bucket and installation-specific secret files first, and make sure the container users can read and write the restored directories. Then run:

```bash
docker compose up -d
```

If you restored the database without the Redis data saved at the same time, clear the application cache before checking the result, so map tiles and point counts are rebuilt from the restored data:

```bash
docker exec dawarich_app bin/rails runner 'Rails.cache.clear'
```

Check that you can sign in, view historical points, download an existing import or export, and read a raw-data archive if you use archival. If 2FA is enabled, verify it as well. Keep the original installation and backup until these checks pass.
