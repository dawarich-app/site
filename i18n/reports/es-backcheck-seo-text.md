# es back-translation check (SEO text pass: titles, descriptions, KML/KMZ and photo guides)
Strings checked: 131 · Drift: 5 (3.8 %) · Fixed: 5 · Date: 2026-10-25

Scope: 62 changed string leaves from `git -C /Users/frey/projects/dawarich/site/.worktrees/seo-text-pass diff HEAD -- src/i18n/content/es`, plus all 69 string leaves in the two new guides, `tool-guides/kml-to-kmz.json` and `tool-guides/photo-geotagging.json`, which were absent from that diff. Independent English back-translations were written for all 131 strings before opening their matching English sources under `src/i18n/content/en/`. Keys below are relative to `src/i18n/content/es/`.

| key | old es text | back-translation | English source | problem | new es text |
| --- | --- | --- | --- | --- | --- |
| tools/gps-file-splitter.json:meta.description | Divide GPX, GeoJSON, KML, KMZ y Google Timeline (Cronología de Google Maps) por tamaño, puntos o fecha; descarga ZIP. Gratis en tu navegador. | Split GPX, GeoJSON, KML, KMZ and Google Timeline (Google Maps Timeline) by size, points or date; download ZIP. Free in your browser. | Split large GPX, GeoJSON, KML, KMZ and Google Timeline files by size, point count or date and download them as a ZIP. Free, runs in your browser. | Dropped the explicit support for large files. | Divide grandes GPX, GeoJSON, KML, KMZ y Google Timeline (Cronología de Google Maps) por tamaño, puntos o fecha; descarga ZIP. Gratis en tu navegador. |
| tools/heatmap-generator.json:meta.description | Crea mapas de calor de GPX, FIT, TCX, GeoJSON, KML o Google Timeline (Cronología de Google Maps): carreras, ciclismo y viajes. Gratis en tu navegador. | Create heatmaps from GPX, FIT, TCX, GeoJSON, KML or Google Timeline (Google Maps Timeline): runs, cycling and trips. Free in your browser. | Create heatmaps from GPX, FIT, TCX, GeoJSON, KML or Google Timeline files to see your running, cycling and travel patterns. Free, in your browser. | Listed activities but lost the purpose of seeing activity and travel patterns. | Haz mapas de calor de GPX/FIT/TCX/GeoJSON/KML o Google Timeline (Cronología de Google Maps): patrones al correr, pedalear y viajar. Gratis en tu navegador. |
| tools/map-poster-maker.json:meta.title | Creador de pósteres de mapas desde rutas GPS | Map poster maker from GPS routes | Map Poster Maker — Route Posters From GPS Files | Changed the input from GPS files to GPS routes, omitting the file-based workflow. | Crea pósteres de mapas con rutas de archivos GPS |
| tools/timeline-format-detector.json:meta.description | Identifica tu exportación de Google Timeline (Cronología de Google Maps): formato, puntos, fechas, tamaño y calidad de datos. Gratis en tu navegador. | Identify your Google Timeline (Google Maps Timeline) export: format, points, dates, size and data quality. Free in your browser. | Find out which Google Timeline export you have: format name, point count, date range, file size and data quality. Free, runs in your browser. | Generic points and dates lost the specific point-count and date-range outputs. | Detecta tu exportación de Google Timeline (Cronología de Google Maps): formato, puntos totales, rango de fechas, tamaño y calidad. Gratis en tu navegador. |
| tools/timeline-merger.json:meta.description | Une Google Timeline (Cronología de Google Maps) en un archivo sin puntos duplicados: Records.json, historial semántico y archivos del móvil. Gratis. | Merge Google Timeline (Google Maps Timeline) into one file without duplicate points: Records.json, semantic history and mobile files. Free. | Merge several Google Timeline exports into one file and remove duplicate points. Combines Records.json, Semantic History and phone exports. Free. | Omitted the explicit merging of multiple exports and translated the named Semantic History export type. | Une exportaciones de Google Timeline (Cronología de Google Maps) en un archivo sin duplicados: Records.json, Semantic History y del móvil. Gratis. |

Checks: all 36 scoped meta titles are ≤49 characters (maximum 49); all 23 scoped meta descriptions are ≤155 (maximum 155). All four guide URLs equal English. Placeholders are unchanged, including `{price}`. The guides retain their numbers, conditions, file names, informal tú register and glossary terms. No length-related meaning compromise was necessary. No builds, extraction, recording, staging or commits were run; no services were started.

Validation command: `npm run i18n:validate -- --locale=es` (exit 0).

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=es

es     0 problem(s)
```

Overall quality is good: both new guides preserve the English meaning, and most metadata differences are equivalent Spanish phrasing. Five shortened metadata strings lost useful source detail; all five are fixed, with the local Google Timeline name retained wherever it appeared.

