import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function useHtmlLang() {
  const { i18n } = useDocusaurusContext();
  return i18n.localeConfigs[i18n.currentLocale].htmlLang;
}
