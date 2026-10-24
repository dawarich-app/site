import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/pages/pricing.json';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React, { useEffect } from "react";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import { initializePaddle } from "@paddle/paddle-js";
import PricingSection from "@site/src/components/PricingSection";
import PricingCompare from "@site/src/components/PricingCompare";
import FAQ from "@site/src/components/FAQ";

export default function PricingPage() {
	const pageUrl = useLocalizedUrl('/pricing/');
	useEffect(() => {
		initializePaddle({
			token: "live_8593fad779b610288ad3ca40789",
		});
	}, []);

	return (
		<Layout
			title={content.meta.title}
			description={interpolate(content.meta.description, { price: "€59.99", price2: "€17.99", price3: "€299.99" })}
		>
			<Head>
				<meta property="og:type" content="website" />
				<meta property="og:url" content={pageUrl} />
				<meta property="og:title" content={content.meta.title} />
				<meta
					property="og:description"
					content={interpolate(content.meta.socialDescription, { price: "€59.99", price2: "€17.99", price3: "€299.99" })}
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.png"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content={pageUrl} />
				<meta name="twitter:title" content={content.meta.title} />
				<meta
					name="twitter:description"
					content={interpolate(content.meta.socialDescription, { price: "€59.99", price2: "€17.99", price3: "€299.99" })}
				/>
				<meta
					name="twitter:image"
					content="https://dawarich.app/img/meta-image.png"
				/>

				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Product",
						name: content.schema.name,
						description:
							content.schema.description,
						brand: { "@type": "Brand", name: content.schema.brand },
						offers: [
							{
								"@type": "Offer",
								name: content.schema.liteAnnual,
								price: "59.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: pageUrl,
							},
							{
								"@type": "Offer",
								name: content.schema.proMonthly,
								price: "17.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: pageUrl,
							},
							{
								"@type": "Offer",
								name: content.schema.proAnnual,
								price: "149.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: pageUrl,
							},
							{
								"@type": "Offer",
								name: content.schema.familyAnnual,
								description:
									content.schema.familyDescription,
								price: "299.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: pageUrl,
							},
							{
								"@type": "Offer",
								name: content.schema.selfHosted,
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
				<FAQ />
			</main>
		</Layout>
	);
}
