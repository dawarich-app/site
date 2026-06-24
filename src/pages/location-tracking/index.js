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
import Link from '@docusaurus/Link';
import styles from './tracking.module.css';

const appShowcase = [
  {
    icon: <SmartphoneIcon />,
    title: 'Dawarich iOS App',
    description: 'Our official iOS app provides seamless location tracking directly to your Dawarich instance. Available on the App Store.',
    image: '/img/app-store.png',
    imageAlt: 'Download Dawarich on the App Store',
    imageHref: 'https://apps.apple.com/app/apple-store/id6739544999?pt=128010810&ct=location-tracking&mt=8',
  },
  {
    icon: <SmartphoneIcon />,
    title: 'Dawarich Android App',
    description: 'Our official Android app brings the same effortless background tracking to your Dawarich instance. Available on Google Play.',
    image: 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png',
    imageAlt: 'Get Dawarich on Google Play',
    imageHref: 'https://play.google.com/store/apps/details?id=com.zeitflow.dawarich',
  },
  {
    icon: <GlobeIcon />,
    title: 'Overland',
    description: 'Open-source location tracking app that sends data in batches. Works on iOS with configurable accuracy and frequency.',
  },
  {
    icon: <HomeIcon />,
    title: 'OwnTracks',
    description: 'Popular location tracking solution with extensive customization options and low battery consumption.',
  },
  {
    icon: <MapPinIcon />,
    title: 'GPSLogger',
    description: 'Lightweight Android app focused on battery efficiency with customizable logging intervals and data formats.',
  },
  {
    icon: <PhoneIcon />,
    title: 'PhoneTrack',
    description: 'NextCloud-integrated app that supports custom log jobs. Perfect for users already in the NextCloud ecosystem.',
  },
  {
    icon: <HomeIcon />,
    title: 'Home Assistant',
    description: 'For smart home enthusiasts, integrate your Home Assistant geolocation data directly into Dawarich.',
  }
];

const howItWorksSteps = [
  {
    icon: <KeyIcon size={32} />,
    title: 'Get Your API Key',
    description: 'Find your unique API key in the Account section of your Dawarich dashboard.',
    details: [
      'Login to your Dawarich instance',
      'Navigate to Account settings',
      'Copy your API key securely'
    ]
  },
  {
    icon: <SmartphoneIcon size={32} />,
    title: 'Choose Your App',
    description: 'Select any supported tracking app that fits your needs and device platform.',
    details: [
      'iOS: official Dawarich app or Overland',
      'Android: official Dawarich app, GPSLogger, or PhoneTrack',
      'Both: OwnTracks or Home Assistant integration'
    ]
  },
  {
    icon: <SettingsIcon size={32} />,
    title: 'Configure the App',
    description: 'Enter your Dawarich instance URL and API key in your chosen app\'s settings.',
    details: [
      'Set receiver endpoint URL',
      'Add your API key to the URL',
      'Configure tracking frequency (optional)',
      'Test the connection'
    ]
  },
  {
    icon: <CheckIcon size={32} />,
    title: 'Start Tracking',
    description: 'Once configured, your location data automatically syncs to your private Dawarich account.',
    details: [
      'Location updates sent in real-time or batches',
      'Data syncs automatically in the background',
      'View your location history on the map'
    ]
  }
];

const appDetails = [
  {
    name: 'Dawarich iOS App',
    description: 'Native iOS application built specifically for Dawarich',
    features: ['Seamless setup', 'Low battery impact', 'Background tracking', 'App Store availability'],
    setupSteps: [
      'Install from App Store',
      'Open app and go to settings',
      'Enter your API key',
      'Tap Save and start tracking'
    ]
  },
  {
    name: 'Dawarich Android App',
    description: 'Native Android application built specifically for Dawarich',
    features: ['Seamless setup', 'Low battery impact', 'Background tracking', 'Available on Google Play'],
    setupSteps: [
      'Install from Google Play',
      'Open app and go to settings',
      'Enter your API key',
      'Tap Save and start tracking'
    ]
  },
  {
    name: 'Overland',
    description: 'Flexible cross-platform tracking app with batch uploads',
    features: ['iOS support', 'Batch processing', 'Configurable accuracy', 'Open source'],
    setupSteps: [
      'Install Overland on your device',
      'Open settings and slide to unlock',
      'Set Receiver Endpoint URL: http://your-instance/api/v1/overland/batches?api_key=YOUR_KEY',
      'Optional: Set a Device ID',
      'Tap Save'
    ]
  },
  {
    name: 'OwnTracks',
    description: 'Location tracking app with HTTP mode support',
    features: ['Low battery usage', 'Highly customizable', 'HTTP and MQTT modes', 'Cross-platform'],
    setupSteps: [
      'Install OwnTracks app',
      'Tap "i" icon in top left corner',
      'Select HTTP mode',
      'Enter URL: http://your-instance/api/v1/owntracks/points?api_key=YOUR_KEY',
      'Tap Back to save'
    ]
  },
  {
    name: 'GPSLogger',
    description: 'Battery-efficient Android logging solution',
    features: ['Battery friendly', 'Custom logging intervals', 'JSON format support', 'Lightweight'],
    setupSteps: [
      'Install GPSLogger for Android',
      'Configure custom URL with OwnTracks endpoint',
      'Set HTTP Body with required JSON format',
      'Add Content-Type: application/json header',
      'Use POST method'
    ]
  },
  {
    name: 'PhoneTrack',
    description: 'NextCloud integration with custom log jobs',
    features: ['NextCloud integration', 'Custom log jobs', 'Query string parameters', 'Flexible configuration'],
    setupSteps: [
      'Install PhoneTrack from F-Droid',
      'Create Custom Log Job',
      'Use OwnTracks endpoint with query string params',
      'Enable POST method',
      'Disable JSON payload option'
    ]
  }
];

