import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/pages/location-tracking.json';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import {
  SmartphoneIcon,
  GlobeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  KeyIcon,
  SettingsIcon,
  CheckIcon,
} from '@site/src/components/LucideIcons';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import styles from './tracking.module.css';

const appShowcase = [
  {
    icon: <SmartphoneIcon />,
    title: content.appShowcase[0].title,
    description: content.appShowcase[0].description,
    image: '/img/app-store.png',
    imageAlt: content.appShowcase[0].imageAlt,
    imageHref: 'https://apps.apple.com/app/apple-store/id6739544999?pt=128010810&ct=location-tracking&mt=8',
  },
  {
    icon: <SmartphoneIcon />,
    title: content.appShowcase[1].title,
    description: content.appShowcase[1].description,
    image: 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png',
    imageAlt: content.appShowcase[1].imageAlt,
    imageHref: 'https://play.google.com/store/apps/details?id=app.dawarich.Dawarich',
  },
  {
    icon: <GlobeIcon />,
    title: content.appShowcase[2].title,
    description: content.appShowcase[2].description,
  },
  {
    icon: <HomeIcon />,
    title: content.appShowcase[3].title,
    description: content.appShowcase[3].description,
  },
  {
    icon: <MapPinIcon />,
    title: content.appShowcase[4].title,
    description: content.appShowcase[4].description,
  },
  {
    icon: <PhoneIcon />,
    title: content.appShowcase[5].title,
    description: content.appShowcase[5].description,
  },
  {
    icon: <HomeIcon />,
    title: content.appShowcase[6].title,
    description: content.appShowcase[6].description,
  }
];

const howItWorksSteps = [
  {
    icon: <KeyIcon size={32} />,
    title: content.howItWorksSteps[0].title,
    description: content.howItWorksSteps[0].description,
    details: content.howItWorksSteps[0].details
  },
  {
    icon: <SmartphoneIcon size={32} />,
    title: content.howItWorksSteps[1].title,
    description: content.howItWorksSteps[1].description,
    details: content.howItWorksSteps[1].details
  },
  {
    icon: <SettingsIcon size={32} />,
    title: content.howItWorksSteps[2].title,
    description: content.howItWorksSteps[2].description,
    details: content.howItWorksSteps[2].details
  },
  {
    icon: <CheckIcon size={32} />,
    title: content.howItWorksSteps[3].title,
    description: content.howItWorksSteps[3].description,
    details: content.howItWorksSteps[3].details
  }
];

const appDetails = content.appDetails;

export default function TrackingPage() {
  const pageUrl = useLocalizedUrl('/location-tracking/');
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
        image="/img/the_map.webp"
        imageAlt={content.hero.imageAlt}
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=tracking"
        showSecondary={true}
      />

      <main>
        <FeatureShowcase
          title={content.trackingPage.title3}
          subtitle={content.trackingPage.subtitle2}
          items={appShowcase}
        />

        <HowItWorks
          title={content.trackingPage.title4}
          subtitle={content.trackingPage.subtitle3}
          steps={howItWorksSteps}
        />

        <section className={styles.detailedSetup}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.trackingPage.heading}</h2>
            <p className={styles.sectionSubtitle}>{content.trackingPage.p}</p>

            <div className={styles.setupGrid}>
              {appDetails.map((app, index) => (
                <div key={index} className={styles.setupCard}>
                  <h3 className={styles.setupTitle}>{app.name}</h3>
                  <p className={styles.setupDescription}>{app.description}</p>

                  <div className={styles.featuresSection}>
                    <h4 className={styles.featuresTitle}>{content.trackingPage.h4}</h4>
                    <ul className={styles.featuresList}>
                      {app.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.stepsSection}>
                    <h4 className={styles.stepsTitle}>{content.trackingPage.h42}</h4>
                    <ol className={styles.stepsList}>
                      {app.setupSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.docsLink}>
              <p>{content.trackingPage.text}{' '}
                <EnOnlyLink to="/docs/getting-started/track-your-location">{content.trackingPage.EnOnlyLink}</EnOnlyLink>{content.trackingPage.text2}</p>
            </div>
          </div>
        </section>

        <section className={styles.apiSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.trackingPage.heading2}</h2>
            <p className={styles.sectionSubtitle}>{content.trackingPage.p2}</p>
            <div className={styles.endpointsGrid}>
              <div className={styles.endpointCard}>
                <h3 className={styles.endpointTitle}>{content.trackingPage.h3}</h3>
                <code className={styles.endpointCode}>{content.trackingPage.code}</code>
                <p className={styles.endpointDesc}>{content.trackingPage.p3}</p>
              </div>
              <div className={styles.endpointCard}>
                <h3 className={styles.endpointTitle}>{content.trackingPage.h32}</h3>
                <code className={styles.endpointCode}>{content.trackingPage.code2}</code>
                <p className={styles.endpointDesc}>{content.trackingPage.p4}</p>
              </div>
            </div>
            <p className={styles.apiNote}>{content.trackingPage.text3}{' '}
              <EnOnlyLink to="/docs/api/dawarich-api">{content.trackingPage.EnOnlyLink2}</EnOnlyLink>{content.trackingPage.text2}</p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>{content.trackingPage.heading3}</h2>
            <p className={styles.ctaSubtitle}>{content.trackingPage.p5}</p>
            <div className={styles.ctaButtons}>
              <SmartLink
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=tracking">{content.trackingPage.Link}</SmartLink>
              <EnOnlyLink
                className={styles.secondaryCta}
                to="/docs/self-hosting/installation/docker">{content.trackingPage.EnOnlyLink3}</EnOnlyLink>
            </div>
            <p className="feature-cta-reassurance">{content.trackingPage.p6}</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
