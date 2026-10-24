import content from '@locale-content/components/FinalCTA.json';
import { SmartLink } from '@site/src/i18n/RichText';
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
							{content.title}
						</h2>
						<p className={styles.subtitle}>
							{content.subtitle}
						</p>
						<SmartLink
							href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=final_cta&utm_campaign=try7days"
							className={styles.primaryButton}
						>
							{content.primaryButton}
						</SmartLink>
					</div>

					{/* Right Column: Newsletter */}
					<div className={styles.newsletterColumn}>
						<h3 className={styles.newsletterTitle}>{content.newsletterTitle}</h3>
						<p className={styles.newsletterSubtitle}>
							{content.newsletterSubtitle}
						</p>
						<NewsletterForm />
					</div>
				</div>
			</div>
		</section>
	);
}
