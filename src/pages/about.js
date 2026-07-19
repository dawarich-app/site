import React from "react";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import styles from "./about.module.css";

const FOUNDERS = [
  {
    name: "Evgenii Burmakin",
    role: "Co-founder & Chief Everything Officer",
    bio: "Builds everything that isn't a mobile app: the product, the cloud, the website, and this very page.",
    photo: "/img/founders/evgenii.webp",
    links: [
      { label: "GitHub", href: "https://github.com/Freika" },
      { label: "X", href: "https://x.com/freymakesstuff" },
      { label: "Mastodon", href: "https://mastodon.social/@dawarich" },
    ],
  },
  {
    name: "Konstantin Priemchenko",
    role: "Co-founder & Mobile Apps",
    bio: "Builds the Dawarich apps for iOS and Android.",
    photo: "/img/founders/konstantin.webp",
    links: [],
  },
];

export default function AboutPage() {
  return (
    <Layout
      title="About Us — Dawarich"
      description="Meet the people behind Dawarich: the weekend project that became a privacy-first Google Timeline alternative, built in Berlin."
    >
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dawarich.app/about/" />
        <meta property="og:title" content="About Us — Dawarich" />
        <meta
          property="og:description"
          content="How a weekend project became a privacy-first Google Timeline alternative, built in Berlin."
        />
        <meta
          property="og:image"
          content="https://dawarich.app/img/meta-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us — Dawarich" />
        <meta
          name="twitter:description"
          content="How a weekend project became a privacy-first Google Timeline alternative, built in Berlin."
        />
        <meta
          name="twitter:image"
          content="https://dawarich.app/img/meta-image.png"
        />
      </Head>
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>About Us</h1>
          <p className={styles.subtitle}>
            The name comes from the German <em>„Da war ich“</em>, which means{" "}
            <em>“I was there.”</em>
          </p>
        </header>
        <section className={styles.story}>
          <h2>How it started</h2>
          <p>
            Dawarich started in March 2024 as a weekend project. After years of
            feeding location data into Google Timeline and getting very little
            back, Evgenii built a tiny self-hosted endpoint to catch location
            pings from his own iPhone. He had no product plans and no company,
            just an itch to own his own data.
          </p>
          <p>
            The code went up on GitHub, and it turned out plenty of people had
            the same itch. Within a year Dawarich had grown into one of the
            better-known open-source alternatives to Google Timeline, and today
            it runs on thousands of home labs around the world.
          </p>
          <p>
            In July 2025 we launched Dawarich Cloud for everyone who would
            rather skip Docker, reverse proxies, and backups. Today the two of
            us build Dawarich as a small, independent company: Konstantin makes
            the mobile apps, Evgenii makes everything else.
          </p>
          <p>The self-hosted version is free, and it will stay free.</p>
        </section>
        <section className={styles.values}>
          <h2>What we believe</h2>
          <ul>
            <li>
              Your location history belongs to you. You can export everything,
              in open formats, whenever you want.
            </li>
            <li>
              Privacy is the product. We make money from subscriptions, not
              from ads or selling data.
            </li>
            <li>Made and hosted in Europe.</li>
            <li>
              Open source. Development happens in public, on GitHub, bugs and
              all.
            </li>
          </ul>
        </section>
        <section className={styles.founders}>
          <h2>Who we are</h2>
          <div className={styles.founderGrid}>
            {FOUNDERS.map((founder) => (
              <div key={founder.name} className={styles.founderCard}>
                <img
                  src={founder.photo}
                  alt={`Portrait of ${founder.name}`}
                  width="180"
                  height="180"
                  className={styles.founderPhoto}
                />
                <h3>{founder.name}</h3>
                <p className={styles.founderRole}>{founder.role}</p>
                <p className={styles.founderBio}>{founder.bio}</p>
                {founder.links.length > 0 && (
                  <p className={styles.founderLinks}>
                    {founder.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className={styles.company}>
          <p>
            Dawarich is made by ZeitFlow UG (haftungsbeschränkt), a small
            company registered in Berlin, Germany. Legal details live in the{" "}
            <Link to="/impressum">Impressum</Link>. Want to say hi?{" "}
            <Link to="/contact">Contact us</Link>. We read every message.
          </p>
        </section>
      </main>
    </Layout>
  );
}
