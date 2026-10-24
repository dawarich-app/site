import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { localizedUrl } from './localizedUrl';

export function useLocalizedUrl(path) {
  const { i18n } = useDocusaurusContext();
  return localizedUrl(path, i18n.currentLocale);
}
