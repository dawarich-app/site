import React from 'react';
import {useLocation} from '@docusaurus/router';
import LocaleDropdownNavbarItem from '@theme-original/NavbarItem/LocaleDropdownNavbarItem';
import {isLocalizedRoute, stripLocalePrefix} from '@site/src/i18n/localizedRoutes';

export default function LocaleDropdownNavbarItemWrapper(props) {
  const {pathname} = useLocation();
  if (!isLocalizedRoute(stripLocalePrefix(pathname))) return null;
  return <LocaleDropdownNavbarItem {...props} />;
}
