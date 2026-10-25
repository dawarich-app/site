# pl back-translation check (SEO text pass: titles, descriptions, KML/KMZ and photo guides)
Strings checked: 131 · Drift: 5 (3.8 %) · Fixed: 5 · Date: 2026-10-25

Scope: 62 changed string leaves returned by `git -C /Users/frey/projects/dawarich/site/.worktrees/seo-text-pass diff HEAD -- src/i18n/content/pl`, plus all 69 leaves in the two new guides explicitly named in the brief: `tool-guides/kml-to-kmz.json` (48) and `tool-guides/photo-geotagging.json` (21). Those guide files were present but were not represented in the required diff. Unchanged content outside these guides was excluded.

Method: each Polish string was back-translated into English and recorded in the session before its English source was opened. Tier 2 comparisons used the same path and key under `src/i18n/content/en/`. Glossary terminology and the informal Polish register were checked. Stylistic differences preserving meaning were accepted.

| key | old pl text | back-translation | English source | problem | new pl text |
| --- | --- | --- | --- | --- | --- |
| pages/family.json#meta.title | Lokalizacja rodziny — apka na iPhone i Android | Family location — app for iPhone and Android | Family Location Sharing App for iPhone & Android | The shortened title omitted sharing, changing the app's stated function to family location alone. | Udostępniaj pozycję rodzinie: apka iPhone/Android |
| tools/google-timeline-splitter.json#meta.title | Oś czasu Google (Google Timeline): podział JSON | Google Timeline (Google Timeline): JSON splitting | Google Timeline Splitter — Split Large JSON Files | The large-file qualification was omitted from the title. | Oś czasu Google (Google Timeline): dziel duże pliki JSON |
| tools/timeline-format-detector.json#meta.title | Oś czasu Google (Google Timeline): wykryj format | Google Timeline (Google Timeline): detect the format | Google Timeline Format Detector — Free Tool | The title omitted the claim that the format detector is free. | Oś czasu Google (Google Timeline): darmowy detektor formatu |
| tools/timeline-mileage-calculator.json#meta.title | Oś czasu Google (Google Timeline): licznik km | Google Timeline (Google Timeline): kilometre counter | Google Timeline Mileage Calculator — Free Log | The title omitted the free mileage log, retaining only distance calculation. | Oś czasu Google (Google Timeline): licz km, dziennik gratis |
| tools/timeline-mileage-calculator.json#meta.description | Oś czasu Google (Google Timeline): oblicz dystans jazdy, stwórz dziennik przebiegu i raporty CSV do odliczeń podatkowych. Darmowo w przeglądarce. | Google Timeline (Google Timeline): calculate driving distance, create a mileage log and CSV reports for tax deductions. Free in the browser. | Calculate driving distance from your Google Timeline, build a mileage log and export CSV reports for tax deductions. Free, runs in your browser. | The description mentioned creating CSV reports but omitted the explicit CSV export action. | Oś czasu Google (Google Timeline): oblicz dystans jazdy, stwórz dziennik przebiegu i eksportuj CSV do odliczeń podatkowych. Darmowo w przeglądarce. |

Verification: all 62 changed leaves satisfy the task's limits: meta titles ≤49 characters, or ≤60 for the Google Timeline tools; meta descriptions ≤155. The corrected family title is 49 characters; corrected Google Timeline titles are 56, 59 and 59 characters; the corrected mileage description is 147 characters. Both Google Timeline names are retained. All four guide URLs match English exactly; no `href` leaves occur in the reviewed scope. Placeholders, bold/link markup and plural forms were preserved. No length exception was needed. Only the four Polish content files listed above and this report were edited. No services were started, and no git write commands, builds, extraction or recording commands were run. These translation corrections introduce no architectural, workflow or product-behavior change requiring a shared knowledge-base update.

Validate output (`npm run i18n:validate -- --locale=pl`, exit 0):

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=pl

pl     0 problem(s)
```

Overall quality is good: the guides preserve the source's conditions, numbers, privacy statements and product names. The SEO shortening mostly preserved meaning; the five corrections restore sharing, the large-file qualification, free-tool/free-log information and explicit CSV export without exceeding the stricter length limits.

