import Link from "@docusaurus/Link";
import React from "react";
import styles from "./FinalCTA.module.css";

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
						<iframe
							width="540"
							height="500"
							src="https://475728ae.sibforms.com/serve/MUIFAJLZJwZyy-W4PJAFc573ygtVeBn5fgINSOiVsmxzDKkjxeC96kVh_EVbvVN-hW4wCbGvIAPzrujZeSPpPbwUAXLZJfmGXHdmWG0208oNcTG4B20KmYDGdFhxs9Bos4UdurRT8dkzD_NjdRoMqg4A1_yAtpB5mHDbP_lT5mHAQIiamOmMomRSCEWWnFyk24LKJ6DqyhJze0By"
							frameBorder="0"
							scrolling="no"
							allowFullScreen
							className={styles.newsletterIframe}
							title="Newsletter signup"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
