import React, { useState } from 'react';
import styles from './FAQ.module.css';

const faqData = [
  {
    question: 'How do I import my Google Timeline data?',
    answer:
      'You can export your location history from Google Takeout and import it directly into Dawarich. The process takes just a few minutes, and all your historical data will be available on your interactive map.',
  },
  {
    question: 'Can I self-host Dawarich?',
    answer:
      'Yes! Dawarich is fully open-source and can be self-hosted using Docker. You get all features for free when self-hosting, with complete control over your data.',
  },
  {
    question: 'What mobile apps are supported?',
    answer:
      'Dawarich has official apps for both iOS and Android for background location tracking. You can also use OwnTracks, GPSLogger, Overland and some other 3rd party apps.',
  },
  {
    question: 'How is my location data protected?',
    answer:
      'Your data is encrypted both in transit (SSL/TLS) and at rest (LUKS encryption). If you self-host, your data never leaves your own server. Our cloud service stores data in European data centers with full GDPR compliance.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Yes, you can export all your location data at any time. Dawarich supports multiple export formats, ensuring you\'re never locked in.',
  },
  {
    question: 'What integrations are available?',
    answer:
      'Dawarich integrates with Immich and PhotoPrism for photo geotagging, supports import from Google Takeout, and works with OwnTracks, GPSLogger, and other tracking apps.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! Dawarich Cloud offers a 7-day free trial with no credit card required. You can also self-host Dawarich for free with all features included.',
  },
];

function ChevronIcon({ isOpen }) {
  return (
    <svg
      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className={styles.faqItem}>
      <button className={styles.question} onClick={onClick}>
        <span>{question}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      <div
        className={`${styles.answerWrapper} ${isOpen ? styles.answerWrapperOpen : ''}`}
      >
        <div className={styles.answer}>{answer}</div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Frequently Asked Questions</h2>
        <p className={styles.subtitle}>
          Everything you need to know about Dawarich.
        </p>
        <div className={styles.faqList}>
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
