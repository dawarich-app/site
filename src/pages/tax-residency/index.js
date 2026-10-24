import content from '@locale-content/pages/tax-residency.json';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import {
  PitchPage,
  PitchHero,
  ProofStrip,
  ValueRows,
  Objections,
  CloseCTA,
} from '@site/src/components/pitch';
import {
  ResidencyCountriesShot,
  ResidencyStaysShot,
  ResidencyCalendarShot,
} from '@site/src/components/pitch/Artifacts';

const rows = [
  {
    title: content.rows[0].title,
    body: content.rows[0].body,
    media: <ResidencyCountriesShot />,
  },
  {
    title: content.rows[1].title,
    body: content.rows[1].body,
    note: content.rows[1].note,
    media: <ResidencyStaysShot />,
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

export default function TaxResidencyPage() {
  const pageUrl = useLocalizedUrl('/tax-residency/');
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
          campaign="tax-residency"
          title={
            <>{content.taxResidencyPage.text}<br />
              <em>{content.taxResidencyPage.em}</em>
            </>
          }
          sub={content.hero.sub}
          artifact={<ResidencyCalendarShot />}
        />

        <ProofStrip />

        <ValueRows
          title={content.taxResidencyPage.title2}
          sub={content.taxResidencyPage.sub2}
          rows={rows}
        />

        <Objections title={content.taxResidencyPage.title3} items={objections} />

        <CloseCTA
          campaign="tax-residency"
          title={content.taxResidencyPage.title4}
          sub={
            <>{content.taxResidencyPage.text2}{' '}
              <EnOnlyLink to="/docs/features/tax-residency">{content.taxResidencyPage.EnOnlyLink}</EnOnlyLink>{content.taxResidencyPage.text3}</>
          }
        />
      </PitchPage>
    </Layout>
  );
}
