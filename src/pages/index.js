import content from '@locale-content/pages/index.json';
import { interpolate } from '@docusaurus/Interpolate';
import RichText from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { initializePaddle } from "@paddle/paddle-js";
import Comparison from "@site/src/components/Comparison";
import CTABanner from "@site/src/components/CTABanner";
import FAQ from "@site/src/components/FAQ";
import Features from "@site/src/components/Features";
import FinalCTA from "@site/src/components/FinalCTA";
import Hero from "@site/src/components/Hero";
import HowItWorks from "@site/src/components/HowItWorks";
import PricingSection from "@site/src/components/PricingSection";
import PrivacySection from "@site/src/components/PrivacySection";
import SocialProof from "@site/src/components/SocialProof";
import Testimonials from "@site/src/components/Testimonials";
import Layout from "@theme/Layout";
import React, { useEffect } from "react";

const MapPinSvg = () => (
	<svg
		width="28"
		height="28"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);

const MapSvg = () => (
	<svg
		width="28"
		height="28"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
		<line x1="8" y1="2" x2="8" y2="18" />
		<line x1="16" y1="6" x2="16" y2="22" />
	</svg>
);

const LightbulbSvg = () => (
	<svg
		width="28"
		height="28"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M9 18h6" />
		<path d="M10 22h4" />
		<path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
	</svg>
);

const howItWorksSteps = [
	{
		icon: <MapPinSvg />,
		title: content.howItWorksSteps[0].title,
		description: <RichText text={interpolate(content.howItWorksTrack, { iosUrl: "https://apps.apple.com/app/apple-store/id6739544999?pt=128010810&ct=landing-howit&mt=8", androidUrl: "https://play.google.com/store/apps/details?id=app.dawarich.Dawarich" })} />,
	},
	{
		icon: <MapSvg />,
		title: content.howItWorksSteps[1].title,
		description:
			content.howItWorksSteps[1].description,
	},
	{
		icon: <LightbulbSvg />,
		title: content.howItWorksSteps[2].title,
		description:
			content.howItWorksSteps[2].description,
	},
];

function HomepageHeader() {
	return <Hero />;
}

export default function Home() {
	const { i18n } = useDocusaurusContext();
	const pageUrl = useLocalizedUrl('/');

	useEffect(() => {
		initializePaddle({
			token: "live_8593fad779b610288ad3ca40789",
		});
	}, []);

	return (
		<Layout
			title={content.meta.title}
			description={content.meta.description}
		>
			<Head>
				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content={pageUrl} />
				<meta property="og:title" content={content.meta.title} />
				<meta
					property="og:description"
					content={content.meta.socialDescription}
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.png"
				/>

				{/* X (Twitter) */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content={pageUrl} />
				<meta
					name="twitter:title"
					content={content.meta.title}
				/>
				<meta
					name="twitter:description"
					content={content.meta.socialDescription}
				/>
				<meta
					name="twitter:image"
					content="https://dawarich.app/img/meta-image.png"
				/>

				{/* JSON-LD: Organization + WebSite + SoftwareApplication */}
				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@graph": [
							{
								"@type": "Organization",
								"@id": `${pageUrl}#organization`,
								name: content.schema.name,
								url: pageUrl,
								logo: "https://dawarich.app/img/logo.svg",
								founder: {
									"@type": "Person",
									name: "Evgenii Burmakin",
									url: "https://github.com/Freika",
									sameAs: ["https://github.com/Freika"],
								},
								sameAs: [
									"https://github.com/Freika/dawarich",
									"https://x.com/freymakesstuff",
									"https://mastodon.social/@dawarich",
									"https://reddit.com/r/dawarich",
									"https://discord.gg/pHsBjpt5J8",
								],
							},
							{
								"@type": "WebSite",
								"@id": `${pageUrl}#website`,
								url: pageUrl,
								name: content.schema.name,
								publisher: { "@id": `${pageUrl}#organization` },
								inLanguage: i18n.localeConfigs[i18n.currentLocale].htmlLang,
							},
							{
								"@type": "SoftwareApplication",
								"@id": `${pageUrl}#app`,
								name: content.schema.name,
								url: pageUrl,
								applicationCategory: "LifestyleApplication",
								operatingSystem: "Web, iOS, Android, Self-hosted (Docker)",
								description:
									content.schema.description,
								offers: [
									{
										"@type": "Offer",
										name: content.schema.liteAnnual,
										price: "59.99",
										priceCurrency: "EUR",
										url: `${pageUrl}#pricing`,
									},
									{
										"@type": "Offer",
										name: content.schema.proMonthly,
										price: "17.99",
										priceCurrency: "EUR",
										url: `${pageUrl}#pricing`,
									},
									{
										"@type": "Offer",
										name: content.schema.proAnnual,
										price: "149.99",
										priceCurrency: "EUR",
										url: `${pageUrl}#pricing`,
									},
									{
										"@type": "Offer",
										name: content.schema.selfHosted,
										price: "0",
										priceCurrency: "EUR",
										url: "https://dawarich.app/docs/self-hosting/introduction",
									},
								],
							},
						],
					})}
				</script>
			</Head>
			<HomepageHeader />
			<main>
				<SocialProof />
				<Comparison />
				<HowItWorks
					title={content.howItWorksTitle}
					subtitle={content.subtitle}
					steps={howItWorksSteps}
					variant="route"
				/>
				<Features />
				<CTABanner />
				<PrivacySection />
				<Testimonials />
				<PricingSection />
				<FAQ />
				<FinalCTA />
			</main>
		</Layout>
	);
}
