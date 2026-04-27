import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import { initializePaddle } from "@paddle/paddle-js";
import FAQ from "@site/src/components/FAQ";
import HowItWorks from "@site/src/components/HowItWorks";
import LandingHero from "@site/src/components/LandingHero";
import sections from "@site/src/components/LandingSections.module.css";
import PricingSection from "@site/src/components/PricingSection";
import Testimonials from "@site/src/components/Testimonials";
import Layout from "@theme/Layout";
import React, { useEffect } from "react";

const SIGNUP_URL =
	"https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=cloud_landing&utm_campaign=cloud";

const SignupIcon = () => (
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

const PinIcon = () => (
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
		<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);

const ImportIcon = () => (
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
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7 10 12 15 17 10" />
		<line x1="12" y1="15" x2="12" y2="3" />
	</svg>
);

const PhoneIcon = () => (
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
		<rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
		<line x1="12" y1="18" x2="12.01" y2="18" />
	</svg>
);

const howItWorksSteps = [
	{
		icon: <PinIcon />,
		title: "Sign up",
		description:
			"Email, password, done. 90 seconds. 7-day free trial with full features.",
	},
	{
		icon: <ImportIcon />,
		title: "Import your past",
		description:
			"Drag-and-drop your Google Takeout zip, OwnTracks records, GPX files, or any of 15+ formats. Watch your history reconstruct itself on a map.",
	},
	{
		icon: <PhoneIcon />,
		title: "Track forward",
		description:
			"Install the iOS or Android app. Background tracking starts automatically. Trips, heatmaps, and stats update in real time.",
	},
];

function PainSection() {
	return (
		<section className={sections.section}>
			<div className={sections.container}>
				<h2 className={sections.title}>
					Your location data is in one of three places right now.
				</h2>
				<p className={sections.subtitle}>
					None of them put you in charge.
				</p>
				<div className={sections.painGrid}>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>Inside Google</div>
						<p className={sections.painCardBody}>
							Feeding ad targeting for a decade. Timeline now stranded on your
							phone, with no cloud backup going forward.
						</p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>Inside Life360</div>
						<p className={sections.painCardBody}>
							Sold as &ldquo;aggregated insights&rdquo; to advertisers. Read{" "}
							<a
								href="https://themarkup.org/privacy/2022/01/27/life360-said-it-stopped-selling-precise-location-data-but-the-data-still-flows"
								target="_blank"
								rel="noopener noreferrer"
							>
								The Markup&rsquo;s reporting
							</a>{" "}
							if you doubt it.
						</p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>Nowhere at all</div>
						<p className={sections.painCardBody}>
							Because every privacy-respecting alternative wanted you to learn
							Docker first. So you never started.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function Differentiators() {
	return (
		<section className={sections.sectionElevated}>
			<div className={sections.container}>
				<h2 className={sections.title}>What actually makes Dawarich different</h2>
				<p className={sections.subtitle}>
					Hosting and backups are table stakes. Here&rsquo;s what isn&rsquo;t.
				</p>
				<div className={sections.diffGrid}>
					<div className={sections.diffCard}>
						<h3>EU data residency</h3>
						<p>
							Hosted on Hetzner in Germany. No US transfers. No PRISM, no
							Patriot Act, no &ldquo;we cooperate with US authorities&rdquo;
							footnote.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>Open-source escape hatch</h3>
						<p>
							The full Dawarich engine is on{" "}
							<a
								href="https://github.com/Freika/dawarich"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>{" "}
							with 8,900+ stars. If we ever shut down, you self-host the same
							software with one command and import your exported data.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>15+ import formats</h3>
						<p>
							Most competitors only ingest their own data. We ingest
							everyone&rsquo;s — Google, Strava, Garmin, Apple Health,
							OwnTracks, and a dozen more.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>Lifetime history, not workouts</h3>
						<p>
							Strava knows your runs. Polarsteps knows your trips. We know
							everywhere you&rsquo;ve been.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>Real visualization product</h3>
						<p>
							Heatmaps, Fog of War, Globe view, automatic trip detection,
							year-in-review. Not just a dot on a map.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>Photo integration</h3>
						<p>
							Connect Immich or PhotoPrism — your photos appear on the map
							next to where you took them.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function CompetitorReframe() {
	return (
		<section className={sections.reframeSection}>
			<div className={sections.reframeContainer}>
				<h2 className={sections.reframeTitle}>
					Why pay for what Google &ldquo;gave away&rdquo; for free?
				</h2>
				<p className={sections.reframeBody}>
					Free wasn&rsquo;t free. You paid in data — every coffee shop, every
					Sunday hike, every late-night drive — fed into Google&rsquo;s profile
					of you.
				</p>
				<p className={sections.reframeBody}>
					What you&rsquo;re actually choosing between:
				</p>

				<div className={sections.compareWrapper}>
					<table className={sections.compareTable}>
						<thead>
							<tr>
								<th>Service</th>
								<th>Annual cost</th>
								<th>What it does</th>
								<th>What they do with your data</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Google Timeline</td>
								<td>&ldquo;Free&rdquo;</td>
								<td>Killed it, moved to phone-only</td>
								<td>Trained ad targeting for a decade</td>
							</tr>
							<tr>
								<td>Life360 Gold</td>
								<td>~&euro;170/yr</td>
								<td>Live family location only</td>
								<td>Sold aggregated location data</td>
							</tr>
							<tr>
								<td>Strava Premium</td>
								<td>&euro;60/yr</td>
								<td>Workouts only — not lifetime history</td>
								<td>Public-by-default activity feeds</td>
							</tr>
							<tr className={sections.highlight}>
								<td>Dawarich Cloud Pro</td>
								<td>&euro;119.99/yr</td>
								<td>Full lifetime history, heatmaps, trips, stats</td>
								<td>Nothing. Ever.</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p className={sections.compareCaption}>
					We charge less than Life360 charges to <em>sell</em> your data.
				</p>
			</div>
		</section>
	);
}

function Promises() {
	return (
		<section className={sections.section}>
			<div className={sections.container}>
				<h2 className={sections.title}>The &ldquo;you can&rsquo;t lose&rdquo; promise</h2>
				<p className={sections.subtitle}>
					&ldquo;Trust us with your location data&rdquo; is a big ask. So
					here&rsquo;s ours:
				</p>
				<div className={sections.promiseGrid}>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>7-day free trial</h3>
						<p className={sections.promiseBody}>
							Full features for a week. Cancel from Subscription Settings if
							it&rsquo;s not for you — your exports stay yours.
						</p>
					</div>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>Cancel anytime</h3>
						<p className={sections.promiseBody}>
							No annual lock-in penalty, no exit fees, no &ldquo;are you
							sure?&rdquo; emails.
						</p>
					</div>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>Export-anytime</h3>
						<p className={sections.promiseBody}>
							Every byte of your data, exportable in GPX, GeoJSON, KML, or raw
							JSON, on any plan, forever.
						</p>
					</div>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>Open-source escape hatch</h3>
						<p className={sections.promiseBody}>
							If Dawarich Cloud ever shuts down, you self-host the same
							software and import your exported data. <strong>We literally
							cannot hold your data hostage.</strong>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function CloudFinalCTA() {
	return (
		<section className={sections.finalCta}>
			<div className={sections.finalCtaInner}>
				<h2 className={sections.finalCtaTitle}>
					Stop renting your memories from companies that don&rsquo;t care.
				</h2>
				<p className={sections.finalCtaBody}>
					Your location history is the map of your life. The places you fell in
					love. The trip you took the year your mom got sick. The route you
					used to bike to your first job.
				</p>
				<Link className={sections.finalCtaButton} href={SIGNUP_URL}>
					Start your 7-day free trial
					<SignupIcon />
				</Link>
				<span className={sections.finalCtaSecondary}>
					7-day free trial · Cancel anytime · Or{" "}
					<a
						href="https://github.com/Freika/dawarich"
						target="_blank"
						rel="noopener noreferrer"
					>
						self-host the open-source version
					</a>{" "}
					if you&rsquo;d rather. We support both. We always will.
				</span>
			</div>
		</section>
	);
}

export default function CloudPage() {
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
		<PainSection key="pain" />,
		<HowItWorks
			key="how"
			title="How it works"
			subtitle="Three steps. There is no step four."
			steps={howItWorksSteps}
			horizontal
		/>,
		<Differentiators key="diff" />,
		<CompetitorReframe key="compare" />,
		<Testimonials key="testimonials" />,
		<Promises key="promises" />,
		<PricingSection key="pricing" />,
		<FAQ key="faq" />,
		<CloudFinalCTA key="final" />,
	];

	return (
		<Layout
			title="Dawarich Cloud — Private Location History You Actually Own"
			description="Privacy-first location history hosted in Germany. Heatmaps, trips, statistics — without selling your data. Imports from Google Takeout, Strava, Garmin, and 12 more. From €49.99/year. 7-day free trial."
		>
			<Head>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://dawarich.app/cloud" />
				<meta
					property="og:title"
					content="Dawarich Cloud — Private Location History You Actually Own"
				/>
				<meta
					property="og:description"
					content="Privacy-first location history hosted in Germany. Heatmaps, trips, statistics — without selling your data. From €49.99/year. 7-day free trial."
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.jpg"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content="https://dawarich.app/cloud" />
				<meta
					name="twitter:title"
					content="Dawarich Cloud — Private Location History You Actually Own"
				/>
				<meta
					name="twitter:description"
					content="Privacy-first location history hosted in Germany. Heatmaps, trips, statistics — without selling your data."
				/>
				<meta
					name="twitter:image"
					content="https://dawarich.app/img/meta-image.jpg"
				/>
				<link rel="canonical" href="https://dawarich.app/cloud" />
			</Head>

			<LandingHero
				badge="Privacy-first location history"
				title="Your location history."
				titleHighlight="Privately. Permanently."
				subtitle="Heatmaps, trips, and statistics for everywhere you've been — without feeding Google's ad machine, Life360's data brokers, or your own Raspberry Pi."
				primaryCta={{
					text: "Start your 7-day free trial",
					href: SIGNUP_URL,
				}}
				secondaryCta={{
					text: "See pricing",
					href: "#pricing",
				}}
				disclaimer="7-day free trial · Cancel anytime · Your data stays yours, in standard formats"
				imageSrc="/img/timeline.png"
				imageAlt="Dawarich timeline view showing a decade of location history"
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
