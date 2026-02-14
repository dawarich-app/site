// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dawarich',
  tagline: 'Visualize your location history',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://dawarich.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  scripts: [
    {
      src: "https://scripts.simpleanalyticscdn.com/latest.js",
      async: true
    },
    {
      src: "https://cdn.paddle.com/paddle/v2/paddle.js",
      async: true
    }
  ],

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  clientModules: [
    require.resolve('./src/client-modules/utm-preservation.js'),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        { name: 'twitter:image', content: 'img/meta-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Dawarich' },
        { name: 'twitter:description', content: 'Your Life, Mapped Automatically' },
        { name: 'twitter:url', content: 'https://dawarich.app' },
        { name: 'og:image', content: 'img/meta-image.jpg' },
        { name: 'og:type', content: 'website' },
        { name: 'og:title', content: 'Dawarich' },
        { name: 'og:description', content: 'Your Life, Mapped Automatically' },
        { name: 'og:url', content: 'https://dawarich.app' },
      ],
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Dawarich',
        logo: {
          alt: 'Dawarich Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: 'Features',
            position: 'left',
            items: [
              {
                to: '/interactive-map',
                label: '🗺️ Interactive Map',
              },
              {
                to: '/trips',
                label: '✈️ Trips & Journaling',
              },
              {
                to: '/statistics',
                label: '📊 Statistics & Analytics',
              },
              {
                to: '/location-tracking',
                label: '📱 Location Tracking',
              },
              {
                to: '/import-export',
                label: '📦 Import & Export',
              },
              {
                to: '/integrations',
                label: '📸 Photo Integrations',
              },
            ],
          },
          {href: '/#pricing', label: 'Pricing', position: 'left'},
          {
            type: 'dropdown',
            label: 'Free tools',
            position: 'left',
            items: [
              {
                to: '/tools/timeline-visualizer',
                label: '🗺️ Google Timeline Visualizer',
              },
              {
                to: '/tools/google-timeline-converter',
                label: '🔄 Google Timeline Converter',
              },
              {
                to: '/tools/timeline-statistics',
                label: '📊 Timeline Statistics Analyzer',
              },
              {
                to: '/tools/timeline-mileage-calculator',
                label: '🚗 Timeline Mileage Calculator',
              },
              {
                to: '/tools/timeline-merger',
                label: '🔗 Timeline Data Merger',
              },
              {
                to: '/tools/gps-file-splitter',
                label: '✂️ GPS File Splitter',
              },
              {
                to: '/tools/timeline-format-detector',
                label: '🔍 Timeline Format Detector',
              },
              {
                to: '/tools/heatmap-generator',
                label: '🔥 GPS Heatmap Generator',
              },
              {
                to: '/tools/gpx-merger',
                label: '🔗 GPX Track Merger',
              },
              {
                to: '/tools/photo-geotagging',
                label: '📸 Photo Geodata Extraction',
              }
            ],
          },
          {
            type: 'dropdown',
            label: 'Converters',
            position: 'left',
            items: [
              {
                to: '/tools/fit-to-gpx',
                label: '🔄 FIT → GPX',
              },
              {
                to: '/tools/fit-to-geojson',
                label: '🔄 FIT → GeoJSON',
              },
              {
                to: '/tools/fit-to-kml',
                label: '🔄 FIT → KML',
              },
              {
                to: '/tools/tcx-to-gpx',
                label: '🔄 TCX → GPX',
              },
              {
                to: '/tools/tcx-to-geojson',
                label: '🔄 TCX → GeoJSON',
              },
              {
                to: '/tools/tcx-to-kml',
                label: '🔄 TCX → KML',
              },
              {
                to: '/tools/gpx-to-geojson',
                label: '🔄 GPX → GeoJSON',
              },
              {
                to: '/tools/gpx-to-kml',
                label: '🔄 GPX → KML',
              },
              {
                to: '/tools/gpx-to-kmz',
                label: '🔄 GPX → KMZ',
              },
              {
                to: '/tools/geojson-to-gpx',
                label: '🔄 GeoJSON → GPX',
              },
              {
                to: '/tools/geojson-to-kml',
                label: '🔄 GeoJSON → KML',
              },
              {
                to: '/tools/geojson-to-kmz',
                label: '🔄 GeoJSON → KMZ',
              },
              {
                to: '/tools/kml-to-gpx',
                label: '🔄 KML → GPX',
              },
              {
                to: '/tools/kml-to-geojson',
                label: '🔄 KML → GeoJSON',
              },
              {
                to: '/tools/kml-to-kmz',
                label: '🔄 KML → KMZ',
              },
              {
                to: '/tools/kmz-to-gpx',
                label: '🔄 KMZ → GPX',
              },
              {
                to: '/tools/kmz-to-geojson',
                label: '🔄 KMZ → GeoJSON',
              },
              {
                to: '/tools/kmz-to-kml',
                label: '🔄 KMZ → KML',
              },
            ]
          },
          {to: '/blog', label: 'Blog', position: 'right'},
          {
            type: 'dropdown',
            label: 'Mobile Apps 📱',
            position: 'left',
            items: [
              {
                to: '/docs/dawarich-for-ios',
                label: '🍎 Dawarich for iOS',
              },
              {
                to: '/docs/dawarich-for-android',
                label: '🤖 Dawarich for Android',
              },
            ],
          },
          {
            to: 'https://discourse.dawarich.app/',
            label: 'Community',
            position: 'right',
          },
          {
            to: 'https://my.dawarich.app',
            label: 'Sign in',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Dawarich',
            items: [
              {
                html: '<p>Made and hosted in 🇪🇺 Europe</p><p>&copy;ZeitFlow UG (haftungsbeschränkt)</p><p>Berlin, Germany</p>',
              },
            ]
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/pHsBjpt5J8',
              },
              {
                label: 'X',
                href: 'https://x.com/freymakesstuff',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Freika/dawarich',
              },
              {
                label: 'Mastodon',
                href: 'https://mastodon.social/@dawarich',
                rel: 'me',
              },
            ]
          },
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
              {
                label: 'Self-Hosting Guide',
                to: '/docs/self-hosting/introduction',
              },
              {
                label: 'Importing existing data',
                to: '/docs/getting-started/import-existing-data',
              },
              {
                label: 'Exporting data',
                to: '/docs/getting-started/export-your-data',
              },
              {
                label: 'FAQ',
                to: 'docs/FAQ',
              },
              {
                label: 'Contact',
                to: '/contact',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Privacy Policy',
                to: '/privacy-policy',
              },
              {
                label: 'Terms and Conditions',
                to: '/terms-and-conditions',
              },
              {
                label: 'Refund Policy',
                to: '/refund-policy',
              },
              {
                label: 'Impressum',
                to: '/impressum',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Credits',
                to: '/credits',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Dawarich, built with Docusaurus.`,
        logo: {
          src: 'https://trendshift.io/api/badge/repositories/11108',
          href: 'https://trendshift.io/repositories/11108',
        },
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula
      },
    }),
};

export default config;
