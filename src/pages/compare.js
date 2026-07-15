import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import LandingHero from "@site/src/components/LandingHero";
import sections from "@site/src/components/LandingSections.module.css";
import Layout from "@theme/Layout";
import React from "react";

import styles from "./compare.module.css";

const SIGNUP_URL =
	"https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=compare_page&utm_campaign=compare";

const Yes = ({ children }) => (
	<span className={styles.yes}>✓ {children || ""}</span>
);
const No = ({ children }) => (
	<span className={styles.no}>— {children || ""}</span>
);
const Partial = ({ children }) => (
	<span className={styles.partial}>{children}</span>
);

const ROWS = [
	{
		feature: "License",
		dawarich: <Yes>AGPL-3.0 (open source)</Yes>,
		geopulse: (
			<Partial>BSL 1.1 — source-available, free for personal use</Partial>
		),
		reitti: <Yes>AGPL-3.0 (open source)</Yes>,
	},
	{
		feature: "Native mobile apps",
		dawarich: <Yes>iOS & Android with built-in tracking</Yes>,
		geopulse: <No>web app; use a third-party tracker</No>,
		reitti: <No>web app; use a third-party tracker</No>,
	},
	{
		feature: "Managed cloud option",
		dawarich: <Yes>Dawarich Cloud (self-hosting stays free)</Yes>,
		geopulse: <No />,
		reitti: <No />,
	},
	{
		feature: "Live location share links",
		dawarich: <Yes>phrase-protected, revocable, respects privacy zones</Yes>,
		geopulse: <Yes>password-protected, revocable</Yes>,
		reitti: <Yes>magic links + cross-instance federation</Yes>,
	},
	{
		feature: "Multi-user & family",
		dawarich: <Yes>family live location + shared history</Yes>,
		geopulse: <Yes>friends with per-friend permissions</Yes>,
		reitti: <Yes>multi-user with user-to-user sharing</Yes>,
	},
	{
		feature: "Visit & trip detection",
		dawarich: <Yes>visits, places, trips</Yes>,
		geopulse: <Yes>configurable stay/trip thresholds</Yes>,
		reitti: <Yes>significant places, trips</Yes>,
	},
	{
		feature: "Transport mode detection",
		dawarich: <Yes />,
		geopulse: <Yes />,
		reitti: <Yes />,
	},
	{
		feature: "Photo integration",
		dawarich: <Yes>Immich + PhotoPrism</Yes>,
		geopulse: <Yes>Immich</Yes>,
		reitti: <Yes>Immich</Yes>,
	},
	{
		feature: "File imports",
		dawarich: (
			<Yes>Google Takeout (all formats), GPX, GeoJSON, KML, FIT, OwnTracks</Yes>
		),
		geopulse: <Yes>Google Timeline, GPX, GeoJSON, CSV, OwnTracks</Yes>,
		reitti: <Yes>Google Takeout, GPX, GeoJSON</Yes>,
	},
	{
		feature: "Tracker compatibility",
		dawarich: (
			<Yes>
				own apps, OwnTracks, Overland, Traccar, GPSLogger, Home Assistant
			</Yes>
		),
		geopulse: (
			<Yes>OwnTracks, Overland, GPSLogger, Traccar, Home Assistant</Yes>
		),
		reitti: <Yes>OwnTracks, Overland, GPSLogger, Home Assistant</Yes>,
	},
	{
		feature: "Stats & yearly recap",
		dawarich: <Yes>statistics, shareable monthly stats, digests</Yes>,
		geopulse: <Yes>analytics, optional AI insights</Yes>,
		reitti: <Yes>statistics</Yes>,
	},
	{
		feature: "OIDC / SSO",
		dawarich: <Yes />,
		geopulse: <Yes />,
		reitti: <Yes />,
	},
	{
		feature: "Resource footprint",
		dawarich: (
			<Partial>
				heavier today; ~20% lighter stack ships in the next release
			</Partial>
		),
		geopulse: <Yes>very light (native binary)</Yes>,
		reitti: <Partial>moderate (JVM + Redis + PostGIS)</Partial>,
	},
	{
		feature: "Community & maturity",
		dawarich: <Yes>since 2024 · 9.7k stars · 56 contributors</Yes>,
		geopulse: <Partial>since 2025 · 1.3k stars · 12 contributors</Partial>,
		reitti: <Partial>2.3k stars · 17 contributors</Partial>,
	},
	{
		feature: "Data export (no lock-in)",
		dawarich: <Yes>GPX, GeoJSON, full account archive</Yes>,
		geopulse: <Yes>GPX, GeoJSON, CSV, JSON</Yes>,
		reitti: <Yes>GPX exports</Yes>,
	},
];

const CHOOSE = [
	{
		name: "Choose Dawarich if…",
		points: [
			"you want native iOS/Android apps that track out of the box — no third-party tracker setup",
			"family sharing with history matters to you",
			"you might want a managed Cloud option someday (or don't want to self-host at all)",
			"you value a large contributor community and AGPL licensing",
		],
	},
	{
		name: "Choose GeoPulse if…",
		points: [
			"minimal RAM usage on a small VPS is your top priority",
			"you're happy configuring OwnTracks or GPSLogger yourself",
			"the Business Source License is acceptable for your use",
		],
	},
	{
		name: "Choose Reitti if…",
		points: [
			"you want AGPL software with a lean JVM stack",
			"cross-instance federation for location sharing appeals to you",
			"a focused, minimal feature set is what you're after",
		],
	},
];

