import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import Link from '@docusaurus/Link';
import styles from './import-export.module.css';

const importFormats = [
  {
    icon: '🗺️',
    title: 'Google Takeout',
    description: 'Import your complete location history from Google Maps Timeline. Bring years of data into Dawarich with a single upload.',
  },
  {
    icon: '🍎',
    title: 'Apple Health & Fitness',
    description: 'Import GPX files exported from Apple Health or Apple Fitness apps. Perfect for iPhone users.',
  },
  {
    icon: '📍',
    title: 'GPX Files',
    description: 'Standard GPS Exchange Format files from any source. The universal format for location data.',
  },
  {
    icon: '📊',
    title: 'CSV Files',
    description: 'Import location data from spreadsheets or custom exports in CSV format with flexible column mapping.',
  },
  {
    icon: '🗺️',
    title: 'KML Files',
    description: 'Import Keyhole Markup Language files from various mapping applications and GPS devices.',
  },
  {
    icon: '📸',
    title: 'Photo Metadata',
    description: 'Extract and import location data from EXIF metadata in your photo collections.'
  }
];

const exportFormats = [
  {
    icon: '📍',
    title: 'GPX Export',
    description: 'Export your location data as GPX files compatible with any GPS software or mapping application.',
  },
  {
    icon: '📊',
    title: 'GeoJSON Export',
    description: 'Get your data in GeoJSON format for easy integration with GIS tools and custom mapping solutions.',
  },
  {
    icon: '📦',
    title: 'Full Account Export',
    description: 'Download everything: all points, visits, trips, stats, and settings. Complete data portability.'
  }
];

const importSteps = [
  {
    icon: '📂',
    title: 'Upload Your File',
    description: 'Navigate to the Imports page in Dawarich and select your file.',
    details: [
      'Click "New Import" button',
      'Select the file(s) to upload',
      'Confirm to start processing',
      'Data format will be recognized automatically'
    ]
  },
  {
    icon: '⏳',
    title: 'Processing',
    description: 'Dawarich processes your import in the background. Large files may take a few minutes.',
    details: [
      'Points are validated for uniqueness',
      'No duplicate entries created',
      'Reverse geocoding runs automatically',
      'You\'ll receive a notification when import is complete'
    ]
  },
  {
    icon: '✅',
    title: 'Data Available',
    description: 'Once complete, all your imported data appears on your map and in your statistics.',
    details: [
      'View points on the interactive map',
      'Stats automatically updated',
      'Create trips from imported data',
      'Search and filter imported locations'
    ]
  }
];

const exportSteps = [
  {
    icon: '📤',
    title: 'Go to Points',
    description: 'Navigate to the Points page in your Dawarich dashboard.',
  },
  {
    icon: '📅',
    title: 'Select Date Range',
    description: 'Choose the specific date range for the data you want to export and hit Search.',
    details: [
      'Select start and end dates',
      'Click "Search" to filter points',
      'Ensure all desired data is visible'
    ]
  },
  {
    icon: '⚙️',
    title: 'Choose Format',
    description: 'Click the Export button',
    details: [
      'Select between GPX or GeoJSON',
      'Full export for complete backup'
    ]
  },
  {
    icon: '⏱️',
    title: 'Processing',
    description: 'Dawarich generates your export file in the background.',
    details: [
      'Small exports complete instantly',
      'Large exports may take a few minutes',
      'You can continue using Dawarich'
    ]
  },
  {
    icon: '💾',
    title: 'Download',
    description: 'Once ready, download your export file.',
    details: [
      'Download link appears on Exports page',
      'Files stored securely',
      'Re-download anytime'
    ]
  }
];

