---
sidebar_position: 10
---

# Moving to PostGIS

In release 0.23.6, Dawarich started using PostGIS for spatial data storage.

All users will need to replace our PostgreSQL database image with the one that supports Postgis.

Since there are at least 4 platforms that are supported by Dawarich, it might be not easy to decide what docker image will be a good replacement for Postgres in your case. Hopefully, the table below will help you with that.

| Architecture | Old image | New image |
| ------------ | --------- | --------- |
| amd64        | postgres:14.2-alpine | imresamu/postgis:14-3.5-alpine |
| arm64        | postgres:14.2-alpine | imresamu/postgis:14-3.5-alpine |
| linux/arm/v7 | postgres:14.2-alpine | imresamu/postgis:14-3.5-alpine |
| linux/arm/v8 | postgres:14.2-alpine | imresamu/postgis:14-3.5-alpine |

If you already switched to PostgreSQL17, here are some images that will work in your case:

| Architecture | Old image | New image |
| ------------ | --------- | --------- |
| amd64        | postgres:17-alpine | imresamu/postgis:17-3.5-alpine |
| arm64        | postgres:17-alpine | imresamu/postgis:17-3.5-alpine |
| linux/arm/v7 | postgres:17-alpine | imresamu/postgis:17-3.5-alpine |
| linux/arm/v8 | postgres:17-alpine | imresamu/postgis:17-3.5-alpine |
