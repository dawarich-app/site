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
    title: 'Sharing that switches itself off',
    body: 'Share your live location for an hour, six, twelve, twenty-four — or always, if that is what you want. The timer runs down on its own, so "just while I drive home" actually ends when you get home instead of running for the next three years.',
    note: 'You pick the duration, every time',
    media: <FamilySharingShot />,
  },
  {
    title: 'Nobody can switch it on for you',
    body: 'Five people, five independent switches. The person who pays for the plan has no more power over your sharing than anyone else does. Turning your own sharing off keeps working even if the subscription expires, because that is a privacy action and never a paid one.',
    media: <FamilyMembersShot />,
  },
  {
    title: 'Asking beats tracking',
    body: 'When you need to know where someone is, send a location request. They see who asked and choose to accept or decline. There is no way to pull a family member\'s position without them agreeing to it in that moment.',
    note: 'Consent is the mechanism, not a setting',
    media: <FamilyRequestShot />,
  },
];

const objections = [
  {
    q: 'Is this just Life360 with different branding?',
    a: 'No. The default here is that nothing is shared. Every member controls their own switch, live sharing can expire on a timer, location history is a separate decision from live position, and asking where somebody is means sending a request they can decline.',
  },
  {
    q: 'Can my teenager see that I am tracking them?',
    a: 'There is nothing hidden to see. Sharing is something each person turns on for themselves, and the family page shows exactly who is currently sharing and who is not. Covert tracking is not a feature we have.',
  },
  {
    q: 'What does each person actually get?',
    a: 'A full Dawarich account — their own map, timeline, trips, statistics and insights. Family is shared location between five separate accounts, not five people signing into one.',
  },
  {
    q: 'What happens if the plan owner\'s subscription expires?',
    a: 'The family is kept. Members fall back to their own plans once the subscription expires, and resubscribing restores it. Nobody is locked out of their own history.',
  },
  {
    q: 'Do I have to pay at all?',
    a: 'Not if you self-host. Family works on your own instance at no cost, because every capability of the paid Cloud product runs on hardware you own.',
  },
];

export default function FamilyPage() {
  return (
    <Layout
      title="Family Location Sharing — Private, Consent-Based, No Tracking"
      description="Share live location with up to five family members on your terms: per-person control, sharing timers, separate history windows, and location requests that must be accepted. €299.99/year or self-host free.">
      <Head>
        <meta
          property="og:title"
          content="Family Location Sharing Without the Surveillance"
        />
        <meta
          property="og:description"
          content="Five people, five independent switches. Live sharing on a timer, history as a separate choice, and location requests that have to be accepted. Nothing is shared by default."
        />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://dawarich.app/family" />
      </Head>

      <PitchPage>
        <PitchHero
          campaign="family"
          title={
            <>
              Family location sharing
              <br />
              <em>that everyone agrees to.</em>
            </>
          }
          sub="Family tracking apps assume the answer is watching everybody all the time. Dawarich assumes the opposite: nothing is shared until a person switches it on themselves, sharing can expire on a timer, and finding out where someone is means asking them."
          artifact={<FamilyPageShot />}
        />

        <ProofStrip />

        <ValueRows
          title="Built so nobody is watched by default"
          sub="Up to five people on one plan, each with a full Dawarich account and complete control of what they share."
          rows={rows}
        />

        <Objections title="What parents and partners ask us" items={objections} />

        <CloseCTA
          campaign="family"
          title="Share with your household, not with a data broker"
          sub="€299.99 a year covers five people on Dawarich Cloud. Or run the same thing on your own hardware for nothing."
          primaryLabel="Start a family plan"
        />
      </PitchPage>
    </Layout>
  );
}
