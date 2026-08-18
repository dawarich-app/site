import React, { useEffect } from "react";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { initializePaddle } from "@paddle/paddle-js";
import { COMMISSION_PERCENT } from "@site/src/data/affiliateProgram";
import PricingSection from "@site/src/components/PricingSection";
import PricingCompare from "@site/src/components/PricingCompare";
import FAQ from "@site/src/components/FAQ";

export default function PricingPage() {
	useEffect(() => {
		initializePaddle({
			token: "live_8593fad779b610288ad3ca40789",
		});
	}, []);

	return (
		<Layout
			title="Pricing — Dawarich"
			description="Simple pricing for Dawarich Cloud. Lite €59.99/yr, Pro €17.99/mo, or Family €299.99/yr for up to 5 people. 7-day free trial, 14-day risk-free refund, cancel anytime. Or self-host for free."
		>
			<Head>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://dawarich.app/pricing/" />
				<meta property="og:title" content="Pricing — Dawarich" />
				<meta
					property="og:description"
					content="Lite €59.99/yr, Pro €17.99/mo, or Family €299.99/yr for up to 5 people. 7-day free trial, 14-day risk-free refund. Or self-host for free."
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.png"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Pricing — Dawarich" />
				<meta
					name="twitter:description"
					content="Lite €59.99/yr, Pro €17.99/mo, or Family €299.99/yr for up to 5 people. 7-day free trial, 14-day risk-free refund. Or self-host for free."
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
						offers: [
							{
								"@type": "Offer",
								name: "Lite (annual)",
								price: "59.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: "https://dawarich.app/pricing/",
							},
							{
								"@type": "Offer",
								name: "Pro (monthly)",
								price: "17.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: "https://dawarich.app/pricing/",
							},
							{
								"@type": "Offer",
								name: "Pro (annual)",
								price: "149.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: "https://dawarich.app/pricing/",
							},
							{
								"@type": "Offer",
								name: "Family (annual)",
								description:
									"One annual subscription covering up to 5 members, each with full Pro access.",
								price: "299.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: "https://dawarich.app/pricing/",
							},
							{
								"@type": "Offer",
								name: "Self-hosted",
								price: "0",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: "https://dawarich.app/docs/self-hosting/introduction",
							},
						],
					})}
				</script>
			</Head>

			<main>
				<PricingSection />
				<PricingCompare />
				<p className="margin-top--lg text--center">
					Writing about Dawarich?{" "}
					<Link to="/affiliate">
						Earn {COMMISSION_PERCENT}% of the first year
					</Link>{" "}
					for every subscriber you refer.
				</p>
				<FAQ />
			</main>
		</Layout>
	);
}
