import React, { useEffect } from "react";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { initializePaddle } from "@paddle/paddle-js";
import { COMMISSION_PERCENT } from "@site/src/data/affiliateProgram";
import PricingSection from "@site/src/components/PricingSection";
import PricingCompare from "@site/src/components/PricingCompare";
import FAQ from "@site/src/components/FAQ";

const SEO_TITLE = "Cloud Pricing & Plans";
const SEO_DESCRIPTION =
	"Compare Dawarich Cloud plans: Lite, Pro and Family for up to 5 people. Try free for 7 days, or self-host with every Pro feature at no cost.";

export default function PricingPage() {
	useEffect(() => {
		initializePaddle({
			token: "live_8593fad779b610288ad3ca40789",
		});
	}, []);

	return (
		<Layout
			title={SEO_TITLE}
			description={SEO_DESCRIPTION}
		>
			<Head>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://dawarich.app/pricing/" />
				<meta property="og:title" content={`${SEO_TITLE} | Dawarich`} />
				<meta
					property="og:description"
					content={SEO_DESCRIPTION}
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.png"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={`${SEO_TITLE} | Dawarich`} />
				<meta
					name="twitter:description"
					content={SEO_DESCRIPTION}
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
								price: "119.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: "https://dawarich.app/pricing/",
							},
							{
								"@type": "Offer",
								name: "Family (annual)",
								description:
									"One annual subscription covering up to 5 members, each with full Pro access.",
								price: "239.99",
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
				<PricingSection
					heading="Dawarich Cloud pricing"
					headingLevel="h1"
				/>
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
