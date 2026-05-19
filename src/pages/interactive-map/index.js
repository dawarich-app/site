import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import Link from '@docusaurus/Link';
import styles from './map.module.css';

const Icon = ({ size = 40, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const MapPinIcon = (props) => (
  <Icon {...props}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

const RouteIcon = (props) => (
  <Icon {...props}>
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </Icon>
);

const FlameIcon = (props) => (
  <Icon {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Icon>
);

const CloudFogIcon = (props) => (
  <Icon {...props}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 0 9z" />
    <path d="M16 17H7" />
    <path d="M17 21H9" />
  </Icon>
);

const MapIcon = (props) => (
  <Icon {...props}>
    <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
    <path d="M15 5.764v15" />
    <path d="M9 3.236v15" />
  </Icon>
);

const HexagonIcon = (props) => (
  <Icon {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </Icon>
);

const CameraIcon = (props) => (
  <Icon {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </Icon>
);

const SmartphoneIcon = (props) => (
  <Icon {...props}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </Icon>
);

const LayersIcon = (props) => (
  <Icon {...props}>
    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </Icon>
);

const CalendarIcon = (props) => (
  <Icon {...props}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </Icon>
);

const SaveIcon = (props) => (
  <Icon {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </Icon>
);

const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);

const LockIcon = (props) => (
  <Icon {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

const showcaseItems = [
  {
    icon: <MapPinIcon />,
    title: 'Points',
    description: 'View every location point captured with precise timestamps and details. Click any point to see its information including coordinates, time, and more.',
    image: '/img/map-points.png',
    imageAlt: 'Map showing individual location points'
  },
  {
    icon: <RouteIcon />,
    title: 'Polylines',
    description: 'See your complete routes connecting all your location points. Visualize your journeys as continuous paths across the map.',
    image: '/img/map-polylines.png',
    imageAlt: 'Map with polyline routes'
  },
  {
    icon: <FlameIcon />,
    title: 'Heatmap',
    description: 'Discover where you spend most of your time with an intensity-based heatmap visualization showing your most visited areas.',
    image: '/img/map-heatmap.png',
    imageAlt: 'Heatmap visualization'
  },
  {
    icon: <CloudFogIcon />,
    title: 'Fog of War',
    description: 'Reveal the world as you explore it. Areas you\'ve visited are cleared while unexplored regions remain covered.',
    image: '/img/map-fog-of-war.png',
    imageAlt: 'Fog of war visualization'
  },
  {
    icon: <MapIcon />,
    title: 'Scratch Map',
    description: 'Watch countries light up as you visit them. Perfect for travel enthusiasts tracking their global adventures.',
    image: '/img/map-scratch-map.png',
    imageAlt: 'Scratch map showing visited countries'
  },
  {
    icon: <HexagonIcon />,
    title: 'Areas',
    description: 'Draw custom areas on your map to mark important locations, neighborhoods, or regions of interest.',
    image: '/img/map-areas.png',
    imageAlt: 'Custom areas on map'
  },
  {
    icon: <CameraIcon />,
    title: 'Photos',
    description: 'See your photos from Immich or PhotoPrism directly on the map at the exact locations they were taken. (fow now, only available with self-hosting)',
    image: '/img/map-photos.png',
    imageAlt: 'Photos displayed on map'
  }
];

const howItWorksSteps = [
  {
    icon: <SmartphoneIcon size={32} />,
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
    icon: <LayersIcon size={32} />,
    title: 'Select Your View',
    description: 'Choose from multiple different map styles and toggle various layers to customize your visualization.',
    details: [
      'Toggle points, routes, or heatmap',
      'Enable fog of war or scratch map',
      'Show or hide photos and areas'
    ]
  },
  {
    icon: <CalendarIcon size={32} />,
    title: 'Filter by Time',
    description: 'Select any time range to view your location history for specific periods.',
    details: [
      'Navigate by year and month',
      'View country and city visit statistics',
      'Search for specific places'
    ]
  },
  {
    icon: <SaveIcon size={32} />,
    title: 'Create and Save',
    description: 'Manually create places and visits to fill in gaps or correct your location history.',
    details: [
      'Save favorite locations',
      'Add missing visits manually',
      'Draw custom areas on the map'
    ]
  },
  {
    icon: <SearchIcon size={32} />,
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
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <FeatureHero
        badge="Interactive Visualization"
        title="Explore Where You've Been,"
        titleHighlight="Never Forget a Place"
        subtitle="Your location history comes alive on an interactive map with multiple visualization layers. From detailed points to beautiful heatmaps, see your life's journey in stunning detail."
        image="/img/the_map.png"
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
            <h3 className={styles.privacyTitle}>
              <LockIcon size={22} />
              <span>Your Data Stays Private</span>
            </h3>
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
              Start tracking your location history today with a 7-day free trial. Cancel anytime.
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
            <p className="feature-cta-reassurance">
              7-day free trial · 14-day risk-free refund · Cancel anytime
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
