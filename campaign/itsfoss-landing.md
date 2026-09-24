# It's FOSS campaign landing page

Last updated: 2026-09-24

The paid It's FOSS newsletter placement points to `https://dawarich.app/itsfoss/`. The page lives in `src/pages/itsfoss/` and follows the Techlore partner landing pattern. It emphasizes the AGPL-3.0 source, free self-hosting, exportable data, and the managed Cloud option.

The page advertises `ITSFOSS` as 10% off the first year of Lite or Pro annual. Its Cloud registration links include `promo=ITSFOSS`, `utm_source=itsfoss`, `utm_medium=newsletter`, and `utm_campaign=itsfoss_2026`. The Lite card also carries `plan=lite`; the Family card carries campaign attribution but no promo code. Partner-specific links are passed to `PricingSection` through its optional `plans` prop so the default pricing page keeps its existing links.

The site only passes and displays the code. Before distributing the newsletter URL, verify that the matching 10% discount is active in the Cloud checkout/Paddle configuration and test redemption on Lite and Pro annual. Also confirm that the signup flow retains the `promo` parameter through checkout. Do not advertise the URL until this is verified.

To verify the page locally, run `npm run build` and inspect `build/itsfoss/index.html`, then serve the build and check desktop and mobile layout plus the signup links. The page uses `noindex,nofollow`, matching the Techlore campaign page.
