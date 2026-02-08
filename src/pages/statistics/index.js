import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FeatureHero from '@site/src/components/FeatureHero';
import FeatureShowcase from '@site/src/components/FeatureShowcase';
import HowItWorks from '@site/src/components/HowItWorks';
import Link from '@docusaurus/Link';
import styles from './stats.module.css';

const showcaseItems = [
  {
    icon: '📊',
    title: 'Monthly & Yearly Insights',
    description: 'Get automatic summaries of your location data broken down by month and year. See trends, patterns, and highlights from each period.',
  },
  {
    icon: '🌍',
    title: 'Cities & Countries Visited',
    description: 'Track every country you\'ve been to with automatic counting and visualization. Perfect for travel enthusiasts collecting passport stamps.',
  },
  {
    icon: '🛣️',
    title: 'Total Distance',
    description: 'Calculate the total distance you\'ve traveled across all your recorded location data. See how far you\'ve gone over time.',
  },
  // {
  //   icon: '⏱️',
  //   title: 'Time Tracking',
  //   description: 'Understand how much time you\'ve spent in different places, cities, and countries.',
  // },
  {
    icon: '📧',
    title: 'Email Digests',
    description: 'Receive automatic monthly and yearly summary emails highlighting your travel achievements and statistics.',
  }
];

const howItWorksSteps = [
  {
    icon: '📱',
    title: 'Track Automatically',
    description: 'Your stats are automatically calculated in the background every hour as you track your location.',
    details: [
      'No manual input required',
      'Updates happen automatically',
      'Historical data processed continuously'
    ]
  },
  {
    icon: '📊',
    title: 'View Your Stats',
    description: 'Navigate to the Stats page to see your comprehensive location analytics.',
    details: [
      'Overall summary at the top',
      'Click on any year to see detailed stats',
      'Click on any month to see it on the map'
    ]
  },
  {
    icon: '🗺️',
    title: 'Explore on Map',
    description: 'Use the [Map] links to visualize your stats geographically.',
    details: [
      'Click [Map] next to any year',
      'View monthly data on interactive map',
      'See your complete routes and points'
    ]
  },
  {
    icon: '🔄',
    title: 'Manual Updates',
    description: 'Force an immediate stats update anytime with the "Update stats" button.',
    details: [
      'Click "Update stats" for instant refresh',
      'Usually completes in a few minutes',
      'Useful after importing large datasets'
    ]
  }
];

const shareFeatures = [
  {
    icon: '🔗',
    title: 'Shareable Links',
    description: 'Generate public links to share your yearly summaries with friends and family while keeping the rest of your data private.'
  },
  // {
  //   icon: '🖼️',
  //   title: 'Export Images',
  //   description: 'Download your stats as images to share on social media or include in presentations and reports.'
  // },
  {
    icon: '🔒',
    title: 'Privacy Friendly',
    description: 'You control what to share. Only shared stats are visible—everything else remains private to you.'
  }
];

export default function StatsPage() {
  return (
    <Layout
      title="Location Statistics & Insights"
      description="See your life in numbers with comprehensive location statistics. Track countries, cities, distances, and get monthly & yearly email digests.">
      <Head>
        <meta property="og:title" content="Dawarich Stats — See Your Life in Numbers" />
        <meta property="og:description" content="Comprehensive location statistics including countries visited, total distance, time tracking, and automatic monthly & yearly email digests." />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <FeatureHero
        badge="Analytics & Insights"
        title="See Your Life in"
        titleHighlight="Numbers"
        subtitle="Turn your location data into meaningful insights. Discover patterns, track achievements, and celebrate milestones with comprehensive statistics updated automatically every hour."
        image="/img/features-stats.png"
        imageAlt="Comprehensive statistics dashboard"
        ctaLink="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-hero&utm_campaign=stats"
        showSecondary={true}
      />

      <main>
        <section className={styles.statsTypes}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What You Can Track</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🌍</div>
                <h3 className={styles.statTitle}>Global Stats</h3>
                <ul className={styles.statList}>
                  <li>Countries visited</li>
                  <li>Cities explored</li>
                  <li>Total distance traveled</li>
                </ul>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📅</div>
                <h3 className={styles.statTitle}>Time-Based Stats</h3>
                <ul className={styles.statList}>
                  <li>Yearly summaries</li>
                  <li>Monthly breakdowns</li>
                  <li>Most active periods</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <FeatureShowcase
          title="Comprehensive Analytics"
          subtitle="Everything you need to understand your location history at a glance."
          items={showcaseItems}
        />

        <section className={styles.sharingSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Share Your Achievements</h2>
            <p className={styles.sectionSubtitle}>
              Celebrate your travel milestones by sharing your yearly summaries while keeping your detailed data private.
            </p>
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
          title="How It Works"
          subtitle="Your statistics are calculated automatically — no manual work required."
          steps={howItWorksSteps}
        />

        <section className={styles.whyItMatters}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Stats Matter</h2>
            <div className={styles.reasonsGrid}>
              <div className={styles.reason}>
                <div className={styles.reasonIcon}>💪</div>
                <h3 className={styles.reasonTitle}>Motivation</h3>
                <p className={styles.reasonText}>
                  Seeing your travel achievements in numbers motivates you to explore more and set new goals.
                </p>
              </div>
              <div className={styles.reason}>
                <div className={styles.reasonIcon}>🔍</div>
                <h3 className={styles.reasonTitle}>Understanding Habits</h3>
                <p className={styles.reasonText}>
                  Discover patterns in your movement and understand how you spend your time across different locations.
                </p>
              </div>
              <div className={styles.reason}>
                <div className={styles.reasonIcon}>🎊</div>
                <h3 className={styles.reasonTitle}>Annual Memory Recap</h3>
                <p className={styles.reasonText}>
                  Get beautiful yearly summaries that help you remember and celebrate your adventures and experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>Start Tracking Your Stats</h2>
            <p className={styles.ctaSubtitle}>
              Begin building your location statistics today with a 7-day free trial. No credit card required.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                className={styles.primaryCta}
                href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=feature-cta&utm_campaign=stats">
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
