import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/pages/family.json';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import {
  PitchPage,
  PitchHero,
  ProofStrip,
  ValueRows,
  WideBlock,
  Objections,
  CloseCTA,
} from '@site/src/components/pitch';
import {
  FamilySharingShot,
  FamilyMembersShot,
  FamilyRequestShot,
  FamilyPageShot,
} from '@site/src/components/pitch/Artifacts';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import RichText from '@site/src/i18n/RichText';
import styles from './FamilyPage.module.css';

const rows = [
  {
    title: content.rows[0].title,
    body: content.rows[0].body,
    note: content.rows[0].note,
    media: <FamilySharingShot />,
  },
  {
    title: content.rows[1].title,
    body: content.rows[1].body,
    media: <FamilyMembersShot />,
  },
  {
    title: content.rows[2].title,
    body: content.rows[2].body,
    note: content.rows[2].note,
    media: <FamilyRequestShot />,
  },
];

export default function FamilyPage() {
  const pageUrl = useLocalizedUrl('/family/');
  return (
    <Layout
      title={content.meta.title}
      description={interpolate(content.meta.description, { price: "€239.99/year" })}>
      <Head>
        <meta name="twitter:url" content={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta
          property="og:title"
          content={content.meta.ogTitle}
        />
        <meta
          property="og:description"
          content={content.meta.ogDescription}
        />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />

      </Head>

      <PitchPage>
        <PitchHero
          campaign="family"
          title={
            <>{content.familyPage.text}<br />
              <em>{content.familyPage.em}</em>
            </>
          }
          sub={content.hero.sub}
          artifact={<FamilyPageShot />}
        />

        <ProofStrip />

        <ValueRows
          title={content.familyPage.title2}
          sub={content.familyPage.sub2}
          rows={rows}
        />

        <WideBlock title={content.setup.title} body={content.setup.body}>
          <ol className={styles.setupSteps}>
            {content.setup.steps.map((step) => (
              <li key={step}><RichText text={step} /></li>
            ))}
          </ol>
          <div className={styles.appLinks}>
            <a href="https://apps.apple.com/app/apple-store/id6739544999?pt=128010810&ct=family-page&mt=8">{content.setup.ios}</a>
            <a href="https://play.google.com/store/apps/details?id=app.dawarich.Dawarich">{content.setup.android}</a>
            <EnOnlyLink to="/docs/features/family">{content.setup.guide}</EnOnlyLink>
          </div>
        </WideBlock>

        <Objections title={content.familyPage.title3} items={content.objections} />

        <CloseCTA
          campaign="family"
          title={content.familyPage.title4}
          sub={interpolate(content.familyPage.sub3, { price: "€239.99" })}
          primaryLabel={content.familyPage.primaryLabel}
        />
      </PitchPage>
    </Layout>
  );
}
