import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/pages/trips.json';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import FeatureCard, { FeatureCardGrid } from '@site/src/components/FeatureCard';
import {
  MapIcon,
  BarChartIcon,
  FileTextIcon,
  CameraIcon,
  ClipboardListIcon,
  SmartphoneIcon,
  PlusIcon,
  PencilIcon,
  TargetIcon,
  SaveIcon,
  BookOpenIcon,
  GlobeIcon,
  BotIcon,
  HandIcon,
} from '@site/src/components/LucideIcons';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import styles from './trips.module.css';

const showcaseItems = [
  {
    icon: <MapIcon />,
    title: content.showcaseItems[0].title,
    description: content.showcaseItems[0].description,
  },
  {
    icon: <BarChartIcon />,
    title: content.showcaseItems[1].title,
    description: content.showcaseItems[1].description,
  },
  {
    icon: <FileTextIcon />,
    title: content.showcaseItems[2].title,
    description: content.showcaseItems[2].description,
  },
  {
    icon: <CameraIcon />,
    title: content.showcaseItems[3].title,
    description: content.showcaseItems[3].description,
  },
  {
    icon: <ClipboardListIcon />,
    title: content.showcaseItems[4].title,
    description: content.showcaseItems[4].description,
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
    icon: <PlusIcon size={32} />,
    title: content.howItWorksSteps[1].title,
    description: content.howItWorksSteps[1].description,
    details: content.howItWorksSteps[1].details
  },
  {
    icon: <PencilIcon size={32} />,
    title: content.howItWorksSteps[2].title,
    description: content.howItWorksSteps[2].description,
    details: content.howItWorksSteps[2].details
  },
  {
    icon: <TargetIcon size={32} />,
    title: content.howItWorksSteps[3].title,
    description: content.howItWorksSteps[3].description,
    details: content.howItWorksSteps[3].details
  }
];

export default function TripsPage() {
  const pageUrl = useLocalizedUrl('/trips/');
  return (
    <Layout
      title={content.meta.title}
      description={content.meta.description}>
      <Head>
        <meta name="twitter:url" content={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={content.meta.ogTitle} />
        <meta property="og:description" content={content.meta.ogDescription} />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <FeatureHero
        badge={content.hero.badge}
        title={content.hero.title}
        titleHighlight={content.hero.titleHighlight}
        subtitle={content.hero.subtitle}
        image="/img/trip-details.webp"
        imageAlt={content.hero.imageAlt}
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=trips"
        showSecondary={true}
      />

      <main>
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <h2 className={styles.benefitsTitle}>{content.tripsPage.heading}</h2>
            <FeatureCardGrid columns={3}>
              <FeatureCard
                icon={<SaveIcon />}
                title={content.tripsPage.title3}
                description={content.tripsPage.description2}
              />
              <FeatureCard
                icon={<BookOpenIcon />}
                title={content.hero.badge}
                description={content.tripsPage.description3}
              />
              <FeatureCard
                icon={<GlobeIcon />}
                title={content.tripsPage.title4}
                description={content.tripsPage.description4}
              />
            </FeatureCardGrid>
          </div>
        </section>

        <FeatureShowcase
          title={content.tripsPage.title5}
          subtitle={content.tripsPage.subtitle2}
          items={showcaseItems}
        />

        <HowItWorks
          title={content.tripsPage.title6}
          subtitle={content.tripsPage.subtitle3}
          steps={howItWorksSteps}
        />

        <section className={styles.automaticVsManual}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.tripsPage.heading2}</h2>
            <FeatureCardGrid columns={2}>
              <FeatureCard
                icon={<BotIcon />}
                title={content.tripsPage.title7}
                description={content.tripsPage.description5}
              />
              <FeatureCard
                icon={<HandIcon />}
                title={content.tripsPage.title8}
                description={content.tripsPage.description6}
              />
            </FeatureCardGrid>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>{content.tripsPage.heading3}</h2>
            <p className={styles.ctaSubtitle}>{content.tripsPage.p}</p>
            <div className={styles.ctaButtons}>
              <SmartLink
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=trips">{content.tripsPage.Link}</SmartLink>
              <EnOnlyLink
                className={styles.secondaryCta}
                to="/docs/self-hosting/installation/docker">{content.tripsPage.EnOnlyLink}</EnOnlyLink>
            </div>
            <p className="feature-cta-reassurance">{content.tripsPage.p2}</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
