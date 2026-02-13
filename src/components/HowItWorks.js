import React, { useEffect, useRef, useState } from 'react';
import styles from './HowItWorks.module.css';

export default function HowItWorks({ title, subtitle, steps, horizontal }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.howItWorks} ref={sectionRef}>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={`${styles.steps} ${horizontal ? styles.stepsHorizontal : ''}`}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${styles.step} ${horizontal ? styles.stepHorizontal : ''} ${isVisible ? styles.stepVisible : ''}`}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}
            >
              {!horizontal && <div className={styles.stepNumber}>{index + 1}</div>}
              <div className={styles.stepContent}>
                <div className={`${styles.stepHeader} ${horizontal ? styles.stepHeaderHorizontal : ''}`}>
                  {horizontal && <div className={styles.stepNumber}>{index + 1}</div>}
                  {step.icon && <div className={styles.stepIcon}>{step.icon}</div>}
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </div>
                {step.description && (
                  <p className={`${styles.stepDescription} ${horizontal ? styles.stepDescriptionHorizontal : ''}`}>{step.description}</p>
                )}
                {step.details && (
                  <ul className={styles.stepDetails}>
                    {step.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
              {horizontal && index < steps.length - 1 && (
                <div className={styles.connector}>
                  <div className={styles.connectorLine} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