export default function ImportExportPage() {
  return (
    <Layout
      title="Import & Export Data"
      description="Your data belongs to you. Import from Google Takeout, GPX, CSV, KML. Export to GPX, CSV, or get a full account export. No lock-in.">
      <Head>
        <meta property="og:title" content="Dawarich Import & Export — Your Data, Your Control" />
        <meta property="og:description" content="Import from Google Maps, Apple Health, GPX, GeoJSON, KML. Export to any format. Full data portability with no lock-in." />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <FeatureHero
        badge="Data Portability"
        title="Your Data"
        titleHighlight="Belongs to You"
        subtitle="Import your location history from anywhere. Export it anytime, in any format. Dawarich believes in complete data portability with no lock-in — you're always in control."
        image="img/imports.jpeg"
        imageAlt="Import and export interface"
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=import-export"
        showSecondary={true}
      />

      <main>
        <section className={styles.principlesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Data Philosophy</h2>
            <div className={styles.principlesGrid}>
              <div className={styles.principle}>
                <div className={styles.principleIcon}>🔓</div>
                <h3 className={styles.principleTitle}>No Lock-In</h3>
                <p className={styles.principleText}>
                  Export all your data at any time. You're never trapped—switch to another service or keep your own backup.
                </p>
              </div>
              <div className={styles.principle}>
                <div className={styles.principleIcon}>🚀</div>
                <h3 className={styles.principleTitle}>Migration Friendly</h3>
                <p className={styles.principleText}>
                  Moving from Google Maps Timeline or any other tracker? Import everything easily and pick up where you left off.
                </p>
              </div>
              <div className={styles.principle}>
                <div className={styles.principleIcon}>💾</div>
                <h3 className={styles.principleTitle}>Complete Control</h3>
                <p className={styles.principleText}>
                  Download everything: points, visits, trips, stats, settings. Your complete digital location history belongs to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FeatureShowcase
          title="Supported Import Formats"
          subtitle="Bring your location data from virtually any source into Dawarich."
          items={importFormats}
        />

        <HowItWorks
          title="How Importing Works"
          subtitle="Get your historical location data into Dawarich in a few simple steps."
          steps={importSteps}
        />

        <section className={styles.deduplicationNote}>
          <div className={styles.container}>
            <div className={styles.noteCard}>
              <div className={styles.noteIcon}>✨</div>
              <div className={styles.noteContent}>
                <h3 className={styles.noteTitle}>Smart Deduplication</h3>
                <p className={styles.noteText}>
                  Dawarich automatically prevents duplicate points. Import the same file twice or have your tracking app
                  report the same location—we ensure each unique point is only stored once.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FeatureShowcase
          title="Supported Export Formats"
          subtitle="Take your data with you—anywhere, anytime, in any format you need."
          items={exportFormats}
        />

        <HowItWorks
          title="How Exporting Works"
          subtitle="Download your location data quickly and securely."
          steps={exportSteps}
        />

        <section className={styles.useCasesSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Import & Export Matters</h2>
            <div className={styles.useCasesGrid}>
              <div className={styles.useCase}>
                <div className={styles.useCaseIcon}>🔄</div>
                <h3 className={styles.useCaseTitle}>Switching Services</h3>
                <p className={styles.useCaseText}>
                  Easily migrate your complete location history from Google Maps Timeline or any other service to Dawarich.
                </p>
              </div>
              <div className={styles.useCase}>
                <div className={styles.useCaseIcon}>💾</div>
                <h3 className={styles.useCaseTitle}>Regular Backups</h3>
                <p className={styles.useCaseText}>
                  Export your data regularly to create backups. Keep local copies of your entire location history.
                </p>
              </div>
              <div className={styles.useCase}>
                <div className={styles.useCaseIcon}>🗺️</div>
                <h3 className={styles.useCaseTitle}>Cross-Platform</h3>
                <p className={styles.useCaseText}>
                  Use GPX exports in other GPS software, mapping applications, or import into different platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Own Your Location Data</h2>
            <p className={styles.ctaSubtitle}>
              Start with a free account and import your existing location history today.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=import-export">
                Try 7 Days for Free
              </Link>
              <Link
                className={styles.secondaryCta}
                to="/docs/self-hosting/installation/docker">
                Self-Host for Free
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
