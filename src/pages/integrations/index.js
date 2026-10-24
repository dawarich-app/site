import content from '@locale-content/pages/integrations.json';
import RichText, { SmartLink } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import FeatureCard, { FeatureCardGrid } from '@site/src/components/FeatureCard';
import {
  CameraIcon,
  ImageIcon,
  MapIcon,
  PlaneIcon,
  CalendarIcon,
  LockIcon,
  KeyIcon,
  SettingsIcon,
  RefreshIcon,
  PartyIcon,
  SmartphoneIcon,
  FileTextIcon,
  MusicIcon,
  CloudIcon,
} from '@site/src/components/LucideIcons';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import styles from './integrations.module.css';

const integrationsShowcase = [
  {
    icon: <CameraIcon />,
    title: content.integrationsShowcase[0].title,
    description: content.integrationsShowcase[0].description,
    image: '/img/map-photos.webp',
    imageAlt: content.integrationsShowcase[0].imageAlt
  },
  {
    icon: <ImageIcon />,
    title: content.integrationsShowcase[1].title,
    description: content.integrationsShowcase[1].description,
    image: '/img/trip-details.webp',
    imageAlt: content.integrationsShowcase[1].imageAlt
  }
];

const benefits = [
  {
    icon: <MapIcon />,
    title: content.benefits[0].title,
    description: content.benefits[0].description
  },
  {
    icon: <PlaneIcon />,
    title: content.benefits[1].title,
    description: content.benefits[1].description
  },
  {
    icon: <CalendarIcon />,
    title: content.benefits[2].title,
    description: content.benefits[2].description
  },
  {
    icon: <LockIcon />,
    title: content.benefits[3].title,
    description: content.benefits[3].description
  }
];

const setupSteps = [
  {
    icon: <KeyIcon size={32} />,
    title: content.setupSteps[0].title,
    description: content.setupSteps[0].description,
    details: content.setupSteps[0].details
  },
  {
    icon: <SettingsIcon size={32} />,
    title: content.setupSteps[1].title,
    description: content.setupSteps[1].description,
    details: content.setupSteps[1].details
  },
  {
    icon: <RefreshIcon size={32} />,
    title: content.setupSteps[2].title,
    description: content.setupSteps[2].description,
    details: content.setupSteps[2].details
  },
  {
    icon: <PartyIcon size={32} />,
    title: content.setupSteps[3].title,
    description: content.setupSteps[3].description,
    details: content.setupSteps[3].details
  }
];

const futureIntegrations = [
  {
    icon: <SmartphoneIcon />,
    title: content.futureIntegrations[0].title,
    description: content.futureIntegrations[0].description
  },
  {
    icon: <FileTextIcon />,
    title: content.futureIntegrations[1].title,
    description: content.futureIntegrations[1].description
  },
  {
    icon: <MusicIcon />,
    title: content.futureIntegrations[2].title,
    description: content.futureIntegrations[2].description
  },
  {
    icon: <CloudIcon />,
    title: content.futureIntegrations[3].title,
    description: content.futureIntegrations[3].description
  }
];

export default function IntegrationsPage() {
  const pageUrl = useLocalizedUrl('/integrations/');
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
        image="/img/map-photos.webp"
        imageAlt={content.hero.imageAlt}
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=integrations"
        showSecondary={true}
      />

      <main>
        <section className={styles.valueSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.integrationsPage.heading}</h2>
            <p className={styles.sectionSubtitle}>{content.integrationsPage.p}</p>
            <FeatureCardGrid columns={4}>
              {benefits.map((benefit, index) => (
                <FeatureCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </FeatureCardGrid>
          </div>
        </section>

        <FeatureShowcase
          title={content.integrationsPage.title3}
          subtitle={content.integrationsPage.subtitle2}
          items={integrationsShowcase}
        />

        <HowItWorks
          title={content.integrationsPage.title4}
          subtitle={content.integrationsPage.subtitle3}
          steps={setupSteps}
        />

        <section className={styles.privacySection}>
          <div className={styles.container}>
            <div className={styles.privacyCard}>
              <div className={styles.privacyIcon}><LockIcon size={48} /></div>
              <div className={styles.privacyContent}>
                <h3 className={styles.privacyTitle}>{content.integrationsPage.h3}</h3>
                <p className={styles.privacyText}><RichText text={content.integrationsPage.p2} /></p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.technicalDetails}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.integrationsPage.heading2}</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <h3 className={styles.detailTitle}>
                  <SettingsIcon size={20} />{content.integrationsPage.text3}</h3>
                <p className={styles.detailText}>{content.integrationsPage.text4}<code>{content.integrationsPage.code}</code>{content.integrationsPage.text5}<code>{content.integrationsPage.code2}</code>{content.integrationsPage.text6}<code>{content.integrationsPage.code3}</code>{content.integrationsPage.text7}</p>
                <SmartLink href="https://immich.app/docs/features/command-line-interface#obtain-the-api-key" className={styles.detailLink}>{content.integrationsPage.Link}</SmartLink>
              </div>
              <div className={styles.detailCard}>
                <h3 className={styles.detailTitle}>
                  <ImageIcon size={20} />{content.integrationsPage.text8}</h3>
                <p className={styles.detailText}>{content.integrationsPage.p3}</p>
                <SmartLink href="https://docs.photoprism.app/user-guide/settings/account/#apps-and-devices" className={styles.detailLink}>{content.integrationsPage.Link2}</SmartLink>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.futureSection}>
          <div className={styles.container}>
            {/* <h2 className={styles.sectionTitle}>Coming Soon</h2>
            <p className={styles.sectionSubtitle}>
              We're continuously expanding Dawarich's integration capabilities. Here's what's on the roadmap.
            </p>
            <FeatureCardGrid columns={4}>
              {futureIntegrations.map((integration, index) => (
                <FeatureCard
                  key={index}
                  icon={integration.icon}
                  title={integration.title}
                  description={integration.description}
                />
              ))}
            </FeatureCardGrid> */}
            <p className={styles.futureNote}><RichText text={content.integrationsPage.p4} /></p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>{content.integrationsPage.heading3}</h2>
            <p className={styles.ctaSubtitle}>{content.integrationsPage.p5}</p>
            <div className={styles.ctaButtons}>
              <SmartLink
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=integrations">{content.integrationsPage.Link4}</SmartLink>
              <EnOnlyLink
                className={styles.secondaryCta}
                to="/docs/self-hosting/installation/docker">{content.integrationsPage.EnOnlyLink}</EnOnlyLink>
            </div>
            <p className="feature-cta-reassurance">{content.integrationsPage.p6}</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
