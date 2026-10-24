import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/components/PricingSection.json';
import RichText from '@site/src/i18n/RichText';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import React from "react";
import { PLANS } from "@site/src/data/pricingPlans";
import PricingCard from "./PricingCard";
import styles from "./PricingSection.module.css";

export default function PricingSection() {
	return (
		<section id="pricing" className={styles.section}>
			<div className={styles.container}>
				<div className={styles.badge}>
					{content.badge}
				</div>

				<h2 className={styles.title}>{content.title}</h2>

				<p className={styles.subtitle}>
					{interpolate(content.subtitle, { price: "€5" })}
				</p>

				<div className={styles.cardContainer}>
					<div className={styles.cardWrapper}>
						<PricingCard plan={PLANS.lite} />
					</div>
					<div className={styles.cardWrapper}>
						<PricingCard plan={PLANS.pro} popular />
					</div>
					<div className={styles.cardWrapper}>
						<PricingCard plan={PLANS.family} />
					</div>
				</div>

				<div className={styles.bonus}>
					<div className={styles.bonusBadge}>{interpolate(content.bonusBadge, { price: "€99" })}</div>
					<div className={styles.bonusText}>
						<RichText text={content.bonusDescription} />
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
						<RichText text={content.guaranteeDescription} />{" "}
						<EnOnlyLink to="/refund-policy" className={styles.guaranteeLink}>
							{content.guaranteeLink}
						</EnOnlyLink>
					</div>
				</div>
			</div>

			<div className={styles.selfHostContainer}>
				<EnOnlyLink to="/docs/self-hosting/introduction" className={styles.selfHostButton}>
					{content.selfHostButton}
				</EnOnlyLink>
			</div>
		</section>
	);
}
