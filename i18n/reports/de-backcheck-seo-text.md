# de back-translation check (SEO text pass: titles, descriptions, KML/KMZ and photo guides)
Strings checked: 133 · Drift: 1 (0.75 %) · Fixed: 1 · Date: 2026-10-25

Scope: 64 changed string leaves from `git diff HEAD -- src/i18n/content/de`, plus all 48 leaves in the new KML/KMZ guide and all 21 leaves in the new photo-location guide, including four URL leaves. The two new guide files are present in the worktree but absent from the diff output. Tier 1: no strings in scope. Independent English back-translations of all 133 leaves were written before reading their corresponding English sources.

| key | old de text | back-translation | English source | problem | new de text |
| --- | --- | --- | --- | --- | --- |
| tools/timeline-statistics.json:meta.title | Google Timeline/Google Maps Zeitachse: Statistik | Google Timeline/Google Maps Timeline: statistics | Google Timeline Statistics Analyzer | Glossary deviation: Statistics uses the singular Statistik instead of preferred Statistiken. Compound hyphenation retains both Google names within the stricter 49-character title limit. | Google Timeline/Google-Maps-Zeitachse-Statistiken |

Verification: all checked titles are at most 49 characters; all checked descriptions are at most 155 (maximum observed: 154). Placeholders, bold markers and Markdown link targets match English; all four guide URL values match exactly. Informal du/dein and other preferred product terms are consistent. No source claims, numbers or conditions were independently fact-checked or rewritten. No build, extraction, recording, staging, commit or service was started. AFFiNE was consulted; no shared documentation update is needed because this restores an existing glossary term and establishes no new behavior or terminology.

```text
$ npm run i18n:validate -- --locale=de

> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=de

de     0 problem(s)
```

Overall quality is strong: the shortened metadata and both new guides preserve the English meaning, claims, numerical details and conditions. Natural German phrasing and concise conversion titles were treated as stylistic differences. The single glossary deviation is fixed; no drift remains in the checked scope.
