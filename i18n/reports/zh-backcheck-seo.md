# zh back-translation check (SEO search-term pass and testimonials)
Strings checked: 63 · Drift: 2 (3.17 %) · Fixed: 2 · Date: 2026-10-25

Scope: every changed string leaf identified by `git -C /Users/frey/projects/dawarich/site/.worktrees/site-i18n-sync diff HEAD -- src/i18n/content/zh`: 63 leaves in 18 tier-2 JSON files. This includes all nine testimonial quotes, their nine attributions, the translation note, SEO copy, and annual-price labels. No tier-1 strings are in this scope.

Independent English back-translations of all 63 original Chinese strings were written before reading the corresponding English sources. Each was then compared with the same path/key under `src/i18n/content/en/` and the glossary. Only drift items appear below; stylistic differences with equivalent meaning were retained.

| key | old zh text | back-translation | English source | problem | new zh text |
| --- | --- | --- | --- | --- | --- |
| `components/Testimonials.json → quotes[5].quote` | 我搬到了哈萨克斯坦，对所在的城市一无所知。Google Timeline 已经用不了了，反正我也不信任它。设置好 Dawarich 后，现在对我来说，地图就像有战争迷雾一样——我出门越多，它就越完整。而且每次行程都留在我这里——我可以随时回顾其中任何一次，还能分享路线。 | I moved to Kazakhstan and knew nothing about the city I was in. Google Timeline no longer worked, and I didn't trust it anyway. After setting up Dawarich, the map now feels like it has fog of war—the more I go out, the more complete it becomes. And every trip stays with me—I can revisit any of them at any time and share the route. | I moved to Kazakhstan not knowing the city at all. Google Timeline wasn't an option anymore, and I didn't trust it either way. Set up Dawarich, and now the map is like fog of war for me — the more I go out, the more it fills in. Plus every trip stays with me — I can look back at any of them and share the route. | “已经用不了了” implies that Google Timeline stopped working or became unusable. The English only says it was no longer an option; do not add a technical failure claim. | 我搬到了哈萨克斯坦，对所在的城市一无所知。Google Timeline 已经不再是可行的选择，而且我本来也不信任它。设置好 Dawarich 后，现在对我来说，地图就像有战争迷雾一样——我出门越多，它就越完整。而且每次行程都留在我这里——我可以随时回顾其中任何一次，还能分享路线。 |
| `pages/google-timeline-alternative.json → meta.description` | 将您的 Google Timeline（谷歌地图时间轴）导入 Dawarich，在网页地图上探索历史记录，并通过 iOS 和 Android 应用记录新的行程。Cloud 可免费试用 7 天。 | Import your Google Timeline (Google Maps Timeline) into Dawarich, explore your history on a web map, and record new trips through iOS and Android apps. Cloud offers a free 7-day trial. | Import your Google Timeline into Dawarich, explore your history on a web map, and track new journeys with iOS and Android apps. 7-day Cloud trial. | Adds “free” to the source's “7-day Cloud trial”; the matching English string does not make that claim. | 将您的 Google Timeline（谷歌地图时间轴）导入 Dawarich，在网页地图上探索历史记录，并通过 iOS 和 Android 应用记录新的行程。Cloud 可试用 7 天。 |

Verification: all 39 scoped strings containing “谷歌地图时间轴” use it exactly once, naturally next to “Google Timeline”. Simplified Chinese and polite “您” match the required register; preferred product terms remain consistent. All scoped placeholders, numeric literals, Markdown link URLs and bold markers match English. There are no changed href leaves or plural-form messages in scope. Meta titles meet the 60-character limit or the English-length exception; descriptions are at most 160 characters. The testimonial figures remain exactly 60-70%, 260k km, 16 countries, 378 cities and mid-2025. Only the two drift leaves above were edited.

No architecture, workflow or terminology policy changed, so no AFFiNE documentation update was needed. The repository report records this narrow translation correction. No builds, extraction, hash recording, Git writes or services were run.

Validation command: `npm run i18n:validate -- --locale=zh` (exit 0).

```text
> dawarich-app@1.0.0 i18n:validate
> node scripts/i18n-validate.mjs --locale=zh

zh     0 problem(s)
```

Overall quality is good: the SEO additions read naturally, the testimonial translations preserve their claims and exact figures, and the register and glossary are consistent. The two fixes remove an unsupported technical-failure implication and an added free-trial claim; the remaining differences are stylistic.

