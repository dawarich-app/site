import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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
      title="Dawarich — Your Life, Remembered"
      description="Track your daily life with Dawarich. Import your location history to create a comprehensive life journal.">
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
