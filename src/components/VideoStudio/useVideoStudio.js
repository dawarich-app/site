// All video studio state plus the derived MapLibre style. DOM-free on
// purpose (mirrors usePosterStudio): safe to load outside the lazy boundary.
import { useEffect, useMemo, useState } from 'react';
import { loadThemeTokens, resolveTheme, THEME_KEYS } from '../../lib/poster-studio/data/theme_loader';
import { buildPosterStyle } from '../../lib/poster-studio/render/style_builder';
import { DAWARICH_BLUE } from '../../utils/videoExport/colorUtil';

export const VIDEO_FORMATS = {
  portrait: { width: 1080, height: 1920, label: 'Story · 9:16' },
  landscape: { width: 1920, height: 1080, label: 'Wide · 16:9' },
  square: { width: 1080, height: 1080, label: 'Feed · 1:1' },
};

export const DEFAULT_VIDEO_THEME_KEY = 'noir';
export const MIN_DURATION_SEC = 8;
export const MAX_DURATION_SEC = 30;

export function useVideoStudio(trackGeojson) {
  const [themeKey, setThemeKey] = useState(DEFAULT_VIDEO_THEME_KEY);
  const [tokens, setTokens] = useState(null);
  const [themeError, setThemeError] = useState(null);
  const [formatKey, setFormatKey] = useState('portrait');
  const [durationSec, setDurationSec] = useState(15);
  const [cameraMode, setCameraMode] = useState('overview');
  const [followZoom, setFollowZoom] = useState(13.5);
  const [trackColor, setTrackColor] = useState(DAWARICH_BLUE);
  const [trackWidth, setTrackWidth] = useState(1.2);
  const [units, setUnits] = useState('km');

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
  const format = VIDEO_FORMATS[formatKey];
  const style = useMemo(
    () =>
      theme
        ? buildPosterStyle({ theme, trackGeojson, trackColor, trackOpacity: 1, trackWidth })
        : null,
    [theme, trackGeojson, trackColor, trackWidth],
  );

  return {
    themeKey,
    setThemeKey,
    themeKeys: THEME_KEYS,
    theme,
    themeError,
    formatKey,
    setFormatKey,
    format,
    durationSec,
    setDurationSec,
    cameraMode,
    setCameraMode,
    followZoom,
    setFollowZoom,
    trackColor,
    setTrackColor,
    trackWidth,
    setTrackWidth,
    units,
    setUnits,
    style,
  };
}
