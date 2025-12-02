import { initializeUtmPreservation } from '@site/src/utils/utm';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * This client module is automatically loaded by Docusaurus on every page.
 * It initializes UTM parameter preservation globally across the entire site.
 */

export function onRouteDidUpdate() {
  if (ExecutionEnvironment.canUseDOM) {
    // Reinitialize on route changes (SPA navigation)
    initializeUtmPreservation();
  }
}

// Initialize on first load
if (ExecutionEnvironment.canUseDOM) {
  initializeUtmPreservation();
}
