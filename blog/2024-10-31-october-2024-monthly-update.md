---
slug: october-2024-monthly-update
title: October 2024 Monthly Update
authors:
  name: Evgenii Burmakin
  title: Author of Dawarich
  url: https://github.com/Freika
  image_url: https://github.com/Freika.png
tags: [montly-update]
---

Hi and welcome to the October 2024 monthly update of Dawarich!

## News

The biggest news of October for me is that I'm looking for a job! If you have a position for a Ruby on Rails developer with 10+ years of experience in Germany, drop me a line on [LinkedIn](https://www.linkedin.com/in/frey/) or [email](mailto:hey+jobfromdawarich@frey.today) me.

As for Dawarich, there is a pretty big list of changes and improvements in this release. Let's dive into them!

## Important features and changes

### The Watcher release

This feature will be useful for those who want to automate the import process. You can now put your GPX and GeoJSON files to the `/tmp/imports/watched/USER@EMAIL.COM` directory and Dawarich will automatically import them. This is useful if you have a service that can put files to the directory automatically. The directory is being watched every 60 minutes for new files.

For example, if you want to import a file for the user with the email address "email@dawarich.app", you would put it in the tmp/imports/watched/email@dawarich.app directory. The file will be imported into the database and the user will receive a notification in the app.

For now, only GeoJSON and GPX files are supported.

### The up-to-date Photon in Docker

[@rtuszik](https://github.com/rtuszik/) was kind enough to build a new Docker image with the latest version of the Photon API. The source code with the usage instructions can be found on [GitHub](https://github.com/rtuszik/photon-docker).

### Set up your backup

This is a kind reminder for you to set up a backup for your Dawarich instance. You can use the [backup tutorial](https://dawarich.app/docs/tutorials/backup-and-restore) to do this. It's important to keep your data safe and secure.

### Added

- `linux/arm/v7` is added to the list of supported architectures to support Raspberry Pi 4 and other ARMv7 devices
- Owntracks' .rec files now can be imported to Dawarich. The import process is the same as for other kinds of files, just select the .rec file and choose "owntracks" as a source.
- User can now select between "Raw" and "Simplified" mode in the map controls. "Simplified" mode will show less points, improving the map performance. "Raw" mode will show all points.
- Importing Immich data on the Imports page now will trigger an attempt to write raw json file with the data from Immich to `tmp/imports/immich_raw_data_CURRENT_TIME_USER_EMAIL.json` file. This is useful to debug the problem with the import if it fails.
- You can now put your GPX and GeoJSON files to `tmp/imports/watched/USER@EMAIL.COM` directory and Dawarich will automatically import them. This is useful if you have a service that can put files to the directory automatically. The directory is being watched every 60 minutes for new files.
- To expose the watcher functionality to the user, a new directory `/tmp/imports/watched/` was created. Add new volume to the `docker-compose.yml` file to expose this directory to the host machine.

```diff
  ...

  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    volumes:
      - gem_cache:/usr/local/bundle/gems
      - public:/var/app/public
+     - watched:/var/app/tmp/watched

  ...

  dawarich_sidekiq:
      image: freikin/dawarich:latest
      container_name: dawarich_sidekiq
      volumes:
        - gem_cache:/usr/local/bundle/gems
        - public:/var/app/public
+       - watched:/var/app/tmp/watched

    ...

volumes:
  db_data:
  gem_cache:
  shared_data:
  public:
+ watched:
```

### Changed

- `GET /api/v1/points` can now accept optional `?order=asc` query parameter to return points in ascending order by timestamp. `?order=desc` is still available to return points in descending order by timestamp
- `GET /api/v1/points` now returns `id` attribute for each point
- Retries disabled for some background jobs
- Use static version of `geocoder` library that supports http and https for Photon API host. This is a temporary solution until the change is available in a stable release of `geocoder`.
- The Map page now by default uses timeframe based on last point tracked instead of the today's points. If there are no points, the map will use the today's timeframe.
- The map on the Map page can no longer be infinitely scrolled horizontally.
- Refactored the stats calculation process to make it more efficient.
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

### Fixed

- Now you can use both http and https protocols for the Photon API host. You now need to explicitly provide `PHOTON_API_USE_HTTPS` to be `true` or `false` depending on what protocol you want to use. [Example](https://github.com/Freika/dawarich/blob/master/docker-compose.yml#L116-L117) is in the `docker-compose.yml` file.
- For stats, total distance per month might have been not equal to the sum of distances per day. Now it's fixed and values are equal.
- Mobile view of the map looks better now.
- Stats update is now being correctly triggered every 6 hours.
- A bug where "RuntimeError: failed to get urandom" was being raised upon importing attempt on Synology.
- Fixed a bug where Google Takeout import was failing due to unsupported date format with milliseconds in the file.
- Stats distance calculation now correctly calculates the daily distances.
- New app version is now being checked every 6 hours instead of 1 day and the check is being performed in the background.

### Removed

- Owntracks' .json files are no longer supported for import as Owntracks itself does not export to this format anymore.

---

## Conclusion

That's it for the October 2024 monthly update! I hope you enjoyed the news and changes. If you have any questions or suggestions, feel free to reach out to me on [Twitter](https://x.com/freymakesstuff) or [Mastodon](https://mastodon.social/@dawarich).

You can also support the project by sponsoring it on [Patreon](https://www.patreon.com/freika), [Ko-Fi](https://ko-fi.com/freika) or [Github Sponsors](https://github.com/sponsors/Freika) ✨

Thank you and see you in the next monthly update!

