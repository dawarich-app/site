---
sidebar_position: 5
title: Backup & Restore
description: Back up and restore Dawarich's database, uploaded files, background jobs, and encryption secrets.
---

# Backup & Restore

A complete instance backup includes both PostgreSQL and persistent files. The database records which files belong to each user; it does not contain the file contents. A database-only restore can recover location points while leaving imports, exports, and archived raw data unavailable.

## What to keep

The paths below are inside the containers from the standard Docker Compose configuration. A bind-mounted installation may store the same data under a host path such as `/var/lib/dawarich/`. Check your own Compose volume mappings before backing up or restoring.

| Data | Standard location | Why it matters |
| --- | --- | --- |
| PostgreSQL | `dawarich_db_data` volume | Accounts, points, trips, settings, and attachment records. Use a database dump, not a copy of a running database's files. |
| File storage | `/var/app/storage` in `dawarich_app`, volume `dawarich_storage` | Active Storage attachments, including uploaded imports, generated exports, and raw-data archives. The nested directories and opaque filenames are persistent data, not disposable cache. |
| Public files | `/var/app/public` in `dawarich_app`, volume `dawarich_public` | Legacy exports from older releases and any custom files. Generated assets share this volume. |
| Watched imports | `/var/app/tmp/imports/watched` in `dawarich_app`, volume `dawarich_watched` | Files awaiting automatic import and any source files retained there. |
| Redis | `/data` in `dawarich_redis`, volume `dawarich_shared` | Pending, scheduled, and retrying background jobs, as well as cache. Stop Redis before copying its persisted files. |
| Configuration and secrets | Your Compose file, `.env`, secret files, and any configured external secret store | Keep the original values, including `SECRET_KEY_BASE`, `ARCHIVE_ENCRYPTION_KEY`, and any `OTP_ENCRYPTION_*` overrides. If your installation has `secrets/secret-key-base`, preserve that file too. |

Changing `SECRET_KEY_BASE` can do more than sign users out: raw-data archive encryption falls back to this value when `ARCHIVE_ENCRYPTION_KEY` is unset, and production OTP encryption keys can also be derived from it. Keep the original encryption keys with your backup so encrypted data remains readable.

The application image rebuilds generated assets in `dawarich_public`, but older releases also stored exports there. Those exports remain there until migrated to Active Storage. The commands below preserve the entire public directory so legacy exports and custom files are retained. If you configured S3-compatible attachment storage, back up that bucket's objects as well; copying local storage does not back up remote objects. Photo libraries managed by Immich or PhotoPrism need their own backups.

## Backup

Use a new backup directory outside the application's volumes. Restrict access to it: the backup contains private location history and secrets. Save your Compose configuration and secret files there without changing their values, and record the Dawarich and PostgreSQL/PostGIS image versions.

Run these commands in **Bash**, from the directory containing your Compose file. Adapt container and service names if you changed them. Stop the web app and worker so the database and files cannot change independently during the backup, then stop Redis to persist its queued jobs. Keep external writers to the watched directory paused too. Allow the worker to shut down cleanly before stopping Redis so unfinished jobs can return to the queue. The 60-second grace period below covers Sidekiq’s default shutdown timeout; if you customized that timeout, use a grace period at least five seconds longer. Check the worker logs for a clean shutdown before proceeding.

```bash
set -o pipefail
umask 077
backup_dir="/path/to/backup"
mkdir -p "$backup_dir"

docker compose stop --timeout 60 dawarich_app dawarich_sidekiq
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
docker compose start dawarich_redis dawarich_app dawarich_sidekiq
```

[Docker can copy files from stopped containers](https://docs.docker.com/reference/cli/docker/container/cp/). Using a tar stream preserves the file metadata for restoration.

## Restore

Restore into an isolated installation with empty destination volumes first, using the saved configuration, encryption secrets, and the **same image versions** as the backup. Test that restore before replacing your running installation or upgrading. The database restore overwrites data; file extraction overwrites matching files and does not remove unrelated destination files.

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

Check that you can sign in, view historical points, download an existing import or export, and read a raw-data archive if you use archival. If 2FA is enabled, verify it as well. Keep the original installation and backup until these checks pass.
