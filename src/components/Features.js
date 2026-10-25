import content from '@locale-content/components/Features.json';
import { interpolate } from '@docusaurus/Interpolate';
import React, { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Features.module.css";
import useDialog from "./useDialog";

const RouteIcon = () => (
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
		<circle cx="6" cy="19" r="3" />
		<path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
		<circle cx="18" cy="5" r="3" />
	</svg>
);

const TabMapIcon = () => (
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
		<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
		<line x1="8" y1="2" x2="8" y2="18" />
		<line x1="16" y1="6" x2="16" y2="22" />
	</svg>
);

const BarChartIcon = () => (
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
		<line x1="12" y1="20" x2="12" y2="10" />
		<line x1="18" y1="20" x2="18" y2="4" />
		<line x1="6" y1="20" x2="6" y2="16" />
	</svg>
);

const GlobeIcon = () => (
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
		<circle cx="12" cy="12" r="10" />
		<line x1="2" y1="12" x2="22" y2="12" />
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</svg>
);

const CrosshairIcon = () => (
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
		<circle cx="12" cy="12" r="10" />
		<line x1="22" y1="12" x2="18" y2="12" />
		<line x1="6" y1="12" x2="2" y2="12" />
		<line x1="12" y1="6" x2="12" y2="2" />
		<line x1="12" y1="22" x2="12" y2="18" />
	</svg>
);

const features = [
	{
		id: "timeline",
		icon: <RouteIcon />,
		title: content.features[0].title,
		description:
			content.features[0].description,
		image: "/img/timeline.webp",
		className: "fullWidthCard",
	},
	{
		id: "map",
		icon: <TabMapIcon />,
		title: content.features[1].title,
		description:
			content.features[1].description,
		image: "/img/the_map.webp",
		className: "heroCard",
	},
	{
		id: "trips",
		icon: <RouteIcon />,
		title: content.features[2].title,
		description:
			content.features[2].description,
		image: "/img/features-trip-details.webp",
		className: "standardCard",
	},
	{
		id: "stats",
		icon: <BarChartIcon />,
		title: content.features[3].title,
		description:
			content.features[3].description,
		image: "/img/features-stats.png",
		className: "standardCard",
	},
	{
		id: "scratch-map",
		icon: <GlobeIcon />,
		title: content.features[4].title,
		description:
			content.features[4].description,
		image: "/img/features-scratch-map.png",
		className: "standardCard",
	},
	{
		id: "insights",
		icon: <BarChartIcon />,
		title: content.features[5].title,
		description:
			content.features[5].description,
		image: "/img/features-insights.png",
		className: "wideCard",
	},
];

export default function Features() {
	const [modalImage, setModalImage] = useState(null);

	const openModal = (image, title) => {
		setModalImage({ src: image, alt: title });
	};

	const closeModal = useCallback(() => setModalImage(null), []);

	const dialogRef = useDialog(Boolean(modalImage), closeModal);

	return (
		<section id="features" className={styles.featuresSection}>
			<div className={styles.container}>
				<h2 className={styles.title}>
					{content.title}
				</h2>
				<p className={styles.subtitle}>
					{content.subtitle}
				</p>

				<div className={styles.bentoGrid}>
					{features.map((feature) => (
						<button
							type="button"
							key={feature.id}
							className={`${styles.card} ${styles[feature.className]}`}
							onClick={() => openModal(feature.image, feature.title)}
							aria-label={interpolate(content.viewFullSize, { title: feature.title })}
						>
							<div className={styles.cardImageWrapper}>
								<img
									src={feature.image}
									alt={feature.title}
									className={styles.cardImage}
									loading="lazy"
									width="1600"
									height="900"
								/>
							</div>
							<div className={styles.cardOverlay}>
								<span className={styles.cardIcon}>{feature.icon}</span>
								<h3 className={styles.cardTitle}>{feature.title}</h3>
								<p className={styles.cardDescription}>{feature.description}</p>
							</div>
						</button>
					))}
				</div>
			</div>

			{modalImage &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						className={styles.imageModal}
						onClick={closeModal}
						ref={dialogRef}
						role="dialog"
						aria-modal="true"
						aria-label={modalImage.alt}
					>
						<button
							className={styles.closeButton}
							onClick={closeModal}
							aria-label={content.ariaLabel}
						>
							&times;
						</button>
						<img
							src={modalImage.src}
							alt={modalImage.alt}
							className={styles.modalImage}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>,
					document.body,
				)}
		</section>
	);
}
