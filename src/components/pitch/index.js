import { SmartLink } from '@site/src/i18n/RichText';
import content from '@locale-content/components/Pitch.json';
import React from 'react';
import EnOnlyLink from '@site/src/i18n/EnOnlyLink';
import styles from './Pitch.module.css';

const SIGNUP = 'https://my.dawarich.app/users/sign_up';

const signupHref = (campaign, medium) =>
  `${SIGNUP}?utm_source=site&utm_medium=${medium}&utm_campaign=${campaign}`;

const CheckMark = () => (
  <svg
    className={styles.guaranteeMark}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="m5 12 5 5L20 7" />
  </svg>
);

/** Page shell that scopes the pitch token overrides. */
export function PitchPage({ children }) {
  return <div className={styles.shell}>{children}</div>;
}

/**
 * Hero: dream outcome, the mechanism in one sentence, dual CTA, risk reversal.
 * Deliberately has no eyebrow/kicker label above the heading.
 */
export function PitchHero({ title, sub, campaign, artifact, primaryLabel = content.primaryLabel }) {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <div>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroSub}>{sub}</p>
            <div className={styles.heroActions}>
              <SmartLink className={styles.primaryCta} href={signupHref(campaign, 'pitch-hero')}>
                {primaryLabel}
              </SmartLink>
              <EnOnlyLink className={styles.secondaryCta} to="/docs/self-hosting/installation/docker">{content.selfHost}</EnOnlyLink>
            </div>
            <p className={styles.reassurance}>{content.reassurance}</p>
          </div>
          <div className={styles.rowMedia}>{artifact}</div>
        </div>
      </div>
    </section>
  );
}

/** Real press coverage, named in PRODUCT.md as usable proof. */
export function ProofStrip() {
  return (
    <section className={styles.proof}>
      <div className={styles.container}>
        <div className={styles.proofInner}>
          <p className={styles.proofLabel}>{content.proofLabel}</p>
          <span className={styles.proofName}>{content.publishers.xda}</span>
          <span className={styles.proofName}>{content.publishers.makeUseOf}</span>
          <span className={styles.proofName}>{content.publishers.ct}</span>
          <span className={styles.proofName}>{content.publishers.itsFoss}</span>
        </div>
      </div>
    </section>
  );
}

/** Alternating asymmetric rows: a claim beside the artifact that proves it. */
export function ValueRows({ title, sub, rows }) {
  return (
    <section className={styles.rows}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {sub && <p className={styles.sectionSub}>{sub}</p>}
        </div>
        {rows.map((row, i) => (
          <div
            key={row.title}
            className={`${styles.row} ${i % 2 === 1 ? styles.rowReversed : ''}`}>
            <div>
              <h3 className={styles.rowTitle}>{row.title}</h3>
              <p className={styles.rowBody}>{row.body}</p>
              {row.note && <span className={styles.rowNote}>{row.note}</span>}
            </div>
            <div className={styles.rowMedia}>{row.media}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** A full-width band for content the two-column rows would crowd. */
export function WideBlock({ title, body, children }) {
  return (
    <section className={styles.rows}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {body && <p className={styles.sectionSub}>{body}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Objection handling — the questions that actually stop a signup. */
export function Objections({ title, items }) {
  return (
    <section className={styles.objections}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{title}</h2>
        </div>
        <div className={styles.objectionList}>
          {items.map((item) => (
            <div key={item.q} className={styles.objection}>
              <p className={styles.objectionQ}>{item.q}</p>
              <p className={styles.objectionA}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Close with the risk reversal spelled out. */
export function CloseCTA({ title, sub, campaign, primaryLabel = content.primaryLabel }) {
  return (
    <section className={styles.close}>
      <div className={styles.container}>
        <h2 className={styles.closeTitle}>{title}</h2>
        <p className={styles.closeSub}>{sub}</p>
        <div className={styles.closeActions}>
          <SmartLink className={styles.primaryCta} href={signupHref(campaign, 'pitch-close')}>
            {primaryLabel}
          </SmartLink>
          <SmartLink className={styles.secondaryCta} href="/pricing">{content.pricing}</SmartLink>
        </div>
        <ul className={styles.guarantee}>
          <li>
            <CheckMark />{content.guarantee.trial}</li>
          <li>
            <CheckMark />{content.guarantee.refund}</li>
          <li>
            <CheckMark />{content.guarantee.export}</li>
          <li>
            <CheckMark />{content.guarantee.selfHost}</li>
        </ul>
      </div>
    </section>
  );
}

export { styles as pitchStyles };
