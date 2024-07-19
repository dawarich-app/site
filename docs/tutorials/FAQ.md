---
sidebar_position: 99
---

# FAQ


## How to enter Dawarich console?
<details>
  <summary>Show me!</summary>

  Dawarich built using [Ruby on Rails](https://rubyonrails.org/), so you can use the Rails console to interact with the application. To enter the console, run the following on your server:

  ```bash
  docker exec -it CONTAINER_ID /bin/sh
  bin/rails console
  ```
</details>

## How to make a user an admin?

<details>
  <summary>Show me!</summary>

  To make a user an admin, you can use the Rails console. First, enter the console as described in the [previous question](#how-to-enter-dawarich-console). Then, run the following command:

  ```ruby
  User.find_by(email: 'user@example.com').update(admin: true)
  ```
</details>

## My distance is off, how can I fix it?

<details>
  <summary>Show me!</summary>

  If you find that the distance in your stats is off, it might indicate a problem either in your data or in the importing process.

  In either case, what you want to look for are the points with coordinates `0,0`. These are the points that Dawarich couldn't process correctly. You can find them by running the following command in the Rails console:

  ```ruby
  # Getting all points with coordinates 0,0
  points = Point.where(latitude: 0, longitude: 0)

  # showing amount of such points
  points.size
  ```

  If there are any points with coordinates `0,0`, you can safely delete them by running:

  ```ruby
  points.destroy_all
  ```

  If you find points such as this, it would be great if you could open an issue on the [GitHub repository](https://github.com/Freika/dawarich/issues) with your import file structure (you can alter your real coordinates, of course) so we can investigate the issue further.
</details>

