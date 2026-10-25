import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/components/Comparison.json';
import React from "react";
import { DwIcon } from "@site/src/data/pricingPlans";
import styles from "./Comparison.module.css";

// Content unchanged — restyled to match the new pricing section.
const VERSUS_ROWS = [
	{ feature: content.versusRows[0].feature, g: { mark: "x", text: content.versusRows[0].g.text }, d: { mark: "check", text: content.versusRows[0].d.text } },
	{ feature: content.versusRows[1].feature, g: { mark: "minus", text: content.versusRows[1].g.text }, d: { mark: "check", text: content.versusRows[1].d.text } },
	{ feature: content.versusRows[2].feature, g: { mark: "x", text: content.versusRows[2].g.text }, d: { mark: "check", text: content.versusRows[2].d.text } },
	{ feature: content.versusRows[3].feature, g: { mark: "x", text: content.versusRows[3].g.text }, d: { mark: "check", text: content.versusRows[3].d.text } },
	{ feature: content.versusRows[4].feature, g: { mark: "minus", text: content.versusRows[4].g.text }, d: { mark: "check", text: content.versusRows[4].d.text } },
	{ feature: content.versusRows[5].feature, g: { mark: "x", text: content.versusRows[5].g.text }, d: { mark: "check", text: content.versusRows[5].d.text } },
	{ feature: content.versusRows[6].feature, g: { mark: "x", text: content.versusRows[6].g.text }, d: { mark: "check", text: content.versusRows[6].d.text } },
	{ feature: content.versusRows[7].feature, g: { mark: "x", text: content.versusRows[7].g.text }, d: { mark: "check", text: content.versusRows[7].d.text } },
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
					<DwIcon name="arrow-down-up" size={13} stroke={2.2} />{content.switchPill}
				</div>
				<h2 className={styles.title}>{content.title}</h2>
				<p className={styles.subtitle}>
					{content.subtitle}
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
						<div className={styles.colHead}>{content.featureHeader}</div>
						<div className={styles.colHead}>{content.googleTimelineHeader}</div>
						<div className={styles.dawarichHead}>
							<span className={styles.dawarichChip}>
								<DwIcon name="map-pin" size={15} stroke={2.2} />
							</span>
							<span className={styles.dawarichName}>{content.dawarichName}</span>
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
						<div className={styles.footNote}>{content.footNote}</div>
						<div />
						<div className={styles.footCtaCell}>
							<SmartLink className={styles.footCta} href={SWITCH_HREF}>
								{content.footCta}
								<DwIcon
									name="arrow-down-up"
									size={15}
									stroke={2.4}
									className={styles.footCtaArrow}
								/>
							</SmartLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
