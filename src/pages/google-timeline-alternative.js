import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import { initializePaddle } from "@paddle/paddle-js";
import HowItWorks from "@site/src/components/HowItWorks";
import LandingHero from "@site/src/components/LandingHero";
import sections from "@site/src/components/LandingSections.module.css";
import PricingSection from "@site/src/components/PricingSection";
import Testimonials from "@site/src/components/Testimonials";
import Layout from "@theme/Layout";
import React, { useEffect } from "react";

const SIGNUP_URL =
	"https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=timeline_landing&utm_campaign=timeline_alt";

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

const ExportIcon = () => (
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
		<polyline points="17 8 12 3 7 8" />
		<line x1="12" y1="3" x2="12" y2="15" />
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

const howItWorksSteps = [
	{
		icon: <ExportIcon />,
		title: "Export from Google",
		description: (
			<>
				Go to{" "}
				<a
					href="https://takeout.google.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					takeout.google.com
				</a>
				, select &ldquo;Location History (Timeline)&rdquo;, request the export.
				Google emails you a zip — usually within an hour.
			</>
		),
	},
	{
		icon: <PinIcon />,
		title: "Sign up for Dawarich Cloud",
		description:
			"Email + password. 7-day free trial with full features.",
	},
	{
		icon: <ImportIcon />,
		title: "Drag-and-drop the zip",
		description:
			"Upload it. Watch your timeline reconstruct itself — pin by pin, trip by trip, year by year — on a map that doesn't belong to Google.",
	},
];

const migrationFAQ = [
	{
		question: "Will the new Google Takeout format work?",
		answer:
			"Yes. We support the new Timeline format (post-2024), the old format, and the legacy records.json fallback.",
	},
	{
		question: "What if my Takeout zip is huge?",
		answer:
			"Our import handles it. We've successfully imported 2 GB Takeouts spanning 15 years and 6.8 million points without issue.",
	},
	{
		question: "Will it work if Google deleted some of my data?",
		answer:
			"Whatever you can export, we can import. We can't recover data Google has already deleted — but we can save what you still have access to.",
	},
	{
		question: "Can I keep using Google Maps after migrating?",
		answer:
			"Yes. Use Google Maps for navigation. Use Dawarich for the record of where you've been. They're not the same product.",
	},
	{
		question: "Will Dawarich track me as well as Google did?",
		answer:
			"Honestly? Better. Native iOS and Android apps with background tracking and battery-friendly intervals. Your data goes over HTTPS to your Dawarich account — never to Google or any third party.",
	},
	{
		question: "What if I want to leave Dawarich later?",
		answer:
			"Export everything to GPX, GeoJSON, or KML — on any plan, even Lite. Self-host the open-source version. Or just delete your account — your data goes with you, never sold, never retained.",
	},
	{
		question: "Is there really a free trial?",
		answer:
			"Yes. 7-day free trial with full features. Cancel anytime from Subscription Settings — your exports remain yours.",
	},
	{
		question: "Do you sell location data?",
		answer:
			"No. We're a small EU company that makes money from subscriptions. Selling location data is illegal under GDPR, and we'd rather have a real business.",
	},
];

function FreeWasntFree() {
	return (
		<section className={sections.reframeSection}>
			<div className={sections.reframeContainer}>
				<h2 className={sections.reframeTitle}>
					&ldquo;But Google Timeline was free.&rdquo;
				</h2>
				<p className={sections.reframeBody}>
					<strong>Free wasn&rsquo;t free.</strong> You paid in data.
				</p>
				<p className={sections.reframeBody}>
					For a decade, every place you went was logged, analyzed, fed to
					Google&rsquo;s ad targeting, and used to train their models. Every
					coffee shop. Every Sunday hike. Every late-night drive to a
					friend&rsquo;s house. That was the price.
				</p>
				<p className={sections.reframeBody}>
					Now Google has extracted what they wanted. Timeline is moved to your
					phone, the cloud version is gone, and the product you
					&ldquo;didn&rsquo;t pay for&rdquo; is being deprecated because it no
					longer earns.
				</p>
				<p className={sections.reframeBody}>
					You don&rsquo;t owe Google anything. And you don&rsquo;t have to
					replace one ad-funded surveillance product with another (looking at
					you, Life360).
				</p>
			</div>
		</section>
	);
}

function PhoneIsNotABackup() {
	return (
		<section className={sections.section}>
			<div className={sections.container}>
				<h2 className={sections.title}>
					Your timeline is now one-device-failure away from gone
				</h2>
				<p className={sections.subtitle}>
					Timeline data is on-device only. That means:
				</p>
				<div className={sections.painGrid}>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>Old phones&rsquo; data</div>
						<p className={sections.painCardBody}>
							The history that didn&rsquo;t transfer? <strong>Gone.</strong>
						</p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>Current phone, broken</div>
						<p className={sections.painCardBody}>
							Lost, stolen, dropped in a lake, factory-reset?{" "}
							<strong>Gone.</strong>
						</p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>Cross-device viewing</div>
						<p className={sections.painCardBody}>
							View your timeline from a tablet or laptop?{" "}
							<strong>Gone.</strong>
						</p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>Cloud backup</div>
						<p className={sections.painCardBody}>
							Of your timeline going forward? <strong>Gone — it&rsquo;s
							local now.</strong>
						</p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>
							Cloud history (pre-migration)
						</div>
						<p className={sections.painCardBody}>
							Held by Google for years for users who didn&rsquo;t grab a Takeout
							in time? <strong>Already deleted.</strong>
						</p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>The bottom line</div>
						<p className={sections.painCardBody}>
							You have one copy of your timeline. It lives on a glass slab that
							breaks if you drop it. <strong>That is not a backup
							strategy.</strong>
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
				<h2 className={sections.title}>
					What makes Dawarich the right home for your Timeline
				</h2>
				<p className={sections.subtitle}>
					Most &ldquo;Google Timeline alternatives&rdquo; are workout trackers,
					manual trip loggers, family-tracking apps that sell data, or
					self-hosted stacks that need a weekend of Docker. Dawarich is none of
					those.
				</p>
				<div className={sections.diffGrid}>
					<div className={sections.diffCard}>
						<h3>EU-hosted</h3>
						<p>
							Hetzner, Germany. No US transfers. Real GDPR — not a &ldquo;we
							comply&rdquo; footnote.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>Open-source</h3>
						<p>
							The full engine is on{" "}
							<a
								href="https://github.com/Freika/dawarich"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>{" "}
							with 8,900+ stars. Cloud is the convenience layer — the product
							underneath is yours to take and run forever.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>Built for Timeline refugees</h3>
						<p>
							New format, old format, legacy <code>records.json</code>{" "}
							fallback. We&rsquo;ve imported 15 years of Timeline data — 6.8
							million points, 2 GB Takeout — without breaking a sweat.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>Visualization product, not a database</h3>
						<p>
							Heatmaps. Fog of War. Globe view. Trip detection. Year-in-review.
							The things Timeline did well — and a few it didn&rsquo;t.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>Permanent export, no lock-in</h3>
						<p>
							GPX, GeoJSON, KML, raw JSON. Your data leaves with you, always —
							on any plan, even Lite.
						</p>
					</div>
					<div className={sections.diffCard}>
						<h3>iOS &amp; Android tracking apps</h3>
						<p>
							Native apps with background tracking and battery-friendly
							intervals. Your data goes to your Dawarich account — never to
							Google or any third party.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function CompetitorReframe() {
	return (
		<section className={sections.section}>
			<div className={sections.containerNarrow}>
				<h2 className={sections.title}>What you&rsquo;re choosing between</h2>
				<div className={sections.compareWrapper}>
					<table className={sections.compareTable}>
						<thead>
							<tr>
								<th>Option</th>
								<th>Annual cost</th>
								<th>Restores your Google Timeline?</th>
								<th>Sells your data?</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Doing nothing</td>
								<td>&ldquo;Free&rdquo;</td>
								<td>No — phone-only, one drop from gone</td>
								<td>N/A</td>
							</tr>
							<tr>
								<td>Life360 Gold</td>
								<td>~&euro;170/yr</td>
								<td>No — live family tracking, no history</td>
								<td>Yes (aggregated)</td>
							</tr>
							<tr>
								<td>Strava Premium</td>
								<td>&euro;60/yr</td>
								<td>No — workouts only</td>
								<td>Public feeds</td>
							</tr>
							<tr className={sections.highlight}>
								<td>Dawarich Cloud Pro</td>
								<td>&euro;119.99/yr</td>
								<td>Yes — full Takeout import, heatmaps, trips</td>
								<td>No. Ever.</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}

function Promises() {
	return (
		<section className={sections.sectionElevated}>
			<div className={sections.container}>
				<h2 className={sections.title}>Two promises, zero risk</h2>
				<div className={sections.promiseGrid}>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>Cancel anytime</h3>
						<p className={sections.promiseBody}>
							7-day free trial, full features. Cancel anytime from
							Subscription Settings — no annual lock-in, no exit fees, no
							friction. Your exports remain yours, on any plan, even after
							cancellation.
						</p>
					</div>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>Open-source escape hatch</h3>
						<p className={sections.promiseBody}>
							If Dawarich Cloud ever shuts down, you export your data and
							self-host the same software with one command. The full engine is
							on{" "}
							<a
								href="https://github.com/Freika/dawarich"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>{" "}
							with 8,900+ stars.{" "}
							<strong>
								You physically cannot lose your timeline by switching to us.
							</strong>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function Urgency() {
	return (
		<section className={sections.reframeSection}>
			<div className={sections.reframeContainer}>
				<h2 className={sections.reframeTitle}>
					This isn&rsquo;t manufactured urgency. Phones break.
				</h2>
				<p className={sections.reframeBody}>
					Your timeline is on one device. <strong>One device.</strong>
				</p>
				<p className={sections.reframeBody}>
					Phones get dropped, stolen, lost, water-damaged, factory-reset.
					Phones get traded in for new phones, and Timeline data doesn&rsquo;t
					always come along cleanly. The Takeout export window depends on
					Google account activity — inactive accounts lose access faster.
				</p>
				<p className={sections.reframeBody}>
					Every week you wait is data you might not get back. The migration
					takes 15 minutes.{" "}
					<strong>
						There is no version of &ldquo;later&rdquo; that is better than
						&ldquo;tonight.&rdquo;
					</strong>
				</p>
				<div style={{ marginTop: "2rem" }}>
					<Link className={sections.finalCtaButton} href={SIGNUP_URL}>
						Import your Takeout this evening
						<ArrowIcon />
					</Link>
				</div>
			</div>
		</section>
	);
}

function MigrationFAQ() {
	return (
		<section className={sections.section}>
			<div className={sections.container}>
				<h2 className={sections.title}>Common questions</h2>
				<div className={sections.inlineFaq}>
					{migrationFAQ.map((item) => (
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

function TimelineFinalCTA() {
	return (
		<section className={sections.finalCta}>
			<div className={sections.finalCtaInner}>
				<h2 className={sections.finalCtaTitle}>
					Your timeline doesn&rsquo;t belong to Google.
				</h2>
				<p className={sections.finalCtaBody}>
					It belongs to you. To the places you&rsquo;ve lived. To the people
					you&rsquo;ve visited. To the trips you took before phones were good
					at remembering them for you.
				</p>
				<Link className={sections.finalCtaButton} href={SIGNUP_URL}>
					Save your timeline today
					<ArrowIcon />
				</Link>
				<span className={sections.finalCtaSecondary}>
					7-day free trial · Cancel anytime · Already self-hosting?{" "}
					<a
						href="https://github.com/Freika/dawarich"
						target="_blank"
						rel="noopener noreferrer"
					>
						Import the same Takeout into your own instance
					</a>
					.
				</span>
			</div>
		</section>
	);
}

export default function GoogleTimelineAlternativePage() {
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
		<FreeWasntFree key="reframe" />,
		<PhoneIsNotABackup key="pain" />,
		<HowItWorks
			key="how"
			title="How the migration works"
			subtitle="Three steps. About 15 minutes total."
			steps={howItWorksSteps}
			horizontal
		/>,
		<Differentiators key="diff" />,
		<Testimonials key="testimonials" />,
		<Promises key="promises" />,
		<Urgency key="urgency" />,
		<CompetitorReframe key="compare" />,
		<PricingSection key="pricing" />,
		<MigrationFAQ key="faq" />,
		<TimelineFinalCTA key="final" />,
	];

	return (
		<Layout
			title="Google Timeline Alternative — Save Your Location History Before You Lose It"
			description="Google killed Timeline and moved your data on-device only. Dawarich Cloud imports your Google Takeout in minutes, gives you back heatmaps and trip detection, and stores it all privately in Germany. From €119.99/year. 7-day free trial."
		>
			<Head>
				<meta property="og:type" content="website" />
				<meta
					property="og:url"
					content="https://dawarich.app/google-timeline-alternative"
				/>
				<meta
					property="og:title"
					content="Google Timeline Alternative — Save Your Location History Before You Lose It"
				/>
				<meta
					property="og:description"
					content="Google killed Timeline and moved your data on-device only. Save your entire history in minutes with Dawarich Cloud — privately, EU-hosted, GDPR-compliant. 7-day free trial."
				/>
				<meta
					property="og:image"
					content="https://dawarich.app/img/meta-image.jpg"
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:url"
					content="https://dawarich.app/google-timeline-alternative"
				/>
				<meta
					name="twitter:title"
					content="Google Timeline Alternative — Save Your Location History"
				/>
				<meta
					name="twitter:description"
					content="Google killed Timeline. Save your history privately with Dawarich Cloud. EU-hosted, GDPR-compliant. 7-day free trial."
				/>
				<meta
					name="twitter:image"
					content="https://dawarich.app/img/meta-image.jpg"
				/>
				<link
					rel="canonical"
					href="https://dawarich.app/google-timeline-alternative"
				/>
			</Head>

			<LandingHero
				badge="Google Timeline alternative"
				title="Google killed Timeline."
				titleHighlight="Don't let your decade go with it."
				subtitle="Save your entire Google location history in minutes — and keep tracking forward, on infrastructure Google can't deprecate, sell, or feed to ad models. EU-hosted. Encrypted in transit and at rest. GDPR-compliant."
				primaryCta={{
					text: "Start your 7-day free trial",
					href: SIGNUP_URL,
				}}
				secondaryCta={{
					text: "See pricing",
					href: "#pricing",
				}}
				disclaimer="7-day free trial · We've successfully imported 15-year Takeouts of 6.8 million points without breaking a sweat"
				imageSrc="/img/map-fog-of-war.png"
				imageAlt="Dawarich Fog of War map showing a decade of location history"
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
