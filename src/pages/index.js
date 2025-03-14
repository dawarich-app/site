import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import Features from '@site/src/components/Features';
import MapVisualizer from '@site/src/components/MapVisualizer';
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
        <FeaturesSection />
        <VisualizationSection />
        <PricingSection />
      </main>
    </Layout>
  );
}
