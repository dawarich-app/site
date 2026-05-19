import Link from "@docusaurus/Link";
import React from "react";
import styles from "./PrivacySection.module.css";

const lucideProps = {
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	xmlns: "http://www.w3.org/2000/svg",
};

const NoAdsIcon = () => (
	<svg {...lucideProps}>
		<circle cx="12" cy="12" r="10" />
		<path d="m4.9 4.9 14.2 14.2" />
	</svg>
);

const SelfHostIcon = () => (
	<svg {...lucideProps}>
		<rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
		<rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
		<line x1="6" x2="6.01" y1="6" y2="6" />
		<line x1="6" x2="6.01" y1="18" y2="18" />
	</svg>
);

const OpenSourceIcon = () => (
	<svg {...lucideProps}>
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
		<path d="M9 18c-4.51 2-5-2-7-2" />
	</svg>
);

const ShieldIcon = () => (
	<svg {...lucideProps}>
		<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
		<path d="m9 12 2 2 4-4" />
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
								Don't trust us? Read the code. OVER 9,000 GitHub stars. Thousands of
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
