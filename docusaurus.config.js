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
          docItemComponent: "@theme/ApiItem",
          async sidebarItemsGenerator({defaultSidebarItemsGenerator, ...args}) {
            const items = await defaultSidebarItemsGenerator(args);
            return items.filter(item => !(item.type === 'category' && item.label === 'api'));
          },
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

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: "api",
        docsPluginId: "classic",
        config: {
          dawarich: {
            specPath: "https://raw.githubusercontent.com/Freika/dawarich/master/swagger/v1/swagger.yaml",
            outputDir: "docs/api",
            version: "v1",
            label: "v1",
            baseUrl: "/docs/api",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            // To add API v2:
            // 1. Move v1 into `versions` below
            // 2. Update main specPath/outputDir to v2
            // Example:
            //   specPath: ".../swagger/v2/swagger.yaml",
            //   outputDir: "docs/api",
            //   version: "v2",
            //   label: "v2",
            //   baseUrl: "/docs/api",
            //   versions: {
            //     "v1": {
            //       specPath: ".../swagger/v1/swagger.yaml",
            //       outputDir: "docs/api-v1",
            //       label: "v1",
            //       baseUrl: "/docs/api-v1",
            //     },
            //   },
            versions: {},
          },
        },
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],

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
                label: 'Interactive Map',
              },
              {
                to: '/trips',
                label: 'Trips & Journaling',
              },
              {
                to: '/statistics',
                label: 'Statistics & Analytics',
              },
              {
                to: '/location-tracking',
                label: 'Location Tracking',
              },
              {
                to: '/import-export',
                label: 'Import & Export',
              },
              {
                to: '/integrations',
                label: 'Photo Integrations',
              },
            ],
          },
          {href: '/#pricing', label: 'Pricing', position: 'left'},
          {to: '/docs/self-hosting/introduction', label: 'Self-Hosted', position: 'left'},
          {to: '/tools', label: 'Tools', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'right'},
          {
            type: 'dropdown',
            label: 'Mobile Apps',
            position: 'left',
            items: [
              {
                to: '/docs/dawarich-for-ios',
                label: 'Dawarich for iOS',
              },
              {
                to: '/docs/dawarich-for-android',
                label: 'Dawarich for Android',
              },
            ],
          },
          {
            to: 'https://discourse.dawarich.app/',
            label: 'Community',
            position: 'right',
          },
          {
            to: 'https://my.dawarich.app/users/sign_in?utm_source=site&utm_medium=navbar&utm_campaign=signin',
            label: 'Sign in',
            position: 'right',
          },
          {
            type: 'html',
            position: 'right',
            value: '<a href="https://my.dawarich.app/users/sign_in?utm_source=site&utm_medium=navbar&utm_campaign=google_signin" class="navbar-google-btn"><svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg><span>Sign in with Google</span></a>',
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
                html: '<p style="display:inline-flex;align-items:center;gap:0.375rem;margin:0 0 0.5rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg><span>Made and hosted in Europe</span></p><p>&copy;ZeitFlow UG (haftungsbeschränkt)</p><p>Berlin, Germany</p>',
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
              {
                label: 'Reddit',
                href: 'https://reddit.com/r/dawarich',
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
                label: 'API Docs',
                to: '/docs/api/dawarich-api',
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
            title: 'Tools',
            items: [
              {
                label: 'Google Timeline Visualizer',
                to: '/tools/timeline-visualizer',
              },
              {
                label: 'GPS Heatmap Generator',
                to: '/tools/heatmap-generator',
              },
              {
                label: 'FIT → GPX Converter',
                to: '/tools/fit-to-gpx',
              },
              {
                label: 'KML → GPX Converter',
                to: '/tools/kml-to-gpx',
              },
              {
                label: 'See all tools →',
                to: '/tools',
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
