import content from '@locale-content/components/PosterLightbox.json';
import { interpolate } from '@docusaurus/Interpolate';
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useDialog from '../useDialog';
import s from './PosterLightbox.module.css';

/**
 * The seventeen shipped poster themes, each exported from Poster Studio over
 * the same Berlin route (15 Jul 2024 – 15 Jul 2026).
 */
export const POSTER_THEMES = [
  { slug: 'autumn', name: content.poster.themes[0].name },
  { slug: 'blueprint', name: content.poster.themes[1].name },
  { slug: 'contrast-zones', name: content.poster.themes[2].name },
  { slug: 'copper-patina', name: content.poster.themes[3].name },
  { slug: 'emerald-city', name: content.poster.themes[4].name },
  { slug: 'forest', name: content.poster.themes[5].name },
  { slug: 'gradient-roads', name: content.poster.themes[6].name },
  { slug: 'japanese-ink', name: content.poster.themes[7].name },
  { slug: 'midnight-blue', name: content.poster.themes[8].name },
  { slug: 'monochrome-blue', name: content.poster.themes[9].name },
  { slug: 'neon-cyberpunk', name: content.poster.themes[10].name },
  { slug: 'noir', name: content.poster.themes[11].name },
  { slug: 'ocean', name: content.poster.themes[12].name },
  { slug: 'pastel-dream', name: content.poster.themes[13].name },
  { slug: 'sunset', name: content.poster.themes[14].name },
  { slug: 'terracotta', name: content.poster.themes[15].name },
  { slug: 'warm-beige', name: content.poster.themes[16].name },
];

const ChevronLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/**
 * Shared poster viewer. Returns an `openAt(index)` opener and the portalled
 * overlay to render. Left/right arrows and the on-screen controls step through
 * whichever set of posters it was opened from, wrapping at both ends.
 */
export function usePosterLightbox(items) {
  const [index, setIndex] = useState(null);
  const count = items.length;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta) => setIndex((i) => (i === null ? null : (i + delta + count) % count)),
    [count],
  );

  const dialogRef = useDialog(index !== null, close);

  useEffect(() => {
    if (index === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [index, step]);

  const active = index === null ? null : items[index];

  const overlay =
    active && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={s.modal}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={interpolate(content.position, { name: active.name, position: index + 1, total: count })}
            onClick={close}>
            <button
              type="button"
              className={`${s.control} ${s.close}`}
              onClick={close}
              aria-label={content.close}>
              ×
            </button>
            {count > 1 && (
              <button
                type="button"
                className={`${s.control} ${s.prev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={content.previous}>
                <ChevronLeft />
              </button>
            )}
            {count > 1 && (
              <button
                type="button"
                className={`${s.control} ${s.next}`}
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={content.next}>
                <ChevronRight />
              </button>
            )}
            <figure className={s.figure}>
              <img
                className={s.image}
                src={`/img/posters/full/${active.slug}.webp`}
                alt={interpolate(content.posterAlt, { name: active.name })}
                onClick={(e) => e.stopPropagation()}
              />
              <figcaption className={s.caption}>
                {active.name}
                {count > 1 && (
                  <span className={s.counter}>
                    {index + 1} / {count}
                  </span>
                )}
              </figcaption>
            </figure>
          </div>,
          document.body,
        )
      : null;

  return { openAt: setIndex, overlay };
}
