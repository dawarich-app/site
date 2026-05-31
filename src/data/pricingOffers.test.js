import { describe, it, expect } from "vitest";
import { pricingOffers } from "./pricingOffers";

describe("pricingOffers", () => {
	it("should include a Family annual offer", () => {
		const family = pricingOffers.find((o) => o.name === "Family (annual)");
		expect(family).toBeDefined();
		expect(family.priceCurrency).toBe("EUR");
		expect(family["@type"]).toBe("Offer");
	});

	it("should keep the existing Lite, Pro and Self-hosted offers", () => {
		const names = pricingOffers.map((o) => o.name);
		expect(names).toContain("Lite (annual)");
		expect(names).toContain("Pro (monthly)");
		expect(names).toContain("Pro (annual)");
		expect(names).toContain("Self-hosted");
	});

	it("should mark the Family price as TBD until launch", () => {
		const family = pricingOffers.find((o) => o.name === "Family (annual)");
		expect(family.price).toBe("TBD");
	});
});
