import React, { useEffect } from "react";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import { initializePaddle } from "@paddle/paddle-js";
import PricingSection from "@site/src/components/PricingSection";
import FAQ from "@site/src/components/FAQ";
import { pricingOffers } from "@site/src/data/pricingOffers";

export default function PricingPage() {
	useEffect(() => {
		initializePaddle({
			token: "live_8593fad779b610288ad3ca40789",
		});
	}, []);

	return (
		<Layout
			title="Pricing — Dawarich"
			description="Simple pricing for Dawarich Cloud. Lite €49.99/yr, Pro €17.99/mo, or Family for up to 5 members. 7-day free trial, 14-day risk-free refund, cancel anytime. Or self-host for free."
		>
			<Head>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://dawarich.app/pricing/" />
				<meta property="og:title" content="Pricing — Dawarich" />
				<meta
					property="og:description"
					content="Lite €49.99/yr, Pro €17.99/mo, or Family for up to 5 members. 7-day free trial, 14-day risk-free refund. Or self-host for free."
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.png"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Pricing — Dawarich" />
				<meta
					name="twitter:description"
					content="Lite €49.99/yr, Pro €17.99/mo, or Family for up to 5 members. 7-day free trial, 14-day risk-free refund. Or self-host for free."
				/>
				<meta
					name="twitter:image"
					content="https://dawarich.app/img/meta-image.png"
				/>
				<link rel="canonical" href="https://dawarich.app/pricing/" />

				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Product",
						name: "Dawarich Cloud",
						description:
							"Privacy-first alternative to Google Timeline. Hosted in Europe. Self-hostable, open source.",
						brand: { "@type": "Brand", name: "Dawarich" },
						offers: pricingOffers,
					})}
				</script>
			</Head>

			<main>
				<PricingSection />
				<FAQ />
			</main>
		</Layout>
	);
}
