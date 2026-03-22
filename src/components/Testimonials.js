import React from "react";
import styles from "./Testimonials.module.css";

const QuoteIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		opacity="0.15"
	>
		<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
	</svg>
);

const StarRating = () => (
	<div className={styles.stars}>
		{[1, 2, 3, 4, 5].map((i) => (
			<svg
				key={i}
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
			</svg>
		))}
	</div>
);

const featuredIn = [
	{
		name: "XDA Developers",
		url: "https://www.xda-developers.com/import-google-timeline-dawarich/",
		style: { fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" },
	},
	{
		name: "MakeUseOf",
		url: "https://www.makeuseof.com/i-use-free-open-source-app-track-everywhere-ive-been-without-google/",
		style: { fontFamily: "'Inter', sans-serif", fontWeight: 800 },
	},
	{
		name: "c't Magazine",
		url: "https://www.heise.de/select/ct/",
		style: { fontFamily: "'Georgia', serif", fontWeight: 700, fontStyle: "italic" },
	},
	{
		name: "It's FOSS",
		url: "https://itsfoss.com/",
		style: { fontFamily: "'Inter', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" },
	},
];

const testimonials = [
	{
		quote:
			"I imported my Google Timeline to this self-hosted app, and it's so much better than what Google offers.",
		author: "Megan Ellis",
		source: "XDA Developers",
		url: "https://www.xda-developers.com/import-google-timeline-dawarich/",
		type: "press",
	},
	{
		quote:
			"Dawarich gives you everything Google Timeline does, and then some. There are no ads and no hidden data collection.",
		author: "Jayric Maning",
		source: "MakeUseOf",
		url: "https://www.makeuseof.com/i-use-free-open-source-app-track-everywhere-ive-been-without-google/",
		type: "press",
	},
	{
		quote: "The UI is clean and user friendly. Basically no impact on battery.",
		author: "P@tr!ck3",
		source: "App Store Review",
		url: "https://apps.apple.com/us/app/dawarich/id6739544999",
		rating: 4,
		type: "review",
	},
	{
		quote:
			"It's way better than OwnTracks, Overland, etc. — it's so much more accurate.",
		author: "Danielson89",
		source: "GitHub Discussions",
		url: "https://github.com/Freika/dawarich/discussions/887",
		type: "community",
	},
	{
		quote:
			"The app has been working great for me so far and hasn't had any effect on battery! Amazing job thus far!",
		author: "NotGoingToBe",
		source: "App Store Review",
		url: "https://apps.apple.com/us/app/dawarich/id6739544999",
		rating: 5,
		type: "review",
	},
	{
		quote: "I think it's a rather impressive piece of software.",
		author: "Pawan",
		source: "Colocataires Blog",
		url: "https://blog.colocataires.dev/posts/07-dawarich/",
		type: "press",
	},
];

export default function Testimonials() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h2 className={styles.title}>What People Are Saying</h2>
				<p className={styles.subtitle}>
					Featured in leading tech publications worldwide.
				</p>

				<div className={styles.featuredIn}>
					<span className={styles.featuredLabel}>As seen in</span>
					<div className={styles.featuredLogos}>
						{featuredIn.map((pub) => (
							<a
								key={pub.name}
								href={pub.url}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.featuredLogo}
								style={pub.style}
							>
								{pub.name}
							</a>
						))}
					</div>
				</div>

				<div className={styles.grid}>
					{testimonials.map((t, i) => (
						<a
							key={i}
							className={styles.card}
							href={t.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className={styles.quoteIcon}>
								<QuoteIcon />
							</div>
							<p className={styles.quote}>{t.quote}</p>
							<div className={styles.footer}>
								{t.rating && <StarRating />}
								<div className={styles.author}>
									<span className={styles.authorName}>{t.author}</span>
									<span className={styles.source}>{t.source}</span>
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
