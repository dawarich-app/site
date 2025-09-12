import React, { useEffect } from "react";
import { initializePaddle } from '@paddle/paddle-js';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import Features from '@site/src/components/Features';
import UseCases from '@site/src/components/UseCases';
import PricingSection from '@site/src/components/PricingSection';
import PrivacySection from '@site/src/components/PrivacySection';

function HomepageHeader() {
  return <Hero />;
}

function FeaturesSection() {
  return <Features />;
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  useEffect(() => {
    initializePaddle({
      token: "live_8593fad779b610288ad3ca40789",
    });
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
        <UseCases />
        <FeaturesSection />
        <PrivacySection />
        <PricingSection />
      </main>
    </Layout>
  );
}
