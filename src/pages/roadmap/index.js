import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import FeatureHero from '@site/src/components/FeatureHero';
import styles from './roadmap.module.css';

const CHANGELOG_URL =
  'https://github.com/Freika/dawarich/blob/master/CHANGELOG.md';

// ---------------------------------------------------------------------------
// Upcoming work — shown at the TOP of the timeline, tagged by status and
// platform. Curated by hand; seeded from the [Unreleased] sections of the web
// and mobile changelogs.
//   status:   'in-progress' (default) | 'planned'
//   platform: 'web' | 'mobile'
// Order in-progress first, then planned, so the timeline reads nearest-first.
// When something ships, move it down into `releases`.
// ---------------------------------------------------------------------------
const upcoming = [
  {
    platform: 'mobile',
    status: 'in-progress',
    title: 'Tracking & sign-in fixes',
    description:
      'Android records the first point immediately when a session starts, and Google / Apple sign-in no longer double-submits on a quick double tap.',
  },
  {
    platform: 'mobile',
    status: 'planned',
    title: 'App UI rework',
    description:
      'A visual refresh of the mobile app — updated navigation, screens and components to match the redesigned web experience.',
  },
  {
    platform: 'web',
    status: 'planned',
    title: 'More map customization',
    description:
      'Additional controls for tuning Map v2 to your taste beyond the current basemap options.',
  },
  {
    platform: 'web',
    status: 'planned',
    title: 'Posters generation',
    description:
      'Turn your location history into a printable, minimalist city map poster, generated straight from your Dawarich data.',
  },
  {
    platform: 'web',
    status: 'planned',
    title: 'Search rework',
    description:
      'A refreshed search experience for finding places and visits faster across your tracked history.',
  },
];

