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
            aria-label={`Enlarge the ${t.name} poster`}>
            <img
              className={s.thumb}
              src={`/img/posters/${t.slug}.webp`}
              alt={`Berlin route poster in the ${t.name} theme`}
              loading="lazy"
              width="600"
              height="849"
            />
            <span className={s.name}>{t.name}</span>
          </button>
        ))}
      </div>

      <p className={s.hint}>
        All seventeen, same Berlin route — scroll sideways, then click any one to enlarge it and
        step through with the arrow keys.
      </p>

      {overlay}
    </div>
  );
}
