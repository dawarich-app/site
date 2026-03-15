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
		title: "Track",
		description: (
			<>
				Import your Google Timeline data in minutes — or start fresh with our{" "}
				<a
					href="https://apps.apple.com/app/apple-store/id6739544999?pt=128010810&ct=landing-howit&mt=8"
					target="_blank"
					rel="noopener noreferrer"
				>
					iOS
				</a>{" "}
				and{" "}
				<a
					href="https://play.google.com/store/apps/details?id=com.zeitflow.dawarich"
					target="_blank"
					rel="noopener noreferrer"
				>
					Android
				</a>{" "}
				apps. Also works with OwnTracks, GPSLogger, and more.
			</>
		),
	},
	{
		icon: <MapSvg />,
		title: "Visualize",
		description:
			"See everywhere you've been on an interactive map. Create trips, explore a scratch map, and browse daily timelines.",
	},
	{
		icon: <LightbulbSvg />,
		title: "Remember",
		description:
			"Get stats on distance, cities, and time. Relive your travels with photos, notes, and memories attached to each place. Get insights on your travel habits and patterns.",
	},
];

function HomepageHeader() {
	return <Hero />;
}

export default function Home() {
	const { siteConfig } = useDocusaurusContext();

	useEffect(() => {
		initializePaddle({
			token: "live_8593fad779b610288ad3ca40789",
		});

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
					}
				});
			},
			{ threshold: 0.1 },
		);

		document.querySelectorAll(".animateOnScroll").forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	}, []);

	return (
		<Layout
			title="Dawarich — Your Timeline, Forever"
			description="The private alternative to Google Timeline. Import your location history, keep it forever. No ads, no data selling."
		>
			<Head>
				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://dawarich.app/" />
				<meta property="og:title" content="Dawarich — Your Timeline, Forever" />
				<meta
					property="og:description"
					content="The private alternative to Google Timeline. Import your location history, keep it forever."
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.jpg"
				/>

				{/* X (Twitter) */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content="https://dawarich.app/" />
				<meta
					name="twitter:title"
					content="Dawarich — Your Timeline, Forever"
				/>
				<meta
					name="twitter:description"
					content="The private alternative to Google Timeline. Import your location history, keep it forever."
				/>
				<meta
					name="twitter:image"
					content="https://dawarich.app/img/meta-image.jpg"
				/>
			</Head>
			<HomepageHeader />
			<main>
				{[
					<SocialProof key="social" />,
					<Comparison key="comparison" />,
					<HowItWorks
						key="how"
						title="How It Works"
						subtitle="Get started in three simple steps."
						steps={howItWorksSteps}
						horizontal
					/>,
					<Features key="features" />,
					<CTABanner key="cta" />,
					<PrivacySection key="privacy" />,
					<Testimonials key="testimonials" />,
					<PricingSection key="pricing" />,
					<FAQ key="faq" />,
					<FinalCTA key="final-cta" />,
				].map((section, i) => (
					<div
						key={section.key}
						className="animateOnScroll"
						style={{ transitionDelay: `${i * 0.1}s` }}
					>
						{section}
					</div>
				))}
			</main>
		</Layout>
	);
}
