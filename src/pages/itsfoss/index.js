import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import HowItWorks from "@site/src/components/HowItWorks";
import LandingHero from "@site/src/components/LandingHero";
import sections from "@site/src/components/LandingSections.module.css";
import PricingSection from "@site/src/components/PricingSection";
import Testimonials from "@site/src/components/Testimonials";
import { PLANS } from "@site/src/data/pricingPlans";
import Layout from "@theme/Layout";
import React, { useEffect, useState } from "react";
import styles from "./itsfoss.module.css";

const PROMO_CODE = "ITSFOSS";
const CAMPAIGN_QUERY = "utm_source=itsfoss&utm_medium=newsletter&utm_campaign=itsfoss_2026";
const SIGNUP_URL = `https://my.dawarich.app/users/sign_up?promo=${PROMO_CODE}&${CAMPAIGN_QUERY}`;
const GITHUB_URL = "https://github.com/Freika/dawarich";
const BANNER_STORAGE_KEY = "itsfoss_banner_dismissed";

const partnerPlans = {
	lite: { ...PLANS.lite, href: `${SIGNUP_URL}&plan=lite` },
	pro: { ...PLANS.pro, href: SIGNUP_URL },
	family: {
		...PLANS.family,
		href: `https://my.dawarich.app/users/sign_up?${CAMPAIGN_QUERY}&plan=family`,
	},
};

const pillars = [
	{
		title: "The source is yours to inspect",
		body: (
			<>
				Dawarich is licensed under AGPL-3.0. Read the code, contribute, or run
				it yourself. <a href={GITHUB_URL}>Explore the project on GitHub</a>.
			</>
		),
	},
	{
		title: "Your history stays portable",
		body: "Import from Google Timeline, OwnTracks, GPX and more. Export your location data whenever you want, including on the Lite plan.",
	},
	{
		title: "Hosting is optional",
		body: "Use Dawarich Cloud on servers in Germany, or self-host the open-source app on your own hardware. Choose the setup that works for you.",
	},
];

const steps = [
	{
		title: "Bring your history",
		description: "Import your existing location data, including Google Timeline exports, and see your past journeys on a map.",
	},
	{
		title: "Keep tracking",
		description: "Use the iOS or Android app to record new places and routes in the background.",
	},
	{
		title: "Explore and export",
		description: "Browse trips, places and stats. Export your data whenever you need it.",
	},
];

const faq = [
	{
		question: "Can I self-host Dawarich instead?",
		answer: "Yes. Dawarich is open source under AGPL-3.0, and the self-hosted version is free. Cloud is the managed option for people who prefer not to run a server.",
	},
	{
		question: "Can I move my data out of Cloud?",
		answer: "Yes. You can export your location history in standard formats, even on the Lite plan, and use it with a self-hosted instance.",
	},
	{
		question: "Where does the discount apply?",
		answer: "Use code ITSFOSS for 10% off your first year of a Lite or Pro annual subscription. The 7-day free trial comes first.",
	},
];

function WelcomeBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!window.localStorage.getItem(BANNER_STORAGE_KEY)) setVisible(true);
	}, []);

	if (!visible) return null;

	return (
		<div className={styles.welcomeBanner} role="region" aria-label="It's FOSS welcome offer">
			<div className={styles.welcomeBannerInner}>
				<span>Welcome, <strong>It&apos;s FOSS readers</strong></span>
				<span aria-hidden="true">·</span>
				<span>10% off your first year with code</span>
				<strong className={styles.welcomeBannerCode}>{PROMO_CODE}</strong>
			</div>
			<button
				type="button"
				className={styles.welcomeBannerClose}
				onClick={() => {
					window.localStorage.setItem(BANNER_STORAGE_KEY, "1");
					setVisible(false);
				}}
				aria-label="Dismiss welcome offer"
			>
				×
			</button>
		</div>
	);
}

