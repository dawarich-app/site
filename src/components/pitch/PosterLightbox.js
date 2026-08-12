import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useDialog from '../useDialog';
import s from './PosterLightbox.module.css';

/**
 * The seventeen shipped poster themes, each exported from Poster Studio over
 * the same Berlin route (15 Jul 2024 – 15 Jul 2026).
 */
export const POSTER_THEMES = [
  { slug: 'autumn', name: 'Autumn' },
  { slug: 'blueprint', name: 'Blueprint' },
  { slug: 'contrast-zones', name: 'Contrast Zones' },
  { slug: 'copper-patina', name: 'Copper Patina' },
  { slug: 'emerald-city', name: 'Emerald City' },
  { slug: 'forest', name: 'Forest' },
  { slug: 'gradient-roads', name: 'Gradient Roads' },
  { slug: 'japanese-ink', name: 'Japanese Ink' },
  { slug: 'midnight-blue', name: 'Midnight Blue' },
  { slug: 'monochrome-blue', name: 'Monochrome Blue' },
  { slug: 'neon-cyberpunk', name: 'Neon Cyberpunk' },
  { slug: 'noir', name: 'Noir' },
  { slug: 'ocean', name: 'Ocean' },
  { slug: 'pastel-dream', name: 'Pastel Dream' },
  { slug: 'sunset', name: 'Sunset' },
  { slug: 'terracotta', name: 'Terracotta' },
  { slug: 'warm-beige', name: 'Warm Beige' },
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
            aria-label={`${active.name} poster, ${index + 1} of ${count}`}
            onClick={close}>
            <button
              type="button"
              className={`${s.control} ${s.close}`}
              onClick={close}
              aria-label="Close">
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
                aria-label="Previous poster">
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
                aria-label="Next poster">
                <ChevronRight />
              </button>
            )}
            <figure className={s.figure}>
              <img
                className={s.image}
                src={`/img/posters/full/${active.slug}.webp`}
                alt={`Berlin route poster in the ${active.name} theme, enlarged`}
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
