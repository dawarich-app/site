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
    title: 'One link, one thing',
    body: 'A link points at exactly what you chose: a date range, your live position, a single track, a trip, a month of statistics, or a yearly digest. Sharing last weekend\'s ride tells the person nothing about last Tuesday.',
    media: <ShareTargets />,
  },
  {
    title: 'Everything the link does is decided before you send it',
    body: 'A phrase is generated for you and can be cleared if you would rather not use one. The expiry defaults to a week out and can be blanked for a link that never expires. Photos start switched off, so you will never send a page and find out afterwards that it showed more than you meant.',
    note: 'Off by default, on by decision',
    media: <ShareFormShot />,
  },
];

const objections = [
  {
    q: 'Does sharing a link expose my whole history?',
    a: 'No. A link resolves to the one resource it was created for. A timeline link is bounded by the dates you picked; a track link shows that track. There is no path from a shared page to the rest of your account.',
  },
  {
    q: 'What if I send it to the wrong person?',
    a: 'Revoke it. The link stops resolving straight away. If you had set a passphrase, you can instead regenerate just the phrase, which invalidates every unlock anyone has already done while keeping the link itself alive.',
  },
  {
    q: 'Do the people I share with need an account?',
    a: 'No. A shared page opens in any browser. If you set a passphrase they enter that, and nothing else.',
  },
  {
    q: 'Can I see whether anyone opened it?',
    a: 'Yes. Every link you have made is listed in one place with how many times it has been opened and when it was last accessed.',
  },
  {
    q: 'What happens to my links if my subscription expires?',
    a: 'You can export everything at any time, and the whole application is open source — you can run the same features on your own hardware for free, permanently.',
  },
];

export default function LocationSharingPage() {
  return (
    <Layout
      title="Location Sharing — Share Your Location History by Link"
      description="Share your live location or location history with a private link. Passphrase-protected, expiring, revocable, and scoped to exactly what you choose. Free 7-day trial or self-host free.">
      <Head>
        <meta
          property="og:title"
          content="Location Sharing — Share Your Location History by Private Link"
        />
        <meta
          property="og:description"
          content="Send one link that shows one thing: a date range, live location, a track, a trip, a month of stats or a yearly digest. Passphrase, expiry and instant revoke on every link."
        />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://dawarich.app/location-sharing" />
      </Head>

      <PitchPage>
        <PitchHero
          campaign="location-sharing"
          title={
            <>
              Share where you are.
              <br />
              <em>Not everywhere you have been.</em>
            </>
          }
          sub="Most location sharing is a switch: on, and someone follows you indefinitely. Dawarich gives you a link instead — pointed at one thing, locked with a passphrase, dead on a date you pick, and revocable the second you change your mind."
          artifact={<ShareHubShot />}
        />

        <ProofStrip />

        <ValueRows
          title="Sharing that stays scoped"
          sub="Six shareable things, each its own link with its own settings and its own expiry."
          rows={rows}
        />

        <Objections title="The questions worth asking first" items={objections} />

        <CloseCTA
          campaign="location-sharing"
          title="Send one link, not your whole history"
          sub="Start on Dawarich Cloud with a 7-day trial, or run the identical features on your own hardware for nothing."
        />
      </PitchPage>
    </Layout>
  );
}
