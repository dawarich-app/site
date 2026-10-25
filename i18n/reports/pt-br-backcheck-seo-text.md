# pt-br back-translation check (SEO text pass: titles, descriptions, KML/KMZ and photo guides)
Strings checked: 131 · Drift: 6 (4.6 %) · Fixed: 6 · Date: 2026-10-25

Scope: 62 changed string leaves from `git diff HEAD -- src/i18n/content/pt-br`, plus all 69 leaves in the two new guides (`tool-guides/kml-to-kmz.json` and `tool-guides/photo-geotagging.json`), which the tracked diff does not show. Independent English back-translations of all 131 leaves were written before opening their English counterparts under `src/i18n/content/en/`. Register and product terminology were checked against `i18n/glossary.json`.

| key | old pt-br text | back-translation | English source | problem | new pt-br text |
| --- | --- | --- | --- | --- | --- |
| pages/cloud.json:meta.description | Histórico de localização privado na Alemanha: mapas de calor, viagens e estatísticas, sem vender dados. Importe Google Takeout e mais. Desde {price}/ano. | Private location history in Germany: heatmaps, trips and statistics, without selling data. Import Google Takeout and more. From {price}/year. | Privacy-first location history hosted in Germany: heatmaps, trips and statistics, no data selling. Import Google Takeout and more. From {price}/year. | 'In Germany' no longer specifies that Germany is the hosting location; it can describe the history's geographic coverage. Restore hosting and keep privacy, features, imports and starting price. | Histórico de localização privado hospedado na Alemanha: mapas de calor, viagens, estatísticas; sem vender dados. Importe Google Takeout… Desde {price}/ano. |
| pages/family.json:meta.title | Compartilhar localização: família, iPhone/Android | Share location: family, iPhone/Android | Family Location Sharing App for iPhone & Android | Drops 'App' from the English title; restore the app while preserving family location sharing and both platforms. | App: compartilhe local em família, iPhone/Android |
| tools/google-timeline-converter.json:meta.title | Linha do tempo do Google (Google Timeline): GPX/KML/CSV | Google's Timeline (Google Timeline): GPX/KML/CSV | Google Timeline to GPX, KML & CSV Converter | Only lists formats, losing the conversion direction. Add 'para' to retain the source-to-output relationship while keeping both Timeline names. | Linha do tempo do Google/Google Timeline: para GPX/KML/CSV |
| tools/google-timeline-splitter.json:meta.title | Linha do tempo do Google (Google Timeline): dividir JSON | Google's Timeline (Google Timeline): split JSON | Google Timeline Splitter — Split Large JSON Files | Drops the large-file qualifier. Restore 'large' while retaining JSON splitting and both Timeline names. | Linha do tempo do Google/Google Timeline: divida JSON grande |
| tools/timeline-format-detector.json:meta.title | Linha do tempo do Google (Google Timeline): detectar formato | Google's Timeline (Google Timeline): detect format | Google Timeline Format Detector — Free Tool | Drops the English title's 'Free' claim. Restore it while retaining format identification and both Timeline names. | Linha do tempo do Google/Google Timeline: ver formato grátis |
| tools/timeline-mileage-calculator.json:meta.title | Linha do tempo do Google (Google Timeline): quilometragem | Google's Timeline (Google Timeline): mileage | Google Timeline Mileage Calculator — Free Log | The title only says 'mileage', dropping the free mileage log. Restore the log and free claim; the description explicitly retains calculation. | Linha do tempo do Google/Google Timeline: km, diário grátis |

Length constraints: every scoped meta title is ≤49 characters, except Google Timeline tool titles (≤60); every scoped meta description is ≤155. The six replacements have lengths 155, 49, 58, 60, 60 and 59 respectively. The Cloud import list uses an ellipsis for “and more” to retain hosting, privacy, features and the starting annual price within 155 characters.

Title limit tradeoff: spelling out “Mileage Calculator — Free Log” alongside both required Timeline names exceeds 60 characters. The revised title retains mileage and the free log (“km, diário grátis”); its existing description retains the calculation, mileage log, CSV exports and tax-deduction purpose. The converter title uses “para” to express conversion direction within the limit. Both exact Timeline names remain, with the local name first.

Verification: 131 leaves checked; exactly six leaves changed from the review's initial snapshot; all scoped metadata lengths pass; all four guide URL values equal English. The new guides retain their original text: no semantic, register or preferred-product-term drift found. No scoped href, placeholder, bold markup, link target or plural-form discrepancy was found.

Documentation: this is a localized copy correction with no architectural, workflow or terminology-policy change; no AFFiNE update is needed. No builds, extraction, recording or Git writes were run. No services were started.

## Rails bugs fixed (changelog)

none

Validation (exit 0):

```text
npm run i18n:validate -- --locale=pt-br
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=pt-br

pt-br  0 problem(s)
```

Overall quality is strong: the Brazilian Portuguese uses the expected você register and preserves the guides’ technical claims, privacy conditions and terminology. Most shortened metadata keeps the English meaning; six clear omissions or ambiguities were corrected, with the mileage-title abbreviation documented above.