const FAQ_ITEMS = [
	{
		q: "Is self-hosted Dawarich really free?",
		a: "Yes — fully free, AGPL-3.0, all features included, forever. Dawarich Cloud is a paid managed option for people who don't want to run their own server; it funds development but takes nothing away from self-hosting.",
	},
	{
		q: "Can I migrate from GeoPulse or Reitti to Dawarich?",
		a: "Yes. Export your data as GPX or GeoJSON and import it into Dawarich — imports are streamed and handle millions of points. The reverse is also true: Dawarich exports your complete history in open formats, because your data should never be locked in.",
	},
	{
		q: "Why is Dawarich heavier than GeoPulse?",
		a: "Dawarich is a full Rails application with a larger feature surface — native app APIs, family sharing, integrations, background processing. We're actively slimming it down: the next release cuts the default stack's idle memory by roughly 20%, with more reductions in progress.",
	},
	{
		q: "Do GeoPulse and Reitti work with the Dawarich mobile apps?",
		a: "GeoPulse can ingest the Dawarich API format. Our iOS and Android apps are built for Dawarich, and features like family sharing, live sharing, and trip views work end-to-end only with a Dawarich backend.",
	},
];

function ComparisonTable() {
	return (
		<div className={styles.tableWrap}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.featureCol}>Feature</th>
						<th className={styles.dawarichCol}>Dawarich</th>
						<th>GeoPulse</th>
						<th>Reitti</th>
					</tr>
				</thead>
				<tbody>
					{ROWS.map((row) => (
						<tr key={row.feature}>
							<td className={styles.featureCol}>{row.feature}</td>
							<td className={styles.dawarichCol}>{row.dawarich}</td>
							<td>{row.geopulse}</td>
							<td>{row.reitti}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default function Compare() {
	return (
		<Layout
			title="Dawarich vs GeoPulse vs Reitti"
			description="An honest comparison of the three leading self-hosted Google Timeline alternatives: Dawarich, GeoPulse and Reitti — licensing, mobile apps, sharing, imports, resource usage."
		>
			<Head>
				<meta
					property="og:title"
					content="Dawarich vs GeoPulse vs Reitti — self-hosted location timeline comparison"
				/>
				<link rel="canonical" href="https://dawarich.app/compare" />
			</Head>

			<LandingHero
				badge="Comparison · updated July 2026"
				title="Dawarich vs GeoPulse vs Reitti"
				subtitle="Three good ways to own your location history. Here's an honest look at how they differ, so you can pick the right one — even if it isn't ours."
				primaryCta={{ text: "Try Dawarich Cloud", href: SIGNUP_URL }}
				secondaryCta={{
					text: "Self-host for free",
					href: "/docs/self-hosting/installation/docker",
				}}
			/>

			<section className={sections.section}>
				<div className={sections.container}>
					<h2 className={sections.title}>Feature comparison</h2>
					<p className={sections.subtitle}>
						All three projects are actively developed self-hosted alternatives
						to Google Timeline. The table reflects each project's documentation
						and releases as of July 2026 — if something is out of date,{" "}
						<a href="https://github.com/dawarich-app/site/issues">
							tell us and we'll fix it
						</a>
						.
					</p>
					<ComparisonTable />
					<p className={styles.updated}>
						Star and contributor counts from GitHub, July 15, 2026.
					</p>
				</div>
			</section>

			<section className={sections.sectionElevated}>
				<div className={sections.container}>
					<h2 className={sections.title}>Which one is right for you?</h2>
					<div className={styles.chooseGrid}>
						{CHOOSE.map((card) => (
							<div key={card.name} className={styles.chooseCard}>
								<h3>{card.name}</h3>
								<ul>
									{card.points.map((p) => (
										<li key={p}>{p}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className={sections.section}>
				<div className={sections.containerNarrow}>
					<h2 className={sections.title}>Frequently asked questions</h2>
					{FAQ_ITEMS.map((item) => (
						<details key={item.q} style={{ marginBottom: "0.9rem" }}>
							<summary style={{ fontWeight: 600, cursor: "pointer" }}>
								{item.q}
							</summary>
							<p style={{ marginTop: "0.6rem" }}>{item.a}</p>
						</details>
					))}
				</div>
			</section>

			<section className={sections.sectionSunken}>
				<div
					className={sections.containerNarrow}
					style={{ textAlign: "center" }}
				>
					<h2 className={sections.title}>
						Your timeline, your server, your call
					</h2>
					<p className={sections.subtitle}>
						Start with a 7-day Cloud trial, or spin up the whole stack with one
						Docker Compose file. Either way, your data stays yours.
					</p>
					<p>
						<Link className="button button--primary button--lg" to={SIGNUP_URL}>
							Try Dawarich Cloud
						</Link>{" "}
						<Link
							className="button button--secondary button--lg"
							to="/docs/self-hosting/installation/docker"
						>
							Self-host guide
						</Link>
					</p>
				</div>
			</section>
		</Layout>
	);
}
