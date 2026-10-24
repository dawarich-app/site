import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/components/FAQ.json';
import RichText from '@site/src/i18n/RichText';
import React, { useState } from "react";
import styles from "./FAQ.module.css";

const faqData = [
	{
		question: content.faqData[0].question,
		answer:
			interpolate(content.faqData[0].answer, { price: "€0.16" }),
	},
	{
		question: content.faqData[1].question,
		answer:
			content.faqData[1].answer,
	},
	{
		question: content.faqData[2].question,
		answer:
			content.faqData[2].answer,
	},
	{
		question: content.faqData[3].question,
		answer:
			content.faqData[3].answer,
	},
	{
		question: content.faqData[4].question,
		answer:
			content.faqData[4].answer,
	},
	{
		question: content.faqData[5].question,
		answer:
			content.faqData[5].answer,
	},
	{
		question: content.faqData[6].question,
		answer:
			content.faqData[6].answer,
	},
	{
		question: content.faqData[7].question,
		answer:
			content.faqData[7].answer,
	},
	{
		question: content.faqData[8].question,
		answer:
			content.faqData[8].answer,
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
				<span><RichText text={question} /></span>
				<ChevronIcon isOpen={isOpen} />
			</button>
			<div
				className={`${styles.answerWrapper} ${isOpen ? styles.answerWrapperOpen : ""}`}
			>
				<div className={styles.answer}><RichText text={answer} /></div>
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
				<h2 className={styles.title}>{content.title}</h2>
				<p className={styles.subtitle}>
					{content.subtitle}
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
