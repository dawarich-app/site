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
          aria-label={`Enlarge the ${t.name} poster`}>
          <img
            className={s.poster}
            src={`/img/posters/${t.slug}.webp`}
            alt={`Berlin route poster in the ${t.name} theme`}
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
        alt="Poster Studio composing a route, with layout, theme and text controls"
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
      label: 'Print · 12',
      items: ['A5', 'A4', 'A3', 'A2', 'A1', 'A0', '30 × 40 cm', '50 × 70 cm', '70 × 100 cm', 'Letter (US)', 'A4 Landscape', 'A3 Landscape'],
    },
    {
      label: 'Social · 5',
      items: ['Instagram Square', 'Instagram Portrait', 'Story (9:16)', 'X Header', 'YouTube Thumbnail'],
    },
    {
      label: 'Wallpaper · 5',
      items: ['Desktop Full HD', 'Desktop 4K', 'Desktop Ultrawide', 'Phone', 'Tablet'],
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
  const targets = ['A date range', 'Live location', 'One track', 'A trip', 'A month of stats', 'A yearly digest'];
  return (
    <div className={s.stack}>
      <p className={s.label}>Six things, six separate links</p>
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
        alt="Family sharing controls: live location on for six hours with the time remaining, and location history as a separate toggle set to the last 7 days"
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
        alt="Family member list showing two people sharing, two not sharing, each with a Request button"
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
        alt="The Dawarich family page: a shared map beside the sharing controls, member list and invitations"
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
        alt="Two family members marked Not sharing, each with a Request button beside them"
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
        alt="Countries card listing days per country for 2023 — Germany 353 days at 96.7% carrying a threshold warning, then Belgium, Greece, Switzerland, Denmark, France and Poland"
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
        alt="Germany expanded to show eight consecutive stay periods through 2023, each with its dates and length"
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
        alt="A year-long calendar heatmap with one colour per country and a legend naming each"
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
        alt="The share hub: a public link and its magic phrase, twelve views, and buttons to regenerate the URL, regenerate the phrase or revoke the link"
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
        alt="Creating a share link: a start and end date, an optional magic phrase, an expiry defaulting to one week, and a Show photos toggle switched off"
        loading="lazy"
        width="1884"
        height="1920"
      />
    </figure>
  );
}
