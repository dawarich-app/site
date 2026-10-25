# fr back-translation check (post-merge strings)
Strings checked: 75 · Drift: 4 (5.33 %) · Fixed: 4 · Date: 2026-10-24

| key | old fr text | back-translation | English source | problem | new fr text |
| --- | --- | --- | --- | --- | --- |
| content:pages/family.json:meta.title | Partage de position en famille sur iPhone et Android | Family location sharing on iPhone and Android | Family Location Sharing App for iPhone and Android | The title omits the source's app concept. | Appli de partage de position en famille, iPhone et Android |
| content:pages/family.json:meta.description | Sur Dawarich iOS et Android, jusqu’à 5 personnes gèrent leur partage en direct, leur historique et les demandes. {price} ou auto-hébergement gratuit. | On Dawarich iOS and Android, up to 5 people manage their live sharing, their history and requests. {price} or free self-hosting. | Share family locations in the Dawarich iOS and Android apps. Invite up to five people; each controls live sharing, history and location requests. {price} or self-host free. | Drops the family context and invitation, and leaves the location-request type unspecified. | Applis Dawarich iOS/Android : invitez jusqu’à 5 proches. Chacun gère partage en direct, historique, demandes de position. {price} ou auto-hébergement gratuit. |
| content:pages/family.json:meta.ogDescription | Cinq personnes, cinq réglages indépendants. Partage en direct avec minuteur, historique au choix et demandes de localisation à accepter. | Five people, five independent settings. Live sharing with a timer, optional history, and location requests to accept. | Five people, five independent switches. Live sharing on a timer, history as a separate choice, and location requests that have to be accepted. | Optional history does not explicitly preserve the separate choice from live sharing. | Cinq personnes, cinq réglages indépendants. Partage en direct avec minuteur, historique à choisir séparément et demandes de localisation à accepter. |
| content:pages/google-timeline-alternative.json:meta.description | Importez Google Timeline dans Dawarich : carte web, historique et suivi de vos déplacements sur iOS et Android. Essai Cloud de 7 jours. | Import Google Timeline into Dawarich: web map, history and tracking your journeys on iOS and Android. 7-day Cloud trial. | Import your Google Timeline into Dawarich, explore your history on a web map, and track new journeys with iOS and Android apps. 7-day Cloud trial. | The compressed list no longer says that history is explored on the web map, that tracked journeys are new, or that tracking uses apps. | Importez Google Timeline dans Dawarich, explorez l’historique sur carte web et suivez de nouveaux trajets via les applis iOS et Android. Essai Cloud de 7 jours. |

Scope: 63 unique keys from `i18n/todo/fr.json`, plus 12 additional `footerSection.*`/`trademark*` strings in `src/i18n/content/fr/shared/config.json`. The Alternatives footer key occurs in both scope definitions and is counted once. All 75 original French strings received written English back-translations in the execution record before the canonical English files were opened. Comparisons used `i18n/.source/en/` for tier 1 and `src/i18n/content/en/` for tier 2.

Status: FAILED for the strict blind-audit requirement; the content corrections and validation are complete. The initial read of `i18n/todo/fr.json` also displayed its embedded English field for the 63 todo entries before their back-translations were written. Those entries therefore did not receive a strictly blind check. The 12 additional footer/trademark entries were back-translated before their English source was read. A fresh reviewer is needed to complete strictly blind verification of all 75 entries.

Additional constraint correction, excluded from the semantic-drift count: `content:pages/location-sharing.json:meta.ogDescription` was shortened from 234 to 156 characters to meet the requested description limit. Its original back-translation was “Send a link for a single piece of content: date range, live position, track, journey, month of statistics or annual summary. Each link expires or can be revoked, and most can be protected by a passphrase.”; its English source was “Send one link that shows one thing: a date range, live location, a track, a trip, a month of stats or a yearly digest. Every link expires or can be revoked, and most can be locked with a passphrase.”. The new French text is “Un lien : période, position en direct, trajet, déplacement, stats mensuelles ou bilan annuel. Expire ou révocable ; phrase secrète possible pour la plupart.”. It retains all six content choices, expiry or revocation, and the ability to protect most links with a passphrase.

The corrected title is 58 characters. Corrected family descriptions are 158 and 148 characters; the Google Timeline description is 160 characters. All six scoped href values equal English. Placeholders, Markdown link URLs and bold markup are preserved; no scoped plural message requires an additional form. Formal vous, protected product names and preferred glossary terminology were checked. Stylistic differences that preserve meaning were left unchanged.

Only three French content files and this report were written. No staging, commit, build, extraction, source-hash recording or service start was performed. AFFiNE context was consulted; synchronization was deferred because this brief restricts writes to the French locale files and this report. No architecture or behavior was changed.

Validation command: `npm run i18n:validate -- --locale=fr` (exit 0).

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=fr

fr     0 problem(s)
```

Overall, the French copy preserves the source's consent controls, subscription conditions, quantities and privacy qualifications well. The meaning corrections restore metadata details and the separate history-sharing choice; the register and glossary are consistent. The source-exposure limitation above prevents treating this as a fully blind audit.

