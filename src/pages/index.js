import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container flex">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            5 min intro ⏱️
          </Link>

          <Link
            className={clsx('button button--secondary button--lg', styles.button)}
            to="https://demo.dawarich.app">
            Live demo 🗺️
          </Link>
        </div>
        <br/>
        <div className={styles.buttons}>
        <Link
            className={clsx('button button--secondary button--lg', styles.button)}
            to="https://www.patreon.com/c/freika/membership">
            Hosted tier on Patreon 🎉
          </Link>
        </div>

        <ThemedImage
          alt="Docusaurus themed image"
          class='dawarich_sources'
          sources={{
            light: useBaseUrl('/img/dawarich-sources-light.svg'),
            dark: useBaseUrl('/img/dawarich-sources-dark.svg'),
          }}
        />

        <div className={styles.github}>
          <div className='support_us'>
            Support us on
          </div>
          <div className={styles.supportButtons}>
            <Link
              className={clsx('button button--secondary button--lg', styles.button)}
              to="https://ko-fi.com/freika">
              Ko-Fi ☕️
            </Link>
            <div className={styles.orSeparator}>or</div>
            <Link
              className={clsx('button button--secondary button--lg', styles.button)}
              to="https://www.patreon.com/freika">
              Patreon 🎉
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Self-hosted alternative to Google Maps Timeline / Google Location History">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