export default function TrackingPage() {
  return (
    <Layout
      title="Location Tracking Setup"
      description="Track your location automatically with multiple supported apps including the official Dawarich iOS and Android apps, Overland, OwnTracks, GPSLogger, PhoneTrack, and Home Assistant.">
      <Head>
        <meta property="og:title" content="Dawarich Location Tracking — Multiple Apps Supported" />
        <meta property="og:description" content="Set up automatic location tracking with the official Dawarich iOS or Android app, Overland, OwnTracks, GPSLogger, PhoneTrack, or Home Assistant integration." />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <FeatureHero
        badge="Automatic Tracking"
        title="Track Your Location"
        titleHighlight="Effortlessly"
        subtitle="Choose from multiple tracking apps to automatically record your location. Whether you prefer our official iOS and Android apps or popular open-source alternatives, Dawarich works with what you love."
        image="/img/the_map.webp"
        imageAlt="Location tracking visualization"
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=tracking"
        showSecondary={true}
      />

      <main>
        <FeatureShowcase
          title="Supported Tracking Apps"
          subtitle="Pick the app that works best for your device and workflow. All apps work seamlessly with Dawarich."
          items={appShowcase}
        />

        <HowItWorks
          title="How to Get Started"
          subtitle="Set up location tracking in minutes with any supported app."
          steps={howItWorksSteps}
        />

        <section className={styles.detailedSetup}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Detailed Setup Guides</h2>
            <p className={styles.sectionSubtitle}>
              Step-by-step instructions for each supported tracking application.
            </p>

            <div className={styles.setupGrid}>
              {appDetails.map((app, index) => (
                <div key={index} className={styles.setupCard}>
                  <h3 className={styles.setupTitle}>{app.name}</h3>
                  <p className={styles.setupDescription}>{app.description}</p>

                  <div className={styles.featuresSection}>
                    <h4 className={styles.featuresTitle}>Features:</h4>
                    <ul className={styles.featuresList}>
                      {app.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.stepsSection}>
                    <h4 className={styles.stepsTitle}>Setup Steps:</h4>
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
              <p>
                For complete setup instructions including Home Assistant integration, visit our{' '}
                <Link to="/docs/getting-started/track-your-location">detailed tracking tutorial</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.apiSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>API Endpoints</h2>
            <p className={styles.sectionSubtitle}>
              Dawarich provides multiple API endpoints for different tracking formats.
            </p>
            <div className={styles.endpointsGrid}>
              <div className={styles.endpointCard}>
                <h3 className={styles.endpointTitle}>Overland Endpoint</h3>
                <code className={styles.endpointCode}>
                  /api/v1/overland/batches?api_key=YOUR_KEY
                </code>
                <p className={styles.endpointDesc}>For Overland app batch uploads</p>
              </div>
              <div className={styles.endpointCard}>
                <h3 className={styles.endpointTitle}>OwnTracks Endpoint</h3>
                <code className={styles.endpointCode}>
                  /api/v1/owntracks/points?api_key=YOUR_KEY
                </code>
                <p className={styles.endpointDesc}>For OwnTracks, GPSLogger, and PhoneTrack</p>
              </div>
            </div>
            <p className={styles.apiNote}>
              Full API documentation is available at{' '}
              <Link to="/docs/api/dawarich-api">our API reference</Link>.
            </p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Ready to Start Tracking?</h2>
            <p className={styles.ctaSubtitle}>
              Get your Dawarich account today and start automatically recording your location history.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=tracking">
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
