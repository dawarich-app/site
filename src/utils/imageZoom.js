/**
 * Click-to-zoom for images in Markdown content (blog posts and docs).
 *
 * Clicking an image opens it in a full-screen overlay, fitted to the viewport.
 * Clicking the image again toggles to its natural size, where it can be
 * scrolled and dragged to pan. Escape, the close button, or a click on the
 * backdrop dismisses it.
 *
 * Styles are injected from here rather than living in custom.css because
 * Infima's stylesheet loads after custom.css and would win specificity
 * ties against these rules.
 */

const STYLE_ID = 'dw-image-zoom-styles';
const OVERLAY_ID = 'dw-image-zoom-overlay';
const MIN_ZOOMABLE_WIDTH = 200;

const STYLES = `
.dw-zoomable { cursor: zoom-in; }
.dw-zoomable:focus-visible { outline: 2px solid var(--ifm-color-primary); outline-offset: 3px; }

#${OVERLAY_ID} {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: none;
  background: rgba(0, 0, 0, 0.9);
  overflow: auto;
  overscroll-behavior: contain;
}
#${OVERLAY_ID}[data-open="true"] { display: block; }

.dw-zoom-stage {
  min-height: 100%;
  display: flex;
  padding: 1rem;
  box-sizing: border-box;
}

.dw-zoom-img {
  display: block;
  flex-shrink: 0;
  /* Auto margins centre the image while it fits and collapse to zero once it
     overflows, which keeps the whole image reachable by scrolling. Centring
     with justify-content instead would overflow both edges and make the left
     side of a zoomed image impossible to pan to. */
  margin: auto;
  max-width: 100%;
  max-height: calc(100vh - 2rem);
  cursor: zoom-in;
  transition: opacity 120ms ease;
}
.dw-zoom-img[data-actual="true"] {
  max-width: none;
  max-height: none;
  cursor: grab;
}
.dw-zoom-img[data-dragging="true"] { cursor: grabbing; }

.dw-zoom-close {
  position: fixed;
  top: 0.75rem;
  right: 0.75rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  line-height: 1;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.375rem;
  cursor: pointer;
}
.dw-zoom-close:hover { background: rgba(0, 0, 0, 0.8); }

.dw-zoom-hint {
  position: fixed;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(0, 0, 0, 0.55);
  border-radius: 0.375rem;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .dw-zoom-img { transition: none; }
}
`;

let overlay;
let overlayImage;
let overlayHint;
let closeButton;
let lastFocused = null;

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function setActualSize(actual) {
  overlayImage.dataset.actual = actual ? 'true' : 'false';
  overlayHint.textContent = actual
    ? 'Drag to pan, click the image to fit, Esc to close'
    : 'Click the image for actual size, Esc to close';

  if (!actual) return;

  // Wait for layout to settle before measuring: on the first open the image
  // may not have been laid out yet, which would centre against a stale size.
  requestAnimationFrame(() => {
    overlay.scrollLeft = (overlay.scrollWidth - overlay.clientWidth) / 2;
    overlay.scrollTop = (overlay.scrollHeight - overlay.clientHeight) / 2;
  });
}

function closeOverlay() {
  if (!overlay || overlay.dataset.open !== 'true') return;

  overlay.dataset.open = 'false';
  overlayImage.removeAttribute('src');
  document.body.style.overflow = '';

  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  lastFocused = null;
}

function enableDragToPan() {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  overlayImage.addEventListener('pointerdown', (event) => {
    if (overlayImage.dataset.actual !== 'true') return;

    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = overlay.scrollLeft;
    startTop = overlay.scrollTop;
    overlayImage.dataset.dragging = 'true';
    overlayImage.setPointerCapture(event.pointerId);
  });

  overlayImage.addEventListener('pointermove', (event) => {
    if (!dragging) return;

    overlay.scrollLeft = startLeft - (event.clientX - startX);
    overlay.scrollTop = startTop - (event.clientY - startY);
  });

  const endDrag = () => {
    dragging = false;
    overlayImage.dataset.dragging = 'false';
  };

  overlayImage.addEventListener('pointerup', endDrag);
  overlayImage.addEventListener('pointercancel', endDrag);
}

function buildOverlay() {
  overlay = document.getElementById(OVERLAY_ID);
  if (overlay) return;

  overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.dataset.open = 'false';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const stage = document.createElement('div');
  stage.className = 'dw-zoom-stage';

  overlayImage = document.createElement('img');
  overlayImage.className = 'dw-zoom-img';
  overlayImage.dataset.actual = 'false';

  closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'dw-zoom-close';
  closeButton.setAttribute('aria-label', 'Close image');
  closeButton.textContent = '×';

  overlayHint = document.createElement('div');
  overlayHint.className = 'dw-zoom-hint';

  stage.appendChild(overlayImage);
  overlay.appendChild(stage);
  overlay.appendChild(closeButton);
  overlay.appendChild(overlayHint);
  document.body.appendChild(overlay);

  // A click on the padding around the image closes; on the image it toggles size.
  overlay.addEventListener('click', (event) => {
    if (event.target === overlayImage) {
      setActualSize(overlayImage.dataset.actual !== 'true');
      return;
    }
    closeOverlay();
  });

  closeButton.addEventListener('click', closeOverlay);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOverlay();
  });

  enableDragToPan();
}

function openOverlay(image) {
  lastFocused = document.activeElement;

  overlayImage.src = image.currentSrc || image.src;
  overlayImage.alt = image.alt || '';
  overlay.setAttribute('aria-label', image.alt || 'Enlarged image');
  overlay.dataset.open = 'true';
  overlay.scrollTop = 0;
  overlay.scrollLeft = 0;
  setActualSize(false);
  document.body.style.overflow = 'hidden';
  closeButton.focus();
}

function shouldZoom(image) {
  if (image.dataset.dwZoom === 'bound') return false;
  if (image.closest('a')) return false;
  if (image.hasAttribute('data-no-zoom')) return false;

  const width = image.naturalWidth || image.width || 0;

  // Skip badges, inline icons, and shields.
  return width === 0 || width >= MIN_ZOOMABLE_WIDTH;
}

export function initializeImageZoom() {
  const images = document.querySelectorAll('.markdown img');
  if (!images.length) return;

  injectStyles();
  buildOverlay();

  images.forEach((image) => {
    if (!shouldZoom(image)) return;

    image.dataset.dwZoom = 'bound';
    image.classList.add('dw-zoomable');
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');

    image.addEventListener('click', () => openOverlay(image));
    image.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      openOverlay(image);
    });
  });
}
