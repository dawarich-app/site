import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import styles from './press-kit.module.css';

const assets = [
  {
    title: 'Dawarich mark',
    detail: 'Vector artwork · SVG',
    image: '/img/logo.svg',
    download: '/img/logo.svg',
    filename: 'dawarich-logo.svg',
    className: styles.logoPreview,
  },
  {
    title: 'App icon',
    detail: 'Square icon · PNG',
    image: '/img/icon-512.png',
    download: '/img/icon-512.png',
    filename: 'dawarich-icon-512.png',
    className: styles.iconPreview,
  },
  {
    title: 'The map',
    detail: 'Product screenshot · WebP',
    image: '/img/the_map.webp',
    download: '/img/the_map.webp',
    filename: 'dawarich-map.webp',
    className: styles.screenshotPreview,
  },
  {
    title: 'Trips',
    detail: 'Product screenshot · WebP',
    image: '/img/trips.webp',
    download: '/img/trips.webp',
    filename: 'dawarich-trips.webp',
    className: styles.screenshotPreview,
  },
];

const founders = [
  { name: 'Evgenii Burmakin', role: 'Co-founder', image: '/img/founders/evgenii.webp', filename: 'evgenii-burmakin.webp' },
  { name: 'Konstantin Priemchenko', role: 'Co-founder, mobile apps', image: '/img/founders/konstantin.webp', filename: 'konstantin-priemchenko.webp' },
];

const coverage = [
  {
    outlet: 'heise online',
    title: 'Dawarich: Open-Source-Alternative zum Google Standortverlauf',
    date: '23 Sep 2026',
    href: 'https://www.heise.de/ratgeber/Dawarich-Open-Source-Alternative-zum-Google-Standortverlauf-11453464.html',
  },
  {
    outlet: 'c’t / heise online',
    title: 'Raspi: Privaten Standortverlauf mit Dawarich lokal aufzeichnen',
    date: '14 Jan 2025',
    href: 'https://www.heise.de/ratgeber/Raspi-Privaten-Standortverlauf-mit-Dawarich-lokal-aufzeichnen-10235624.html',
  },
  { outlet: 'XDA Developers', href: 'https://www.xda-developers.com/import-google-timeline-dawarich/' },
  { outlet: 'MakeUseOf', href: 'https://www.makeuseof.com/i-use-free-open-source-app-track-everywhere-ive-been-without-google/' },
];

export default function PressKitPage() {
  return (
    <Layout
      title="Press Kit — Dawarich"
      description="Dawarich press kit: company facts, ready-to-use descriptions, logos, product screenshots, founder photos, and press contact."
    >
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dawarich.app/press-kit/" />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
      </Head>

      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eyebrow}>Dawarich / Press resources</p>
            <div className={styles.heroGrid}>
              <div>
                <h1>Press Kit</h1>
                <p className={styles.lead}>
                  A private place for your places. Here are the facts, images, and people behind Dawarich.
                </p>
                <a className={styles.heroLink} href="mailto:hi@dawarich.app?subject=Dawarich%20press%20inquiry">
                  Get in touch <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className={styles.heroVisual} aria-hidden="true">
                <div className={styles.orbitOuter} />
                <div className={styles.orbitInner} />
                <img src="/img/icon-512.png" alt="" width="132" height="132" />
                <span className={styles.mapPinOne} />
                <span className={styles.mapPinTwo} />
              </div>
            </div>
          </div>
        </header>

        <div className={styles.container}>
          <section className={styles.section} aria-labelledby="overview-title">
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>01 / The story</p>
              <h2 id="overview-title">What Dawarich is</h2>
              <p>Ready-to-use background for articles, listings, and interviews.</p>
            </div>
            <div className={styles.storyGrid}>
              <article className={styles.descriptionCard}>
                <span className={styles.cardLabel}>In one sentence</span>
                <p>
                  Dawarich is an open-source location history app that helps people keep,
                  explore, and export their own travel history.
                </p>
              </article>
              <article className={styles.descriptionCard}>
                <span className={styles.cardLabel}>In a paragraph</span>
                <p>
                  Dawarich turns location history into a personal map of places, routes, and
                  trips. People can import their existing data, track new journeys with the
                  iOS and Android apps, and export their data when they want. Dawarich can
                  be self-hosted for free or used through Dawarich Cloud, a hosted service
                  run in Europe.
                </p>
              </article>
            </div>
            <dl className={styles.facts}>
              <div><dt>Started</dt><dd>March 2024</dd></div>
              <div><dt>Based in</dt><dd>Berlin, Germany</dd></div>
              <div><dt>Made by</dt><dd>ZeitFlow UG (haftungsbeschränkt)</dd></div>
              <div><dt>Available as</dt><dd>Free self-hosted software and Dawarich Cloud</dd></div>
            </dl>
          </section>

          <section className={styles.section} aria-labelledby="assets-title">
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>02 / Visual assets</p>
              <h2 id="assets-title">The images</h2>
              <p>Download original files for coverage of Dawarich. Please credit Dawarich when you use them.</p>
            </div>
            <div className={styles.assetGrid}>
              {assets.map((asset) => (
                <article className={styles.assetCard} key={asset.title}>
                  <div className={`${styles.assetPreview} ${asset.className}`}>
                    <img src={asset.image} alt={asset.title} loading="lazy" />
                  </div>
                  <div className={styles.assetDetails}>
                    <div>
                      <h3>{asset.title}</h3>
                      <p>{asset.detail}</p>
                    </div>
                    <a href={asset.download} download={asset.filename} aria-label={`Download ${asset.title}`}>
                      Download <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="people-title">
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>03 / The people</p>
              <h2 id="people-title">Meet the founders</h2>
              <p>Dawarich is built by a small, independent team in Berlin.</p>
            </div>
            <div className={styles.peopleGrid}>
              {founders.map((founder) => (
                <article className={styles.person} key={founder.name}>
                  <img src={founder.image} alt={`Portrait of ${founder.name}`} width="112" height="112" loading="lazy" />
                  <div>
                    <h3>{founder.name}</h3>
                    <p>{founder.role}</p>
                    <a href={founder.image} download={founder.filename}>Download portrait ↓</a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="coverage-title">
            <div className={styles.sectionIntro}>
              <p className={styles.kicker}>04 / Coverage</p>
              <h2 id="coverage-title">Dawarich in the press</h2>
            </div>
            <div className={styles.coverageList}>
              {coverage.map((item) => (
                <a key={item.outlet} href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className={styles.coverageText}>
                    <span>{item.title || item.outlet}</span>
                    {item.title && <small>{item.outlet} · {item.date}</small>}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>

          <section className={styles.contact} aria-labelledby="contact-title">
            <div>
              <p className={styles.kicker}>Questions or interviews</p>
              <h2 id="contact-title">Let's talk.</h2>
              <p>For interviews, additional images, or product questions, write to us directly.</p>
            </div>
            <a href="mailto:hi@dawarich.app?subject=Dawarich%20press%20inquiry">hi@dawarich.app <span aria-hidden="true">↗</span></a>
          </section>
        </div>
      </main>
    </Layout>
  );
}
