import React, { useState } from "react";
import styles from "./FAQ.module.css";

const faqData = [
	{
		question: "Why should I pay when Google Timeline is free?",
		answer:
			'Google Timeline is "free" because your location data funds their $300B ad business. With Dawarich, you pay a small fee and your data stays private — no ads, no tracking, no data selling. At less than \u20AC0.14/day on Lite, you\'re buying back your privacy.',
	},
	{
		question: "How do I import my Google Timeline data?",
		answer:
			"Export your location history from Google Takeout and import it directly into Dawarich. The process takes just a few minutes, and years of historical data will appear on your interactive map immediately.",
	},
	{
		question: "Will Dawarich disappear like other startups?",
		answer:
			"Dawarich is open source with 8,400+ GitHub stars. Even if the company shut down tomorrow, your self-hosted instance keeps running and your data exports to standard formats (GPX, GeoJSON). You are never locked in.",
	},
	{
		question: "Is my data really private?",
		answer:
			"On our cloud service, data is encrypted in transit and at rest, stored in European data centers with full GDPR compliance. Want zero trust? Self-host it — your data never touches our servers. Either way, we never sell data or show ads.",
	},
	{
		question: "What if Google changes their export format?",
		answer:
			"We actively maintain importers for Google's data formats. When they change (and they do), we update within days. Our open-source community of thousands of developers helps catch format changes fast.",
	},
	{
		question: "What mobile apps are supported?",
		answer:
			"Dawarich has official apps for both iOS and Android with background location tracking and minimal battery impact. You can also use OwnTracks, GPSLogger, Overland, and other compatible tracking apps.",
	},
	{
		question: "Can I export my data?",
		answer:
			"Yes, you can export all your location data at any time in multiple formats (GPX, GeoJSON). Even on the Lite plan, exports include your full history — not just the 12-month viewing window. You're never locked in.",
	},
	{
		question: "Is there a free trial?",
		answer:
			"Yes! Dawarich Cloud offers a 7-day free trial with no credit card required. Import your Google data, explore the maps, and see if it's right for you — risk-free. You can also self-host for free with all features included.",
	},
];

function ChevronIcon({ isOpen }) {
	return (
		<svg
			className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5 7.5L10 12.5L15 7.5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function FAQItem({ question, answer, isOpen, onClick }) {
	return (
		<div className={styles.faqItem}>
			<button className={styles.question} onClick={onClick}>
				<span>{question}</span>
				<ChevronIcon isOpen={isOpen} />
			</button>
			<div
				className={`${styles.answerWrapper} ${isOpen ? styles.answerWrapperOpen : ""}`}
			>
				<div className={styles.answer}>{answer}</div>
			</div>
		</div>
	);
}

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState(null);

	const handleToggle = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className={styles.faqSection}>
			<div className={styles.container}>
				<h2 className={styles.title}>Frequently Asked Questions</h2>
				<p className={styles.subtitle}>
					Everything you need to know about Dawarich.
				</p>
				<div className={styles.faqList}>
					{faqData.map((item, index) => (
						<FAQItem
							key={index}
							question={item.question}
							answer={item.answer}
							isOpen={openIndex === index}
							onClick={() => handleToggle(index)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
