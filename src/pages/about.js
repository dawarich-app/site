import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/pages/about.json';
import { interpolate } from '@docusaurus/Interpolate';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from "react";
import Head from "@docusaurus/Head";
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import Layout from "@theme/Layout";
import styles from "./about.module.css";

const FOUNDERS = [
  {
    name: content.founders[0].name,
    role: content.founders[0].role,
    bio: content.founders[0].bio,
    photo: "/img/founders/evgenii.webp",
    links: [
      { label: content.founders[0].links[0].label, href: "https://github.com/Freika" },
      { label: content.founders[0].links[1].label, href: "https://x.com/freymakesstuff" },
      { label: content.founders[0].links[2].label, href: "https://mastodon.social/@dawarich" },
    ],
  },
  {
    name: content.founders[1].name,
    role: content.founders[1].role,
    bio: content.founders[1].bio,
    photo: "/img/founders/konstantin.webp",
    links: [],
  },
];

export default function AboutPage() {
  const pageUrl = useLocalizedUrl('/about/');
  return (
    <Layout
      title={content.meta.title}
      description={content.meta.description}
    >
      <Head>
        <meta name="twitter:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={content.meta.title} />
        <meta
          property="og:description"
          content={content.meta.ogDescription}
        />
        <meta
          property="og:image"
          content="https://dawarich.app/img/meta-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.meta.title} />
        <meta
          name="twitter:description"
          content={content.meta.ogDescription}
        />
        <meta
          name="twitter:image"
          content="https://dawarich.app/img/meta-image.png"
        />
      </Head>
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>{content.aboutPage.heading}</h1>
          <p className={styles.subtitle}>{content.aboutPage.text}<em>{content.aboutPage.em}</em>{content.aboutPage.text2}{" "}
            <em>{content.aboutPage.em2}</em>
          </p>
        </header>
        <section className={styles.story}>
          <h2>{content.aboutPage.heading2}</h2>
          <p>{content.aboutPage.p}</p>
          <p>{content.aboutPage.p2}</p>
          <p>{content.aboutPage.p3}</p>
          <p>{content.aboutPage.p4}</p>
        </section>
        <section className={styles.values}>
          <h2>{content.aboutPage.heading3}</h2>
          <ul>
            <li>{content.aboutPage.li}</li>
            <li>{content.aboutPage.li2}</li>
            <li>{content.aboutPage.li3}</li>
            <li>{content.aboutPage.li4}</li>
          </ul>
        </section>
        <section className={styles.founders}>
          <h2>{content.aboutPage.heading4}</h2>
          <div className={styles.founderGrid}>
            {FOUNDERS.map((founder) => (
              <div key={founder.name} className={styles.founderCard}>
                <img
                  src={founder.photo}
                  alt={interpolate(content.aboutPage.alt, { name: founder.name })}
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
                      <SmartLink
                        key={link.href}
                        href={link.href}
                      >
                        {link.label}
                      </SmartLink>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className={styles.company}>
          <p>{content.aboutPage.text3}{" "}
            <EnOnlyLink to="/impressum">{content.aboutPage.EnOnlyLink}</EnOnlyLink>{content.aboutPage.text4}{" "}
            <SmartLink href="/contact">{content.aboutPage.Link}</SmartLink>{content.aboutPage.text5}</p>
        </section>
      </main>
    </Layout>
  );
}
