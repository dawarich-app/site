---
sidebar_position: 7
title: Areas
description: Areas are now Places with a Visit Radius. This page explains what changed when Areas were merged into Places.
---

# Areas

Since Dawarich 1.18.0, Areas are part of [Places](/docs/features/visits-and-places#places). Every Place has a **Visit Radius**: a visit whose center falls inside it can be matched to the Place, just as a visit inside an Area was before.

When you upgrade, each Area becomes a Place with the same name, center and radius, and keeps its notes and visits. **Notify on enter and leave** is turned on for it, so it records when you arrive or leave; see [Geofencing](/docs/features/geofencing). The separate Areas layer and the **Create Area** tool are gone:

- To mark a spot you visit often, create a Place and set its Visit Radius. See [Places](/docs/features/visits-and-places#places).
- To see the circles on the map, turn on **Show place boundaries** in the Places layer options. See [Map layers](/docs/features/map#places).

Deleting a Place keeps its visits; they just lose the attached place.

## API

`/api/v1/areas` and the Visit `area_id` field still work but are deprecated. Use `/api/v1/places` and `place_id` instead. See [Updating to 1.18.0](/docs/self-hosting/updating#1180) for the other Visit API changes.
