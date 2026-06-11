import Link from "@docusaurus/Link";
import React, { useState } from "react";
import { DwIcon } from "@site/src/data/pricingPlans";
import WaitlistForm from "./WaitlistForm";
import styles from "./PricingCard.module.css";

export default function PricingCard({ plan, popular = false, deemph = false }) {
	const [billing, setBilling] = useState("annual");
	const isPro = plan.key === "pro";
	const monthly = isPro && billing === "monthly";
	const bigPrice = monthly ? plan.priceMonthly : plan.price;
	const bigPeriod = monthly ? plan.periodMonthly : plan.period;

	const cardClass = [
		styles.card,
		plan.accent === "teal" ? styles.accentTeal : styles.accentBlue,
		popular ? styles.popular : "",
		deemph ? styles.deemph : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={cardClass}>
			{popular && <div className={styles.mapWash} aria-hidden="true" />}

			{popular && (
				<div className={styles.ribbon}>
					<DwIcon name="sparkles" size={12} stroke={2.4} /> MOST POPULAR
				</div>
			)}
			{deemph && <div className={styles.comingSoon}>COMING SOON</div>}

			<div className={styles.header}>
				<span className={styles.planIcon}>
					<DwIcon name={plan.icon} size={20} stroke={2} />
				</span>
				<span className={styles.planName}>{plan.name}</span>
			</div>

			{plan.price && (
				<div className={styles.priceBlock}>
					<div className={styles.priceTopRow}>
						{plan.oldPrice && !monthly && (
							<span className={styles.oldPrice}>&euro;{plan.oldPrice}</span>
						)}
						{isPro && plan.save && !monthly && (
							<span className={styles.saveBadge}>
								<DwIcon name="trending-up" size={12} stroke={2.4} /> {plan.save}
							</span>
						)}
					</div>
					<div className={styles.priceMainRow}>
						<span className={styles.currency}>&euro;</span>
						<span className={styles.bigPrice}>{bigPrice}</span>
						<span className={styles.period}>{bigPeriod}</span>
					</div>
					<div className={styles.perMonth}>
						{monthly ? "billed monthly" : plan.perMonth}
					</div>
				</div>
			)}

			{isPro && (
				<div className={styles.toggleRow}>
					<div className={styles.toggleTrack}>
						{["monthly", "annual"].map((opt) => (
							<button
								key={opt}
								type="button"
								className={`${styles.toggleBtn} ${billing === opt ? styles.toggleActive : ""}`}
								onClick={() => setBilling(opt)}
							>
								{opt}
							</button>
						))}
					</div>
					{billing === "monthly" && (
						<span className={styles.toggleHint}>Save 44% on annual &rarr;</span>
					)}
				</div>
			)}

			{plan.urgency && (
				<div className={styles.urgency}>
					<DwIcon name="lock" size={15} stroke={2} className={styles.urgencyIcon} />
					<span>{plan.urgency}</span>
				</div>
			)}

			{(monthly ? plan.perDayMonthly : plan.perDay) && (
				<div className={styles.perDay}>
					<DwIcon name="zap" size={13} stroke={2.4} />{" "}
					{monthly ? plan.perDayMonthly : plan.perDay}
				</div>
			)}

			<p className={styles.tagline}>{plan.tagline}</p>

			<div className={styles.divider} />

			{plan.featuresHeading && (
				<div className={styles.featuresHeading}>{plan.featuresHeading}</div>
			)}

			<ul className={styles.features}>
				{plan.features.map((f, i) => (
					<li key={i} className={styles.featureRow}>
						<span className={styles.featureChip}>
							<DwIcon name={f.icon} size={15} stroke={2} />
						</span>
						<span className={styles.featureLabel}>{f.label}</span>
					</li>
				))}
			</ul>

			{plan.valueStack && (
				<div className={styles.valueStack}>
					{plan.valueStack.items.map((item, i) => (
						<div key={i} className={styles.valueRow}>
							<span className={item.bonus ? styles.valueBonus : ""}>
								{item.bonus ? "BONUS: " : ""}
								{item.label}
							</span>
							<span className={styles.valueAmount}>&euro;{item.value}</span>
						</div>
					))}
					<div className={styles.valueTotalRow}>
						<span>Total value</span>
						<span className={styles.valueTotal}>
							&euro;{plan.valueStack.total}
						</span>
					</div>
					<div className={styles.valuePayLine}>{plan.valueStack.payLine}</div>
				</div>
			)}

			<div className={styles.spacer} />

			{plan.waitlistListId ? (
				<WaitlistForm
					listId={plan.waitlistListId}
					heading="Join the Family waitlist"
					subtext="Be first to know the moment it launches — annual only, every Pro feature."
					buttonLabel="Join the waitlist"
					note="No spam, just the launch email."
				/>
			) : (
				<>
					<div className={styles.guarantee}>
						<DwIcon name="shield-check" size={15} stroke={2} /> The Import
						Guarantee &middot; 14-day money-back
					</div>

					<Link
						to={plan.href}
						className={`${styles.cta} ${plan.ctaStyle === "primary" ? styles.ctaPrimary : styles.ctaOutline}`}
					>
						{plan.cta}
					</Link>

					<div className={styles.footnote}>{plan.footnote}</div>
				</>
			)}
		</div>
	);
}
