---
sidebar_position: 98
---

# Updating guides

Dawarich is a rapidly evolving project, and some changes may break compatibility with older versions. This page will serve as a record of the breaking changes and migration paths.

## 0.25.0

### Visits and places

The release page: https://github.com/Freika/dawarich/releases/tag/0.25.0

There is a known issue when data migrations are not being run automatically on some systems. If you're experiencing issues when opening map page, trips page or when trying to see visits, try executing the following command in the [Console](/docs/FAQ/#how-to-enter-dawarich-console):

### Errors on the map page

If on the map page you see errors like this:

```
undefined method `y' for nil:NilClass
```

This means that the data migration job that supposed to move coordinates from `longitude` and `latitude` columns to `lonlat` column on `points` table was not run. We can fix this by running the following command in the [Console](/docs/FAQ/#how-to-enter-dawarich-console):

```ruby
User.includes(:tracked_points).find_each do |user|
  user.tracked_points.where(lonlat: nil).update_all('lonlat = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)')
end
```

This will update the `lonlat` column for all the points. After this, the map should work again.

If this script failed with a `killed` message, you have ran out of memory. Simply repeat the command again, it will pick up from the last processed point.

If you experiencing something similar to the following error:

```
Caused by PG::UniqueViolation: ERROR:  duplicate key value violates unique constraint "index_points_on_lonlat_timestamp_user_id"
DETAIL:  Key (lonlat, "timestamp", user_id)=(0101000020E6100000E2E5E95C51522140B6D8EDB3CA184940, 1737716451, 2) already exists.
```

This means, you have some points with the same coordinates, timestamp and user_id. This usually should not happen, but we can remove the duplicates. Run the following command in the [Console](/docs/FAQ/#how-to-enter-dawarich-console):

```ruby
user_id = 2 # (your user id based on error message above)
timestamp = 1739235618 # (your problematic timestamp, based on error message above)
points = Point.where(user_id: user_id, timestamp: timestamp)

points.size # This will return number of duplicated points

points.drop(1).each(&:destroy) # This will remove all but the first point.
```

After this, run the script from the previous step again. Repeat, if you see the same for different timestamp or user_id.

### The "your user is not active" errors

In the [Console](/docs/FAQ/#how-to-enter-dawarich-console), run the following command:

```ruby
User.find_by(email: "your@email.com").update(status: :active)
```

This will activate your account.
