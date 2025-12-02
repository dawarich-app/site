import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import FeatureCard, { FeatureCardGrid } from '@site/src/components/FeatureCard';
import Link from '@docusaurus/Link';
import styles from './trips.module.css';

const showcaseItems = [
  {
    icon: '🗺️',
    title: 'Interactive Trip Map',
    description: 'Every trip page comes with a beautiful interactive map showing your complete route with all the points you visited along the way.',

  },
  {
    icon: '📊',
    title: 'Comprehensive Statistics',
    description: 'See detailed stats for each trip including total distance traveled, duration, countries visited, and more features coming soon.',
  },
  {
    icon: '📝',
    title: 'Rich Text Journaling',
    description: 'Document your adventures with rich text descriptions and notes. Preserve memories and stories from your travels.',
  },
  {
    icon: '📸',
    title: 'Photo Integration',
    description: 'Photos from your Immich or PhotoPrism instance automatically appear on your trip map at the locations they were taken.',

  },
  {
    icon: '📋',
    title: 'Trip List Management',
    description: 'Organize all your trips in one place. Browse through past adventures and create new ones anytime.',

  }
];

const howItWorksSteps = [
  {
    icon: '📱',
    title: 'Track Your Movement',
    description: 'Let Dawarich automatically record your location while you travel using any supported tracking app.',
    details: [
      'Dawarich iOS app for seamless tracking',
      'Third-party apps like Overland, OwnTracks, GPSLogger',
      'Data syncs automatically to your account'
    ]
  },
  {
    icon: '➕',
    title: 'Create Your Trip',
    description: 'When you\'re back, create a new trip by setting the name and date range.',
    details: [
      'Choose start and end dates',
      'Give your trip a memorable name',
      'Dawarich automatically groups your location data'
    ]
  },
  {
    icon: '✍️',
    title: 'Add Your Story',
    description: 'Enhance your trip with notes, descriptions, and journal entries using the rich text editor.',
    details: [
      'Write about your experiences',
      'Add context to your locations',
      'Create a narrative of your journey'
    ]
  },
  {
    icon: '🎯',
    title: 'Explore and Share',
    description: 'View your trip on the interactive map, review statistics, and relive your adventure (Trips sharing coming soon)',
    details: [
      'See your complete route on the map',
      'Review distance, duration, and places visited',
      'Photos automatically appear on the map'
    ]
  }
];

export default function TripsPage() {
  return (
    <Layout
      title="Travel Trips & Journaling"
      description="Turn your travels into beautifully documented trips with interactive maps, statistics, rich text journaling, and photo integration.">
      <Head>
        <meta property="og:title" content="Dawarich Trips — Document Your Travel Adventures" />
        <meta property="og:description" content="Create comprehensive travel journals with interactive maps, detailed statistics, rich text descriptions, and automatic photo integration." />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <FeatureHero
        badge="Travel Journaling"
        title="Turn Your Travels Into"
        titleHighlight="Beautiful Trip Stories"
        subtitle="Automatically capture your movements and transform them into comprehensive travel journals. Each trip includes an interactive map, detailed statistics, rich text descriptions, and photos — all in one place."
        image="img/trip-details.png"
        imageAlt="Trip details with map and statistics"
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=trips"
        showSecondary={true}
      />

      <main>
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <h2 className={styles.benefitsTitle}>Why Trips Matter</h2>
            <FeatureCardGrid columns={3}>
              <FeatureCard
                icon="💾"
                title="Memory Preservation"
                description="Never forget the details of your adventures. Every trip is permanently saved with complete location data and your personal notes."
              />
              <FeatureCard
                icon="📖"
                title="Travel Journaling"
                description="Combine location data with your thoughts and stories. Create a rich, multimedia travel journal that goes beyond simple notes."
              />
              <FeatureCard
                icon="🌍"
                title="Relive Adventures"
                description="Look back at past trips anytime. See exactly where you went, how long you traveled, and rediscover places you visited."
              />
            </FeatureCardGrid>
          </div>
        </section>

        <FeatureShowcase
          title="Everything You Need in One Trip"
          subtitle="Each trip automatically includes multiple components to tell the complete story of your journey."
          items={showcaseItems}
        />

        <HowItWorks
          title="How It Works"
          subtitle="Creating and managing trips is simple and intuitive—just a few clicks to turn your location data into stories."
          steps={howItWorksSteps}
        />

        <section className={styles.automaticVsManual}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Flexible Trip Creation</h2>
            <FeatureCardGrid columns={2}>
              <FeatureCard
                icon="🤖"
                title="Automatic Grouping"
                description="Simply set your trip dates and Dawarich automatically collects all your location points from that period. Perfect for when you want quick results."
              />
              <FeatureCard
                icon="✋"
                title="Manual Details"
                description="Create trips for storytelling purposes or to document specific adventures. Add your own narrative and notes to enrich the experience."
              />
            </FeatureCardGrid>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Start Documenting Your Travels</h2>
            <p className={styles.ctaSubtitle}>
              Begin creating beautiful trip journals today with a 7-day free trial. No credit card required.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=trips">
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
