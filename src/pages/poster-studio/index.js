import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/pages/poster-studio.json';
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
  PosterThemes,
  PosterStudioShot,
  ExportFormats,
} from '@site/src/components/pitch/Artifacts';
import PosterGallery from '@site/src/components/pitch/PosterGallery';

const rows = [
  {
    title: content.rows[0].title,
    body: content.rows[0].body,
    note: content.rows[0].note,
    media: <ExportFormats />,
  },
  {
    title: content.rows[1].title,
    body: content.rows[1].body,
    media: <PosterStudioShot />,
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

export default function PosterStudioPage() {
  const pageUrl = useLocalizedUrl('/poster-studio/');
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
          campaign="poster-studio"
          title={
            <>{content.posterStudioPage.text}<br />
              <em>{content.posterStudioPage.em}</em>
            </>
          }
          sub={content.hero.sub}
          artifact={<PosterThemes />}
        />

        <ProofStrip />

        <WideBlock
          title={content.posterStudioPage.title2}
          body={content.posterStudioPage.body}>
          <PosterGallery />
        </WideBlock>

        <ValueRows
          title={content.posterStudioPage.title3}
          sub={content.posterStudioPage.sub2}
          rows={rows}
        />

        <Objections title={content.posterStudioPage.title4} items={objections} />

        <CloseCTA
          campaign="poster-studio"
          title={content.posterStudioPage.title5}
          sub={
            <>{content.posterStudioPage.text2}{' '}
              <SmartLink href="/tools/map-poster-maker/">{content.posterStudioPage.a}</SmartLink>{content.posterStudioPage.text3}</>
          }
        />
      </PitchPage>
    </Layout>
  );
}
