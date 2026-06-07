import React, { useState } from "react";
import { COMPARE_GROUPS, DwIcon } from "@site/src/data/pricingPlans";
import styles from "./PricingCompare.module.css";

const COLS = [
	{ key: "lite", name: "Lite", sub: "€49.99/yr", accent: "blue", popular: false },
	{ key: "pro", name: "Pro", sub: "€119.99/yr", accent: "blue", popular: true },
	{ key: "family", name: "Family", sub: "Coming soon", accent: "teal", popular: false },
];

// Comparison table gets its own UTM tagging, distinct from the pricing cards
// (cards use utm_medium=pricing; this section uses utm_medium=pricing_compare).
const COMPARE_UTM = "utm_source=site&utm_medium=pricing_compare";
const CTA_LINKS = {
	lite: `https://my.dawarich.app/users/sign_up?${COMPARE_UTM}&utm_campaign=try7dayslite&utm_content=compare_lite&plan=lite`,
	pro: `https://my.dawarich.app/users/sign_up?${COMPARE_UTM}&utm_campaign=try7days&utm_content=compare_pro`,
	family: "#pricing",
};

const norm = (v) => (v === true ? "✓" : v === false ? "✗" : String(v));
const rowIsDifferent = (row) =>
	!(norm(row.lite) === norm(row.pro) && norm(row.pro) === norm(row.family));

function CellMark({ value, accent }) {
	if (value === true) {
		return (
			<span
				className={`${styles.cellCheck} ${accent === "teal" ? styles.cellCheckTeal : styles.cellCheckBlue}`}
			>
				<DwIcon name="check" size={14} stroke={2.6} />
			</span>
		);
	}
	if (value === false) {
		return (
			<span className={styles.cellMinus}>
				<DwIcon name="minus" size={16} stroke={2.4} />
			</span>
		);
	}
	return <span className={styles.cellText}>{value}</span>;
}

export default function PricingCompare() {
	const [open, setOpen] = useState(() => {
		const o = {};
		COMPARE_GROUPS.forEach((g) => {
			o[g.name] = true;
		});
		return o;
	});
	const [diffOnly, setDiffOnly] = useState(false);
	const allOpen = COMPARE_GROUPS.every((g) => open[g.name]);
	const toggle = (name) => setOpen((p) => ({ ...p, [name]: !p[name] }));
	const setAll = (v) => {
		const o = {};
		COMPARE_GROUPS.forEach((g) => {
			o[g.name] = v;
		});
		setOpen(o);
	};

	return (
		<section className={styles.compare}>
			<div className={styles.inner}>
				<div className={styles.head}>
					<div>
						<h2 className={styles.title}>Compare every feature</h2>
						<p className={styles.subtitle}>
							Expand a section to see the details — or just show what changes
							between plans.
						</p>
					</div>
					<div className={styles.controls}>
						<button
							type="button"
							className={styles.ctrlBtn}
							onClick={() => setAll(!allOpen)}
						>
							{allOpen ? "Collapse all" : "Expand all"}
						</button>
						<button
							type="button"
							className={`${styles.ctrlBtn} ${diffOnly ? styles.ctrlBtnActive : ""}`}
							onClick={() => setDiffOnly((v) => !v)}
							aria-pressed={diffOnly}
						>
							<span className={`${styles.switch} ${diffOnly ? styles.switchOn : ""}`}>
								<span className={styles.knob} />
							</span>
							Highlight differences
						</button>
					</div>
				</div>

				<div className={styles.tableScroll}>
					<div className={styles.table}>
						<div className={styles.headerRow}>
							<div className={styles.headerFeatures}>Features</div>
							{COLS.map((c) => (
								<div
									key={c.key}
									className={`${styles.headerCol} ${c.popular ? styles.popCol : ""}`}
								>
									{c.popular && <div className={styles.colTopBar} />}
									<div className={styles.colName}>
										{c.popular && (
											<DwIcon
												name="sparkles"
												size={13}
												stroke={2.4}
												className={styles.colSpark}
											/>
										)}
										{c.name}
									</div>
									<div
										className={`${styles.colSub} ${c.accent === "teal" ? styles.colSubTeal : ""}`}
									>
										{c.sub}
									</div>
								</div>
							))}
						</div>

						{COMPARE_GROUPS.map((g, gi) => {
							const rows = diffOnly ? g.rows.filter(rowIsDifferent) : g.rows;
							if (diffOnly && rows.length === 0) return null;
							const isOpen = open[g.name];
							return (
								<div
									key={g.name}
									className={
										gi < COMPARE_GROUPS.length - 1 ? styles.group : styles.groupLast
									}
								>
									<button
										type="button"
										className={styles.groupHeader}
										onClick={() => toggle(g.name)}
										aria-expanded={isOpen}
									>
										<span className={styles.groupTitleCell}>
											<span
												className={`${styles.chevron} ${isOpen ? "" : styles.chevronClosed}`}
											>
												<DwIcon name="chevron-down" size={16} stroke={2.4} />
											</span>
											<span className={styles.groupName}>{g.name}</span>
											<span className={styles.groupCount}>{rows.length}</span>
										</span>
										<span />
										<span />
										<span />
									</button>
									{isOpen &&
										rows.map((row, ri) => {
											const diff = rowIsDifferent(row);
											return (
												<div
													key={ri}
													className={`${styles.row} ${diffOnly && diff ? styles.rowDiff : ""}`}
												>
													<div className={styles.rowLabel}>{row.label}</div>
													{COLS.map((c) => (
														<div
															key={c.key}
															className={`${styles.cell} ${c.popular ? styles.popCell : ""}`}
														>
															<CellMark value={row[c.key]} accent={c.accent} />
														</div>
													))}
												</div>
											);
										})}
								</div>
							);
						})}

						<div className={styles.footerRow}>
							<div className={styles.footerLabel}>Ready when you are</div>
							{COLS.map((c) => (
								<div
									key={c.key}
									className={`${styles.footerCell} ${c.popular ? styles.popCell : ""}`}
								>
									<a
										href={CTA_LINKS[c.key]}
										className={`${styles.footCta} ${c.popular ? styles.footCtaPrimary : c.accent === "teal" ? styles.footCtaTeal : styles.footCtaBlue}`}
									>
										{c.key === "family"
											? "Notify me"
											: c.key === "pro"
												? "Start free"
												: "Choose Lite"}
									</a>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
