import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import Link from '@docusaurus/Link';
import styles from './map.module.css';

const showcaseItems = [
  {
    icon: '📍',
    title: 'Points',
    description: 'View every location point captured with precise timestamps and details. Click any point to see its information including coordinates, time, and more.',
    image: 'img/map-points.png',
    imageAlt: 'Map showing individual location points'
  },
  {
    icon: '🛣️',
    title: 'Polylines',
    description: 'See your complete routes connecting all your location points. Visualize your journeys as continuous paths across the map.',
    image: 'img/map-polylines.png',
    imageAlt: 'Map with polyline routes'
  },
  {
    icon: '🔥',
    title: 'Heatmap',
    description: 'Discover where you spend most of your time with an intensity-based heatmap visualization showing your most visited areas.',
    image: 'img/map-heatmap.png',
    imageAlt: 'Heatmap visualization'
  },
  {
    icon: '🌫️',
    title: 'Fog of War',
    description: 'Reveal the world as you explore it. Areas you\'ve visited are cleared while unexplored regions remain covered.',
    image: 'img/map-fog-of-war.png',
    imageAlt: 'Fog of war visualization'
  },
  {
    icon: '🗺️',
    title: 'Scratch Map',
    description: 'Watch countries light up as you visit them. Perfect for travel enthusiasts tracking their global adventures.',
    image: 'img/map-scratch-map.png',
    imageAlt: 'Scratch map showing visited countries'
  },
  {
    icon: '📍',
    title: 'Areas',
    description: 'Draw custom areas on your map to mark important locations, neighborhoods, or regions of interest.',
    image: 'img/map-areas.png',
    imageAlt: 'Custom areas on map'
  },
  {
    icon: '📸',
    title: 'Photos',
    description: 'See your photos from Immich or PhotoPrism directly on the map at the exact locations they were taken. (fow now, only available with self-hosting)',
    image: 'img/map-photos.png',
    imageAlt: 'Photos displayed on map'
  }
];

const howItWorksSteps = [
  {
    icon: '📱',
    title: 'Track Your Location',
    description: 'Use any supported tracking app to automatically record your location throughout the day.',
    details: [
      'Dawarich iOS app',
      'Overland',
      'OwnTracks',
      'GPSLogger',
      'PhoneTrack'
    ]
  },
  {
    icon: '🔍',
    title: 'Select Your View',
    description: 'Choose from multiple different map styles and toggle various layers to customize your visualization.',
    details: [
      'Toggle points, routes, or heatmap',
      'Enable fog of war or scratch map',
      'Show or hide photos and areas'
    ]
  },
  {
    icon: '📅',
    title: 'Filter by Time',
    description: 'Select any time range to view your location history for specific periods.',
    details: [
      'Navigate by year and month',
      'View country and city visit statistics',
      'Search for specific places'
    ]
  },
  {
    icon: '💾',
    title: 'Create and Save',
    description: 'Manually create places and visits to fill in gaps or correct your location history.',
    details: [
      'Save favorite locations',
      'Add missing visits manually',
      'Draw custom areas on the map'
    ]
  },
  {
    icon: '🔍',
    title: 'Search by location',
    description: 'Enter place or address to quickly find when you were there and for how long.',
    details: [
      'Search by place name or address',
      'Quickly locate visits and points of interest',
      'Create visits from your search results'
    ]
  }
];

export default function MapPage() {
  return (
    <Layout
      title="Interactive Map Visualization"
      description="Explore your location history on an interactive map with multiple layers including points, routes, heatmap, fog of war, and more.">
      <Head>
        <meta property="og:title" content="Dawarich Map — Interactive Location Visualization" />
        <meta property="og:description" content="Explore your location history with multiple visualization layers: points, routes, heatmap, fog of war, scratch map, and photo integration." />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <FeatureHero
        badge="Interactive Visualization"
        title="Explore Where You've Been,"
        titleHighlight="Never Forget a Place"
        subtitle="Your location history comes alive on an interactive map with multiple visualization layers. From detailed points to beautiful heatmaps, see your life's journey in stunning detail."
        image="img/the_map.png"
        imageAlt="Dawarich interactive map"
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=map"
        showSecondary={true}
      />

      <main>
        <FeatureShowcase
          title="Multiple Visualization Layers"
          subtitle="Toggle between different map layers to see your location data in various ways. Each layer reveals unique insights about your travels and habits."
          items={showcaseItems}
        />

        <HowItWorks
          title="How It Works"
          subtitle="Start visualizing your location history in minutes with our intuitive map interface."
          steps={howItWorksSteps}
        />

        <section className={styles.privacyNote}>
          <div className={styles.container}>
            <h3 className={styles.privacyTitle}>🔒 Your Data Stays Private</h3>
            <p className={styles.privacyText}>
              All your location data is stored securely with encryption at rest and in transit.
              Hosted in Europe and fully GDPR compliant. You can also self-host for complete control.
            </p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Ready to Visualize Your Journey?</h2>
            <p className={styles.ctaSubtitle}>
              Start tracking your location history today with a 7-day free trial. No credit card required.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=map">
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
