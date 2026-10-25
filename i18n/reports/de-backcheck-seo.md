# de back-translation check (SEO search-term pass and testimonials)
Strings checked: 47 · Drift: 4 (8.51 %) · Fixed: 4 · Date: 2026-10-25

| key | old de text | back-translation | English source | problem | new de text |
| --- | --- | --- | --- | --- | --- |
| content:pages/google-timeline-alternative.json:meta.title | Google Timeline (Google Maps Zeitachse): private Alternative | Google Timeline (Google Maps Timeline): private alternative | Google Timeline Alternative: Private History | Drops the explicit private-history subject. Restore 'Verlauf' while keeping the alternative relationship and both Google names. | Privater Verlauf statt Google Timeline/Google Maps Zeitachse |
| content:tools/gps-file-splitter.json:meta.description | GPS-Dateien (GPX, GeoJSON, KML, KMZ) und JSON aus Google Timeline (Google Maps Zeitachse) gratis teilen: Größe, Punktzahl, Datum. ZIP, privat im Browser. | Split GPS files (GPX, GeoJSON, KML, KMZ) and JSON from Google Timeline (Google Maps Timeline) for free: size, point count, date. ZIP, privately in your browser. | Free tool to split large GPS and location files into smaller chunks. Split GPX, GeoJSON, KML, KMZ, and Google Timeline JSON by size, point count, or date. Download as ZIP. Privacy-first — runs in your browser. | Drops the explicit large-file scope. Restore 'Große' while retaining every format, splitting criterion, ZIP download and browser privacy. | Große GPS-Dateien gratis teilen: GPX/GeoJSON/KML/KMZ, JSON aus Google Timeline (Google Maps Zeitachse). Nach Größe, Punktzahl, Datum. ZIP, privat im Browser. |
| content:tools/timeline-mileage-calculator.json:meta.title | Google Timeline (Google Maps Zeitachse): Kilometerrechner | Google Timeline (Google Maps Timeline): mileage calculator | Google Timeline Mileage Calculator - Track Driving Distance Free | Drops the free claim and does not identify the kilometres as driving mileage. Restore both. | Google Timeline/Google Maps Zeitachse: Fahr-km gratis berechnen |
| content:tools/timeline-visualizer.json:meta.title | Google Timeline (Google Maps Zeitachse) im Web ansehen | View Google Timeline (Google Maps Timeline) on the web | Google Timeline Visualizer — View Your Timeline on the Web Again | Drops 'Again', losing the return-to-web meaning. Restore 'wieder'. | Google Timeline (Google Maps Zeitachse) wieder im Web ansehen |

Scope and method: the permitted `git diff HEAD -- src/i18n/content/de` identified 47 changed string leaves, including added leaves: 19 testimonial leaves and 28 comparison, page, pricing and tool leaves. All 47 initial German values received a written English back-translation in the session before any corresponding English source was read. Comparisons used the same paths and keys under `src/i18n/content/en/`; no tier-1 strings were in scope. The table records only the four meaning-drift items; stylistic compression that preserves meaning was retained. Separately, the Cloud and family meta descriptions were each shortened from 165 to 160 characters to satisfy the brief's cap. Those two edits also make the existing import/sharing actions explicit, without changing their meaning. Fixed in the header counts the four drift items; six string leaves changed in total.

All nine testimonial quotes and nine source labels remain faithful. In particular, 60-70%, 260k km, 16 countries, 378 cities and mid-2025 are unchanged, and no claims or conditions were added or removed. Informal du, preferred glossary terms and German compound hyphenation were checked. Every scoped string contains the local name `Google Maps Zeitachse` at most once. No href leaves occur in scope; existing URLs and markup were preserved. Placeholders match English. All scoped meta descriptions are at most 160 characters. Titles are at most 60 characters except where English is longer: the retained converter title is 63 (English 72), the corrected mileage title is 63 (English 64), and the corrected visualizer title is 61 (English 64).

Only six string leaves in six German content files and this report were written. No Git write commands, commits, builds, extraction, hash recording, services or suites were run. No architecture, product behavior or glossary policy changed. AFFiNE synchronization is deferred because the brief permits writes only to the assigned German locale paths and this report.

## Rails bugs fixed (changelog)

none

Validation: `npm run i18n:validate -- --locale=de` (exit 0)

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=de

de     0 problem(s)
```

Overall quality is strong: the testimonials preserve the source claims and numbers, and the local Google Timeline name reads naturally without repetition. Four drift corrections restore omitted details, and two additional description edits satisfy the 160-character cap. The other 43 initial strings preserve the English meaning, including the two descriptions shortened only for length.

