import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/pages/import-export.json';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import ToolGuide from '@site/src/components/ToolGuide';
import {
  MapIcon,
  ActivityIcon,
  MapPinIcon,
  BarChartIcon,
  CameraIcon,
  PackageIcon,
  FolderIcon,
  HourglassIcon,
  CheckIcon,
  UploadIcon,
  CalendarIcon,
  SettingsIcon,
  TimerIcon,
  SaveIcon,
  UnlockIcon,
  RocketIcon,
  SparklesIcon,
  RefreshIcon,
} from '@site/src/components/LucideIcons';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import styles from './import-export.module.css';

const importFormats = [
  {
    icon: <MapIcon />,
    title: content.importFormats[0].title,
    description: content.importFormats[0].description,
  },
  {
    icon: <ActivityIcon />,
    title: content.importFormats[1].title,
    description: content.importFormats[1].description,
  },
  {
    icon: <MapPinIcon />,
    title: content.importFormats[2].title,
    description: content.importFormats[2].description,
  },
  {
    icon: <BarChartIcon />,
    title: content.importFormats[3].title,
    description: content.importFormats[3].description,
  },
  {
    icon: <MapIcon />,
    title: content.importFormats[4].title,
    description: content.importFormats[4].description,
  },
  {
    icon: <CameraIcon />,
    title: content.importFormats[5].title,
    description: content.importFormats[5].description
  }
];

const exportFormats = [
  {
    icon: <MapPinIcon />,
    title: content.exportFormats[0].title,
    description: content.exportFormats[0].description,
  },
  {
    icon: <BarChartIcon />,
    title: content.exportFormats[1].title,
    description: content.exportFormats[1].description,
  },
  {
    icon: <PackageIcon />,
    title: content.exportFormats[2].title,
    description: content.exportFormats[2].description
  }
];

const importSteps = [
  {
    icon: <FolderIcon size={32} />,
    title: content.importSteps[0].title,
    description: content.importSteps[0].description,
    details: content.importSteps[0].details
  },
  {
    icon: <HourglassIcon size={32} />,
    title: content.importSteps[1].title,
    description: content.importSteps[1].description,
    details: content.importSteps[1].details
  },
  {
    icon: <CheckIcon size={32} />,
    title: content.importSteps[2].title,
    description: content.importSteps[2].description,
    details: content.importSteps[2].details
  }
];

const exportSteps = [
  {
    icon: <UploadIcon size={32} />,
    title: content.exportSteps[0].title,
    description: content.exportSteps[0].description,
  },
  {
    icon: <CalendarIcon size={32} />,
    title: content.exportSteps[1].title,
    description: content.exportSteps[1].description,
    details: content.exportSteps[1].details
  },
  {
    icon: <SettingsIcon size={32} />,
    title: content.exportSteps[2].title,
    description: content.exportSteps[2].description,
    details: content.exportSteps[2].details
  },
  {
    icon: <TimerIcon size={32} />,
    title: content.importSteps[1].title,
    description: content.exportSteps[3].description,
    details: content.exportSteps[3].details
  },
  {
    icon: <SaveIcon size={32} />,
    title: content.exportSteps[4].title,
    description: content.exportSteps[4].description,
    details: content.exportSteps[4].details
  }
];

export default function ImportExportPage() {
  const pageUrl = useLocalizedUrl('/import-export/');
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
        image="/img/imports.png"
        imageAlt={content.hero.imageAlt}
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=import-export"
        showSecondary={true}
      />

      <main>
        <section className={styles.principlesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.importExportPage.heading}</h2>
            <div className={styles.principlesGrid}>
              <div className={styles.principle}>
                <div className={styles.principleIcon}><UnlockIcon size={48} /></div>
                <h3 className={styles.principleTitle}>{content.importExportPage.h3}</h3>
                <p className={styles.principleText}>{content.importExportPage.p}</p>
              </div>
              <div className={styles.principle}>
                <div className={styles.principleIcon}><RocketIcon size={48} /></div>
                <h3 className={styles.principleTitle}>{content.importExportPage.h32}</h3>
                <p className={styles.principleText}>{content.importExportPage.p2}</p>
              </div>
              <div className={styles.principle}>
                <div className={styles.principleIcon}><SaveIcon size={48} /></div>
                <h3 className={styles.principleTitle}>{content.importExportPage.h33}</h3>
                <p className={styles.principleText}>{content.importExportPage.p3}</p>
              </div>
            </div>
          </div>
        </section>

        <FeatureShowcase
          title={content.importExportPage.title3}
          subtitle={content.importExportPage.subtitle2}
          items={importFormats}
        />

        <HowItWorks
          title={content.importExportPage.title4}
          subtitle={content.importExportPage.subtitle3}
          steps={importSteps}
        />

        <section className={styles.deduplicationNote}>
          <div className={styles.container}>
            <div className={styles.noteCard}>
              <div className={styles.noteIcon}><SparklesIcon size={48} /></div>
              <div className={styles.noteContent}>
                <h3 className={styles.noteTitle}>{content.importExportPage.h34}</h3>
                <p className={styles.noteText}>{content.importExportPage.p4}</p>
              </div>
            </div>
          </div>
        </section>

        <FeatureShowcase
          title={content.importExportPage.title5}
          subtitle={content.importExportPage.subtitle4}
          items={exportFormats}
        />

        <HowItWorks
          title={content.importExportPage.title6}
          subtitle={content.importExportPage.subtitle5}
          steps={exportSteps}
        />

        <section className={styles.useCasesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{content.importExportPage.heading2}</h2>
            <div className={styles.useCasesGrid}>
              <div className={styles.useCase}>
                <div className={styles.useCaseIcon}><RefreshIcon /></div>
                <h3 className={styles.useCaseTitle}>{content.importExportPage.h35}</h3>
                <p className={styles.useCaseText}>{content.importExportPage.p5}</p>
              </div>
              <div className={styles.useCase}>
                <div className={styles.useCaseIcon}><SaveIcon /></div>
                <h3 className={styles.useCaseTitle}>{content.importExportPage.h36}</h3>
                <p className={styles.useCaseText}>{content.importExportPage.p6}</p>
              </div>
              <div className={styles.useCase}>
                <div className={styles.useCaseIcon}><MapIcon /></div>
                <h3 className={styles.useCaseTitle}>{content.importExportPage.h37}</h3>
                <p className={styles.useCaseText}>{content.importExportPage.p7}</p>
              </div>
            </div>
          </div>
        </section>

        <ToolGuide content={content.guide} />
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>{content.importExportPage.heading3}</h2>
            <p className={styles.ctaSubtitle}>{content.importExportPage.p8}</p>
            <div className={styles.ctaButtons}>
              <SmartLink
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=import-export">{content.importExportPage.Link}</SmartLink>
              <EnOnlyLink
                className={styles.secondaryCta}
                to="/docs/self-hosting/installation/docker">{content.importExportPage.EnOnlyLink}</EnOnlyLink>
            </div>
            <p className="feature-cta-reassurance">{content.importExportPage.p9}</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
