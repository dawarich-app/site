import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Visualize Your Location History',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Effortlessly import your location history from Google Maps Timeline and Owntracks. View your journeys on an interactive map, complete with customizable layers like heatmaps, points, and connecting lines to visualize your travels.
      </>
    ),
  },
  {
    title: 'Comprehensive Travel Statistics',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Gain insights into your travel patterns with detailed statistics. Track the number of countries and cities visited, total distance traveled, and time spent in each location. Split your data by years and months for a clear overview of your journeys.
      </>
    ),
  },
  {
    title: 'Self-Hosted and Private',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Maintain complete control over your data with our self-hosted solution. Dawarich ensures your location history remains private and secure, giving you peace of mind while enjoying the full functionality of a robust tracking system.
      </>
    ),
  }
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
