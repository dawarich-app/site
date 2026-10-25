# ca back-translation check (SEO text pass: titles, descriptions, KML/KMZ and photo guides)
Strings checked: 133 · Drift: 0 (0 %) · Fixed: 0 · Date: 2026-10-25

| key | old ca text | back-translation | English source | problem | new ca text |
| --- | --- | --- | --- | --- | --- |

Scope: 64 changed string leaves from `git -C /Users/frey/projects/dawarich/site/.worktrees/seo-text-pass diff HEAD -- src/i18n/content/ca`, plus all 48 leaves in the new `tool-guides/kml-to-kmz.json` and all 21 leaves in the new `tool-guides/photo-geotagging.json`. The two new guides are present on disk but absent from that diff, so they were included explicitly as requested. Counts include guide names, preservation indicators and URLs.

English back-translations were drafted from the Catalan before opening the corresponding English files. Each leaf was then compared with the same key in `src/i18n/content/en/`. No tier 1 strings were in scope. The review checked meaning, claims, numbers, conditions, informal “tu” register and glossary terminology. All four guide URLs exactly match English. The scoped strings preserve their placeholders and markup; every scoped meta title is at most 49 characters and every scoped meta description at most 155. No translation changes were needed.

Validation: `npm run i18n:validate -- --locale=ca` (exit 0)

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=ca

ca     0 problem(s)
```

Overall quality is consistent and natural for Catalan. The shorter metadata preserves the English meaning, the local Google Timeline name remains in place, and both new guides retain the source’s technical details and limitations. No architecture, terminology policy or workflow changed, so no shared AFFiNE documentation update was needed.
