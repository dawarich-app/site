import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/pages/interactive-map.json';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import ToolGuide from '@site/src/components/ToolGuide';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import styles from './map.module.css';
const Icon = ({ size = 40, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const MapPinIcon = (props) => (
  <Icon {...props}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
const RouteIcon = (props) => (
  <Icon {...props}>
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </Icon>
);
const FlameIcon = (props) => (
  <Icon {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Icon>
);
const CloudFogIcon = (props) => (
  <Icon {...props}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 0 9z" />
    <path d="M16 17H7" />
    <path d="M17 21H9" />
  </Icon>
);
const MapIcon = (props) => (
  <Icon {...props}>
    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
    <path d="M15 5.764v15" />
    <path d="M9 3.236v15" />
  </Icon>
);
const HexagonIcon = (props) => (
  <Icon {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </Icon>
);
const CameraIcon = (props) => (
  <Icon {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </Icon>
);
const SmartphoneIcon = (props) => (
  <Icon {...props}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </Icon>
);
const LayersIcon = (props) => (
  <Icon {...props}>
    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </Icon>
);
const CalendarIcon = (props) => (
  <Icon {...props}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </Icon>
);
const SaveIcon = (props) => (
  <Icon {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </Icon>
);
const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);
const LockIcon = (props) => (
  <Icon {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);
const ListIcon = (props) => (
  <Icon {...props}>
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </Icon>
);
const timelineItems = [
  {
    icon: <ListIcon />,
    title: content.timelineItems[0].title,
    description: content.timelineItems[0].description,
  },
  {
    icon: <RouteIcon />,
    title: content.timelineItems[1].title,
    description: content.timelineItems[1].description,
  },
  {
    icon: <CloudFogIcon />,
    title: content.timelineItems[2].title,
    description: content.timelineItems[2].description,
  },
];
const showcaseItems = [
  {
    icon: <MapPinIcon />,
    title: content.showcaseItems[0].title,
    description: content.showcaseItems[0].description,
    image: '/img/map-points.webp',
    imageAlt: content.showcaseItems[0].imageAlt
  },
  {
    icon: <RouteIcon />,
    title: content.showcaseItems[1].title,
    description: content.showcaseItems[1].description,
    image: '/img/map-polylines.webp',
    imageAlt: content.showcaseItems[1].imageAlt
  },
  {
    icon: <FlameIcon />,
    title: content.showcaseItems[2].title,
    description: content.showcaseItems[2].description,
    image: '/img/map-heatmap.webp',
    imageAlt: content.showcaseItems[2].imageAlt
  },
  {
    icon: <CloudFogIcon />,
    title: content.showcaseItems[3].title,
    description: content.showcaseItems[3].description,
    image: '/img/map-fog-of-war.webp',
    imageAlt: content.showcaseItems[3].imageAlt
  },
  {
    icon: <MapIcon />,
    title: content.showcaseItems[4].title,
    description: content.showcaseItems[4].description,
    image: '/img/map-scratch-map.webp',
    imageAlt: content.showcaseItems[4].imageAlt
  },
  {
    icon: <HexagonIcon />,
    title: content.showcaseItems[5].title,
    description: content.showcaseItems[5].description,
    image: '/img/map-areas.webp',
    imageAlt: content.showcaseItems[5].imageAlt
  },
  {
    icon: <CameraIcon />,
    title: content.showcaseItems[6].title,
    description: content.showcaseItems[6].description,
    image: '/img/map-photos.webp',
    imageAlt: content.showcaseItems[6].imageAlt
  }
];
const howItWorksSteps = [
  {
    icon: <SmartphoneIcon size={32} />,
    title: content.howItWorksSteps[0].title,
    description: content.howItWorksSteps[0].description,
    details: content.howItWorksSteps[0].details
  },
  {
    icon: <LayersIcon size={32} />,
    title: content.howItWorksSteps[1].title,
    description: content.howItWorksSteps[1].description,
    details: content.howItWorksSteps[1].details
  },
  {
    icon: <CalendarIcon size={32} />,
    title: content.howItWorksSteps[2].title,
    description: content.howItWorksSteps[2].description,
    details: content.howItWorksSteps[2].details
  },
  {
    icon: <SaveIcon size={32} />,
    title: content.howItWorksSteps[3].title,
    description: content.howItWorksSteps[3].description,
    details: content.howItWorksSteps[3].details
  },
  {
    icon: <SearchIcon size={32} />,
    title: content.howItWorksSteps[4].title,
    description: content.howItWorksSteps[4].description,
    details: content.howItWorksSteps[4].details
  }
];
export default function MapPage() {
  const pageUrl = useLocalizedUrl('/interactive-map/');
  return (
    <Layout title={content.meta.title} description={content.meta.description}>
      <Head>
        <meta name="twitter:url" content={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={content.meta.ogTitle} />
        <meta property="og:description" content={content.meta.ogDescription} />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <FeatureHero badge={content.hero.badge} title={content.hero.title} titleHighlight={content.hero.titleHighlight} subtitle={content.hero.subtitle} image="/img/the_map.webp" imageAlt={content.hero.imageAlt} ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=map" showSecondary={true} />
      <main>
        <FeatureShowcase title={content.mapPage.title3} subtitle={content.mapPage.subtitle2} items={timelineItems} />
        <FeatureShowcase title={content.mapPage.title4} subtitle={content.mapPage.subtitle3} items={showcaseItems} />
        <HowItWorks title={content.mapPage.title5} subtitle={content.mapPage.subtitle4} steps={howItWorksSteps} />
        <section className={styles.privacyNote}>
          <div className={styles.container}>
            <h3 className={styles.privacyTitle}>
              <LockIcon size={22} />
              <span>{content.mapPage.span}</span>
            </h3>
            <p className={styles.privacyText}>{content.mapPage.p}</p>
          </div>
        </section>
        <ToolGuide content={content.guide} />
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>{content.mapPage.heading}</h2>
            <p className={styles.ctaSubtitle}>{content.mapPage.p2}</p>
            <div className={styles.ctaButtons}>
              <SmartLink className={styles.primaryCta} href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=map">{content.mapPage.Link}</SmartLink>
              <EnOnlyLink className={styles.secondaryCta} to="/docs/self-hosting/installation/docker">{content.mapPage.EnOnlyLink}</EnOnlyLink>
            </div>
            <p className="feature-cta-reassurance">{content.mapPage.p3}</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
