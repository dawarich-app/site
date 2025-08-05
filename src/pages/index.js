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
      title="Dawarich — Your Journey, Your Control"
      description="Visualize your location history, track your movements, and analyze your travel patterns with complete privacy and control.">
      <HomepageHeader />
      <main>
        <VisualizationSection />
        <StatsSection />
        <FeaturesSection />
        <UseCases />
        <PricingSection />
      </main>
    </Layout>
  );
}