function OpenSourcePillars() {
	return (
		<section className={sections.sectionElevated}>
			<div className={sections.container}>
				<h2 className={sections.title}>Open source, all the way through</h2>
				<p className={sections.subtitle}>
					Cloud runs the same Dawarich you can inspect and self-host.
				</p>
				<div className={sections.diffGrid}>
					{pillars.map((pillar) => (
						<div key={pillar.title} className={sections.diffCard}>
							<h3>{pillar.title}</h3>
							<p>{pillar.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function PromoCallout() {
	return (
		<section className={styles.promoCallout} aria-label="It's FOSS reader discount">
			<div className={styles.promoCalloutInner}>
				<div className={styles.promoCalloutText}>
					<p className={styles.promoCalloutHeadline}>A little thank-you for It&apos;s FOSS readers</p>
					<p className={styles.promoCalloutBody}>
						10% off your first year of Lite or Pro annual. Use code <strong>{PROMO_CODE}</strong> at checkout.
					</p>
				</div>
				<div className={styles.promoCalloutCode} aria-label={`Promo code: ${PROMO_CODE}`}>
					{PROMO_CODE}
				</div>
			</div>
		</section>
	);
}

function Faq() {
	return (
		<section className={sections.section}>
			<div className={sections.containerNarrow}>
				<h2 className={sections.title}>Common questions</h2>
				<div className={sections.inlineFaq}>
					{faq.map((item) => (
						<div key={item.question} className={sections.inlineFaqItem}>
							<p className={sections.inlineFaqQuestion}>{item.question}</p>
							<p className={sections.inlineFaqAnswer}>{item.answer}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function FinalCta() {
	return (
		<section className={sections.finalCta}>
			<div className={sections.finalCtaInner}>
				<h2 className={sections.finalCtaTitle}>Your places. Your code. Your choice.</h2>
				<p className={sections.finalCtaBody}>
					Start with a 7-day Cloud trial. Code <strong>{PROMO_CODE}</strong> gives It&apos;s FOSS readers 10% off the first year of Lite or Pro annual.
				</p>
				<Link className={sections.finalCtaButton} href={SIGNUP_URL}>
					Start free trial with {PROMO_CODE} →
				</Link>
				<span className={sections.finalCtaSecondary}>
					Prefer to self-host? <a href={GITHUB_URL}>Get the open-source app on GitHub</a>.
				</span>
			</div>
		</section>
	);
}

export default function ItsFossPage() {
	return (
		<Layout
			title="Dawarich for It's FOSS readers — Open-source location history"
			description="Explore your location history with open-source Dawarich. Self-host for free or use Dawarich Cloud. It's FOSS readers get 10% off the first year of Lite or Pro annual with code ITSFOSS."
		>
			<Head>
				<meta name="robots" content="noindex,nofollow" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://dawarich.app/itsfoss" />
				<meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<WelcomeBanner />
			<LandingHero
				badge="Open-source location history"
				title="Your history."
				titleHighlight="Your rules."
				subtitle="Dawarich turns your location history into trips, places and a map you can explore. The app is open source and free to self-host. Dawarich Cloud gives you the same experience without running a server."
				primaryCta={{ text: "Start 7-day Cloud trial", href: SIGNUP_URL }}
				secondaryCta={{ text: "Explore the source", href: GITHUB_URL }}
				disclaimer={`It’s FOSS readers: 10% off the first year of Lite or Pro annual with code ${PROMO_CODE}`}
				imageSrc="/img/the_map.webp"
				imageAlt="A map of journeys in Dawarich"
				imageContainerStyle={{ transform: "rotateY(4deg) rotateX(2deg) scale(1)" }}
			/>
			<main>
				<OpenSourcePillars />
				<HowItWorks
					title="Make your location history useful"
					subtitle="Bring your data in, keep tracking, and take it with you whenever you want."
					steps={steps}
					horizontal
				/>
				<Testimonials />
				<PromoCallout />
				<PricingSection plans={partnerPlans} />
				<Faq />
				<FinalCta />
			</main>
		</Layout>
	);
}
