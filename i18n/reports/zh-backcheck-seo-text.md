# zh back-translation check (SEO text pass: titles, descriptions, KML/KMZ and photo guides)
Strings checked: 209 · Drift: 1 (0.48 %) · Fixed: 1 · Date: 2026-10-25

| key | old zh text | back-translation | English source | problem | new zh text |
| --- | --- | --- | --- | --- | --- |
| `tool-guides/gpx-to-kml.json:reference.body.2` | 如果您想分享或可视化轨迹，接收软件通常需要 KML。如果想将轨迹传回其他 GPS 设备，或在运动软件中分析，请保留 GPX。 | To share or visualize a track, the receiving software usually needs KML. To send a track to another GPS device or analyze it in sports software, keep GPX. | If your goal is to share or visualise a track, KML is what the receiving software wants. If your goal is to feed it back into another GPS device or analyse it in fitness software, keep it as GPX. | Added “usually” (通常) qualifies an unqualified English statement. Removed that qualifier to preserve the source claim. | 如果您想分享或可视化轨迹，接收软件需要 KML。如果想将轨迹传回其他 GPS 设备，或在运动软件中分析，请保留 GPX。 |

Scope: 62 changed string leaves identified by the prescribed `git diff HEAD -- src/i18n/content/zh`, plus all 147 leaves in the three explicitly requested new guides: `gpx-to-kml` (78), `kml-to-kmz` (48), and `photo-geotagging` (21). Those new guide files were present on disk but absent from that diff. Each string was independently back-translated before opening its English counterpart at the same tier-2 path and key; URLs and XML examples were retained verbatim for comparison.

Checks: all 36 scoped meta titles meet the 49-character limit (longest: 43); all 23 scoped meta descriptions meet the 155-character limit (longest: 104). All 11 link targets and both XML examples equal English. Both `{price}` occurrences, bold markup, guide key/array structure, and the local Google Timeline name were preserved. Only the drift leaf above was edited during this check. No build, extraction, recording, staging or commit was performed.

Validation command: `npm run i18n:validate -- --locale=zh`

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=zh

zh     0 problem(s)
```

Overall quality is strong: the shortened metadata and new guides retain the English meaning, claims, quantities and conditions, with natural Simplified Chinese, polite 您 where addressed, and consistent product terminology. Apart from the one added qualifier fixed above, differences are stylistic; no meaning had to be sacrificed to meet the length limits. No architectural, workflow or product-behavior decision changed, so no AFFiNE documentation update was needed.
