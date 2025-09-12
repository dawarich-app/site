# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Docusaurus-based website for Dawarich, a location history visualization application. The site serves as both documentation and marketing for the project, including features, tutorials, and blog posts.

## Development Commands

### Setup
```bash
npm i  # Install dependencies
```

### Development
```bash
npm run start     # Start development server with hot reload
npm run build     # Build static site for production
```

### Deployment
```bash
git push origin main
```

## Architecture

### Core Technologies
- **Docusaurus 3.6+**: Static site generator with React components
- **React 18**: Component library for interactive elements
- **TypeScript**: Type checking (configured but not enforced)
- **Prism**: Code syntax highlighting
- **Chart.js + react-chartkick**: Data visualization
- **Leaflet + react-leaflet**: Interactive maps

### Site Structure
- `docs/`: Auto-generated sidebar documentation (tutorials, features, FAQ)
- `blog/`: Blog posts with author metadata
- `src/components/`: Reusable React components for the homepage
- `src/pages/`: Static pages (contact, legal, privacy)
- `static/`: Static assets, images, and media files

### Key Components
- `Hero.js`: Landing page hero with smooth scroll to features
- `Features.js`: Vertical tabs feature showcase with clickable image modals
- `UseCases.js`: Use cases section 
- `PrivacySection.js`: Data privacy and security information (SSL, LUKS, GDPR, EU hosting)
- `PricingSection.js`: Service pricing information

### Configuration
- `docusaurus.config.js`: Main site configuration, navbar, footer, analytics
- `sidebars.js`: Auto-generated documentation sidebar structure
- Sidebar content is automatically generated from the `docs/` folder structure

### Content Management
- Documentation uses automatic sidebar generation from folder structure
- Blog posts require frontmatter with author references
- Static pages are markdown files in `src/pages/`
- Images and media go in `static/img/` and are referenced with `/img/` paths

### Styling
- Custom CSS in `src/css/custom.css`
- Component-specific CSS modules (`.module.css` files)
- Dark/light theme support via Docusaurus theming

### Analytics
- Simple Analytics integration configured in `docusaurus.config.js`
- Cookie consent handled by `react-cookie-consent`

## Important Notes
- The site uses yarn, not npm (use yarn commands)
- Node.js 18+ required
- Auto-generated sidebars mean documentation structure follows filesystem
- Component styling uses CSS modules for scoping
- Video content served from `/static/` directory
