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
  Objections,
  CloseCTA,
} from '@site/src/components/pitch';
import {
  FamilySharingShot,
  FamilyMembersShot,
  FamilyRequestShot,
  FamilyPageShot,
} from '@site/src/components/pitch/Artifacts';

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

const objections = [
  {
    q: content.objections[0].q,
    a: content.objections[0].a,
  },
  {
    q: content.objections[1].q,
    a: content.objections[1].a,
  },
  {
    q: content.objections[2].q,
    a: content.objections[2].a,
  },
  {
    q: content.objections[3].q,
    a: content.objections[3].a,
  },
  {
    q: content.objections[4].q,
    a: content.objections[4].a,
  },
];

export default function FamilyPage() {
  const pageUrl = useLocalizedUrl('/family/');
  return (
    <Layout
      title={content.meta.title}
      description={interpolate(content.meta.description, { price: "€299.99/year" })}>
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

        <Objections title={content.familyPage.title3} items={objections} />

        <CloseCTA
          campaign="family"
          title={content.familyPage.title4}
          sub={interpolate(content.familyPage.sub3, { price: "€299.99" })}
          primaryLabel={content.familyPage.primaryLabel}
        />
      </PitchPage>
    </Layout>
  );
}
