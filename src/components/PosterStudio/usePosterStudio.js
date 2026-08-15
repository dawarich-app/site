// All studio state plus the derived MapLibre style. Deliberately DOM-free:
// only style_builder / theme_loader / layouts / fonts are imported, so the
// hook stays safe to load outside the maplibre lazy boundary.
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_FONT_KEY } from '../../lib/poster-studio/data/fonts';
import { DEFAULT_LAYOUT_ID, layoutById } from '../../lib/poster-studio/data/layouts';
import { loadThemeTokens, resolveTheme, THEME_KEYS } from '../../lib/poster-studio/data/theme_loader';
import { buildPosterStyle } from '../../lib/poster-studio/render/style_builder';

export const DEFAULT_THEME_KEY = THEME_KEYS[0];
export const DEFAULT_DPI = 300;

export function usePosterStudio(trackGeojson) {
  const [themeKey, setThemeKey] = useState(DEFAULT_THEME_KEY);
  const [tokens, setTokens] = useState(null);
  const [themeError, setThemeError] = useState(null);
  const [layoutId, setLayoutId] = useState(DEFAULT_LAYOUT_ID);
  const [dpi, setDpi] = useState(DEFAULT_DPI);
  const [title, setTitle] = useState('Berlin');
  const [subtitle, setSubtitle] = useState('Summer 2026');
  const [showCoords, setShowCoords] = useState(true);
  const [showAttribution, setShowAttribution] = useState(true);
  const [fontKey, setFontKey] = useState(DEFAULT_FONT_KEY);
  const [trackColor, setTrackColor] = useState(null);
  const [trackOpacity, setTrackOpacity] = useState(0.5);
  const [trackWidth, setTrackWidth] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setThemeError(null);
    loadThemeTokens(themeKey)
      .then((loaded) => {
        if (!cancelled) setTokens(loaded);
      })
      .catch((error) => {
        if (!cancelled) setThemeError(error);
      });
    return () => {
      cancelled = true;
    };
  }, [themeKey]);

  const theme = useMemo(() => (tokens ? resolveTheme(tokens) : null), [tokens]);
  const layout = useMemo(() => layoutById(layoutId), [layoutId]);
  const style = useMemo(
    () =>
      theme
        ? buildPosterStyle({ theme, trackGeojson, trackColor, trackOpacity, trackWidth })
        : null,
    [theme, trackGeojson, trackColor, trackOpacity, trackWidth],
  );

  return {
    themeKey,
    setThemeKey,
    theme,
    themeError,
    layoutId,
    setLayoutId,
    layout,
    dpi,
    setDpi,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    showCoords,
    setShowCoords,
    showAttribution,
    setShowAttribution,
    fontKey,
    setFontKey,
    trackColor,
    setTrackColor,
    trackOpacity,
    setTrackOpacity,
    trackWidth,
    setTrackWidth,
    style,
  };
}
