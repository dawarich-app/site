import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { PitchPage, Objections, ProofStrip } from '@site/src/components/pitch';
import pitch from '@site/src/components/pitch/Pitch.module.css';
import {
  COMMISSION_RATE,
  COOKIE_WINDOW_DAYS,
  REVIEW_PERIOD_DAYS,
  PORTAL_SIGNUP_URL,
  EARNINGS,
} from '@site/src/data/affiliateProgram';
import styles from './styles.module.css';

const PERCENT = `${Math.round(COMMISSION_RATE * 100)}%`;
const HEADLINE = EARNINGS.find((r) => r.key === 'proAnnual');
const money = (n) => `€${n.toFixed(2)}`;

const STATS = [
  { value: `${PERCENT} of the first year`, label: 'On every plan, including renewals within that year' },
  { value: `${COOKIE_WINDOW_DAYS}-day window`, label: 'From the first click to the sign-up' },
  { value: `Paid after ${REVIEW_PERIOD_DAYS} days`, label: 'Once the refund window closes' },
];

const HOW = [
  {
    title: 'Your link works even when cookies do not',
    body:
      'Most affiliate programs live and die by a browser cookie. Ours records the referral on our servers the moment the account is created, so a visitor who clears cookies, declines the banner, or switches from your blog to their laptop is still credited to you.',
    note: 'Server-side attribution',
  },
  {
    title: 'You are paid on what people actually keep',
    body:
      `Commission is held for ${REVIEW_PERIOD_DAYS} days while the refund window runs, then released automatically. Nothing is clawed back later, and you can see every pending and approved reward in your dashboard.`,
  },
  {
    title: 'Web subscriptions only',
    body:
      'Sign-ups that pay through our website earn commission. Subscriptions bought inside the iOS or Android apps go through Apple and Google, never reach our billing system, and cannot be attributed. Self-hosting Dawarich is free and earns nothing at all.',
    note: 'Worth knowing before you write',
  },
];

const objections = [
  {
    q: 'My audience mostly self-hosts. Is this worth my time?',
    a: 'Probably not, and we would rather say so now. Dawarich is open source and self-hosting is free, so a self-hosting tutorial earns nothing however well it performs. This program pays on Dawarich Cloud subscriptions. If your audience wants tracking without running a server, it is worth your time.',
  },
  {
    q: 'When do I actually get paid?',
    a: `A referral becomes a pending reward as soon as the subscription is paid for, and is approved automatically after ${REVIEW_PERIOD_DAYS} days once the refund window has closed. Payouts are handled in the affiliate dashboard.`,
  },
  {
    q: 'What happens if someone refunds?',
    a: `Nothing you need to handle. The ${REVIEW_PERIOD_DAYS}-day hold exists precisely so a refund inside the window cancels the pending reward instead of being taken back from a balance you have already been paid.`,
  },
  {
    q: 'Does the person I refer pay more?',
    a: 'No. The price is identical whether they arrive through your link or type the address themselves. The commission comes out of our margin, not their bill.',
  },
  {
    q: 'What am I not allowed to do?',
    a: 'Do not bid on "Dawarich" or close variants in paid search, do not refer yourself, and do not list us on coupon or deal-aggregation sites. Disclose that your link is an affiliate link — most jurisdictions require it, and readers respect it.',
  },
];

export default function AffiliatePage() {
  return (
    <Layout
      title={`Affiliate Program — Earn ${PERCENT} of the First Year`}
      description={`Earn ${PERCENT} of first-year revenue for every Dawarich Cloud subscriber you refer. ${COOKIE_WINDOW_DAYS}-day window, server-side attribution, paid after the refund window.`}>
      <Head>
        <meta property="og:title" content="Dawarich Affiliate Program" />
        <meta
          property="og:description"
          content={`Earn ${PERCENT} of first-year revenue on every Dawarich Cloud subscription you refer. ${money(HEADLINE.commission)} per annual Pro subscriber.`}
        />
        <meta property="og:image" content="https://dawarich.app/img/meta-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://dawarich.app/affiliate" />
      </Head>

      <PitchPage>
        <section className={pitch.hero}>
          <div className={pitch.container}>
            <h1 className={pitch.heroTitle}>
              Earn {money(HEADLINE.commission)} for every Pro
              <br />
              <em>subscriber you send us.</em>
            </h1>
            <p className={pitch.heroSub}>
              Dawarich is a private alternative to Google Timeline. If you write about privacy,
              self-hosting, travel or quantified self, your readers are already looking for it —
              and {PERCENT} of their first year comes back to you.
            </p>
            <div className={pitch.heroActions}>
              <Link className={pitch.primaryCta} href={PORTAL_SIGNUP_URL}>
                Become an affiliate
              </Link>
              <Link className={pitch.secondaryCta} to="/pricing">
                See what people are buying
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={pitch.container}>
            <div className={styles.statsGrid}>
              {STATS.map((s) => (
                <div key={s.value} className={styles.stat}>
                  <p className={styles.statValue}>{s.value}</p>
                  <p className={styles.statLabel}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProofStrip />

        <section className={styles.earnings}>
          <div className={pitch.container}>
            <h2 className={styles.earningsTitle}>What each referral is worth</h2>
            <p className={styles.earningsSub}>
              {PERCENT} of everything they pay in their first year.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>They pay</th>
                    <th>You earn</th>
                  </tr>
                </thead>
                <tbody>
                  {EARNINGS.map((r) => (
                    <tr key={r.key}>
                      <td>{r.plan}</td>
                      <td>
                        {r.basis}
                        {r.note ? <span className={styles.rowNote}>{r.note}</span> : null}
                      </td>
                      <td className={styles.amount}>{money(r.commission)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={styles.how}>
          <div className={pitch.container}>
            <h2 className={styles.earningsTitle}>How the program works</h2>
            <div className={styles.howGrid}>
              {HOW.map((card) => (
                <div key={card.title} className={styles.card}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardBody}>{card.body}</p>
                  {card.note ? <span className={styles.cardNote}>{card.note}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Objections title="The questions worth asking first" items={objections} />

        <section className={pitch.close}>
          <div className={pitch.container}>
            <h2 className={pitch.closeTitle}>Start earning on your next post</h2>
            <p className={pitch.closeSub}>
              Sign up, get your link, and share it. No application to wait on, no minimum audience.
            </p>
            <div className={pitch.closeActions}>
              <Link className={pitch.primaryCta} href={PORTAL_SIGNUP_URL}>
                Become an affiliate
              </Link>
            </div>
          </div>
        </section>
      </PitchPage>
    </Layout>
  );
}
