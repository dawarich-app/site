import Link from "@docusaurus/Link";
import React from "react";
import PricingCard from "./PricingCard";
import styles from "./PricingSection.module.css";

export default function PricingSection() {
	return (
		<section id="pricing" className={styles.section}>
			<div className={styles.container}>
				<div className={styles.badge}>Simple Pricing</div>

				<h2 className={styles.title}>Own Your Location History</h2>

				<p className={styles.subtitle}>
					Less than a coffee per week to keep a lifetime of memories. Your data
					is always yours — export everything, anytime, on any plan.
				</p>

				<div className={styles.cardContainer}>
					<div className={styles.cardWrapper}>
						<PricingCard
							title="Lite"
							annualPrice={49.99}
							description="A private alternative to Google Timeline for casual trackers."
							perDayText={"Less than \u20AC0.14/day"}
							features={[
								"iOS & Android native apps",
								"Background location tracking",
								"12 months of searchable history",
								"Unlimited imports & exports",
								"Interactive map with routes",
								"Speed-colored routes & daily replay",
								"Trips & places management",
								"Basic stats & monthly breakdowns",
								"200 req/hr API rate limit",
							]}
							buttonText="Try Lite Free"
							buttonVariant="secondary"
							buttonLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=pricing&utm_campaign=try7dayslite&plan=lite"
							trialText="Annual only · Cancel anytime"
						/>
					</div>

					<div className={styles.featuredCardWrapper}>
						<PricingCard
							className={styles.featuredCard}
							title="Pro"
							annualPrice={119.99}
							monthlyPrice={17.99}
							badge="Most Popular"
							description="Unlimited history, advanced visualizations, and full API access."
							perDayText={"Just \u20AC0.33/day"}
							includesLabel="Everything in Lite, plus:"
							features={[]}
							proOnlyFeatures={[
								"Unlimited data history — forever",
								"Heatmap & Fog of War layers",
								"Globe view (3D)",
								"Trip photo integration",
								"Immich / PhotoPrism integration",
								"Full year-in-review & public sharing",
								"Full Write API access",
								"1,000 req/hr API rate limit",
							]}
							buttonText="Start Pro Free — 7 Days"
							buttonVariant="primary"
							buttonLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=pricing&utm_campaign=try7days"
							trialText="Cancel anytime"
						/>
					</div>
				</div>

				<div className={styles.guarantee}>
					<div className={styles.guaranteeIcon}>
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
							<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
							<path d="m9 12 2 2 4-4" />
						</svg>
					</div>
					<div className={styles.guaranteeText}>
						<strong>14-day risk-free refund.</strong> Try Dawarich for 7 days
						free, then for 14 days after subscribing — change your mind and we
						refund you, no questions asked. Your data export is always yours to
						keep.{" "}
						<Link to="/refund-policy" className={styles.guaranteeLink}>
							Refund policy →
						</Link>
					</div>
				</div>
			</div>

			<div className={styles.selfHostContainer}>
				<Link to="/docs/self-hosting/introduction" className={styles.selfHostButton}>
					Don't trust anyone with your data? Self-host for free — every Pro
					feature, your server, zero cost
				</Link>
			</div>
		</section>
	);
}
