import Link from "@docusaurus/Link";
import React from "react";
import styles from "./FinalCTA.module.css";
import NewsletterForm from "./NewsletterForm";

export default function FinalCTA() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.grid}>
					{/* Left Column: CTA */}
					<div className={styles.ctaColumn}>
						<h2 className={styles.title}>
							Your location history is yours. Keep it that way.
						</h2>
						<p className={styles.subtitle}>
							Import your Google Timeline data before it's gone. Start with a
							7-day free trial, cancel anytime.
						</p>
						<Link
							to="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=final_cta&utm_campaign=try7days"
							className={styles.primaryButton}
						>
							Save Your Location History
						</Link>
					</div>

					{/* Right Column: Newsletter */}
					<div className={styles.newsletterColumn}>
						<h3 className={styles.newsletterTitle}>Stay Updated</h3>
						<p className={styles.newsletterSubtitle}>
							Get notified about new features and Google Timeline migration
							tips.
						</p>
						<NewsletterForm />
					</div>
				</div>
			</div>
		</section>
	);
}
