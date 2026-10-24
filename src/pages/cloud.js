import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/pages/cloud.json';
import RichText, { SmartLink } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import Head from "@docusaurus/Head";
import FAQ from "@site/src/components/FAQ";
import HowItWorks from "@site/src/components/HowItWorks";
import LandingHero from "@site/src/components/LandingHero";
import sections from "@site/src/components/LandingSections.module.css";
import PricingSection from "@site/src/components/PricingSection";
import Testimonials from "@site/src/components/Testimonials";
import Layout from "@theme/Layout";
import React, { useEffect } from "react";
const SIGNUP_URL =
	"https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=cloud_landing&utm_campaign=cloud";
const SignupIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<line x1="5" y1="12" x2="19" y2="12" />
		<polyline points="12 5 19 12 12 19" />
	</svg>
);
const PinIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);
const ImportIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7 10 12 15 17 10" />
		<line x1="12" y1="15" x2="12" y2="3" />
	</svg>
);
const PhoneIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
		<line x1="12" y1="18" x2="12.01" y2="18" />
	</svg>
);
const howItWorksSteps = [
	{
		icon: <PinIcon />,
		title: content.howItWorksSteps[0].title,
		description:
			content.howItWorksSteps[0].description,
	},
	{
		icon: <ImportIcon />,
		title: content.howItWorksSteps[1].title,
		description:
			content.howItWorksSteps[1].description,
	},
	{
		icon: <PhoneIcon />,
		title: content.howItWorksSteps[2].title,
		description:
			content.howItWorksSteps[2].description,
	},
];
function PainSection() {
	return (
		<section className={sections.section}>
			<div className={sections.container}>
				<h2 className={sections.title}>{content.painSection.heading}</h2>
				<p className={sections.subtitle}>{content.painSection.p}</p>
				<div className={sections.painGrid}>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>{content.painSection.div}</div>
						<p className={sections.painCardBody}>{content.painSection.p2}</p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>{content.painSection.div2}</div>
						<p className={sections.painCardBody}><RichText text={content.painSection.p3} /></p>
					</div>
					<div className={sections.painCard}>
						<div className={sections.painCardHeader}>{content.painSection.div3}</div>
						<p className={sections.painCardBody}>{content.painSection.p4}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
function Differentiators() {
	return (
		<section className={sections.sectionElevated}>
			<div className={sections.container}>
				<h2 className={sections.title}>{content.differentiators.heading}</h2>
				<p className={sections.subtitle}>{content.differentiators.p}</p>
				<div className={sections.diffGrid}>
					<div className={sections.diffCard}>
						<h3>{content.differentiators.h3}</h3>
						<p>{content.differentiators.p2}</p>
					</div>
					<div className={sections.diffCard}>
						<h3>{content.differentiators.h32}</h3>
						<p><RichText text={content.differentiators.p3} /></p>
					</div>
					<div className={sections.diffCard}>
						<h3>{content.differentiators.h33}</h3>
						<p>{content.differentiators.p4}</p>
					</div>
					<div className={sections.diffCard}>
						<h3>{content.differentiators.h34}</h3>
						<p>{content.differentiators.p5}</p>
					</div>
					<div className={sections.diffCard}>
						<h3>{content.differentiators.h35}</h3>
						<p>{content.differentiators.p6}</p>
					</div>
					<div className={sections.diffCard}>
						<h3>{content.differentiators.h36}</h3>
						<p>{content.differentiators.p7}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
function CompetitorReframe() {
	return (
		<section className={sections.reframeSection}>
			<div className={sections.reframeContainer}>
				<h2 className={sections.reframeTitle}>{content.competitorReframe.heading}</h2>
				<p className={sections.reframeBody}>{content.competitorReframe.p}</p>
				<p className={sections.reframeBody}>{content.competitorReframe.p2}</p>
				<div className={sections.compareWrapper}>
					<table className={sections.compareTable}>
						<thead>
							<tr>
								<th>{content.competitorReframe.th}</th>
								<th>{content.competitorReframe.th2}</th>
								<th>{content.competitorReframe.th3}</th>
								<th>{content.competitorReframe.th4}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{content.competitorReframe.td}</td>
								<td>{content.competitorReframe.td2}</td>
								<td>{content.competitorReframe.td3}</td>
								<td>{content.competitorReframe.td4}</td>
							</tr>
							<tr>
								<td>{content.competitorReframe.td5}</td>
								<td>~&euro;170/yr</td>
								<td>{content.competitorReframe.td6}</td>
								<td>{content.competitorReframe.td7}</td>
							</tr>
							<tr>
								<td>{content.competitorReframe.td8}</td>
								<td>&euro;60/yr</td>
								<td>{content.competitorReframe.td9}</td>
								<td>{content.competitorReframe.td10}</td>
							</tr>
							<tr className={sections.highlight}>
								<td>{content.competitorReframe.td11}</td>
								<td>&euro;119.99/yr</td>
								<td>{content.competitorReframe.td12}</td>
								<td>{content.competitorReframe.td13}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className={sections.compareCaption}>{content.competitorReframe.text}<em>{content.competitorReframe.em}</em>{content.competitorReframe.text2}</p>
			</div>
		</section>
	);
}
function Promises() {
	return (
		<section className={sections.section}>
			<div className={sections.container}>
				<h2 className={sections.title}>{content.promises.heading}</h2>
				<p className={sections.subtitle}>{content.promises.p}</p>
				<div className={sections.promiseGrid}>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>{content.promises.h3}</h3>
						<p className={sections.promiseBody}>{content.promises.p2}</p>
					</div>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>{content.promises.h32}</h3>
						<p className={sections.promiseBody}>{content.promises.p3}</p>
					</div>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>{content.promises.h33}</h3>
						<p className={sections.promiseBody}>{content.promises.p4}</p>
					</div>
					<div className={sections.promiseCard}>
						<h3 className={sections.promiseTitle}>{content.differentiators.h32}</h3>
						<p className={sections.promiseBody}><RichText text={content.promises.p5} /></p>
					</div>
				</div>
			</div>
		</section>
	);
}
function CloudFinalCTA() {
	return (
		<section className={sections.finalCta}>
			<div className={sections.finalCtaInner}>
				<h2 className={sections.finalCtaTitle}>{content.cloudFinalCTA.heading}</h2>
				<p className={sections.finalCtaBody}>{content.cloudFinalCTA.p}</p>
				<SmartLink className={sections.finalCtaButton} href={SIGNUP_URL}>{content.cloudFinalCTA.text}<SignupIcon />
				</SmartLink>
				<span className={sections.finalCtaSecondary}><RichText text={content.cloudFinalCTA.span} /></span>
			</div>
		</section>
	);
}
export default function CloudPage() {
  const pageUrl = useLocalizedUrl('/cloud/');
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
					}
				});
			},
			{ threshold: 0.1 },
		);
		document.querySelectorAll(".animateOnScroll").forEach((el) => {
			observer.observe(el);
		});
		return () => observer.disconnect();
	}, []);
	const pageSections = [
		<PainSection key="pain" />,
		<HowItWorks key="how" title={content.howItWorks.title} subtitle={content.howItWorks.subtitle} steps={howItWorksSteps} horizontal />,
		<Differentiators key="diff" />,
		<CompetitorReframe key="compare" />,
		<Testimonials key="testimonials" />,
		<Promises key="promises" />,
		<PricingSection key="pricing" />,
		<FAQ key="faq" />,
		<CloudFinalCTA key="final" />,
	];
	return (
		<Layout title={content.meta.title} description={interpolate(content.meta.description, { price: "€59.99/year" })}>
			<Head>
				<meta property="og:type" content="website" />
				<meta property="og:url" content={pageUrl} />
				<meta property="og:title" content={content.meta.title} />
				<meta property="og:description" content={interpolate(content.meta.ogDescription, { price: "€59.99/year" })} />
				<meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content={pageUrl} />
				<meta name="twitter:title" content={content.meta.title} />
				<meta name="twitter:description" content={content.meta.twitterDescription} />
				<meta name="twitter:image" content="https://dawarich.app/img/meta-image.png" />
			</Head>
			<LandingHero badge={content.hero.badge} title={content.hero.title} titleHighlight={content.hero.titleHighlight} subtitle={content.hero.subtitle} primaryCta={{ text: content.cloudFinalCTA.text, href: SIGNUP_URL }} secondaryCta={{ text: content.cloudPage.text, href: "#pricing" }} disclaimer={content.hero.disclaimer} imageSrc="/img/timeline.webp" imageAlt={content.hero.imageAlt} />
			<main>
				{pageSections.map((section, i) => (
					<div key={section.key} className="animateOnScroll" style={{ transitionDelay: `${i * 0.1}s` }}>
						{section}
					</div>
				))}
			</main>
		</Layout>
	);
}
