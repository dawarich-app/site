import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const pageTitle = 'Free GPS Tools & Format Converters | Dawarich';
const pageDescription = 'Privacy-first online tools for visualizing, analyzing, merging, and converting GPS and location history files. Everything runs in your browser — no data leaves your device.';
const pageUrl = 'https://dawarich.app/tools';
const imageUrl = 'https://dawarich.app/img/meta-image.jpg';

const freeTools = [
  {
    to: '/tools/timeline-visualizer',
    icon: '🗺️',
    title: 'Google Timeline Visualizer',
    description: 'View your exported Google Timeline data on an interactive map. Supports all export formats.',
  },
  {
    to: '/tools/google-timeline-converter',
    icon: '🔄',
    title: 'Google Timeline Converter',
    description: 'Convert Google Timeline exports between formats. Handles Records.json and Semantic Location History.',
  },
  {
    to: '/tools/timeline-statistics',
    icon: '📊',
    title: 'Timeline Statistics Analyzer',
    description: 'Get insights into your location history: total distance, countries, cities, visits, and more.',
  },
  {
    to: '/tools/timeline-mileage-calculator',
    icon: '🚗',
    title: 'Timeline Mileage Calculator',
    description: 'Calculate total driving and travel distance from your Google Timeline data.',
  },
  {
    to: '/tools/timeline-merger',
    icon: '🔗',
    title: 'Timeline Data Merger',
    description: 'Combine multiple Google Timeline exports into a single dataset without duplicates.',
  },
  {
    to: '/tools/google-timeline-splitter',
    icon: '✂️',
    title: 'Google Timeline Splitter',
    description: 'Split a large Google Timeline file into smaller chunks by year or month.',
  },
  {
    to: '/tools/gps-file-splitter',
    icon: '✂️',
    title: 'GPS File Splitter',
    description: 'Break large GPX, KML, and GeoJSON files into smaller pieces for easier handling.',
  },
  {
    to: '/tools/timeline-format-detector',
    icon: '🔍',
    title: 'Timeline Format Detector',
    description: 'Identify which Google Timeline export format your file uses so you know how to process it.',
  },
  {
    to: '/tools/heatmap-generator',
    icon: '🔥',
    title: 'GPS Heatmap Generator',
    description: 'Turn location history into a heatmap showing where you spend the most time.',
  },
  {
    to: '/tools/gpx-merger',
    icon: '🔗',
    title: 'GPX Track Merger',
    description: 'Combine multiple GPX files into a single track. Useful for multi-day trips or imports.',
  },
  {
    to: '/tools/photo-geotagging',
    icon: '📸',
    title: 'Photo Geodata Extraction',
    description: 'Extract GPS coordinates and location metadata from your photos (EXIF data).',
  },
];

const converterGroups = [
  {
    source: 'FIT',
    description: 'Garmin activity files',
    targets: [
      { to: '/tools/fit-to-gpx', label: 'FIT → GPX' },
      { to: '/tools/fit-to-geojson', label: 'FIT → GeoJSON' },
      { to: '/tools/fit-to-kml', label: 'FIT → KML' },
    ],
  },
  {
    source: 'TCX',
    description: 'Training Center XML',
    targets: [
      { to: '/tools/tcx-to-gpx', label: 'TCX → GPX' },
      { to: '/tools/tcx-to-geojson', label: 'TCX → GeoJSON' },
      { to: '/tools/tcx-to-kml', label: 'TCX → KML' },
    ],
  },
  {
    source: 'GPX',
    description: 'GPS exchange format',
    targets: [
      { to: '/tools/gpx-to-geojson', label: 'GPX → GeoJSON' },
      { to: '/tools/gpx-to-kml', label: 'GPX → KML' },
      { to: '/tools/gpx-to-kmz', label: 'GPX → KMZ' },
    ],
  },
  {
    source: 'GeoJSON',
    description: 'Web-standard GPS format',
    targets: [
      { to: '/tools/geojson-to-gpx', label: 'GeoJSON → GPX' },
      { to: '/tools/geojson-to-kml', label: 'GeoJSON → KML' },
      { to: '/tools/geojson-to-kmz', label: 'GeoJSON → KMZ' },
    ],
  },
  {
    source: 'KML',
    description: 'Google Earth format',
    targets: [
      { to: '/tools/kml-to-gpx', label: 'KML → GPX' },
      { to: '/tools/kml-to-geojson', label: 'KML → GeoJSON' },
      { to: '/tools/kml-to-kmz', label: 'KML → KMZ' },
    ],
  },
  {
    source: 'KMZ',
    description: 'Compressed Google Earth format',
    targets: [
      { to: '/tools/kmz-to-gpx', label: 'KMZ → GPX' },
      { to: '/tools/kmz-to-geojson', label: 'KMZ → GeoJSON' },
      { to: '/tools/kmz-to-kml', label: 'KMZ → KML' },
    ],
  },
];

export default function ToolsHub() {
  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
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

      <header className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Free GPS & Location Tools</h1>
          <p className={styles.heroSubtitle}>
            Privacy-first utilities for working with GPS and location history files.
            Everything runs in your browser — your data never leaves your device.
          </p>
          <div className={styles.heroNav}>
            <a href="#free-tools" className={styles.heroNavLink}>Free Tools</a>
            <a href="#converters" className={styles.heroNavLink}>Format Converters</a>
          </div>
        </div>
      </header>

      <section id="free-tools" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Free Tools</h2>
          <p className={styles.sectionSubtitle}>
            Visualize, analyze, merge, and split your location history — no uploads, no accounts.
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
          <h2 className={styles.sectionTitle}>Format Converters</h2>
          <p className={styles.sectionSubtitle}>
            Convert GPS and map data between formats. All processing happens locally in your browser.
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
          <h2 className={styles.ctaTitle}>Want the full Dawarich experience?</h2>
          <p className={styles.ctaSubtitle}>
            These tools handle one-off tasks. Dawarich is the complete location history platform —
            interactive maps, trips, statistics, photo integrations, and EU-hosted data privacy.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/" className={styles.ctaPrimary}>See Dawarich</Link>
            <Link to="/#pricing" className={styles.ctaSecondary}>Pricing</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
