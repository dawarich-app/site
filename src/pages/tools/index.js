import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/index.json';
import styles from './index.module.css';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = 'https://dawarich.app/img/meta-image.png';

const freeTools = [
  {
    to: '/tools/timeline-visualizer',
    icon: '🗺️',
    title: content.tools[0].title,
    description: content.tools[0].description,
  },
  {
    to: '/tools/google-timeline-converter',
    icon: '🔄',
    title: content.tools[1].title,
    description: content.tools[1].description,
  },
  {
    to: '/tools/timeline-statistics',
    icon: '📊',
    title: content.tools[2].title,
    description: content.tools[2].description,
  },
  {
    to: '/tools/timeline-mileage-calculator',
    icon: '🚗',
    title: content.tools[3].title,
    description: content.tools[3].description,
  },
  {
    to: '/tools/timeline-merger',
    icon: '🔗',
    title: content.tools[4].title,
    description: content.tools[4].description,
  },
  {
    to: '/tools/google-timeline-splitter',
    icon: '✂️',
    title: content.tools[5].title,
    description: content.tools[5].description,
  },
  {
    to: '/tools/gps-file-splitter',
    icon: '✂️',
    title: content.tools[6].title,
    description: content.tools[6].description,
  },
  {
    to: '/tools/timeline-format-detector',
    icon: '🔍',
    title: content.tools[7].title,
    description: content.tools[7].description,
  },
  {
    to: '/tools/heatmap-generator',
    icon: '🔥',
    title: content.tools[8].title,
    description: content.tools[8].description,
  },
  {
    to: '/tools/map-poster-maker',
    icon: '🖼️',
    title: content.tools[9].title,
    description: content.tools[9].description,
  },
  {
    to: '/tools/gpx-merger',
    icon: '🔗',
    title: content.tools[10].title,
    description: content.tools[10].description,
  },
  {
    to: '/tools/photo-geotagging',
    icon: '📸',
    title: content.tools[11].title,
    description: content.tools[11].description,
  },
];

const converterGroups = [
  {
    source: content.converters[0].source,
    description: content.converters[0].description,
    targets: [
      { to: '/tools/fit-to-gpx', label: content.converters[0].targets[0].label },
      { to: '/tools/fit-to-geojson', label: content.converters[0].targets[1].label },
      { to: '/tools/fit-to-kml', label: content.converters[0].targets[2].label },
    ],
  },
  {
    source: content.converters[1].source,
    description: content.converters[1].description,
    targets: [
      { to: '/tools/tcx-to-gpx', label: content.converters[1].targets[0].label },
      { to: '/tools/tcx-to-geojson', label: content.converters[1].targets[1].label },
      { to: '/tools/tcx-to-kml', label: content.converters[1].targets[2].label },
    ],
  },
  {
    source: content.converters[2].source,
    description: content.converters[2].description,
    targets: [
      { to: '/tools/gpx-to-geojson', label: content.converters[2].targets[0].label },
      { to: '/tools/gpx-to-kml', label: content.converters[2].targets[1].label },
      { to: '/tools/gpx-to-kmz', label: content.converters[2].targets[2].label },
    ],
  },
  {
    source: content.converters[3].source,
    description: content.converters[3].description,
    targets: [
      { to: '/tools/geojson-to-gpx', label: content.converters[3].targets[0].label },
      { to: '/tools/geojson-to-kml', label: content.converters[3].targets[1].label },
      { to: '/tools/geojson-to-kmz', label: content.converters[3].targets[2].label },
    ],
  },
  {
    source: content.converters[4].source,
    description: content.converters[4].description,
    targets: [
      { to: '/tools/kml-to-gpx', label: content.converters[4].targets[0].label },
      { to: '/tools/kml-to-geojson', label: content.converters[4].targets[1].label },
      { to: '/tools/kml-to-kmz', label: content.converters[4].targets[2].label },
    ],
  },
  {
    source: content.converters[5].source,
    description: content.converters[5].description,
    targets: [
      { to: '/tools/kmz-to-gpx', label: content.converters[5].targets[0].label },
      { to: '/tools/kmz-to-geojson', label: content.converters[5].targets[1].label },
      { to: '/tools/kmz-to-kml', label: content.converters[5].targets[2].label },
    ],
  },
];

export default function ToolsHub() {
  const pageUrl = useLocalizedUrl('/tools/');
  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <main>

      <header className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>{content.h1}</h1>
          <p className={styles.heroSubtitle}>
            {content.intro}
          </p>
          <div className={styles.heroNav}>
            <Link to="#free-tools" className={styles.heroNavLink}>{content.toolsHeading}</Link>
            <Link to="#converters" className={styles.heroNavLink}>{content.convertersHeading}</Link>
          </div>
        </div>
      </header>

      <section id="free-tools" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{content.toolsHeading}</h2>
          <p className={styles.sectionSubtitle}>
            {content.toolsIntro}
          </p>
          <div className={styles.toolsGrid}>
            {freeTools.map((tool) => (
              <Link key={tool.to} to={tool.to} className={styles.toolCard}>
                <span className={styles.toolIcon}>{tool.icon}</span>
                <h3 className={styles.toolTitle}>{tool.title}</h3>
                <p className={styles.toolDescription}>{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="converters" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{content.convertersHeading}</h2>
          <p className={styles.sectionSubtitle}>
            {content.convertersIntro}
          </p>
          <div className={styles.converterGroups}>
            {converterGroups.map((group) => (
              <div key={group.source} className={styles.converterGroup}>
                <div className={styles.converterGroupHeader}>
                  <h3 className={styles.converterSource}>{group.source}</h3>
                  <p className={styles.converterDescription}>{group.description}</p>
                </div>
                <ul className={styles.converterList}>
                  {group.targets.map((target) => (
                    <li key={target.to}>
                      <Link to={target.to} className={styles.converterLink}>
                        {target.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>{content.ctaTitle}</h2>
          <p className={styles.ctaSubtitle}>
            {content.ctaBody}
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/" className={styles.ctaPrimary}>{content.ctaButton}</Link>
            <Link to="/#pricing" className={styles.ctaSecondary}>{content.pricingButton}</Link>
          </div>
        </div>
      </section>
      </main>
    </Layout>
  );
}
