const path = require('path');

module.exports = function localeContentPlugin(context) {
  const contentDir = path.join(context.siteDir, 'src/i18n/content');
  const englishDir = path.join(contentDir, context.i18n.defaultLocale);

  return {
    name: 'locale-content',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            '@locale-content': englishDir,
          },
        },
        module: {
          rules: [
            {
              test: /\.json$/,
              include: englishDir,
              use: [
                {
                  loader: path.join(__dirname, 'loader.js'),
                  options: { locale: context.i18n.currentLocale, defaultLocale: context.i18n.defaultLocale, contentDir },
                },
              ],
            },
          ],
        },
      };
    },
  };
};
