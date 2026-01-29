import React, { useEffect } from "react";
import { initializePaddle } from '@paddle/paddle-js';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import SocialProof from '@site/src/components/SocialProof';
import HowItWorks from '@site/src/components/HowItWorks';
import Features from '@site/src/components/Features';
import UseCases from '@site/src/components/UseCases';
import PricingSection from '@site/src/components/PricingSection';
import PrivacySection from '@site/src/components/PrivacySection';

const MapPinSvg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MapSvg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const LightbulbSvg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const howItWorksSteps = [
  {
    icon: <MapPinSvg />,
    title: 'Track',
    description: 'Use the Dawarich iOS app, OwnTracks, GPSLogger, or any compatible tracker. Or import years of history from Google Timeline.',
  },
  {
    icon: <MapSvg />,
    title: 'Visualize',
    description: 'See everywhere you\'ve been on an interactive map. Create trips, explore a scratch map, and browse daily timelines.',
  },
  {
    icon: <LightbulbSvg />,
    title: 'Remember',
    description: 'Get stats on distance, cities, and time. Geotag photos with Immich or PhotoPrism. Share your year in review.',
  },
];

function HomepageHeader() {
  return <Hero />;
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  useEffect(() => {
    initializePaddle({
      token: "live_8593fad779b610288ad3ca40789",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animateOnScroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Layout
      title="Dawarich — Your memories, mapped automatically"
      description="Never forget a place you've been to">
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dawarich.app/" />
        <meta property="og:title" content="Dawarich — Your memories, mapped automatically" />
        <meta property="og:description" content="Never forget a place you've been to" />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.jpg" />

        {/* X (Twitter) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://dawarich.app/" />
        <meta name="twitter:title" content="Dawarich — Your memories, mapped automatically" />
        <meta name="twitter:description" content="Never forget a place you've been to" />
        <meta name="twitter:image" content="https://dawarich.app/img/meta-image.jpg" />
      </Head>
      <HomepageHeader />
      <main>
        {[
          <SocialProof key="social" />,
          <HowItWorks
            key="how"
            title="How It Works"
            subtitle="Get started in three simple steps."
            steps={howItWorksSteps}
            horizontal
          />,
          <Features key="features" />,
          <PrivacySection key="privacy" />,
          <UseCases key="usecases" />,
          <PricingSection key="pricing" />,
        ].map((section, i) => (
          <div
            key={section.key}
            className="animateOnScroll"
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            {section}
          </div>
        ))}
        <section style={{
          padding: '4rem 1.5rem',
          textAlign: 'center',
          background: 'var(--ifm-color-background-alt)',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--ifm-heading-color)',
            }}>
              Stay Updated
            </h2>
            <p style={{
              color: 'var(--muted-foreground)',
              marginBottom: '2rem',
              fontSize: '1.05rem',
            }}>
              Get the latest news, features, and tips delivered to your inbox.
            </p>
            <iframe
              width="540"
              height="500"
              src="https://475728ae.sibforms.com/serve/MUIFAJLZJwZyy-W4PJAFc573ygtVeBn5fgINSOiVsmxzDKkjxeC96kVh_EVbvVN-hW4wCbGvIAPzrujZeSPpPbwUAXLZJfmGXHdmWG0208oNcTG4B20KmYDGdFhxs9Bos4UdurRT8dkzD_NjdRoMqg4A1_yAtpB5mHDbP_lT5mHAQIiamOmMomRSCEWWnFyk24LKJ6DqyhJze0By"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}
