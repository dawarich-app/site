import content from '@locale-content/pages/location-sharing.json';
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
  ShareTargets,
  ShareHubShot,
  ShareFormShot,
} from '@site/src/components/pitch/Artifacts';

const rows = [
  {
    title: content.rows[0].title,
    body: content.rows[0].body,
    media: <ShareTargets />,
  },
  {
    title: content.rows[1].title,
    body: content.rows[1].body,
    note: content.rows[1].note,
    media: <ShareFormShot />,
  },
];

const objections = content.objections;

export default function LocationSharingPage() {
  const pageUrl = useLocalizedUrl('/location-sharing/');
  return (
    <Layout
      title={content.meta.title}
      description={content.meta.description}>
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
          campaign="location-sharing"
          title={
            <>{content.locationSharingPage.text}<br />
              <em>{content.locationSharingPage.em}</em>
            </>
          }
          sub={content.hero.sub}
          artifact={<ShareHubShot />}
        />

        <ProofStrip />

        <ValueRows
          title={content.locationSharingPage.title2}
          sub={content.locationSharingPage.sub2}
          rows={rows}
        />

        <Objections title={content.locationSharingPage.title3} items={objections} />

        <CloseCTA
          campaign="location-sharing"
          title={content.locationSharingPage.title4}
          sub={content.locationSharingPage.sub3}
        />
      </PitchPage>
    </Layout>
  );
}
