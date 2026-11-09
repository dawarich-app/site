# Poster Studio troubleshooting

The standalone editor lives at `/tools/map-poster-maker/` in
`src/components/PosterStudio/`. The shared rendering modules in
`src/lib/poster-studio/` are vendored; the React preview lifecycle is site-owned.

## Selected format changes after resizing

Select **Instagram Square**, then resize the browser window or rotate a phone.
The preview frame must remain square. Repeat with **4K**; the frame must keep
its 16:9 aspect ratio. Pixel rounding can change dimensions by one pixel.

`PreviewMap` must refresh its stage `ResizeObserver` whenever the selected
layout changes. An observer installed only during map creation retains the
initial A3 layout and restores its aspect on subsequent resize notifications.
Keep map creation separate so changing layouts does not discard the camera or
recreate the WebGL context. Observe the stage rather than the frame that the
callback resizes, and disconnect observers on cleanup.

Regression checks:

```sh
npm test -- src/components/PosterStudio/PreviewMap.test.js
npm test -- src/components/PosterStudio src/pages/tools/mapPosterMaker.test.js src/lib/poster-studio
```

The regression uses the real frame geometry with simulated stage sizes. It
also checks that layout changes keep the same map and that unmount releases
both the map and the observers. Browser verification should repeat the format
selection and viewport change against a running site.

## Blank map with a content blocker

Record the browser version, blocker version, selected lists, and the blocker's
request log after reloading the affected page. An empty map with a visible
title overlay does not identify which resource or rendering stage failed.

Map tiles come from `https://tyles.dwri.xyz/planet/{z}/{x}/{y}.mvt`. Blocking
only these requests still leaves the theme background and the locally drawn
route visible. Missing tiles alone therefore do not explain a completely
white Noir poster. The optional Cloudflare analytics beacon is independent of
the editor; blocking it alone should not affect the map.

On 2026-10-27, a user reported a blank map in Firefox 158 with uBlock Origin
1.75.0 and confirmed that disabling uBlock restored the map. Separate Firefox
151 profiles with the extension and selected lists did not reproduce the
blank map. A local page also rendered in Firefox 158 with uBlock enabled.
The affected site's blocker log is still required to identify the cause;
the resize correction above is a separate fix.

The shared engineering index is maintained in AFFiNE as
**Dawarich site — Poster Studio troubleshooting**.
