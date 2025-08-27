---
sidebar_position: 4
---

# Imports

Imports page features a list of your imports. For each import, you can see the name, number of points imported, and the time of the import. Click on the import name to see the details of the import. On import's individual page you can also delete the import, which will ⚠️ *delete all points imported in that import* ⚠️.

On the Imports page you can also create a new import. Refer to [Imports tutorial](/docs/tutorials/import-existing-data) for more information.

![Imports](./images/imports.jpeg)

It's important to note, that importing even a huge json file should usually be processed after a couple of hours. If you're still seeing a lot of jobs in the "Enqueued" section, go there and make sure your `imports` queue is empty. If it is, your files were imported, successfully or not. In both cases you will receive a notification in the application.

On the other hand, if you're still see a lot of enqueued jobs, it's with a 99% certainty your points are being reverse geocoded. To get more details on that, go to the [Reverse geocoding](/docs/tutorials/reverse-geocoding) page.

:::tip

Existing points will not be duplicated in the database neither with importing the same file twice nor with your client app writing a point twice. Within a user, a point is being validated for uniqueness by its coordinates and timestamp.

:::