// ---------------------------------------------------------------------------
// "Recently shipped" — curated milestone releases across the whole history.
// Patch-only releases are intentionally omitted; each entry keeps a few
// user-facing highlights. Newest first.
// ---------------------------------------------------------------------------
const releases = [
  {
    version: '1.9.1',
    date: 'June 2026',
    theme: 'Trip photos',
    highlights: [
      'Trip photos from Immich now appear on Map v2 trip and replay views, popping in as the replay reaches each photo\'s timestamp',
      'The same photos show on public shared-trip links, with privacy-zone masking still applied',
    ],
  },
  {
    version: '1.9.0',
    date: 'June 2026',
    theme: 'AirTrail & redesigned trips',
    highlights: [
      'AirTrail integration pulls your flight history from a self-hosted instance and draws it as arcs on Map v2, with daily re-sync',
      'Trip pages redesigned around Map v2: sticky map, day-colored per-day accordion, and a timeline replay scrubber',
      'Per-day trip notes, editable straight from the accordion',
      'Public sharing for tracks and live location, plus a redesigned public trip page with per-section toggles',
    ],
  },
  {
    version: '1.8.1',
    date: 'June 2026',
    theme: 'Fog of War & faster maps',
    highlights: [
      'Visit Max Gap slider to tune the stay-point visit detector\'s maximum gap between points',
      'Fog of War can now reveal explored areas per hexagon instead of per point',
      'Faster point loading on large histories using the spatial index',
    ],
  },
  {
    version: '1.8.0',
    date: 'June 2026',
    theme: 'Smarter visits',
    highlights: [
      'Opt-in "stay-point" visit detection with a 0–100 confidence score per suggestion',
      'Sign in with Apple on the web (Dawarich Cloud)',
      'Search the real place name for any visit from the Map v2 Timeline',
      '"What\'s New" changelog notices in the navbar',
    ],
  },
  {
    version: '1.7.0',
    date: 'April 2026',
    theme: 'The Timeline release',
    highlights: [
      'Map v2 Timeline matures into a full Google Timeline replacement',
      'Monthly digest emails with distance, active days, top countries and cities',
      'User-configurable GPS noise filtering with re-evaluate / recalculate controls',
      'Self-hosted S3 storage (MinIO, Ceph, Cloudflare R2)',
    ],
  },
  {
    version: '1.6.0',
    date: 'March 2026',
    theme: 'Account security',
    highlights: [
      'Two-factor authentication (TOTP apps + backup codes)',
      'Immich users can enrich their photos with geodata',
    ],
  },
  {
    version: '1.5.0',
    date: 'March 2026',
    theme: 'Cleaner data',
    highlights: [
      'Automatic GPS noise filtering for unrealistic speeds, altitudes and jumps',
      'Toggle individual map layers on and off',
      'One-click demo data to instantly see what the map looks like',
      '"Days per Country" breakdown',
    ],
  },
  {
    version: '1.4.0',
    date: 'March 2026',
    theme: 'Family on the map',
    highlights: [
      'Family page with live member markers on the map',
      'Confirm-all / decline-all for visit suggestions',
      'Refreshed look and feel; faster point counting on large accounts',
    ],
  },
  {
    version: '1.3.4',
    date: 'March 2026',
    theme: 'Location sharing',
    highlights: [
      'Share your live location with family members, with per-member control',
      'Redesigned onboarding: "I have data" vs "Start tracking"',
    ],
  },
  {
    version: '1.3.2',
    date: 'March 2026',
    theme: 'Plans',
    highlights: [
      'Lite plan introduced for Dawarich Cloud alongside Pro',
      'Self-hosted instances stay fully featured, with no restrictions',
    ],
  },
  {
    version: '1.3.0',
    date: 'February 2026',
    theme: 'Storage & Timeline interaction',
    highlights: [
      'Per-user timezone setting applied across the whole app',
      'New Timeline feed in Map v2 with hover-to-highlight and click-to-zoom',
      'Encrypted v2 export/import format that streams large datasets',
    ],
  },
  {
    version: '1.0.0',
    date: 'January 2026',
    theme: 'The 1.0 milestone',
    highlights: [
      'Dawarich reaches 1.0 and moves to a more stable release cadence',
    ],
  },
  {
    version: '0.37.0',
    date: 'December 2025',
    theme: 'Year in review',
    highlights: [
      'Year-end digest emails summarizing your tracking year',
      'Render the map as a globe',
    ],
  },
  {
    version: '0.36.2',
    date: 'December 2025',
    theme: 'The Map v2 release',
    highlights: [
      'New MapLibre GL JS map (Map v2) alongside the classic Leaflet map',
      'Smoother interactions and better performance; new features land on v2',
    ],
  },
  {
    version: '0.36.0',
    date: 'November 2025',
    theme: 'Single sign-on & places',
    highlights: [
      'OIDC single sign-on for self-hosted instances (plus Google / GitHub on Cloud)',
      'KML file import',
      'Create places with tags, notes, privacy zones, and a Home location',
    ],
  },
  {
    version: '0.34.0',
    date: 'October 2025',
    theme: 'The Family release',
    highlights: [
      'Create family groups and invite members',
      'Full-screen map page',
    ],
  },
  {
    version: '0.31.0',
    date: 'September 2025',
    theme: 'The Search release',
    highlights: [
      'Search for a place and see every year and visit you were there',
      'Jump straight to a past visit on the map',
    ],
  },
  {
    version: '0.30.0',
    date: 'July 2025',
    theme: 'Stored tracks',
    highlights: [
      'Tracks are calculated and stored in the database instead of in the browser',
      'Faster map loading and nightly place-name backfill',
    ],
  },
  {
    version: '0.29.0',
    date: 'July 2025',
    theme: 'Move your data',
    highlights: [
      'Export your entire account — points, places, visits, trips and more — as a zip',
      'Import it into another Dawarich instance',
    ],
  },
  {
    version: '0.25.4',
    date: 'April 2025',
    theme: 'Flexible storage',
    highlights: [
      'Import / export files stored as attachments, S3-compatible',
      'Import Google Records.json directly from the UI',
      'Optional Sentry error tracking',
    ],
  },
  {
    version: '0.24.1',
    date: 'February 2025',
    theme: 'Custom maps',
    highlights: [
      'Set a custom map tile URL',
      'Nominatim added as a reverse-geocoding provider',
    ],
  },
  {
    version: '0.22.2',
    date: 'January 2025',
    theme: 'Fancy Routes',
    highlights: [
      'Color routes by the speed of each segment',
      'Hover a route to read its segment speed',
    ],
  },
  {
    version: '0.19.0',
    date: 'December 2024',
    theme: 'PhotoPrism photos',
    highlights: [
      'Show PhotoPrism photos on the map and import their geodata',
    ],
  },
  {
    version: '0.18.0',
    date: 'November 2024',
    theme: 'The Trips release',
    highlights: [
      'Create, edit and delete trips, auto-populated from your tracked points',
      'See trip photos from a connected Immich instance',
    ],
  },
  {
    version: '0.17.0',
    date: 'November 2024',
    theme: 'The Immich Photos release',
    highlights: [
      'Show photos from your Immich instance on the map',
    ],
  },
  {
    version: '0.16.0',
    date: 'November 2024',
    theme: 'The Websockets release',
    highlights: [
      'New points appear on the map in real time',
      'Live Mode that follows incoming points, plus in-app notifications',
      'Scratch map highlighting the countries you have visited',
    ],
  },
  {
    version: '0.15.0',
    date: 'October 2024',
    theme: 'The Watcher release',
    highlights: [
      'Drop GPX / GeoJSON files into a watched folder for automatic import',
      'Raw vs simplified point rendering for big histories',
    ],
  },
  {
    version: '0.14.0',
    date: 'September 2024',
    theme: 'More basemaps',
    highlights: [
      '17 new map tile layers to choose from',
    ],
  },
  {
    version: '0.13.0',
    date: 'September 2024',
    theme: 'Open formats',
    highlights: [
      'Export and import GPX and GeoJSON',
    ],
  },
  {
    version: '0.12.0',
    date: 'August 2024',
    theme: 'The visit suggestion release',
    highlights: [
      'Automatic visit suggestions you can confirm or decline',
      'Places page powered by reverse geocoding',
    ],
  },
  {
    version: '0.9.5',
    date: 'July 2024',
    theme: 'Areas & visits',
    highlights: [
      'Draw areas on the map and detect visits to them',
      'Confirm or decline visits to build your timeline',
    ],
  },
  {
    version: '0.8.0',
    date: 'June 2024',
    theme: 'Fog of War',
    highlights: [
      'Fog of War map layer and a dedicated Settings page',
    ],
  },
  {
    version: '0.7.0',
    date: 'June 2024',
    theme: 'The GPX MVP release',
    highlights: [
      'Import GPX files from your devices',
    ],
  },
  {
    version: '0.4.0',
    date: 'May 2024',
    theme: 'Your own data',
    highlights: [
      'Per-user API keys, so you only ever see your own points',
      'Heatmap layer showing point density',
    ],
  },
  {
    version: '0.1.5',
    date: 'April 2024',
    theme: 'The first release',
    highlights: [
      'The first tracked Dawarich release — where it all began',
    ],
  },
];

