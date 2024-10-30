---
sidebar_position: 9
---

# The Watcher release

Dawarich can now watch a directory for new GPX and GeoJSON files and automatically import them. This feature is useful if you have a service that can put files to the directory automatically. The directory is being watched every _60 minutes_ for new files.

First, let's update your `docker-compose.yml` file to include a new volume that will expose the `/tmp/imports/watched/` directory to the host machine. Add the following lines to the `volumes` section of the `docker-compose.yml` file:

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

Now, you can put your GPX and GeoJSON files to the `/tmp/imports/watched/your_user@email.com/` directory and Dawarich will automatically import them. You will receive a notification in the app after the file is imported.
