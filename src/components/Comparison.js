import React from "react";
import { DwIcon } from "@site/src/data/pricingPlans";
import styles from "./Comparison.module.css";

// Content unchanged — restyled to match the new pricing section.
const VERSUS_ROWS = [
	{ feature: "Browser access", g: { mark: "x", text: "Killed (mobile only)" }, d: { mark: "check", text: "Full web app" } },
	{ feature: "Data retention", g: { mark: "minus", text: "Limited (auto-deletes)" }, d: { mark: "check", text: "Forever (Pro)" } },
	{ feature: "Your data used for ads", g: { mark: "x", text: "Yes" }, d: { mark: "check", text: "Never" } },
	{ feature: "Data sold to third parties", g: { mark: "x", text: "Yes (ad network)" }, d: { mark: "check", text: "Never" } },
	{ feature: "Export your data", g: { mark: "minus", text: "Partial, complex" }, d: { mark: "check", text: "One-click, any format" } },
	{ feature: "Self-host option", g: { mark: "x", text: "No" }, d: { mark: "check", text: "Yes — full control" } },
	{ feature: "Open source", g: { mark: "x", text: "No" }, d: { mark: "check", text: "Yes — inspect every line" } },
	{ feature: "Works if company kills the product", g: { mark: "x", text: "No" }, d: { mark: "check", text: "Yes (self-host lives on)" } },
];

const SWITCH_HREF =
	"https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=vs_table&utm_campaign=try7days";

function VsCell({ cell, win }) {
	const chipClass =
		cell.mark === "check"
			? styles.chipCheck
			: cell.mark === "x"
				? styles.chipX
				: styles.chipMinus;
	return (
		<div className={styles.cell}>
			<span className={`${styles.chip} ${chipClass}`}>
				<DwIcon name={cell.mark} size={15} stroke={2.6} />
			</span>
			<span className={win ? styles.cellTextWin : styles.cellText}>
				{cell.text}
			</span>
		</div>
	);
}

export default function Comparison() {
	return (
		<section className={styles.section}>
			<div className={styles.heading}>
				<div className={styles.switchPill}>
					<DwIcon name="arrow-down-up" size={13} stroke={2.2} /> Make the switch
				</div>
				<h2 className={styles.title}>Google Timeline vs Dawarich</h2>
				<p className={styles.subtitle}>
					See what you're gaining when you make the switch.
				</p>
			</div>

			<div className={styles.tableScroll}>
				<div className={styles.table}>
					{/* glowing highlight band behind the Dawarich column */}
					<div className={styles.band} aria-hidden="true">
						<div />
						<div />
						<div className={styles.bandCol}>
							<div className={styles.bandAccent} />
							<div className={styles.bandWash} />
						</div>
					</div>

					{/* header */}
					<div className={styles.headerRow}>
						<div className={styles.colHead}>Feature</div>
						<div className={styles.colHead}>Google Timeline</div>
						<div className={styles.dawarichHead}>
							<span className={styles.dawarichChip}>
								<DwIcon name="map-pin" size={15} stroke={2.2} />
							</span>
							<span className={styles.dawarichName}>DAWARICH</span>
						</div>
					</div>

					{/* rows */}
					{VERSUS_ROWS.map((r, i) => (
						<div
							key={r.feature}
							className={`${styles.row} ${i % 2 === 1 ? styles.rowAlt : ""}`}
						>
							<div className={styles.feature}>{r.feature}</div>
							<VsCell cell={r.g} win={false} />
							<VsCell cell={r.d} win={true} />
						</div>
					))}

					{/* footer CTA */}
					<div className={styles.footerRow}>
						<div className={styles.footNote}>It's your data. Keep it that way.</div>
						<div />
						<div className={styles.footCtaCell}>
							<a className={styles.footCta} href={SWITCH_HREF}>
								Switch to Dawarich
								<DwIcon
									name="arrow-down-up"
									size={15}
									stroke={2.4}
									className={styles.footCtaArrow}
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
