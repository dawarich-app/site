import React from "react";

export const DW_ICONS = {
	smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
	"map-pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
	calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
	"arrow-down-up": '<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/>',
	map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
	route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
	flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
	"chart-column": '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
	zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
	infinity: '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>',
	flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
	layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
	globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
	camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
	share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
	"square-pen": '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
	users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
	"badge-check": '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
	"shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
	"map-pin-plus": '<path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738"/><circle cx="12" cy="10" r="3"/><path d="M16 18h6"/><path d="M19 15v6"/>',
	sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
	crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
	star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
	check: '<path d="M20 6 9 17l-5-5"/>',
	x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
	minus: '<path d="M5 12h14"/>',
	"chevron-down": '<path d="m6 9 6 6 6-6"/>',
	lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
	"trending-up": '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
};

export function DwIcon({ name, size = 18, stroke = 2, className, style }) {
	const inner = DW_ICONS[name];
	if (!inner) return null;
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={stroke}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			style={style}
			dangerouslySetInnerHTML={{ __html: inner }}
		/>
	);
}

const SIGNUP = "https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=pricing";

export const PLANS = {
	lite: {
		key: "lite",
		name: "Lite",
		tagline: "A private alternative to Google Timeline for casual trackers.",
		icon: "map-pin",
		accent: "blue",
		oldPrice: "59.99",
		price: "49.99",
		period: "/year",
		perMonth: "€4.17/month",
		perDay: "€0.14/day",
		badge: null,
		cta: "Try Lite Free",
		ctaStyle: "outline",
		href: `${SIGNUP}&utm_campaign=try7dayslite&plan=lite`,
		footnote: "Annual only · Cancel anytime",
		urgency: "Founding price ends July 31, 2026 — lock in €49.99 for life",
		valueStack: {
			items: [
				{ label: "iOS & Android tracking apps", value: 30 },
				{ label: "12 months of searchable history", value: 25 },
				{ label: "Unlimited imports & exports", value: 15 },
				{ label: "Stats & monthly breakdowns", value: 10 },
				{ label: "White-Glove Import Service", value: 99, bonus: true },
			],
			total: 179,
			payLine: "Yours for €49.99/yr",
		},
		featuresHeading: null,
		features: [
			{ icon: "smartphone", label: "iOS & Android native apps" },
			{ icon: "map-pin", label: "Background location tracking" },
			{ icon: "calendar", label: "12 months of searchable history" },
			{ icon: "arrow-down-up", label: "Unlimited imports & exports" },
			{ icon: "map", label: "Interactive map with routes" },
			{ icon: "route", label: "Speed-colored routes & daily replay" },
			{ icon: "flag", label: "Trips & places management" },
			{ icon: "chart-column", label: "Basic stats & monthly breakdowns" },
			{ icon: "zap", label: "200 req/hr API rate limit" },
		],
	},
	pro: {
		key: "pro",
		name: "Pro",
		tagline: "Unlimited history, advanced visualizations, and full API access.",
		icon: "crown",
		accent: "blue",
		oldPrice: "179.99",
		price: "119.99",
		priceMonthly: "17.99",
		period: "/year",
		periodMonthly: "/month",
		perMonth: "€10.00/month",
		perDay: "€0.33/day",
		perDayMonthly: "€0.60/day",
		save: "Save 44%",
		badge: "MOST POPULAR",
		cta: "Start Pro Free — 7 Days",
		ctaStyle: "primary",
		href: `${SIGNUP}&utm_campaign=try7days`,
		footnote: "Cancel anytime",
		urgency: "Founding price ends July 31, 2026 — lock in €119.99 for life",
		valueStack: {
			items: [
				{ label: "Everything in Lite", value: 179 },
				{ label: "Unlimited history — forever", value: 60 },
				{ label: "Heatmap, Fog of War & 3D globe", value: 30 },
				{ label: "Photo & Immich/PhotoPrism integration", value: 25 },
				{ label: "Full Write API access", value: 25 },
			],
			total: 319,
			payLine: "Yours for €119.99/yr",
		},
		featuresHeading: "Everything in Lite, plus:",
		features: [
			{ icon: "infinity", label: "Unlimited data history — forever" },
			{ icon: "flame", label: "Heatmap & Fog of War layers" },
			{ icon: "globe", label: "Globe view (3D)" },
			{ icon: "camera", label: "Trip photo integration" },
			{ icon: "layers", label: "Immich / PhotoPrism integration" },
			{ icon: "share", label: "Full year-in-review & public sharing" },
			{ icon: "square-pen", label: "Full Write API access" },
			{ icon: "zap", label: "1,000 req/hr API rate limit" },
		],
	},
	family: {
		key: "family",
		name: "Family",
		tagline: "Every Pro feature for the whole household — one annual subscription, up to 5 people.",
		icon: "users",
		accent: "teal",
		badge: "COMING SOON",
		urgency: null,
		waitlistListId: "dawarichfamilywaitlist",
		featuresHeading: "Everything in Pro, plus:",
		features: [
			{ icon: "users", label: "Up to 5 members on one subscription" },
			{ icon: "badge-check", label: "Each member gets full Pro access" },
			{ icon: "map-pin-plus", label: "Invite or remove members anytime" },
			{ icon: "shield-check", label: "Members inherit access while in the family" },
			{ icon: "map-pin", label: "Real-time family location sharing" },
		],
	},
};

export const COMPARE_GROUPS = [
	{
		name: "Tracking & apps",
		rows: [
			{ label: "iOS & Android native apps", lite: true, pro: true, family: true },
			{ label: "Background location tracking", lite: true, pro: true, family: true },
			{ label: "Real-time family location sharing", lite: false, pro: false, family: true },
		],
	},
	{
		name: "History & data",
		rows: [
			{ label: "Searchable history", lite: "12 months", pro: "Unlimited", family: "Unlimited" },
			{ label: "Unlimited imports & exports", lite: true, pro: true, family: true },
			{ label: "Data is always yours (export anytime)", lite: true, pro: true, family: true },
		],
	},
	{
		name: "Maps & visualization",
		rows: [
			{ label: "Interactive map with routes", lite: true, pro: true, family: true },
			{ label: "Speed-colored routes & daily replay", lite: true, pro: true, family: true },
			{ label: "Heatmap & Fog of War layers", lite: false, pro: true, family: true },
			{ label: "Globe view (3D)", lite: false, pro: true, family: true },
			{ label: "Trip photo integration", lite: false, pro: true, family: true },
			{ label: "Immich / PhotoPrism integration", lite: false, pro: true, family: true },
		],
	},
	{
		name: "Insights & sharing",
		rows: [
			{ label: "Basic stats & monthly breakdowns", lite: true, pro: true, family: true },
			{ label: "Full year-in-review & public sharing", lite: false, pro: true, family: true },
			{ label: "Trips & places management", lite: true, pro: true, family: true },
		],
	},
	{
		name: "API & limits",
		rows: [
			{ label: "API rate limit", lite: "200 req/hr", pro: "1,000 req/hr", family: "1,000 req/hr" },
			{ label: "Full Write API access", lite: false, pro: true, family: true },
		],
	},
	{
		name: "Members & billing",
		rows: [
			{ label: "Members on one subscription", lite: "1", pro: "1", family: "Up to 5" },
			{ label: "Each member gets full Pro access", lite: false, pro: false, family: true },
			{ label: "14-day money-back guarantee", lite: true, pro: true, family: true },
		],
	},
];
