import content from '@locale-content/components/PosterGallery.json';
import { interpolate } from '@docusaurus/Interpolate';
import React from 'react';
import { POSTER_THEMES, usePosterLightbox } from './PosterLightbox';
import s from './PosterGallery.module.css';

export default function PosterGallery() {
  const { openAt, overlay } = usePosterLightbox(POSTER_THEMES);

  return (
    <div className={s.wrap}>
      <div className={s.scroller}>
        {POSTER_THEMES.map((t, i) => (
          <button
            key={t.slug}
            type="button"
            className={s.item}
            onClick={() => openAt(i)}
            aria-label={interpolate(content.enlargePoster, { name: t.name })}>
            <img
              className={s.thumb}
              src={`/img/posters/${t.slug}.webp`}
              alt={interpolate(content.posterAlt, { name: t.name })}
              loading="lazy"
              width="600"
              height="849"
            />
            <span className={s.name}>{t.name}</span>
          </button>
        ))}
      </div>

      <p className={s.hint}>{content.hint}</p>

      {overlay}
    </div>
  );
}
