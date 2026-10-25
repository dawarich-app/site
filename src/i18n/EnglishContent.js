import React from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { isEnOnlyPath } from './enOnlyLinkProps';
import { DEFAULT_LOCALE } from './locales';
import { stripLocalePrefix } from './localizedRoutes';

export default function EnglishContent({ children }) {
  const { i18n } = useDocusaurusContext();
  const { pathname } = useLocation();
  if (i18n.currentLocale === DEFAULT_LOCALE || !isEnOnlyPath(stripLocalePrefix(pathname))) return children;
  return <div lang="en" style={{ display: 'contents' }}>{children}</div>;
}
