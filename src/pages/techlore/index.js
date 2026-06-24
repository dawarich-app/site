import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import { initializePaddle } from "@paddle/paddle-js";
import HowItWorks from "@site/src/components/HowItWorks";
import LandingHero from "@site/src/components/LandingHero";
import sections from "@site/src/components/LandingSections.module.css";
import PricingSection from "@site/src/components/PricingSection";
import Testimonials from "@site/src/components/Testimonials";
import Layout from "@theme/Layout";
import React, { useEffect, useState } from "react";
import styles from "./techlore.module.css";

const PROMO_CODE = "TECHLORE";
const SIGNUP_URL = `https://my.dawarich.app/users/sign_up?promo=${PROMO_CODE}&utm_source=techlore&utm_medium=video&utm_campaign=techlore_2026`;
const GITHUB_URL = "https://github.com/Freika/dawarich";
const BANNER_STORAGE_KEY = "techlore_banner_dismissed";

const ArrowIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="5" y1="12" x2="19" y2="12" />
		<polyline points="12 5 19 12 12 19" />
	</svg>
);

const ShieldIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
	</svg>
);

const ServerIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
		<rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
		<line x1="6" y1="6" x2="6.01" y2="6" />
		<line x1="6" y1="18" x2="6.01" y2="18" />
	</svg>
);

const MapIcon = () => (
	<svg
		width="20"
		height="20"
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

const EyeIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
		<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
		<path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
		<line x1="1" y1="1" x2="23" y2="23" />
	</svg>
);

const CloseIcon = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);

function WelcomeBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const dismissed = window.localStorage.getItem(BANNER_STORAGE_KEY);
		if (!dismissed) setVisible(true);
	}, []);

	const dismiss = () => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(BANNER_STORAGE_KEY, "1");
		}
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div className={styles.welcomeBanner} role="region" aria-label="TechLore welcome">
			<div className={styles.welcomeBannerInner}>
				<span className={styles.welcomeBannerGreeting}>
					👋 Welcome, <strong>TechLore viewers</strong>
				</span>
				<span className={styles.welcomeBannerSeparator}>·</span>
				<span>20% off your first year with code</span>
				<span className={styles.welcomeBannerCode}>{PROMO_CODE}</span>
			</div>
			<button
				type="button"
				className={styles.welcomeBannerClose}
				onClick={dismiss}
				aria-label="Dismiss welcome banner"
			>
				<CloseIcon />
			</button>
		</div>
	);
}

const privacyPillars = [
	{
		icon: <ShieldIcon />,
		title: "Open source, OVER 9000 stars",
		body: (
			<>
				Licensed AGPL-3.0. Audit the code, fork it, run it yourself. The whole
				engine is on{" "}
				<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
					GitHub
				</a>{" "}
				— Cloud is just the convenience layer.
			</>
		),
	},
	{
		icon: <MapIcon />,
		title: "EU-hosted, real GDPR",
		body: (
			<>
				Your location data lives on Hetzner dedicated hardware in Germany.
				Encrypted in transit and at rest. EU jurisdiction, full GDPR rights.
				A short list of narrow sub-processors (billing, error tracking, CDN)
				is in the{" "}
				<a href="/privacy-policy">privacy policy</a> — none of them receive
				your location history.
			</>
		),
	},
	{
		icon: <EyeIcon />,
		title: "No surveillance funding the product",
		body: (
			<>
				No Google Analytics. No Meta SDK. No Mixpanel, no Segment, no
				retargeting pixels in the product. The marketing site uses cookieless
				Simple Analytics by default; consent-based ad-conversion pixels only
				fire if you accept them. We make money from subscriptions, full stop.
			</>
		),
	},
	{
		icon: <ServerIcon />,
		title: "Self-host whenever you want",
		body: (
			<>
				Docker one-liner, your hardware, your network. Zero trust required —
				your data never touches our servers. Export from Cloud and move in
				either direction, anytime.
			</>
		),
	},
];

const howItWorksSteps = [
	{
		icon: <MapIcon />,
		title: "Import everything",
		description:
			"Google Timeline (old and new formats), OwnTracks, GPX, GeoJSON, KML, Immich, PhotoPrism. Bring fifteen years of history in one upload.",
	},
	{
		icon: <ShieldIcon />,
		title: "Visualize your life",
		description:
			"Interactive map. Heatmaps. Fog of War. Trip detection. Year-in-review. Speed-colored routes and daily replay. The things mapping products do well — without the surveillance tax.",
	},
	{
		icon: <ServerIcon />,
		title: "Own it forever",
		description:
			"Export to GPX, GeoJSON, KML, or raw JSON anytime — on any plan, even Lite. Delete your account and your data leaves with you. No lock-in, ever.",
	},
];

