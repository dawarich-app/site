import React, { useState } from "react";
import styles from "./NewsletterForm.module.css";

// --- Notifuse config — replace these with your own values ---
const NOTIFUSE_ENDPOINT = "https://emails.dawarich.app/subscribe";
const WORKSPACE_ID = "dawarich";
const LIST_IDS = ["dawarichnewsletter"];
// ------------------------------------------------------------

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS = {
	idle: "idle",
	loading: "loading",
	success: "success",
	error: "error",
};

export default function NewsletterForm() {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [status, setStatus] = useState(STATUS.idle);
	const [message, setMessage] = useState("");

	const isLoading = status === STATUS.loading;
	const isSuccess = status === STATUS.success;

	async function handleSubmit(event) {
		event.preventDefault();

		const trimmedEmail = email.trim();
		if (!EMAIL_PATTERN.test(trimmedEmail)) {
			setStatus(STATUS.error);
			setMessage("Please enter a valid email address.");
			return;
		}

		setStatus(STATUS.loading);
		setMessage("");

		const contact = { email: trimmedEmail };
		const trimmedFirstName = firstName.trim();
		if (trimmedFirstName) {
			contact.first_name = trimmedFirstName;
		}

		try {
			const response = await fetch(NOTIFUSE_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					workspace_id: WORKSPACE_ID,
					contact,
					list_ids: LIST_IDS,
				}),
			});

			let payload = {};
			try {
				payload = await response.json();
			} catch {
				payload = {};
			}

			if (!response.ok || payload.success !== true) {
				const errorText =
					payload.error || "Something went wrong. Please try again later.";
				setStatus(STATUS.error);
				setMessage(errorText);
				return;
			}

			setStatus(STATUS.success);
			setMessage("You're subscribed! Check your inbox to confirm.");
			setEmail("");
			setFirstName("");
		} catch {
			setStatus(STATUS.error);
			setMessage("Network error. Please check your connection and try again.");
		}
	}

	if (isSuccess) {
		return (
			<div className={styles.successPanel} role="status" aria-live="polite">
				<svg
					className={styles.successIcon}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
				<p className={styles.successText}>{message}</p>
			</div>
		);
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			<div className={styles.field}>
				<label className={styles.label} htmlFor="newsletter-first-name">
					First name <span className={styles.optional}>(optional)</span>
				</label>
				<input
					id="newsletter-first-name"
					className={styles.input}
					type="text"
					name="first_name"
					autoComplete="given-name"
					placeholder="Evgenii"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					disabled={isLoading}
				/>
			</div>

			<div className={styles.field}>
				<label className={styles.label} htmlFor="newsletter-email">
					Email <span className={styles.required}>*</span>
				</label>
				<input
					id="newsletter-email"
					className={styles.input}
					type="email"
					name="email"
					autoComplete="email"
					placeholder="you@example.com"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading}
					aria-invalid={status === STATUS.error}
				/>
			</div>

			{status === STATUS.error && message && (
				<p className={styles.errorText} role="alert" aria-live="assertive">
					{message}
				</p>
			)}

			<button className={styles.button} type="submit" disabled={isLoading}>
				{isLoading ? (
					<>
						<span className={styles.spinner} aria-hidden="true" />
						Subscribing…
					</>
				) : (
					"Subscribe"
				)}
			</button>

			<p className={styles.privacyNote}>
				No spam. Unsubscribe anytime.
			</p>
		</form>
	);
}
