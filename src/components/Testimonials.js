import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { SmartLink } from '@site/src/i18n/RichText';
import { DEFAULT_LOCALE } from '@site/src/i18n/locales';
import content from '@locale-content/components/Testimonials.json';
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
		quote: content.quotes[0].quote,
		author: "Megan Ellis",
		source: content.quotes[0].source,
		url: "https://www.xda-developers.com/import-google-timeline-dawarich/",
		type: "press",
	},
	{
		quote: content.quotes[1].quote,
		author: "Jayric Maning",
		source: content.quotes[1].source,
		url: "https://www.makeuseof.com/i-use-free-open-source-app-track-everywhere-ive-been-without-google/",
		type: "press",
	},
	{
		quote: content.quotes[2].quote,
		author: "P@tr!ck3",
		source: content.quotes[2].source,
		url: "https://apps.apple.com/us/app/dawarich/id6739544999",
		rating: 4,
		type: "review",
	},
	{
		quote: content.quotes[3].quote,
		author: "Andreas",
		source: content.quotes[3].source,
		type: "customer",
	},
	{
		quote: content.quotes[4].quote,
		author: "Manuel Torres",
		source: content.quotes[4].source,
		type: "customer",
	},
	{
		quote: content.quotes[5].quote,
		author: "Roman Bogdanov",
		source: content.quotes[5].source,
		type: "customer",
	},
	{
		quote: content.quotes[6].quote,
		author: "Danielson89",
		source: content.quotes[6].source,
		url: "https://github.com/Freika/dawarich/discussions/887",
		type: "community",
	},
	{
		quote: content.quotes[7].quote,
		author: "NotGoingToBe",
		source: content.quotes[7].source,
		url: "https://apps.apple.com/us/app/dawarich/id6739544999",
		rating: 5,
		type: "review",
	},
	{
		quote: content.quotes[8].quote,
		author: "Pawan",
		source: content.quotes[8].source,
		url: "https://blog.colocataires.dev/posts/07-dawarich/",
		type: "press",
	},
];

export default function Testimonials() {
	const { i18n } = useDocusaurusContext();
	const translated = i18n.currentLocale !== DEFAULT_LOCALE;
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h2 className={styles.title}>{content.title}</h2>
				<p className={styles.subtitle}>
					{content.subtitle}
				</p>

				<div className={styles.featuredIn}>
					<span className={styles.featuredLabel}>{content.featuredLabel}</span>
					<div className={styles.featuredLogos}>
						{featuredIn.map((pub) => (
							<SmartLink
								key={pub.name}
								href={pub.url}
								className={styles.featuredLogo}
							>
								<span style={pub.style}>{pub.name}</span>
							</SmartLink>
						))}
					</div>
				</div>

				<div className={styles.grid}>
					{testimonials.map((t, i) => {
						const CardElement = t.url ? SmartLink : "div";
						const linkProps = t.url
							? { href: t.url }
							: {};
						return (
							<CardElement key={i} className={styles.card} {...linkProps}>
								<div className={styles.quoteIcon}>
									<QuoteIcon />
								</div>
								<p className={styles.quote}>{t.quote}</p>
								<div className={styles.footer}>
									{t.rating && <StarRating />}
									<div className={styles.author}>
										<span className={styles.authorName}>{t.author}</span>
										<span className={styles.source}>{t.source}</span>
										{translated && <span className={styles.translatedNote}>{content.translatedNote}</span>}
									</div>
								</div>
							</CardElement>
						);
					})}
				</div>
			</div>
		</section>
	);
}
