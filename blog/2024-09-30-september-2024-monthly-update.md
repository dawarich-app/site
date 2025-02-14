---
slug: september-2024-monthly-update
title: September 2024 Monthly Update
authors: evgenii
tags: [montly-update]
---

Hi and welcome to the September 2024 monthly update of Dawarich!

This is the first monthly update of the project. It will be published in the end(-ish) of each month and will contain the most interesting news and updates of the project.

## News

Believe it or not, in the beginning of the month, there was less than 900 stars on the GitHub repository. But now, there are almost 2000 stars! The [post on the 0.12.0 release](https://www.reddit.com/r/selfhosted/comments/1f73ctc/dawarich_0120_selfhosted_google_location_history/) on Reddit was very popular and it helped to attract more attention to the project. Shortly after that post, someone posted a link to Dawarich repo on [HackerNews](https://news.ycombinator.com/item?id=41424373) and lots of people visited the project page from there. The project is growing and it's very exciting!

<!-- truncate -->

## Important features and changes

### Miles

Dawarich now supports miles! To switch to miles, provide `DISTANCE_UNIT` environment variable with value `mi` in the `docker-compose.yml` file. Default value is `km`.

It's recommended to update your stats manually after changing the `DISTANCE_UNIT` environment variable. You can do this by clicking the "Update stats" button on the Stats page.

⚠️IMPORTANT⚠️: All settings are still should be provided in meters. All calculations though will be converted to feets and miles if `DISTANCE_UNIT` is set to `mi`.

```diff
  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    environment:
      ...
+     DISTANCE_UNIT: "mi"
  dawarich_sidekiq:
    image: freikin/dawarich:latest
    container_name: dawarich_sidekiq
    environment:
      ...
+     DISTANCE_UNIT: "mi"
```

### Default time range on the map

The default time range on the map is now 1 day instead of 1 month. It will help you with performance issues if you have a lot of points in the database.

### The GPX and GeoJSON export release

⚠️ BREAKING CHANGES: ⚠️

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

## Changelog

Since I already posted about the 0.12.0 release, I will not go into details about it. Instead, I'll tell you about the changes that were made after that release.

Since Dawarich is being actively developed, there are always lots of moving parts. I encourage you to check the [releases page](https://github.com/Freika/dawarich/releases) regularely to see all the changes that were made. All breaking changes and ways to mitigate them are always described in the release notes.


### Added

- `GET /api/v1/health` endpoint to check the health of the application with swagger docs
- `PATCH /api/v1/settings` endpoint to update user settings with swagger docs
- `GET /api/v1/settings` endpoint to get user settings with swagger docs
- `GET /api/v1/points` response now will include `X-Total-Pages` and `X-Current-Page` headers to make it easier to work with the endpoint
- "Slim" version of `GET /api/v1/points`: pass optional param `?slim=true` to it and it will return only latitude, longitude and timestamp
- 7 new tile layers to choose from. Now you can select the tile layer that suits you the best. You can find the list of available tile layers in the map controls in the top right corner of the map under the layers icon
- The Pages point now shows total number of points found for provided date range
- Links to view import points on the map and on the Points page on the Imports page
- Support for miles. To switch to miles, provide `DISTANCE_UNIT` environment variable with value `mi` in the `docker-compose.yml` file. Default value is `km`
- GeoJSON format is now available for exporting data
- GPX format is now available for exporting data
- Importing GeoJSON is now available
- Missing `page` and `per_page` query parameters to the `GET /api/v1/points` endpoint swagger docs
- Resource limits to docke-compose.yml file to prevent server overload. Feel free to adjust the limits to your needs

```yml
deploy:
  resources:
    limits:
      cpus: '0.50'    # Limit CPU usage to 50% of one core
      memory: '2G'    # Limit memory usage to 2GB
```

### Changed

- `GET /api/v1/points` will no longer return `raw_data` attribute for each point as it's a bit too much
- GPX export now has time and elevation elements for each point
- Default value for `RAILS_MAX_THREADS` was changed to 10
- Visit suggestions background job was moved to its own low priority queue to prevent it from blocking other jobs.
- Default time range on the map is now 1 day instead of 1 month. It will help you with performance issues if you have a lot of points in the database
- The Points page now have number of points found for provided date range
- Ruby version updated to 3.3.4
- Visits suggestion process now will try to merge consecutive visits to the same place into one visit
- Default exporting format is now GeoJSON instead of Owntracks-like JSON. This will allow you to use the exported data in other applications that support GeoJSON format
- A notification about an existing import with the same name will now show the import name
- Export file now also will contain `raw_data` field for each point. This field contains the original data that was imported to the application
- Map settings moved to the map itself and are available in the top right corner of the map under the gear icon


### Fixed

- Deleting points from the Points page now preserves `start_at` and `end_at` values for the routes
- Visits map now being rendered correctly in the Visits page
- Fixed issue with timezones for negative UTC offsets
- Point page is no longer reloads losing provided timestamps when searching for points on Points page
- Optimize order of the dockerfiles to leverage layer caching by @JoeyEamigh
- Add support for alternate postgres ports and db names in docker by @JoeyEamigh
- Creating exports directory if it doesn't exist by @tetebueno
- Link to Visits page in notification informing about new visit suggestion
- The Imports page now loading faster
- Fixed a bug preventing the application from starting, when there is no users in the database but a data migration tries to update one
- Fixed a bug where the confirmation alert was shown more than once when deleting a point
- Importing geodata from Immich will now not throw an error in the end of the process


## Conclusion

Phew, that was a lot of changes! With every release it always feels like not much was added or changed, but when you look back at the changelog, it's always a surprise how much was done in a month.

I'd also like to thank everyone who contributed to the project in any way, whether it was a bug report, a feature request, a pull request, or just a kind word. You are the ones who make this project better every day. Thank you!

If you're feeling generous, you can support the project by sponsoring it on [Patreon](https://www.patreon.com/freika), [Ko-Fi](https://ko-fi.com/freika) or [Github Sponsors](https://github.com/sponsors/Freika) ✨

Thank you and see you in the next monthly update! More exciting stuff is coming soon! 🚀

