# es back-translation check (post-merge strings)
Strings checked: 75 · Drift: 2 (2.7 %) · Fixed: 2 · Date: 2026-10-24

Scope: 63 unique todo keys plus 12 additional footer/trademark keys; `footerSection.Legal` appears in both scope lists and is counted once. All six scoped `href` values equal English.

Method: English back-translations of all 75 Spanish strings were written before opening the English source files, then compared against the same keys in `i18n/.source/en/` and `src/i18n/content/en/`. Blinding limitation: the initial scope read displayed the todo manifest's embedded English, so this check was not fully blind.

| key | old es text | back-translation | English source | problem | new es text |
| --- | --- | --- | --- | --- | --- |
| content:pages/family.json:meta.title | App de ubicación familiar para iPhone y Android | Family location app for iPhone and Android | Family Location Sharing App for iPhone and Android | The title drops “sharing”, turning a sharing-app claim into a generic family-location app claim. | App para compartir ubicación familiar en iPhone y Android |
| content:pages/family.json:meta.description | Ubicación familiar en Dawarich para iOS y Android. Invita hasta cinco personas: controlan ubicación en vivo, historial y solicitudes. {price} o alójalo gratis. | Family location in Dawarich for iOS and Android. Invite up to five people: they control live location, history and requests. {price} or host it free. | Share family locations in the Dawarich iOS and Android apps. Invite up to five people; each controls live sharing, history and location requests. {price} or self-host free. | Drops the sharing action and replaces each person's individual control with a collective plural. Restore sharing and “cada uno”; keep the self-host alternative explicit. | Comparte en familia con Dawarich iOS/Android. Invita hasta cinco: cada uno controla ubicación en vivo, historial y solicitudes. {price} o alójalo tú gratis. |

Only the two scoped metadata values were changed during this check. Their final lengths are 57 characters (title) and 156 characters (description). `{price}` is preserved. Existing locale edits were retained; no staging, commits, builds, extraction or recording commands were run. No services were started or left running.

Validation: `npm run i18n:validate -- --locale=es` (exit 0).

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=es

es     0 problem(s)
```

Overall quality is strong: the remaining strings retain the source claims, subscription and sharing conditions, informal tú register, preferred product terminology, placeholders, bold markup and URLs. The two metadata fixes restore the sharing purpose and each person's control without exceeding the metadata limits.
