// Loads the HUD's typefaces (Archivo + JetBrains Mono) before rendering, so
// canvas text draws with the design's fonts instead of the fallback stack.
// Capped by a timeout: offline or blocked, the render proceeds on fallbacks.
let fontsPromise = null;

export function ensureHudFonts() {
  if (fontsPromise) return fontsPromise;
  fontsPromise = (async () => {
    if (!document.getElementById('video-hud-fonts')) {
      const link = document.createElement('link');
      link.id = 'video-hud-fonts';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600&family=JetBrains+Mono:wght@400;500;700&display=swap';
      document.head.appendChild(link);
    }
    const faces = [
      '700 54px "JetBrains Mono"',
      '500 17px "JetBrains Mono"',
      '400 11px "JetBrains Mono"',
      '500 18px Archivo',
    ].map((face) => document.fonts.load(face).catch(() => {}));
    await Promise.race([Promise.all(faces), new Promise((resolve) => setTimeout(resolve, 3000))]);
  })();
  return fontsPromise;
}
