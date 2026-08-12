import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
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
    title: 'Every country, counted, with the 183-day line drawn',
    body: 'Pick a year and see how many distinct days you spent in each country, ordered largest first. Any country where you reach 183 days or more is flagged — the threshold behind a great many residency rules, and the number you want to see coming rather than discover in April.',
    media: <ResidencyCountriesShot />,
  },
  {
    title: 'The runs behind the total, not just the total',
    body: 'A total of 353 days tells you less than the eight separate stretches that made it up — a 133-day run, a 104-day run, then a scatter of short ones in December. Each stay is listed with its start date, end date and length, which is what you need when a rule cares about unbroken presence rather than an annual sum.',
    note: 'Exportable evidence, not a dashboard number',
    media: <ResidencyStaysShot />,
  },
];

const objections = [
  {
    q: 'Is this tax advice?',
    a: 'No, and it does not pretend to be. Dawarich reports what your location history says. It does not interpret any country\'s tax law, and jurisdictions count days differently — some count partial days, some exclude travel days, some average across several years. It is evidence to bring to a professional, not a conclusion to act on.',
  },
  {
    q: 'How exactly is a day counted?',
    a: 'A day counts for a country if you have at least one recorded point there that day. Fly Germany to France on a Tuesday and that Tuesday counts for both, so per-country days can add up to more than your tracked days. Days are bounded by UTC, which near midnight and near a border can move a day.',
  },
  {
    q: 'What about days I did not track?',
    a: 'They count for nothing and are never attributed to your last known country. The report also shows your total tracked days, so you can see how much of the year your numbers actually cover — the first thing an accountant will ask.',
  },
  {
    q: 'I have years of history in Google Timeline. Does that work?',
    a: 'Yes. Import your Google Takeout archive and the days come with it. Imported points need reverse geocoding before they can be attributed to a country, which Dawarich handles for you.',
  },
  {
    q: 'Do I have to trust you with years of location data?',
    a: 'You do not have to trust anyone. The entire application is open source and every capability runs on hardware you own. Self-host it and the data never leaves your machine.',
  },
];

export default function TaxResidencyPage() {
  return (
    <Layout
      title="Tax Residency Day Counter — Track the 183-Day Rule Automatically"
      description="Count the days you spent in each country from your own GPS history, with consecutive stay periods and a 183-day threshold flag. Built for digital nomads, cross-border commuters and long-term travellers.">
      <Head>
        <meta
          property="og:title"
          content="Tax Residency Day Counter — Track the 183-Day Rule From Your GPS History"
        />
        <meta
          property="og:description"
          content="Per-country day counts from location history you already collect, with consecutive stay periods and a 183-day threshold flag. Evidence for residency questions, not tax advice."
        />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://dawarich.app/tax-residency" />
      </Head>

      <PitchPage>
        <PitchHero
          campaign="tax-residency"
          title={
            <>
              You crossed six borders this year.
              <br />
              <em>How many days was that?</em>
            </>
          }
          sub="Reconstructing a year from boarding passes and calendar entries is how people get residency wrong. Dawarich counts the days per country from the GPS history you already collect — one square per day, coloured by country — flags anything past 183, and leaves the gaps visible where your tracking lapsed instead of papering over them."
          artifact={<ResidencyCalendarShot />}
        />

        <ProofStrip />

        <ValueRows
          title="The answer, with its working shown"
          sub="Days per country lives on the Insights page and follows the year you pick at the top."
          rows={rows}
        />

        <Objections title="Read this before you rely on it" items={objections} />

        <CloseCTA
          campaign="tax-residency"
          title="Start counting now, not next April"
          sub={
            <>
              Track from today and next year&apos;s answer is already counted. The full counting
              rules are in the{' '}
              <Link to="/docs/features/tax-residency">Days per Country documentation</Link>.
            </>
          }
        />
      </PitchPage>
    </Layout>
  );
}
