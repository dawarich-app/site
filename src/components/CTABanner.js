import content from '@locale-content/components/CTABanner.json';
import { SmartLink } from '@site/src/i18n/RichText';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import React from "react";
import styles from "./CTABanner.module.css";

export default function CTABanner() {
	return (
		<section className={styles.banner}>
			<div className={styles.content}>
				<h2 className={styles.headline}>
					{content.headline}
				</h2>
				<div className={styles.buttons}>
					<SmartLink
						className={styles.primaryButton}
						href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=cta_banner&utm_campaign=try7days"
					>
						{content.primaryButton}
					</SmartLink>
					<EnOnlyLink className={styles.ghostButton} to="/docs/intro">
						{content.ghostButton}
					</EnOnlyLink>
				</div>
				<p className={styles.reassurance}>
					{content.reassurance}
				</p>
			</div>
		</section>
	);
}
