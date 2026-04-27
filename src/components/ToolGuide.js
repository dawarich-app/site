import React from 'react';
import Head from '@docusaurus/Head';
import styles from './ToolGuide.module.css';

// Renders the unique editorial content + FAQPage + BreadcrumbList JSON-LD
// for a converter tool page. Content shape is defined in src/data/tool-guides/<slug>.js.
//
// Props:
//   slug:    tool slug (used in BreadcrumbList)
//   title:   page H1, also used as breadcrumb leaf
//   content: { whenToConvert, preservation, apps, example, reference, faqs }
export default function ToolGuide({ slug, title, content }) {
  if (!content) return null;
  const pageUrl = `https://dawarich.app/tools/${slug}/`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://dawarich.app/" },
      { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://dawarich.app/tools/" },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  };
  const faqSchema = content.faqs && content.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  } : null;

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Head>
      <div className={styles.guide}>
        {content.whenToConvert && (
          <section>
            <h2>When you'd convert {content.whenToConvert.subject}</h2>
            {content.whenToConvert.body.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        )}

        {content.preservation && (
          <section>
            <h2>What gets preserved (and what doesn't)</h2>
            <p>{content.preservation.intro}</p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Preserved?</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {content.preservation.rows.map((r, i) => (
                    <tr key={i}>
                      <td><strong>{r.field}</strong></td>
                      <td>{r.preserved}</td>
                      <td>{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {content.apps && (
          <section>
            <h2>Apps that read your converted file</h2>
            <p>{content.apps.intro}</p>
            <ul className={styles.appList}>
              {content.apps.items.map((app, i) => (
                <li key={i}>
                  <strong>{app.url ? <a href={app.url} target="_blank" rel="noopener">{app.name}</a> : app.name}</strong>
                  {' — '}{app.note}
                </li>
              ))}
            </ul>
          </section>
        )}

        {content.example && (
          <section>
            <h2>Worked example</h2>
            <p>{content.example.intro}</p>
            <div className={styles.exampleGrid}>
              <div>
                <h3>Input ({content.example.fromLabel})</h3>
                <pre className={styles.code}><code>{content.example.input}</code></pre>
              </div>
              <div>
                <h3>Output ({content.example.toLabel})</h3>
                <pre className={styles.code}><code>{content.example.output}</code></pre>
              </div>
            </div>
          </section>
        )}

        {content.reference && (
          <section>
            <h2>{content.reference.heading}</h2>
            {content.reference.body.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        )}

        {content.faqs && content.faqs.length > 0 && (
          <section>
            <h2>Frequently asked questions</h2>
            <dl className={styles.faqList}>
              {content.faqs.map(({ q, a }, i) => (
                <React.Fragment key={i}>
                  <dt>{q}</dt>
                  <dd>{a}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>
        )}
      </div>
    </>
  );
}
