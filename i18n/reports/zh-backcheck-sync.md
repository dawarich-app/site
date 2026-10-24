# zh back-translation check (post-merge strings)
Strings checked: 75 · Drift: 1 (1.3 %) · Fixed: 1 · Date: 2026-10-24

Scope: all 62 todo keys and all 13 `footerSection.*` / `trademark*` keys in shared config. All six scoped `href` values equal English. Placeholders, bold markup, link URLs, numbers, metadata limits, Simplified Chinese register and preferred product terms were checked.

Method limitation: the todo inventory's inline English fields were inadvertently displayed before back-translation. English back-translations of all 75 current Chinese strings were then written in the initial report before opening the canonical English files, but the 62 todo entries cannot be claimed as fully blind. The 13 extra shared-config strings were back-translated before viewing their English sources.

Status: FAILED for the strict blind-check requirement; translation review, correction and validation are complete. Remaining: a fully blind recheck of the 62 todo entries by a reviewer who has not seen their English. This session cannot undo the early exposure. No services were started; no Git write commands were run.

| key | old zh text | back-translation | English source | problem | new zh text |
| --- | --- | --- | --- | --- | --- |
| code:shared.cookieConsent.body | 可选的网站分析、广告、邮件和联盟推广追踪工具仅在您接受后才会运行。拒绝后，这些工具会保持关闭，也不会传递广告活动归因信息。 | Optional site analytics, ads, email and affiliate tracking tools run only after you accept. If you reject, these tools remain off and advertising campaign attribution information will not be passed on. | Optional site analytics, advertising, email and affiliate trackers run only after you accept. Rejecting keeps them off and disables campaign handoff. | Narrows campaign handoff to advertising attribution information. English covers marketing campaign handoff generally; the revised wording preserves that scope. | 可选的网站分析、广告、邮件和联盟推广追踪工具仅在您接受后才会运行。拒绝后，这些工具会保持关闭，也不会传递营销活动信息。 |

Validation (`npm run i18n:validate -- --locale=zh`, exit 0):

```text

> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=zh

zh     0 problem(s)
```

Overall quality is high: the other 74 strings preserve the source meaning, conditions and product terminology, with natural Simplified Chinese and polite 您 where directly addressing the reader. The sole correction restores the full scope of campaign handoff; no stylistic-only changes were made. No architecture, product behavior or translation workflow was changed, so no AFFiNE documentation update was needed.
