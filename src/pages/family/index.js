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
import styles from './FamilyPage.module.css';

const rows = [
  {
    title: 'Sharing that switches itself off',
    body: 'Share your live location for an hour, six, twelve, twenty-four — or always, if that is what you want. The timer runs down on its own, so "just while I drive home" actually ends when you get home instead of running for the next three years.',
    note: 'You pick the duration, every time',
    media: <FamilySharingShot />,
  },
  {
    title: 'Nobody can switch it on for you',
    body: 'Five people, five independent switches. Starting a Cloud Family plan turns on the owner\'s sharing, which they can turn off immediately. Invited members start with sharing off. The plan owner cannot switch it on for anyone else, and turning your own sharing off still works if the subscription expires.',
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
    a: 'No. Invited members start with sharing off, and every member controls their own switch. The Cloud plan owner starts with sharing on but can turn it off. Live sharing can expire on a timer, history is a separate choice, and a location request can be declined.',
  },
  {
    q: 'Can my teenager see that I am tracking them?',
    a: 'There is nothing hidden to see. Invited members decide whether to share, and the family page shows exactly who is currently sharing and who is not. Covert tracking is not a feature we have.',
  },
  {
    q: 'What does each person actually get?',
    a: 'A full Dawarich account — their own map, timeline, trips, statistics and insights. Family is shared location between five separate accounts, not five people signing into one.',
  },
  {
    q: 'What happens if the plan owner\'s subscription expires?',
    a: 'The family is kept and nothing is deleted. Access runs until the end of the period that was already paid for. After that, members without a plan of their own fall back to Lite and their tracking pauses until a plan is active again, while their history stays in their account and can be exported. Renewing restores everyone at once.',
  },
  {
    q: 'Does it work on our phones?',
    a: 'Yes. The Dawarich apps for iOS and Android show your family on the map. From the app you can turn your own sharing on or off, choose what history to share, and send or answer location requests.',
  },
  {
    q: 'Do I have to pay at all?',
    a: 'Not if you self-host. Family works on your own instance at no cost, because every capability of the paid Cloud product runs on hardware you own.',
  },
];

export default function FamilyPage() {
  return (
    <Layout
      title="Family Location Sharing App for iPhone and Android"
      description="Share family locations in the Dawarich iOS and Android apps. Invite up to five people; each controls live sharing, history and location requests. €299.99/year or self-host free.">
      <Head>
        <meta
          property="og:title"
          content="Family Location Sharing Without the Surveillance"
        />
        <meta
          property="og:description"
          content="Five people, five independent switches. Live sharing on a timer, history as a separate choice, and location requests that have to be accepted."
        />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://dawarich.app/family/" />
      </Head>

      <PitchPage>
        <PitchHero
          campaign="family"
          title={
            <>
              Family location sharing app
              <br />
              <em>that everyone agrees to.</em>
            </>
          }
          sub="See your household on iPhone and Android. Invited members choose when to share, live sharing can expire on a timer, and finding out where someone is means asking them. The Cloud plan owner starts with sharing on and can turn it off at any time."
          artifact={<FamilyPageShot />}
        />

        <ProofStrip />

        <ValueRows
          title="Built around each person's choice"
          sub="Up to five people on one plan, each with a full Dawarich account and control of what they share."
          rows={rows}
        />

        <WideBlock
          title="Get your family set up on iPhone and Android"
          body="The Family plan covers up to five separate accounts. Everyone uses their own phone and decides what to share.">
          <ol className={styles.setupSteps}>
            <li><strong>Start a Family plan.</strong> Dawarich creates the Cloud family for you, or you can create one on your self-hosted instance.</li>
            <li><strong>Invite your household.</strong> Send invitations from the Family page on the web. Each person accepts using the invited email address.</li>
            <li><strong>Install and sign in.</strong> Open the Dawarich app on each phone, then use the Family panel on the map to choose live sharing and history settings.</li>
          </ol>
          <div className={styles.appLinks}>
            <a href="https://apps.apple.com/app/apple-store/id6739544999?pt=128010810&ct=family-page&mt=8">Download the iOS app</a>
            <a href="https://play.google.com/store/apps/details?id=app.dawarich.Dawarich">Get the Android app</a>
            <a href="/docs/features/family">Read the setup guide</a>
          </div>
        </WideBlock>

        <Objections title="What parents and partners ask us" items={objections} />

        <CloseCTA
          campaign="family"
          title="Share with your household, not with a data broker"
          sub="€299.99 a year covers five people on Dawarich Cloud, with a 7-day free trial. Or run the same thing on your own hardware for nothing."
          primaryLabel="Start a family plan"
        />
      </PitchPage>
    </Layout>
  );
}
