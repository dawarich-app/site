import Link from "@docusaurus/Link";
import React from "react";
import styles from "./PrivacySection.module.css";

const NoAdsIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
		<line
			x1="4.93"
			y1="4.93"
			x2="19.07"
			y2="19.07"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M12 8V12L15 15"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const SelfHostIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			x="2"
			y="3"
			width="20"
			height="4"
			rx="1"
			stroke="currentColor"
			strokeWidth="2"
		/>
		<rect
			x="2"
			y="9"
			width="20"
			height="4"
			rx="1"
			stroke="currentColor"
			strokeWidth="2"
		/>
		<rect
			x="2"
			y="15"
			width="20"
			height="4"
			rx="1"
			stroke="currentColor"
			strokeWidth="2"
		/>
		<line
			x1="6"
			y1="5"
			x2="6.01"
			y2="5"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<line
			x1="6"
			y1="11"
			x2="6.01"
			y2="11"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<line
			x1="6"
			y1="17"
			x2="6.01"
			y2="17"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

const OpenSourceIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M16 18L22 12L16 6"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M8 6L2 12L8 18"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<line
			x1="14"
			y1="4"
			x2="10"
			y2="20"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

const ShieldIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 22S4 18 4 12V6L12 2L20 6V12C20 18 12 22 12 22Z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M9 12L11 14L15 10"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default function PrivacySection() {
	return (
		<section className={styles.privacySection}>
			<div className={styles.container}>
				<h2 className={styles.title}>The Anti-Google Privacy Stack</h2>
				<p className={styles.subtitle}>
					Google uses your location to sell ads. We charge you money instead.
					That's the entire business model.
				</p>

				<div className={styles.grid}>
					<div className={styles.privacyCard}>
						<div className={styles.iconWrapper}>
							<NoAdsIcon />
						</div>
						<div>
							<h3 className={styles.cardTitle}>
								No Ads. No Data Selling. Ever.
							</h3>
							<p className={styles.cardDescription}>
								Your data funds Google's $300B ad business. At Dawarich, your
								location data is the product you're buying — not the product
								we're selling.
							</p>
						</div>
					</div>

					<div className={styles.privacyCard}>
						<div className={styles.iconWrapper}>
							<SelfHostIcon />
						</div>
						<div>
							<h3 className={styles.cardTitle}>
								Self-Host: Zero Trust Required
							</h3>
							<p className={styles.cardDescription}>
								Don't trust anyone with your data? Run Dawarich on your own
								server. Your data never touches our infrastructure. We literally
								cannot see it.
							</p>
						</div>
					</div>

					<div className={styles.privacyCard}>
						<div className={styles.iconWrapper}>
							<ShieldIcon />
						</div>
						<div>
							<h3 className={styles.cardTitle}>Encrypted and EU-Hosted</h3>
							<p className={styles.cardDescription}>
								All data encrypted in transit (SSL/TLS) and at rest (LUKS).
								Stored in European data centers under strict GDPR regulations.
								You have full control over your data.
							</p>
						</div>
					</div>

					<div className={styles.privacyCard}>
						<div className={styles.iconWrapper}>
							<OpenSourceIcon />
						</div>
						<div>
							<h3 className={styles.cardTitle}>
								Open Source: Inspect Every Line
							</h3>
							<p className={styles.cardDescription}>
								Don't trust us? Read the code. 8,300+ GitHub stars. Thousands of
								developers have reviewed it. No hidden tracking. No surprises.
							</p>
						</div>
					</div>
				</div>

				<div className={styles.policyLinkContainer}>
					<Link to="/privacy-policy" className={styles.policyLink}>
						Read our full Privacy Policy →
					</Link>
				</div>
			</div>
		</section>
	);
}
