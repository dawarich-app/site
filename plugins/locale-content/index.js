const path = require('path');

module.exports = function localeContentPlugin(context) {
  const contentDir = path.join(context.siteDir, 'src/i18n/content');
  const { currentLocale, defaultLocale } = context.i18n;
  const locales = currentLocale === defaultLocale ? [defaultLocale] : [currentLocale, defaultLocale];

  return {
    name: 'locale-content',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            '@locale-content': locales.map((locale) => path.join(contentDir, locale)),
          },
        },
      };
    },
  };
};
