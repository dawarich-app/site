import Link from "@docusaurus/Link";
import React from "react";
import styles from "./Hero.module.css";

const ArrowRightIcon = () => (
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
		<line x1="5" y1="12" x2="19" y2="12" />
		<polyline points="12 5 19 12 12 19" />
	</svg>
);

const MapPinIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);

export default function LandingHero({
	badge,
	title,
	titleHighlight,
	subtitle,
	primaryCta,
	secondaryCta,
	disclaimer,
	imageSrc,
	imageAlt,
}) {
	return (
		<section className={styles.hero}>
			<div className={styles.meshBlob1} />
			<div className={styles.meshBlob2} />
			<div className={styles.meshBlob3} />

			<div className={styles.container}>
				<div className={styles.textColumn}>
					{badge && (
						<div className={styles.badge} style={{ animationDelay: "0s" }}>
							<MapPinIcon />
							<span>{badge}</span>
						</div>
					)}

					<h1 className={styles.title} style={{ animationDelay: "0.1s" }}>
						{title}
						{titleHighlight && (
							<>
								{" "}
								<span className={styles.highlight}>{titleHighlight}</span>
							</>
						)}
					</h1>

					{subtitle && (
						<p className={styles.subtitle} style={{ animationDelay: "0.2s" }}>
							{subtitle}
						</p>
					)}

					<div className={styles.buttons} style={{ animationDelay: "0.3s" }}>
						<Link className={styles.primaryButton} href={primaryCta.href}>
							{primaryCta.text}
							<span className={styles.arrow}>
								<ArrowRightIcon />
							</span>
						</Link>
						{secondaryCta && (
							<Link
								className={styles.secondaryButton}
								href={secondaryCta.href}
							>
								{secondaryCta.text}
							</Link>
						)}
					</div>

					{disclaimer && (
						<p className={styles.noCredit} style={{ animationDelay: "0.4s" }}>
							{disclaimer}
						</p>
					)}
				</div>

				{imageSrc && (
					<div className={styles.imageColumn}>
						<div className={styles.heroImageContainer}>
							<img
								src={imageSrc}
								alt={imageAlt || ""}
								className={styles.heroImage}
							/>
							<div className={styles.imageFadeOverlay} />
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
