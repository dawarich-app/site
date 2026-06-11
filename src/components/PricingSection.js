import Link from "@docusaurus/Link";
import React from "react";
import { PLANS } from "@site/src/data/pricingPlans";
import PricingCard from "./PricingCard";
import styles from "./PricingSection.module.css";

export default function PricingSection() {
	return (
		<section id="pricing" className={styles.section}>
			<div className={styles.container}>
				<div className={styles.badge}>
					Founding-member pricing — limited time
				</div>

				<h2 className={styles.title}>Own Your Location History</h2>

				<p className={styles.subtitle}>
					Less than €1 a week to keep a lifetime of memories. Your data is always
					yours — export everything, anytime, on any plan.
				</p>

				<div className={styles.cardContainer}>
					<div className={styles.cardWrapper}>
						<PricingCard plan={PLANS.lite} />
					</div>
					<div className={styles.cardWrapper}>
						<PricingCard plan={PLANS.pro} popular />
					</div>
					<div className={styles.cardWrapper}>
						<PricingCard plan={PLANS.family} deemph />
					</div>
				</div>

				<div className={styles.bonus}>
					<div className={styles.bonusBadge}>Free Bonus · €99 value</div>
					<div className={styles.bonusText}>
						<strong>White-Glove Import Service.</strong> Send us your Google
						Takeout and we import your entire location history for you —
						usually within 24 hours. Included free with every plan.
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
						<strong>The Import Guarantee:</strong> if your Google Takeout
						doesn't import cleanly, we fix it personally — or refund every
						cent. Plus a 14-day no-questions money-back guarantee on every
						plan.{" "}
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
