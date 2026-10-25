import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/pages/statistics.json';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import {
  BarChartIcon,
  GlobeIcon,
  RouteIcon,
  MailIcon,
  SmartphoneIcon,
  MapIcon,
  RefreshIcon,
  LinkIcon,
  LockIcon,
  CalendarIcon,
  DumbbellIcon,
  SearchIcon,
  PartyIcon,
} from '@site/src/components/LucideIcons';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import styles from './stats.module.css';

const showcaseItems = [
  {
    icon: <BarChartIcon />,
    title: content.showcaseItems[0].title,
    description: content.showcaseItems[0].description,
  },
  {
    icon: <GlobeIcon />,
    title: content.showcaseItems[1].title,
    description: content.showcaseItems[1].description,
  },
  {
    icon: <RouteIcon />,
    title: content.showcaseItems[2].title,
    description: content.showcaseItems[2].description,
  },
  {
    icon: <MailIcon />,
    title: content.showcaseItems[3].title,
    description: content.showcaseItems[3].description,
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
    icon: <BarChartIcon size={32} />,
    title: content.howItWorksSteps[1].title,
    description: content.howItWorksSteps[1].description,
    details: content.howItWorksSteps[1].details
  },
  {
    icon: <MapIcon size={32} />,
    title: content.howItWorksSteps[2].title,
    description: content.howItWorksSteps[2].description,
    details: content.howItWorksSteps[2].details
  },
  {
    icon: <RefreshIcon size={32} />,
    title: content.howItWorksSteps[3].title,
    description: content.howItWorksSteps[3].description,
    details: content.howItWorksSteps[3].details
  }
];

const shareFeatures = [
  {
    icon: <LinkIcon size={48} />,
    title: content.shareFeatures[0].title,
    description: content.shareFeatures[0].description
  },
  {
    icon: <LockIcon size={48} />,
    title: content.shareFeatures[1].title,
    description: content.shareFeatures[1].description
  }
];

export default function StatsPage() {
  const pageUrl = useLocalizedUrl('/statistics/');
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
        image="/img/features-stats.png"
        imageAlt={content.hero.imageAlt}
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=stats"
        showSecondary={true}
      />

      <main>
        <section className={styles.statsTypes}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.statsPage.heading}</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><GlobeIcon /></div>
                <h3 className={styles.statTitle}>{content.statsPage.h3}</h3>
                <ul className={styles.statList}>
                  <li>{content.statsPage.li}</li>
                  <li>{content.statsPage.li2}</li>
                  <li>{content.statsPage.li3}</li>
                </ul>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><CalendarIcon /></div>
                <h3 className={styles.statTitle}>{content.statsPage.h32}</h3>
                <ul className={styles.statList}>
                  <li>{content.statsPage.li4}</li>
                  <li>{content.statsPage.li5}</li>
                  <li>{content.statsPage.li6}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <FeatureShowcase
          title={content.statsPage.title3}
          subtitle={content.statsPage.subtitle2}
          items={showcaseItems}
        />

        <section className={styles.sharingSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.statsPage.heading2}</h2>
            <p className={styles.sectionSubtitle}>{content.statsPage.p}</p>
            <div className={styles.sharingGrid}>
              {shareFeatures.map((feature, index) => (
                <div key={index} className={styles.sharingCard}>
                  <div className={styles.sharingIcon}>{feature.icon}</div>
                  <h3 className={styles.sharingTitle}>{feature.title}</h3>
                  <p className={styles.sharingText}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks
          title={content.statsPage.title4}
          subtitle={content.statsPage.subtitle3}
          steps={howItWorksSteps}
        />

        <section className={styles.whyItMatters}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.statsPage.heading3}</h2>
            <div className={styles.reasonsGrid}>
              <div className={styles.reason}>
                <div className={styles.reasonIcon}><DumbbellIcon size={48} /></div>
                <h3 className={styles.reasonTitle}>{content.statsPage.h33}</h3>
                <p className={styles.reasonText}>{content.statsPage.p2}</p>
              </div>
              <div className={styles.reason}>
                <div className={styles.reasonIcon}><SearchIcon size={48} /></div>
                <h3 className={styles.reasonTitle}>{content.statsPage.h34}</h3>
                <p className={styles.reasonText}>{content.statsPage.p3}</p>
              </div>
              <div className={styles.reason}>
                <div className={styles.reasonIcon}><PartyIcon size={48} /></div>
                <h3 className={styles.reasonTitle}>{content.statsPage.h35}</h3>
                <p className={styles.reasonText}>{content.statsPage.p4}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>{content.statsPage.heading4}</h2>
            <p className={styles.ctaSubtitle}>{content.statsPage.p5}</p>
            <div className={styles.ctaButtons}>
              <SmartLink
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=stats">{content.statsPage.Link}</SmartLink>
              <EnOnlyLink
                className={styles.secondaryCta}
                to="/docs/self-hosting/installation/docker">{content.statsPage.EnOnlyLink}</EnOnlyLink>
            </div>
            <p className="feature-cta-reassurance">{content.statsPage.p6}</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
