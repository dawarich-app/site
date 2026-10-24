import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/pages/pricing.json';
import RichText from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from "react";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import { COMMISSION_PERCENT } from "@site/src/data/affiliateProgram";
import PricingSection from "@site/src/components/PricingSection";
import PricingCompare from "@site/src/components/PricingCompare";
import FAQ from "@site/src/components/FAQ";


export default function PricingPage() {
	const pageUrl = useLocalizedUrl('/pricing/');
	return (
		<Layout
			title={content.meta.title}
			description={content.meta.description}
		>
			<Head>
				<meta property="og:type" content="website" />
				<meta property="og:url" content={pageUrl} />
				<meta property="og:title" content={`${content.meta.title} | Dawarich`} />
				<meta
					property="og:description"
					content={content.meta.description}
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.png"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content={pageUrl} />
				<meta name="twitter:title" content={`${content.meta.title} | Dawarich`} />
				<meta
					name="twitter:description"
					content={content.meta.description}
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
								price: "119.99",
								priceCurrency: "EUR",
								availability: "https://schema.org/InStock",
								url: pageUrl,
							},
							{
								"@type": "Offer",
								name: content.schema.familyAnnual,
								description:
									content.schema.familyDescription,
								price: "239.99",
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
				<PricingSection
					heading={content.heading}
					headingLevel="h1"
				/>
				<PricingCompare />
				<p className="margin-top--lg text--center">
					<RichText text={interpolate(content.affiliate, { percent: COMMISSION_PERCENT })} />
				</p>
				<FAQ />
			</main>
		</Layout>
	);
}
