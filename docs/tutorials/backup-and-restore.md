---
sidebar_position: 5
---

# Backup & Restore

*This page is heavily inspired by Immich's "[Backup and Restore](https://immich.app/docs/administration/backup-and-restore)" page*

## Backup

```bash
docker exec -t dawarich_db pg_dumpall --clean --if-exists --username=postgres | gzip > "/path/to/backup/dump.sql.gz"
```

## Restore

```
docker compose down -v      # CAUTION! Deletes all Dawarich data to start from scratch.
# rm -rf DB_DATA_LOCATION   # CAUTION! Deletes all Dawarich data to start from scratch.
docker compose pull         # Update to latest version of Dawarich (if desired)
docker compose create       # Create Docker containers for Dawarich apps without running them.
docker start dawarich_db    # Start Postgres server
sleep 10                    # Wait for Postgres server to start up
gunzip < "/path/to/backup/dump.sql.gz" \
| sed "s/SELECT pg_catalog.set_config('search_path', '', false);/SELECT pg_catalog.set_config('search_path', 'public, pg_catalog', true);/g" \
| docker exec -i dawarich_db psql --username=postgres    # Restore Backup
docker compose up -d        # Start remainder of Dawarich apps
```
