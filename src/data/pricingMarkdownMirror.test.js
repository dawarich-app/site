import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { PLANS, COMPARE_GROUPS } from "./pricingPlans";

const MIRROR_PATH = path.resolve(__dirname, "../../static/pricing.md");

function readMirror() {
	return fs.readFileSync(MIRROR_PATH, "utf8");
}

describe("static/pricing.md agent mirror", () => {
	it("exists", () => {
		expect(fs.existsSync(MIRROR_PATH)).toBe(true);
	});

	it("quotes every price from PLANS", () => {
		const mirror = readMirror();
		const prices = [
			PLANS.lite.price,
			PLANS.pro.price,
			PLANS.pro.priceMonthly,
			PLANS.family.price,
		];

		for (const price of prices) {
			expect(mirror, `missing price ${price}`).toContain(price);
		}
	});

	it("quotes every founding-price deadline still shown on the site", () => {
		const mirror = readMirror();
		const urgencies = Object.values(PLANS)
			.map((plan) => plan.urgency)
			.filter(Boolean);

		for (const urgency of urgencies) {
			const deadline = urgency.match(/ends ([A-Z][a-z]+ \d{1,2}, \d{4})/)?.[1];
			expect(deadline, `unparsable urgency: ${urgency}`).toBeTruthy();
			expect(mirror, `missing deadline ${deadline}`).toContain(deadline);
		}
	});

	it("lists every plan feature label", () => {
		const mirror = readMirror();
		const labels = Object.values(PLANS).flatMap((plan) =>
			plan.features.map((feature) => feature.label),
		);

		for (const label of labels) {
			expect(mirror, `missing feature label: ${label}`).toContain(label);
		}
	});

	it("lists every comparison row label and its per-plan values", () => {
		const mirror = readMirror();

		for (const group of COMPARE_GROUPS) {
			for (const row of group.rows) {
				expect(mirror, `missing row label: ${row.label}`).toContain(row.label);

				for (const value of [row.lite, row.pro, row.family]) {
					if (typeof value === "string") {
						expect(mirror, `missing value "${value}" for ${row.label}`).toContain(value);
					}
				}
			}
		}
	});
});
