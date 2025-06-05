---
sidebar_position: 9
---

# The Watcher release

Dawarich can now watch a directory for new GPX, Owntracks' .rec and GeoJSON files and automatically import them. This feature is useful if you have a service that can put files to the directory automatically. The directory is being watched every _60 minutes_ for new files. Updated files with the same name will be ignored.

First, let's update your `docker-compose.yml` file to include a new volume that will expose the `/tmp/imports/watched/` directory to the host machine. Add the following lines to the `volumes` section of the `docker-compose.yml` file:

```diff
  ...

  dawarich_app:
    image: freikin/dawarich:latest
    container_name: dawarich_app
    volumes:
      - public:/var/app/public
+     - watched:/var/app/tmp/imports/watched

  ...

  dawarich_sidekiq:
      image: freikin/dawarich:latest
      container_name: dawarich_sidekiq
      volumes:
        - public:/var/app/public
+       - watched:/var/app/tmp/imports/watched

  ...

volumes:
  db_data:
  shared_data:
  public:
+ watched:
```

Now, in the container, create a directory for your user (`/tmp/imports/watched/your_user@email.com/`) and put your GPX, Owntracks' `.rec` and GeoJSON files to the directory.

Dawarich will automatically import the files and you will receive a notification in the app after the file is imported.
