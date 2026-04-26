import Link from "@docusaurus/Link";
import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Hero.module.css";

const GoogleIcon = () => (
	<svg width="18" height="18" viewBox="0 0 48 48">
		<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
		<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
		<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
		<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
	</svg>
);


// SVG Icons as components
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

const PlayIcon = () => (
	<svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="none">
		<polygon points="5 3 19 12 5 21 5 3" />
	</svg>
);

export default function Hero() {
	const [modalOpen, setModalOpen] = useState(false);
	const modalVideoRef = useRef(null);

	const scrollToFeatures = () => {
		document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
	};

	const openModal = useCallback(() => {
		setModalOpen(true);
		document.body.style.overflow = "hidden";
	}, []);

	const closeModal = useCallback(() => {
		setModalOpen(false);
		document.body.style.overflow = "";
		if (modalVideoRef.current) {
			modalVideoRef.current.pause();
		}
	}, []);

	return (
		<section className={styles.hero}>
			{/* Mesh gradient blobs */}
			<div className={styles.meshBlob1} />
			<div className={styles.meshBlob2} />
			<div className={styles.meshBlob3} />

			<div className={styles.container}>
				<div className={styles.textColumn}>
					<div className={styles.badge} style={{ animationDelay: "0s" }}>
						<MapPinIcon />
						<span>The Private Alternative to Google Timeline</span>
					</div>

					<h1 className={styles.title} style={{ animationDelay: "0.1s" }}>
						Your Timeline, <span className={styles.highlight}>Forever</span>
					</h1>

					<p className={styles.subtitle} style={{ animationDelay: "0.2s" }}>
						Google killed browser Timeline and is limiting data retention.
						Import your entire location history into Dawarich in minutes —
						private, encrypted, yours. No ads. No data selling.
					</p>

					<div className={styles.buttons} style={{ animationDelay: "0.3s" }}>
						<Link
							className={styles.primaryButton}
							href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=hero&utm_campaign=hero"
						>
							Import My Google Data
							<span className={styles.arrow}>
								<ArrowRightIcon />
							</span>
						</Link>
						<button
							className={styles.secondaryButton}
							onClick={scrollToFeatures}
						>
							Explore Features
						</button>
					</div>

					<div className={styles.googleSignIn} style={{ animationDelay: "0.35s" }}>
						<span className={styles.orDivider}>or</span>
						<a
							href="https://my.dawarich.app/users/sign_in"
							className={`${styles.googleButton} ${styles.googleForm}`}
						>
							<GoogleIcon />
							<span>Sign in with Google</span>
						</a>
					</div>

					<p className={styles.noCredit} style={{ animationDelay: "0.4s" }}>
						7-day free trial · Cancel anytime · Your data stays yours
					</p>
				</div>

				<div className={styles.imageColumn}>
					<div
						className={styles.heroImageContainer}
						onClick={openModal}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => e.key === "Enter" && openModal()}
					>
						<video
							autoPlay
							loop
							muted
							playsInline
							className={styles.heroVideo}
							poster="/img/the_map.png"
						>
							<source src="/hero-video.mp4" type="video/mp4" />
						</video>
						<div className={styles.imageFadeOverlay} />
						<div className={styles.playButton}>
							<PlayIcon />
						</div>
					</div>
				</div>
			</div>

			{modalOpen &&
				typeof document !== "undefined" &&
				createPortal(
					<div className={styles.videoModal} onClick={closeModal}>
						<button
							className={styles.modalClose}
							onClick={closeModal}
							aria-label="Close video"
						>
							&times;
						</button>
						<div
							className={styles.modalContent}
							onClick={(e) => e.stopPropagation()}
						>
							<video
								ref={modalVideoRef}
								autoPlay
								controls
								playsInline
								className={styles.modalVideo}
							>
								<source src="/hero-video.mp4" type="video/mp4" />
							</video>
						</div>
					</div>,
					document.body,
				)}
		</section>
	);
}
