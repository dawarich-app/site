import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import Features from '@site/src/components/Features';
import UseCases from '@site/src/components/UseCases';
import MapVisualizer from '@site/src/components/MapVisualizer';
import StatsSection from '@site/src/components/StatsSection';
import PricingSection from '@site/src/components/PricingSection';

function HomepageHeader() {
  return <Hero />;
}

function FeaturesSection() {
  return <Features />;
}

function VisualizationSection() {
  return <MapVisualizer />;
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Dawarich — Your Journey, Your Control"
      description="Visualize your location history, track your movements, and analyze your travel patterns with complete privacy and control.">
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dawarich.app/" />
        <meta property="og:title" content="Dawarich — Your Journey, Your Control | Dawarich" />
        <meta property="og:description" content="Visualize your location history, track your movements, and analyze your travel patterns with complete privacy and control." />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.jpg" />

        {/* X (Twitter) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://dawarich.app/" />
        <meta name="twitter:title" content="Dawarich — Your Journey, Your Control | Dawarich" />
        <meta name="twitter:description" content="Visualize your location history, track your movements, and analyze your travel patterns with complete privacy and control." />
        <meta name="twitter:image" content="https://dawarich.app/img/meta-image.jpg" />
      </Head>
      <HomepageHeader />
      <main>
        <VisualizationSection />
        <StatsSection />
        <UseCases />
        <FeaturesSection />
        <PricingSection />
      </main>
    </Layout>
  );
}