const techloreFaq = [
	{
		question: "Is my data really private?",
		answer:
			"Yes. Encrypted in transit (TLS) and at rest, stored in Hetzner's Germany data centers, never shared with advertisers, never used to train AI models. Want zero trust? Self-host the open-source version and your data never touches our infrastructure.",
	},
	{
		question: "Can I self-host instead of paying?",
		answer:
			"Absolutely. The entire engine is open source under AGPL-3.0 with 9,000+ GitHub stars. There's a single Docker Compose file, full documentation, and an active community. Self-hosting is free forever and supports every feature Cloud does.",
	},
	{
		question: "Do you sell data or run ads?",
		answer:
			"No. We're a small EU company funded by subscriptions — selling location data is illegal under GDPR, and we'd rather have a real business than be the next data broker. The product has no third-party trackers, no analytics SDKs, no Meta or Google pixels. The marketing site uses cookieless Simple Analytics by default; the only ad pixel is a Google Ads conversion tag that fires only if you accept the cookie banner.",
	},
	{
		question: "Where exactly is my data stored?",
		answer:
			"Your location data is on dedicated Hetzner servers in Germany. ZeitFlow UG, the company behind Dawarich, is registered in Berlin under EU jurisdiction. A small set of narrow sub-processors handles peripheral tasks — Paddle (UK) for billing, Sentry (US) for error tracking, Cloudflare for the marketing-site CDN — and none of them receive your location history. The full list and the legal basis for every data category is in our privacy policy.",
	},
	{
		question: "What if Dawarich shuts down one day?",
		answer:
			"The AGPL-3.0 license means the project itself can't disappear — anyone can keep running the code forever, including you. Export your data anytime, on any plan (even Lite), and spin up the open-source version on a $5 VPS or a Raspberry Pi at home. Your history doesn't depend on us being the operator.",
	},
	{
		question: "How is this different from Google Timeline?",
		answer:
			"Google Timeline was \"free\" because your location data funded their $300B ad business. Now Google moved it on-device only and is deprecating the cloud product. Dawarich is built for people who don't want to choose between owning their history and losing it.",
	},
];

function PrivacyPillars() {
	return (
		<section className={sections.sectionElevated}>
			<div className={sections.container}>
				<h2 className={sections.title}>
					Built for the audience that reads the fine print
				</h2>
				<p className={sections.subtitle}>
					Four reasons people leave Google Timeline and Life360 and don&rsquo;t
					look back.
				</p>
				<div className={sections.diffGrid}>
					{privacyPillars.map((pillar) => (
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
		<section className={styles.promoCallout}>
			<div className={styles.promoCalloutInner}>
				<div className={styles.promoCalloutText}>
					<p className={styles.promoCalloutHeadline}>
						20% off your first year
					</p>
					<p className={styles.promoCalloutBody}>
						Use code <strong>{PROMO_CODE}</strong> at checkout on Lite or Pro
						annual.
					</p>
				</div>
				<div className={styles.promoCalloutCode} aria-label={`Promo code: ${PROMO_CODE}`}>
					{PROMO_CODE}
				</div>
			</div>
		</section>
	);
}

function TechLoreFAQ() {
	return (
		<section className={sections.section}>
			<div className={sections.containerNarrow}>
				<h2 className={sections.title}>Common questions</h2>
				<div className={sections.inlineFaq}>
					{techloreFaq.map((item) => (
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

function TechLoreFinalCTA() {
	return (
		<section className={sections.finalCta}>
			<div className={sections.finalCtaInner}>
				<h2 className={sections.finalCtaTitle}>
					Take back your location history.
				</h2>
				<p className={sections.finalCtaBody}>
					Your map of where you&rsquo;ve been shouldn&rsquo;t be a line item in
					someone else&rsquo;s ad business. Start with a 7-day free trial. Use
					code <strong>{PROMO_CODE}</strong> for 20% off your first year. Cancel
					anytime, export anytime.
				</p>
				<Link className={sections.finalCtaButton} href={SIGNUP_URL}>
					Start with code {PROMO_CODE}
					<ArrowIcon />
				</Link>
				<span className={sections.finalCtaSecondary}>
					Prefer to self-host?{" "}
					<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
						The full engine is on GitHub
					</a>{" "}
					— free forever, AGPL-3.0.
				</span>
			</div>
		</section>
	);
}

export default function TechLorePage() {
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

	const pageSections = [
		<PrivacyPillars key="pillars" />,
		<HowItWorks
			key="how"
			title="How Dawarich works"
			subtitle="Import. Visualize. Own. The way location history should have worked all along."
			steps={howItWorksSteps}
			horizontal
		/>,
		<Testimonials key="testimonials" />,
		<PromoCallout key="promo" />,
		<PricingSection key="pricing" />,
		<TechLoreFAQ key="faq" />,
		<TechLoreFinalCTA key="final" />,
	];

	return (
		<Layout
			title="Dawarich for TechLore viewers — Privacy-first location tracking"
			description="The open-source, EU-hosted, self-hostable location history app. No ads, no trackers, no data sales. 20% off your first year with code TECHLORE."
		>
			<Head>
				<meta name="robots" content="noindex,nofollow" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://dawarich.app/techlore" />
				<meta
					property="og:title"
					content="Dawarich for TechLore viewers — Privacy-first location tracking"
				/>
				<meta
					property="og:description"
					content="Open-source, EU-hosted, self-hostable location history. No ads, no trackers, no data sales. 20% off your first year with code TECHLORE."
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.png"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content="Dawarich for TechLore viewers — Privacy-first location tracking"
				/>
				<meta
					name="twitter:description"
					content="The open-source, EU-hosted location history app. No surveillance tax. 20% off with code TECHLORE."
				/>
				<meta
					name="twitter:image"
					content="https://dawarich.app/img/meta-image.png"
				/>
			</Head>

			<WelcomeBanner />

			<LandingHero
				badge="Privacy-first location tracking"
				title="Your location history"
				titleHighlight="belongs to you."
				subtitle="Open-source, EU-hosted, GDPR-compliant. We make money from subscriptions — not from your data. Self-host on your own hardware or use our managed cloud. AGPL-3.0 code, 9,000+ GitHub stars, built by a small EU company."
				primaryCta={{
					text: "Start free trial",
					href: SIGNUP_URL,
				}}
				secondaryCta={{
					text: "View source on GitHub",
					href: GITHUB_URL,
				}}
				disclaimer={`7-day free trial · Use code ${PROMO_CODE} for 20% off your first year · Cancel anytime`}
				videoWebm="/hero-video.webm"
				videoMp4="/hero-video.mp4"
				videoPoster="/img/the_map.webp"
			/>

			<main>
				{pageSections.map((section, i) => (
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
