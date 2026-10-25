# pl back-translation check (post-merge strings)
Strings checked: 75 · Drift: 4 (5.3 %) · Fixed: 4 · Date: 2026-10-24

Scope: all 62 keys in `i18n/todo/pl.json`, plus the 13 `footerSection.*` / `trademark*` strings in Polish `shared/config.json`. Count includes six href strings, all identical to their English counterparts. All 75 English back-translations were written before opening the canonical English source files. Comparison used the same keys in `i18n/.source/en/` and `src/i18n/content/en/`, with the Polish register and preferred terms from `i18n/glossary.json`.

Method limitation: the initial read of `i18n/todo/pl.json` inadvertently displayed its embedded `english` fields before the back-translations were written. The back-translations were then composed from a separate Polish-only view, but this was not a fully blind audit. Strict compliance with the source-unseen requirement remains unfulfilled and requires an independent blind review; the findings and fixes below remain valid.

| key | old pl text | back-translation | English source | problem | new pl text |
| --- | --- | --- | --- | --- | --- |
| content:pages/family.json:meta.title | Lokalizacja rodziny — aplikacja na iPhone i Android | Family location — an app for iPhone and Android | Family Location Sharing App for iPhone and Android | Meaning: the title omitted sharing and described only family location. Restore sharing and retain the app and both platforms (60 characters). | Udostępnianie lokalizacji rodzinie: apka na iPhone i Android |
| content:pages/family.json:meta.description | Dawarich na iOS i Android: rodzina do 5 osób. Każdy kontroluje udostępnianie na żywo, historię i prośby o lokalizację. {price} lub własny serwer gratis. | Dawarich on iOS and Android: a family of up to 5 people. Each person controls live sharing, history and location requests. {price} or your own server free. | Share family locations in the Dawarich iOS and Android apps. Invite up to five people; each controls live sharing, history and location requests. {price} or self-host free. | Meaning: omitted the invitation and explicit family location sharing; restore the invitation and sharing while retaining every control, platform, price placeholder and free self-hosting (156 characters). | Dawarich iOS/Android: zaproś do 5 osób z rodziny. Każdy kontroluje udostępnianie na żywo, historię i prośby o lokalizację. {price} lub własny serwer gratis. |
| content:pages/family.json:meta.ogDescription | Pięć osób, pięć niezależnych przełączników. Udostępnianie lokalizacji na żywo na określony czas, historia jako osobny wybór i prośby o lokalizację wymagające akceptacji. | Five people, five independent switches. Live location sharing for a set time, history as a separate choice and location requests requiring acceptance. | Five people, five independent switches. Live sharing on a timer, history as a separate choice, and location requests that have to be accepted. | Length: 169 characters exceeded the brief's 160-character description limit. Condense to 155 without changing the sharing conditions. | Pięć osób, pięć niezależnych przełączników. Udostępnianie na żywo z limitem czasu, historia jako osobny wybór i prośby o lokalizację wymagające akceptacji. |
| content:pages/location-sharing.json:meta.ogDescription | Wyślij jeden link do jednej rzeczy: zakresu dat, lokalizacji na żywo, trasy, podróży, miesiąca statystyk lub rocznego podsumowania. Każdy link wygasa lub można go unieważnić, a większość można zabezpieczyć frazą. | Send one link for one thing: a date range, live location, a track, a trip, a month of statistics or an annual summary. Every link expires or can be revoked, and most can be secured with a phrase. | Send one link that shows one thing: a date range, live location, a track, a trip, a month of stats or a yearly digest. Every link expires or can be revoked, and most can be locked with a passphrase. | Length and precision: 212 characters exceeded the brief's 160-character description limit; generic “fraza” did not clearly name a passphrase. Preserve all six types, expiry/revocation and optional protection for most links in 160 characters. | Jeden link: zakres dat, pozycja na żywo, trasa, podróż, statystyki miesiąca, podsumowanie roku. Wygasa lub da się cofnąć; większość można chronić frazą hasłową. |

Two findings concern omitted meaning; two concern the brief's 160-character description limit, including social descriptions (the validator does not enforce `meta.ogDescription`). No glossary or address-register drift was found; lowercase reflexive `swój/swoje` is appropriate Polish and does not conflict with capitalized direct-address `Ty/Twój`. The localized Insights label `Podsumowanie` matches the glossary.

Final manual checks: title 60 characters; family description 156; family social description 155; location-sharing social description 160. Price placeholders, bold spans, link URLs and plural-form counts remain unchanged. Only the four scoped values in the two Polish page files were edited. No Git writes, builds, extraction, recording, services or sub-agents were used.

AFFiNE's existing feature-landing content contract was consulted. These copy corrections establish no new architecture, behavior, terminology or workflow, so no knowledge-base change was needed.

`npm run i18n:validate -- --locale=pl` exited 0:

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=pl

pl     0 problem(s)
```

Overall, the Polish strings preserve the sharing defaults, individual control, expiry, subscription fallback, pricing and links accurately, with natural informal address and consistent product terms. The fixes restore the missing sharing/invitation information and keep metadata within the brief's limits. The remaining material limitation is the source exposure described above.

