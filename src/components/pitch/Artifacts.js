import content from '@locale-content/components/Artifacts.json';
import { interpolate } from '@docusaurus/Interpolate';
import React from 'react';
import { POSTER_THEMES, usePosterLightbox } from './PosterLightbox';
import s from './Artifacts.module.css';

/** The three themes shown beside the hero, drawn from the full set. */
const HERO_SLUGS = ['terracotta', 'blueprint', 'noir'];
const HERO_THEMES = HERO_SLUGS.map((slug) =>
  POSTER_THEMES.find((t) => t.slug === slug),
);

/** Three of the seventeen shipped themes, each opening the shared viewer. */
export function PosterThemes() {
  const { openAt, overlay } = usePosterLightbox(HERO_THEMES);

  return (
    <div className={s.posters}>
      {HERO_THEMES.map((t, i) => (
        <button
          key={t.slug}
          type="button"
          className={s.posterButton}
          onClick={() => openAt(i)}
          aria-label={interpolate(content.posterThemes.arialabel, { name: t.name })}>
          <img
            className={s.poster}
            src={`/img/posters/${t.slug}.webp`}
            alt={interpolate(content.posterThemes.alt, { name: t.name })}
            loading="lazy"
            width="600"
            height="849"
          />
          <span className={s.posterName}>{t.name}</span>
        </button>
      ))}
      {overlay}
    </div>
  );
}

/** The studio itself, composing a real 719 km route. */
export function PosterStudioShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/poster-studio.webp"
        alt={content.posterStudioShot.alt}
        loading="lazy"
        width="1600"
        height="1000"
      />
    </figure>
  );
}

/** The three export categories, with their real layout names. */
export function ExportFormats() {
  const groups = [
    {
      label: content.exportFormats.groups[0].label,
      items: content.exportFormats.groups[0].items,
    },
    {
      label: content.exportFormats.groups[1].label,
      items: content.exportFormats.groups[1].items,
    },
    {
      label: content.exportFormats.groups[2].label,
      items: content.exportFormats.groups[2].items,
    },
  ];
  return (
    <div className={s.stack}>
      {groups.map((g) => (
        <div key={g.label} className={s.formatGroup}>
          <p className={s.label}>{g.label}</p>
          <div className={s.choices}>
            {g.items.map((it) => (
              <span key={it} className={s.choice}>
                {it}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** What a share link can point at. */
export function ShareTargets() {
  const targets = content.shareTargets.items;
  return (
    <div className={s.stack}>
      <p className={s.label}>{content.shareTargets.p}</p>
      <div className={s.choices}>
        {targets.map((t) => (
          <span key={t} className={s.choice}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Real capture: the sharing controls, with the live-location timer running. */
export function FamilySharingShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/family-sharing.webp"
        alt={content.familySharingShot.alt}
        loading="lazy"
        width="1506"
        height="738"
      />
    </figure>
  );
}

/** Real capture: the member list, each with their own sharing state. */
export function FamilyMembersShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/family-members.webp"
        alt={content.familyMembersShot.alt}
        loading="lazy"
        width="1506"
        height="954"
      />
    </figure>
  );
}

/** Real capture: the whole family page, map and panel together. */
export function FamilyPageShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/family-page.webp"
        alt={content.familyPageShot.alt}
        loading="lazy"
        width="2800"
        height="1886"
      />
    </figure>
  );
}

/** Real capture: two members not sharing, each offering a location request. */
export function FamilyRequestShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/family-request.webp"
        alt={content.familyRequestShot.alt}
        loading="lazy"
        width="1506"
        height="408"
      />
    </figure>
  );
}

/** Real capture: per-country day counts with the 183-day threshold flagged. */
export function ResidencyCountriesShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/residency-countries.webp"
        alt={content.residencyCountriesShot.alt}
        loading="lazy"
        width="912"
        height="1212"
      />
    </figure>
  );
}

/** Real capture: the consecutive stay periods behind a country's total. */
export function ResidencyStaysShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/residency-stays.webp"
        alt={content.residencyStaysShot.alt}
        loading="lazy"
        width="840"
        height="840"
      />
    </figure>
  );
}

/** Real capture: the year as a calendar, one colour per country. */
export function ResidencyCalendarShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/residency-calendar.webp"
        alt={content.residencyCalendarShot.alt}
        loading="lazy"
        width="2742"
        height="706"
      />
    </figure>
  );
}

/** Real capture: a live link with its phrase, view count and controls. */
export function ShareHubShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/share-hub.webp"
        alt={content.shareHubShot.alt}
        loading="lazy"
        width="1800"
        height="1620"
      />
    </figure>
  );
}

/** Real capture: the creation form, with photos off before you send it. */
export function ShareFormShot() {
  return (
    <figure className={s.figure}>
      <img
        className={s.shot}
        src="/img/share-form.webp"
        alt={content.shareFormShot.alt}
        loading="lazy"
        width="1884"
        height="1920"
      />
    </figure>
  );
}
