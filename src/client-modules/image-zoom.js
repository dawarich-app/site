import { initializeImageZoom } from '@site/src/utils/imageZoom';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * This client module is automatically loaded by Docusaurus on every page.
 * It makes images in Markdown content (blog posts and docs) click-to-zoom.
 */

export function onRouteDidUpdate() {
  if (ExecutionEnvironment.canUseDOM) {
    // Content is swapped in on SPA navigation, so new images need binding.
    initializeImageZoom();
  }
}

if (ExecutionEnvironment.canUseDOM) {
  initializeImageZoom();
}
