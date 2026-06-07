import React, { useState } from "react";
import styles from "./WaitlistForm.module.css";

// --- Notifuse config (matches the newsletter form's approach) ---
const NOTIFUSE_ENDPOINT = "https://emails.dawarich.app/subscribe";
const WORKSPACE_ID = "dawarich";
// ----------------------------------------------------------------

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS = {
	idle: "idle",
	loading: "loading",
	success: "success",
	error: "error",
};

export default function WaitlistForm({
	listId,
	heading = null,
	subtext = null,
	buttonLabel = "Join the waitlist",
	note = "No spam — just the launch email.",
}) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState(STATUS.idle);
	const [message, setMessage] = useState("");

	const isLoading = status === STATUS.loading;

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

		try {
			const response = await fetch(NOTIFUSE_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					workspace_id: WORKSPACE_ID,
					contact: { email: trimmedEmail },
					list_ids: [listId],
				}),
			});

			let payload = {};
			try {
				payload = await response.json();
			} catch {
				payload = {};
			}

			if (!response.ok || payload.success !== true) {
				setStatus(STATUS.error);
				setMessage(payload.error || "Something went wrong. Please try again later.");
				return;
			}

			setStatus(STATUS.success);
			setMessage("You're on the list! We'll email you when Family launches.");
			setEmail("");
		} catch {
			setStatus(STATUS.error);
			setMessage("Network error. Please check your connection and try again.");
		}
	}

	if (status === STATUS.success) {
		return (
			<div className={styles.success} role="status" aria-live="polite">
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
				<span>{message}</span>
			</div>
		);
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			{(heading || subtext) && (
				<div className={styles.prompt}>
					{heading && <div className={styles.promptTitle}>{heading}</div>}
					{subtext && <p className={styles.promptText}>{subtext}</p>}
				</div>
			)}
			<input
				className={styles.input}
				type="email"
				name="email"
				autoComplete="email"
				placeholder="you@example.com"
				required
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				disabled={isLoading}
				aria-label="Email address"
				aria-invalid={status === STATUS.error}
			/>

			{status === STATUS.error && message && (
				<p className={styles.error} role="alert" aria-live="assertive">
					{message}
				</p>
			)}

			<button className={styles.button} type="submit" disabled={isLoading}>
				{isLoading ? (
					<>
						<span className={styles.spinner} aria-hidden="true" />
						Joining…
					</>
				) : (
					buttonLabel
				)}
			</button>

			<p className={styles.note}>{note}</p>
		</form>
	);
}
