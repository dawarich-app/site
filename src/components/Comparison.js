import React from "react";
import styles from "./Comparison.module.css";

const CheckIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d="M13.5 4.5L6.5 12L2.5 8"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const CrossIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d="M12 4L4 12M4 4L12 12"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const PartialIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d="M3 8H13"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

const rows = [
	{
		feature: "Browser access",
		google: "removed",
		dawarich: "yes",
		googleLabel: "Killed (mobile only)",
		dawarichLabel: "Full web app",
	},
	{
		feature: "Data retention",
		google: "partial",
		dawarich: "yes",
		googleLabel: "Limited (auto-deletes)",
		dawarichLabel: "Forever (Pro)",
	},
	{
		feature: "Your data used for ads",
		google: "bad",
		dawarich: "no",
		googleLabel: "Yes",
		dawarichLabel: "Never",
	},
	{
		feature: "Data sold to third parties",
		google: "bad",
		dawarich: "no",
		googleLabel: "Yes (ad network)",
		dawarichLabel: "Never",
	},
	{
		feature: "Export your data",
		google: "partial",
		dawarich: "yes",
		googleLabel: "Partial, complex",
		dawarichLabel: "One-click, any format",
	},
	{
		feature: "Self-host option",
		google: "removed",
		dawarich: "yes",
		googleLabel: "No",
		dawarichLabel: "Yes — full control",
	},
	{
		feature: "Open source",
		google: "removed",
		dawarich: "yes",
		googleLabel: "No",
		dawarichLabel: "Yes — inspect every line",
	},
	{
		feature: "Works if company kills the product",
		google: "removed",
		dawarich: "yes",
		googleLabel: "No",
		dawarichLabel: "Yes (self-host lives on)",
	},
];

function StatusIcon({ status }) {
	if (status === "yes" || status === "no") {
		return (
			<span className={styles.iconGreen}>
				<CheckIcon />
			</span>
		);
	}
	if (status === "partial") {
		return (
			<span className={styles.iconYellow}>
				<PartialIcon />
			</span>
		);
	}
	return (
		<span className={styles.iconRed}>
			<CrossIcon />
		</span>
	);
}

export default function Comparison() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h2 className={styles.title}>Google Timeline vs Dawarich</h2>
				<p className={styles.subtitle}>
					See what you're gaining when you make the switch.
				</p>

				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th className={styles.featureHeader}>Feature</th>
								<th className={styles.googleHeader}>Google Timeline</th>
								<th className={styles.dawarichHeader}>Dawarich</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={row.feature} className={styles.row}>
									<td className={styles.featureCell}>{row.feature}</td>
									<td className={styles.googleCell}>
										<StatusIcon status={row.google} />
										<span>{row.googleLabel}</span>
									</td>
									<td className={styles.dawarichCell}>
										<StatusIcon status={row.dawarich} />
										<span>{row.dawarichLabel}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
