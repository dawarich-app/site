# fr back-translation check (SEO text pass: titles, descriptions, KML/KMZ and photo guides)
Strings checked: 132 · Drift: 6 (4.5 %) · Fixed: 6 · Date: 2026-10-25

| key | old fr text | back-translation | English source | problem | new fr text |
| --- | --- | --- | --- | --- | --- |
| pages/cloud.json:meta.description | Historique des positions privé hébergé en Allemagne : cartes de chaleur, déplacements, stats. Sans vente de données. Import Google Takeout… Dès {price}/an. | Private location history hosted in Germany: heatmaps, trips, stats. No sale of data. Google Takeout import… From {price}/year. | Privacy-first location history hosted in Germany: heatmaps, trips and statistics, no data selling. Import Google Takeout and more. From {price}/year. | The ellipsis leaves support for other imports implicit; « stats » departs from the preferred « Statistiques ». Made both explicit. | Historique privé hébergé en Allemagne : cartes de chaleur, déplacements, statistiques. Sans vente de données. Importez Google Takeout, etc. Dès {price}/an. |
| pages/family.json:meta.title | Partage de position — famille, iPhone et Android | Location sharing — family, iPhone and Android | Family Location Sharing App for iPhone & Android | The title omits that this is an app. Restored « Appli ». | Appli de partage familial pour iPhone et Android |
| pages/poster-studio.json:meta.title | Affiches cartographiques : parcours GPS au mur | Map posters: GPS routes on the wall | Map Poster Studio — GPS Routes as Wall Posters | The title describes posters but omits the studio for creating them. Restored « Atelier ». | Atelier d’affiches : parcours GPS au mur |
| tools/map-poster-maker.json:meta.title | Affiches de parcours à partir de fichiers GPS | Route posters from GPS files | Map Poster Maker — Route Posters From GPS Files | The title describes route posters but omits the maker function. Restored « Créateur ». | Créateur d’affiches de parcours GPS |
| tools/timeline-statistics.json:meta.title | Stats Google Timeline (Vos trajets Google Maps) | Google Timeline stats (Your Google Maps trips) | Google Timeline Statistics Analyzer | The title omits the analysing function and abbreviates the preferred « Statistiques » to « Stats ». Restored the function with « Analyse »; see length constraint below. | Analyse Google Timeline/Vos trajets Google Maps |
| tools/timeline-visualizer.json:meta.title | Google Timeline/Vos trajets Google Maps en ligne | Google Timeline/Your Google Maps trips online | Google Timeline Visualizer — View It on the Web | The title says only that Google Timeline is online and loses the tool’s viewing function. Restored « vue web ». | Google Timeline/Vos trajets Google Maps : vue web |

Scope: 63 changed string leaves identified with `git diff HEAD -- src/i18n/content/fr`, plus all 48 leaves of the new KML/KMZ guide and all 21 leaves of the new photo-location guide, which did not appear in that diff. These 132 leaves include four URL values. Each English back-translation was written from the French before the corresponding English source was read; comparison used the same path and key under `src/i18n/content/en/`. The two guides have no meaning drift, and all four URLs match English exactly. The formal « vous » register, placeholders, source numbers and conditions are preserved.

Length constraint: `Statistiques Google Timeline/Vos trajets Google Maps` alone requires 52 characters, before adding an explicit analyser label. The revised 47-character `Analyse Google Timeline/Vos trajets Google Maps` retains the English tool’s analysing purpose and both Google names within the binding 49-character title limit. This is a necessary compact rendering of “Statistics Analyzer”; no numeric claim or tool capability changes. All 37 scoped meta titles are at most 49 characters, and all 23 scoped meta descriptions are at most 155 characters.

Only six French string leaves were edited. No builds, extraction, recording, staging or commits were performed. No services were started. No architecture, workflow or product-behavior decisions changed, so no AFFiNE documentation update was needed.

Validation command: `npm run i18n:validate -- --locale=fr`

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=fr

fr     0 problem(s)
```

Overall quality is high: the guides preserve the English meaning, including technical details, limitations and privacy conditions. The six corrections restore information lost in compressed metadata and improve terminology while keeping the stricter SEO length limits and existing local Google Timeline names.

