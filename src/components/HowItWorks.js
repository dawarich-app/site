import { useEffect, useState } from 'react';
import styles from './HowItWorks.module.css';

const ROUTE_PINS = [
  { left: '16.63%', top: '50%' },
  { left: '50%', top: '40%' },
  { left: '83.37%', top: '53.3%', accent: true },
];

function Pin({ icon, num, accent, className }) {
  return (
    <div className={`${styles.pinBody} ${accent ? styles.pinBodyAccent : ''} ${className || ''}`}>
      {icon && <span className={styles.pinIcon}>{icon}</span>}
      <span className={styles.pinNum}>{num}</span>
    </div>
  );
}

function RouteHowItWorks({ title, subtitle, steps }) {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAnimate(!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const pinFor = (index) =>
    ROUTE_PINS[index] || { left: `${((index + 0.5) / steps.length) * 100}%`, top: '50%' };

  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles.routeWrap}>
          <div className={styles.routeBand} aria-hidden="true">
            <svg
              className={styles.routeSvg}
              viewBox="0 0 980 300"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="hiw-route-path"
                d="M163,150 C 260,90 380,92 490,120 C 620,153 700,210 817,160"
                stroke="var(--ifm-color-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="2 11"
                opacity="0.85"
              />
              {animate && (
                <>
                  <circle r="11" fill="var(--ifm-color-accent)" opacity="0.25">
                    <animateMotion dur="6s" repeatCount="indefinite">
                      <mpath href="#hiw-route-path" />
                    </animateMotion>
                  </circle>
                  <circle r="6" fill="var(--ifm-color-accent)">
                    <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
                      <mpath href="#hiw-route-path" />
                    </animateMotion>
                  </circle>
                </>
              )}
            </svg>

            {steps.map((step, index) => {
              const pin = pinFor(index);
              return (
                <div
                  key={index}
                  className={styles.routePin}
                  style={{ left: pin.left, top: pin.top }}
                >
                  <Pin icon={step.icon} num={index + 1} accent={pin.accent} />
                </div>
              );
            })}
          </div>

          <div className={styles.routeSteps}>
            {steps.map((step, index) => (
              <div key={index} className={styles.routeStep}>
                <Pin
                  icon={step.icon}
                  num={index + 1}
                  accent={pinFor(index).accent}
                  className={styles.routeStepPinMobile}
                />
                <p className={styles.routeKicker}>
                  Step {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className={styles.routeStepTitle}>{step.title}</h3>
                {step.description && (
                  <p className={styles.routeStepDesc}>{step.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HowItWorks({ title, subtitle, steps, horizontal, variant }) {
  if (variant === 'route') {
    return <RouteHowItWorks title={title} subtitle={subtitle} steps={steps} />;
  }

  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={`${styles.steps} ${horizontal ? styles.stepsHorizontal : ''}`}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${styles.step} ${horizontal ? styles.stepHorizontal : ''}`}
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
