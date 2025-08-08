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
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/docs/intro', label: 'Self host', position: 'left'},
          {to: '/docs/dawarich-for-ios', label: 'Dawarich for iOS 📱 (new!)', position: 'left'},
          {
            href: 'https://github.com/Freika/dawarich',
            label: 'GitHub',
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
                label: 'Tutorial',
                to: '/docs/intro',
              },
              {
                label: 'Importing existing data',
                to: 'docs/tutorials/import-existing-data',
              },
              {
                label: 'Exporting data',
                to: 'https://dawarich.app/docs/tutorials/export-your-data',
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
