import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Visualize Your Location History',
    image: require('@site/docs/features/images/map.png').default,
    description: (
      <>
        Effortlessly import your location history from Google Maps Timeline, OwnTracks, HomeAssistant, Immich, Photos, and more. View your journeys on an interactive map, complete with customizable layers like heatmaps, points, and connecting lines to visualize your travels.
      </>
    ),
  },
  {
    title: 'Continuosly track and visualize your location',
    image: require('@site/docs/features/images/map-points.png').default,
    description: (
      <>
        You can use a number of different mobile apps to track your location and upload it to Dawarich. Currently supported apps are: Overland, OwnTracks, HomeAssistant and GPSLogger.
      </>
    ),
  },
  {
    title: 'Comprehensive Travel Statistics',
    image: require('@site/docs/features/images/stats.png').default,
    description: (
      <>
        Gain insights into your travel patterns with detailed statistics. Track the number of countries and cities visited and total distance traveled. Split your data by years and months for a clear overview of your journeys.
      </>
    ),
  },
  {
    title: 'Self-Hosted and Private',
    image: require('@site/static/img/undraw_safe_0mei.png').default,
    description: (
      <>
        Maintain complete control over your data with our self-hosted solution. Dawarich ensures your location history remains private and secure, giving you peace of mind while enjoying the full functionality of a robust tracking system.
      </>
    ),
  },
  {
    title: 'Visualize your trips on a map',
    image: require('@site/docs/features/images/trips-list.png').default,
    description: (
      <>
        Create and view your trips on a map, add your notes and see photos from your trip pulled from your own photo library on Immich or Photoprism.
      </>
    ),
  }
];

function Feature({ image, title, description, index }) {
  const isEven = index % 2 === 0;

  return (
    <div className={clsx('row', styles.featureSection)}>
      {isEven ? (
        <>
          <div className={clsx('col col--4', styles.featureContent)}>
            <div className={styles.featureText}>
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
            </div>
          </div>
          <div className={clsx('col col--8', styles.featureImage)}>
            <img src={image} alt={title} />
          </div>
        </>
      ) : (
        <>
          <div className={clsx('col col--8', styles.featureImage)}>
            <img src={image} alt={title} />
          </div>
          <div className={clsx('col col--4', styles.featureContent)}>
            <div className={styles.featureText}>
              <Heading as="h3">{title}</Heading>
              <p>{description}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} index={idx} />
        ))}
      </div>
    </section>
  );
}
