import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import FeatureCard, { FeatureCardGrid } from '@site/src/components/FeatureCard';
import Link from '@docusaurus/Link';
import styles from './integrations.module.css';

const integrationsShowcase = [
  {
    icon: '📸',
    title: 'Immich',
    description: 'Self-hosted photo and video backup solution. Connect your Immich instance to display your photos on the map at the exact locations they were taken.',
    image: 'img/map-photos.png',
    imageAlt: 'Photos on map from Immich'
  },
  {
    icon: '🖼️',
    title: 'PhotoPrism',
    description: 'AI-powered photo management app. Integrate PhotoPrism to see your entire photo library on your location timeline.',
    image: 'img/trip-details.png',
    imageAlt: 'Trip with PhotoPrism photos'
  }
];

const benefits = [
  {
    icon: '🗺️',
    title: 'Photos on Map',
    description: 'See all your photos plotted on the interactive map at their exact GPS coordinates. Rediscover where each memory was made.'
  },
  {
    icon: '✈️',
    title: 'Photos in Trips',
    description: 'Trip pages automatically show photos taken during that trip. Your travel journal becomes a rich multimedia experience.'
  },
  {
    icon: '📅',
    title: 'Photo Timeline',
    description: 'Browse your photos chronologically alongside your location data. See the complete story of each day.'
  },
  {
    icon: '🔒',
    title: 'Privacy Preserved',
    description: 'Dawarich never stores your photos. It only reads location data from your self-hosted photo apps via their APIs.'
  }
];

const setupSteps = [
  {
    icon: '🔑',
    title: 'Get API Keys',
    description: 'Generate API keys from your Immich or PhotoPrism instance.',
    details: [
      'Immich: Create key with asset.read scope',
      'PhotoPrism: Generate key in Apps and Devices settings',
      'Keep your keys secure'
    ]
  },
  {
    icon: '⚙️',
    title: 'Configure in Dawarich',
    description: 'Enter your photo service details in Dawarich settings.',
    details: [
      'Navigate to Settings page',
      'Find Photo Integration section',
      'Enter your service URL',
      'Paste your API key',
      'Click Save'
    ]
  },
  {
    icon: '🔄',
    title: 'Sync Complete',
    description: 'Dawarich connects to your photo service and indexes location data.',
    details: [
      'Photos are indexed by location',
      'EXIF GPS data is extracted',
      'No photos are copied or stored',
      'Only metadata is used'
    ]
  },
  {
    icon: '🎉',
    title: 'View Photos',
    description: 'Photos now appear on your map and in your trips.',
    details: [
      'Enable Photos layer on the map',
      'Click photo markers to view',
      'See photos automatically in trips',
      'Browse by location and date'
    ]
  }
];

const futureIntegrations = [
  {
    icon: '📱',
    title: 'Fitness Apps',
    description: 'Integration with fitness tracking apps to combine workout routes with your location history.'
  },
  {
    icon: '📝',
    title: 'Note-Taking Apps',
    description: 'Connect your notes to locations automatically. See what you wrote and where you wrote it.'
  },
  {
    icon: '🎵',
    title: 'Music Services',
    description: 'Track what you were listening to at different locations throughout your day.'
  },
  {
    icon: '☁️',
    title: 'Cloud Services',
    description: 'Deeper integrations with various cloud storage and productivity services.'
  }
];

export default function IntegrationsPage() {
  return (
    <Layout
      title="Photo Integrations"
      description="Connect your Immich or PhotoPrism instance to see photos on your map and in trips. Your map becomes a rich multimedia experience.">
      <Head>
        <meta property="og:title" content="Dawarich Integrations — Connect Your Digital Life" />
        <meta property="og:description" content="Integrate Immich and PhotoPrism photo libraries with your location history. See photos on the map and in trips automatically." />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <FeatureHero
        badge="Connected Experience"
        title="Connect Your"
        titleHighlight="Digital Life"
        subtitle="Bring your photos into your location timeline. Dawarich integrates with Immich and PhotoPrism to display your photos on the map and in trips—turning your location history into a rich, visual experience."
        image="img/map-photos.png"
        imageAlt="Photos displayed on map"
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=integrations"
        showSecondary={true}
      />

      <main>
        <section className={styles.valueSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Photo Integration?</h2>
            <p className={styles.sectionSubtitle}>
              Your location data becomes more meaningful when combined with the photos you took.
              Rediscover memories by seeing exactly where each photo was taken.
            </p>
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
          title="Supported Photo Services"
          subtitle="Dawarich works seamlessly with popular self-hosted photo management solutions."
          items={integrationsShowcase}
        />

        <HowItWorks
          title="How to Set Up"
          subtitle="Connect your photo library to Dawarich in just a few steps."
          steps={setupSteps}
        />

        <section className={styles.privacySection}>
          <div className={styles.container}>
            <div className={styles.privacyCard}>
              <div className={styles.privacyIcon}>🔒</div>
              <div className={styles.privacyContent}>
                <h3 className={styles.privacyTitle}>Your Photos Stay Private</h3>
                <p className={styles.privacyText}>
                  Dawarich <strong>does not store or copy your photos</strong>. It only reads location metadata
                  from your self-hosted photo service via its API. Your photos remain safely in your Immich or
                  PhotoPrism instance, under your complete control.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.technicalDetails}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Technical Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <h3 className={styles.detailTitle}>🔧 Immich Setup</h3>
                <p className={styles.detailText}>
                  Requires an API key with <code>asset.read</code> scope. Dawarich queries the Immich API
                  to read photo metadata including GPS coordinates from EXIF data.
                </p>
                <Link to="https://immich.app/docs/features/command-line-interface#obtain-the-api-key" className={styles.detailLink}>
                  How to obtain Immich API key →
                </Link>
              </div>
              <div className={styles.detailCard}>
                <h3 className={styles.detailTitle}>🖼️ PhotoPrism Setup</h3>
                <p className={styles.detailText}>
                  Generate an API key in PhotoPrism's "Apps and Devices" settings. Dawarich uses this
                  to access your photo library and extract location information.
                </p>
                <Link to="https://docs.photoprism.app/user-guide/settings/account/#apps-and-devices" className={styles.detailLink}>
                  How to obtain PhotoPrism API key →
                </Link>
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
            <p className={styles.futureNote}>
              Have an integration idea? <Link to="https://discourse.dawarich.app/">Share it on our community forum!</Link>.
            </p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Connect Your Photo Library Today</h2>
            <p className={styles.ctaSubtitle}>
              Start seeing your photos on the map with a free Dawarich account.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=integrations">
                Try 7 Days for Free
              </Link>
              <Link
                className={styles.secondaryCta}
                to="/docs/tutorials/installation">
                Self-Host for Free
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
