import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { enOnlyLinkProps } from './enOnlyLinkProps';

export function useEnOnlyLinkProps(path) {
  const { i18n } = useDocusaurusContext();
  return enOnlyLinkProps(path, i18n.currentLocale);
}
