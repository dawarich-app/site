import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
afterEach(cleanup);
import FeatureHero from './FeatureHero';
import FeatureShowcase from './FeatureShowcase';
import { PitchHero, ProofStrip, CloseCTA } from './pitch';
import * as Artifacts from './pitch/Artifacts';
import PosterGallery from './pitch/PosterGallery';
import { POSTER_THEMES, usePosterLightbox } from './pitch/PosterLightbox';
import { interpolate } from '@docusaurus/Interpolate';
import hero from '@locale-content/components/FeatureHero.json';
import showcase from '@locale-content/components/FeatureShowcase.json';
import pitch from '@locale-content/components/Pitch.json';
import artifacts from '@locale-content/components/Artifacts.json';
import gallery from '@locale-content/components/PosterGallery.json';
import lightbox from '@locale-content/components/PosterLightbox.json';

function Lightbox() {
  const { openAt, overlay } = usePosterLightbox(POSTER_THEMES);
  return <><button onClick={() => openAt(0)}>Open</button>{overlay}</>;
}

describe('Landing component content', () => {
  it('FeatureHero renders its default CTA from content', () => {
    render(<FeatureHero title="Feature" />);
    expect(screen.getByRole('link', { name: hero.ctaText })).toBeInTheDocument();
  });
  it('FeatureShowcase renders its image action and close label from content', () => {
    render(<FeatureShowcase items={[{ title: 'Map', image: '/map.webp' }]} />);
    fireEvent.click(screen.getByRole('button', { name: interpolate(showcase.viewImage, { image: 'Map' }) }));
    expect(screen.getByRole('button', { name: showcase.closeImage })).toBeInTheDocument();
  });
  it('PitchHero renders its default CTA from content', () => {
    render(<PitchHero title="Pitch" campaign="test" />);
    expect(screen.getByRole('link', { name: pitch.primaryLabel })).toBeInTheDocument();
  });
  it('ProofStrip renders its label from content', () => {
    render(<ProofStrip />);
    expect(screen.getByText(pitch.proofLabel)).toBeInTheDocument();
  });
  it('CloseCTA renders its pricing label from content', () => {
    render(<CloseCTA title="Close" campaign="test" />);
    expect(screen.getByRole('link', { name: pitch.pricing })).toBeInTheDocument();
  });
  it('PosterGallery renders its hint from content', () => {
    render(<PosterGallery />);
    expect(screen.getByText(gallery.hint)).toBeInTheDocument();
  });
  it('PosterLightbox renders its controls from content', () => {
    render(<Lightbox />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: lightbox.close })).toBeInTheDocument();
  });
  it('PosterThemes renders its image action from content', () => {
    render(<Artifacts.PosterThemes />);
    expect(screen.getByRole('button', { name: interpolate(artifacts.posterThemes.arialabel, { name: POSTER_THEMES.find(t => t.slug === 'terracotta').name }) })).toBeInTheDocument();
  });
  it('ExportFormats renders its label from content', () => {
    render(<Artifacts.ExportFormats />);
    expect(screen.getByText(artifacts.exportFormats.groups[0].label)).toBeInTheDocument();
  });
  it('ShareTargets renders its label from content', () => {
    render(<Artifacts.ShareTargets />);
    expect(screen.getByText(artifacts.shareTargets.p)).toBeInTheDocument();
  });
  it.each([
    ['PosterStudioShot', 'posterStudioShot.alt'], ['FamilySharingShot', 'familySharingShot.alt'],
    ['FamilyMembersShot', 'familyMembersShot.alt'], ['FamilyPageShot', 'familyPageShot.alt'],
    ['FamilyRequestShot', 'familyRequestShot.alt'], ['ResidencyCountriesShot', 'residencyCountriesShot.alt'],
    ['ResidencyStaysShot', 'residencyStaysShot.alt'], ['ResidencyCalendarShot', 'residencyCalendarShot.alt'],
    ['ShareHubShot', 'shareHubShot.alt'], ['ShareFormShot', 'shareFormShot.alt'],
  ])('%s renders its image label from content', (name, key) => {
    const Component = Artifacts[name];
    render(<Component />);
    expect(screen.getByAltText(key.split('.').reduce((value, part) => value[part], artifacts))).toBeInTheDocument();
  });
});