function UpcomingEntry({ item }) {
  // status defaults to 'in-progress'; set `status: 'planned'` to mark an item
  // as planned-but-not-started.
  const planned = item.status === 'planned';
  const mobile = item.platform === 'mobile';
  return (
    <li className={styles.timelineItem}>
      <div
        className={`${styles.timelineMarker} ${
          planned ? styles.markerPlanned : styles.markerInProgress
        }`}
        aria-hidden="true"
      />
      <div className={styles.timelineContent}>
        <div className={styles.upcomingHeader}>
          <span className={planned ? styles.plannedBadge : styles.inProgressBadge}>
            {planned ? 'Planned' : 'In progress'}
          </span>
          <span className={mobile ? styles.platformMobile : styles.platformWeb}>
            {mobile ? 'Mobile apps' : 'Web app'}
          </span>
        </div>
        <h3 className={styles.upcomingTitle}>{item.title}</h3>
        <p className={styles.upcomingDescription}>{item.description}</p>
      </div>
    </li>
  );
}

function ReleaseEntry({ release }) {
  return (
    <li className={styles.timelineItem}>
      <div
        className={`${styles.timelineMarker} ${styles.markerShipped}`}
        aria-hidden="true"
      />
      <div className={styles.timelineContent}>
        <div className={styles.releaseHeader}>
          <span className={styles.releaseVersion}>v{release.version}</span>
          {release.theme && (
            <span className={styles.releaseTheme}>{release.theme}</span>
          )}
          <span className={styles.releaseDate}>{release.date}</span>
        </div>
        <ul className={styles.highlights}>
          {release.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function Roadmap() {
  return (
    <Layout
      title="Roadmap"
      description="See what's shipping next in Dawarich and a curated history of what we've already delivered."
    >
      <Head>
        <meta property="og:title" content="Dawarich Roadmap" />
        <meta
          property="og:description"
          content="What's shipping next in Dawarich and a curated history of past releases."
        />
        <link rel="canonical" href="https://dawarich.app/roadmap" />
      </Head>

      <FeatureHero
        badge="Roadmap"
        title="What we're building"
        titleHighlight="next"
        subtitle="See what's shipping next in Dawarich and a curated history of everything we've delivered along the way."
        ctaText="Try 7 Days for Free"
      />

      <main className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Timeline</h2>
          <p className={styles.sectionSubtitle}>
            What's in progress and planned, flowing into the milestones we've
            already shipped.
          </p>
          <ol className={styles.timeline}>
            {upcoming.map((item, i) => (
              <UpcomingEntry key={`upcoming-${i}`} item={item} />
            ))}
            <li className={styles.timelineDivider}>
              <span>Released</span>
            </li>
            {releases.map((release) => (
              <ReleaseEntry key={release.version} release={release} />
            ))}
          </ol>
        </section>

        <section className={styles.footerCta}>
          <h2 className={styles.footerCtaTitle}>Want the full history?</h2>
          <p className={styles.footerCtaText}>
            Every release, down to the smallest fix, lives in the changelog.
          </p>
          <Link
            className={styles.footerCtaButton}
            to={CHANGELOG_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the full changelog
          </Link>
        </section>
      </main>
    </Layout>
  );
}
