---
sidebar_position: 10
---

# Update PostgreSQL to the latest version

As of January 2025, Dawarich uses kinda obsolete version of PostgreSQL, so to make sure we'll be able to improve and expand the project, we need to update it to the most recent version.

This post will serve you as an instruction on how to do that.

:::info

Later on, PostgreSQL 17 will be used by default. To prevent data loss, the default docker-compose file will include a script that will prevent the app from starting and will ask you to update the database.

:::

First, we're going to create a backup, so our data is safe in case something goes wrong.

```bash
docker exec -t dawarich_db pg_dumpall -U USERNAME > backup.sql
```

Let's check if data is there:

```
head backup.sql
```

If this command returned first lines of contents of the backup file, we're safe to proceed.


Next, let's update our `docker-compose.yml` to use an updated version of PostgreSQL container:

```diff
dawarich_db:
-	image: postgres:14.2-alpine
+	image: postgres:17-alpine
```

Don't forget to upload it to your server.

Next, let's stop Dawarich and **remove** existing database volume. It's necessary because otherwise new database container won't be able to start.

```bash
docker compose down
docker volume rm dawarich_db_data
```

When it's done, let's start our database container and clear the database:

```
docker compose up -d dawarich_db

docker exec -it dawarich_db psql -U USERNAME

DROP DATABASE IF EXISTS dawarich_development;
CREATE DATABASE dawarich_development;

\q # to exit the psql session
```

Now we're ready to restore our backup to the fresh database:

```
cat backup.sql | docker exec -i dawarich_db psql -U USERNAME -d dawarich_development
```

Let's stop the database container and start all Dawarich containers together:

```
docker compose down
docker compose up -d
```

You're beautiful!

Now visit your Dawarich instance and make sure everything is working as it was before.

The author of the original update instruction is [narucx](https://github.com/narucx)
