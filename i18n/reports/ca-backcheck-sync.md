# ca back-translation check (post-merge strings)
Strings checked: 75 · Drift: 3 (4 %) · Fixed: 3 · Date: 2026-10-24

Scope: 64 todo keys plus 11 additional footer/trademark keys, deduplicated. All 75 Catalan-based English back-translations were recorded before opening the English source files. Method limitation: the initial todo inspection inadvertently exposed its embedded English fields, so this was not a strictly source-blind pass. Status: FAILED for the strict blind-review procedure; a source-blind rerun remains outstanding. The three translation fixes and successful validation are complete and left uncommitted in the two locale files listed by the drift rows below.

| key | old ca text | back-translation | English source | problem | new ca text |
| --- | --- | --- | --- | --- | --- |
| code:shared.cookieConsent.body | Els rastrejadors opcionals d’analítica del lloc, publicitat, correu electrònic i afiliació només s’activen si els acceptes. Si els rebutges, es mantenen desactivats i no es transfereixen dades de campanya. | Optional trackers for site analytics, advertising, email and affiliation activate only if you accept them. If you reject them, they stay disabled and campaign data are not transferred. | Optional site analytics, advertising, email and affiliate trackers run only after you accept. Rejecting keeps them off and disables campaign handoff. | Changes a specific disabled campaign-handoff feature into a broader statement that campaign data are not transferred. | Els rastrejadors opcionals d’analítica del lloc, publicitat, correu electrònic i afiliació només s’activen si els acceptes. Rebutjar-los els manté desactivats i desactiva el traspàs de campanya. |
| content:pages/family.json:meta.title | App d’ubicació familiar per a iPhone i Android | Family location app for iPhone and Android | Family Location Sharing App for iPhone and Android | Omits sharing, making the title describe a family-location app without its sharing purpose. | App per compartir ubicació en família a iPhone i Android |
| content:pages/family.json:meta.description | Convida fins a cinc persones a Dawarich (iOS i Android): control individual d’ubicació en viu, historial i peticions. {price} o allotjament propi gratis. | Invite up to five people to Dawarich (iOS and Android): individual control of live location, history and requests. {price} or free self-hosting. | Share family locations in the Dawarich iOS and Android apps. Invite up to five people; each controls live sharing, history and location requests. {price} or self-host free. | Omits explicit family location sharing and reduces location requests to unspecified requests. | Convida fins a 5 a Dawarich (iOS/Android): compartició familiar en viu, historial i peticions d’ubicació amb control individual. {price} o autoallotja gratis. |

Verification: all 6 scoped `href` values exactly match English. The corrected family meta title is 56 characters and its description is 158 characters. Placeholders, bold markup, link URLs and glossary terms remain intact. No builds, extraction, recording, staging or commits were run; no services were started. This translation alignment changes no product behavior or canonical terminology, so no AFFiNE documentation update is needed.

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=ca

ca     0 problem(s)
```

Overall quality is good: the other 72 strings preserve the source meaning, numbers, conditions and informal Catalan register. The three corrections restore explicit sharing semantics and the precise campaign-handoff claim; the source-blindness limitation above remains part of this review's evidence.
