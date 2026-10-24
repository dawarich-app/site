# Website

This is the source code for the website of the [Dawarich](https://dawarich.app) project

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Press resources and footer

The public press kit is at `/press-kit`. Its page source is `src/pages/press-kit/`; it uses the original app logo and icon, light and dark logo variants, horizontal wordmarks, product screenshots, and founder portraits in `static/img/`. The additional downloadable logo files live in `static/img/press-kit/` and come from the project's existing brand assets. Update the page when those assets or the company facts change.

Footer navigation is defined in `src/data/footerLinks.js`. Long columns use non-link subsection labels so visitors can scan product features, tools, documentation, and company links. These labels are plain text elements, since heading tags inside the shared footer caused a heading-level skip on nearly every page. Keep the press kit linked from the Company section and check `src/data/footerLinks.test.js` when moving links.

### September 2026 SEO audit

The [OpenSEO audit](https://openseo.zeitflow.de/p/f95ef856-7fac-45f8-a3ea-5beb822eed3b/reports/fc6238d8-ea81-424d-ae58-bc0c73c240e5) prioritized the Life360 comparison and the Family app onboarding path. The comparison, Family landing page and Family guide now explain the current Cloud Family plan and its consent controls. In particular, Cloud plan creation enables the owner's sharing before anyone else joins; invited members begin with sharing off. The Family landing page links directly to both mobile apps.

The audit's missing H1, missing image alt and mismatched canonical URL findings were also addressed. This site uses `trailingSlash: true`, so hand-written canonical URLs should end in `/`. Validate changes with a production build and inspect generated HTML. Search rankings and clicks need follow-up after deployment; the audit's metadata-length warnings are content review suggestions rather than evidence of indexing failure.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
