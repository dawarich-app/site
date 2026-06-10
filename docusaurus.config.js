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

  trailingSlash: true,

  scripts: [
    {
      src: "https://scripts.simpleanalyticscdn.com/latest.js",
      async: true
    },
    {
      src: "https://cdn.paddle.com/paddle/v2/paddle.js",
      async: true
    },
    {
      src: "https://www.googletagmanager.com/gtag/js?id=AW-17899851408",
      async: true
    }
  ],

  // Google Ads gtag bootstrap + cross-domain linker.
  // The linker rewrites outbound links to my.dawarich.app to include a `_gl`
  // param carrying the gclid + client_id. Without this, ad-click attribution
  // is lost when users navigate from the marketing site to the manager,
  // because the gclid cookie is scoped to dawarich.app only.
  // We disable send_page_view because pageview events are not configured as
  // conversions in Google Ads — sending them would just be noise.
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/img/apple-touch-icon.png",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/img/icon-512.png",
        media: "(prefers-color-scheme: light)",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/img/icon-512-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    },
    {
      tagName: "script",
      attributes: {},
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-17899851408', {
          send_page_view: false,
          linker: { domains: ['dawarich.app', 'my.dawarich.app'] }
        });
      `,
    },
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
        sitemap: {
          ignorePatterns: [
            '/docs/api/**',
            '/docs/category/**',
            '/blog/tags/**',
            '/blog/page/**',
            '/blog/archive/**',
            '/blog/authors/**',
            '/docs/intro/**',
          ],
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
        { name: 'twitter:image', content: 'img/meta-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Dawarich' },
        { name: 'twitter:description', content: 'Your Life, Mapped Automatically' },
        { name: 'twitter:url', content: 'https://dawarich.app' },
        { name: 'og:image', content: 'img/meta-image.png' },
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
          {to: '/pricing', label: 'Pricing', position: 'left'},
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
        copyright: `<div class="dawarich-footer-social" role="navigation" aria-label="Community links">
  <a href="https://discord.gg/pHsBjpt5J8" target="_blank" rel="noopener noreferrer" aria-label="Discord"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></a>
  <a href="https://x.com/freymakesstuff" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
  <a href="https://github.com/Freika/dawarich" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
  <a href="https://mastodon.social/@dawarich" target="_blank" rel="me noopener noreferrer" aria-label="Mastodon"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg></a>
  <a href="https://reddit.com/r/dawarich" target="_blank" rel="noopener noreferrer" aria-label="Reddit"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg></a>
</div>
<a href="https://trendshift.io/repositories/11108" target="_blank" rel="noopener noreferrer" class="dawarich-footer-trendshift"><img src="https://trendshift.io/api/badge/repositories/11108" alt="Dawarich on Trendshift" /></a>
<p class="dawarich-footer-copyright-text">Copyright © ${new Date().getFullYear()} Dawarich</p>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula
      },
    }),
};

export default config;
