# Website

This is the source code for the website of the [Dawarich](https://dawarich.app) project

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Press resources and footer

The public press kit is at `/press-kit`. Its page source is `src/pages/press-kit/`; it uses the original logo, app icon, product screenshots, and founder portraits in `static/img/`. Update the page when those assets or the company facts change.

Footer navigation is defined in `src/data/footerLinks.js`. Long columns use non-link subsection headings so visitors can scan product features, tools, documentation, and company links. Keep the press kit linked from the Company section and check `src/data/footerLinks.test.js` when moving links.

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
