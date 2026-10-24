const fs = require('fs');
const path = require('path');
const { mergeOverEnglish } = require('./merge');

module.exports = function localeContentLoader(source) {
  const { locale, defaultLocale, contentDir } = this.getOptions();
  const english = JSON.parse(source);
  if (locale === defaultLocale) return JSON.stringify(english);
  const relative = path.relative(path.join(contentDir, defaultLocale), this.resourcePath);
  const localizedFile = path.join(contentDir, locale, relative);
  if (!fs.existsSync(localizedFile)) {
    this.addMissingDependency(localizedFile);
    return JSON.stringify(english);
  }
  this.addDependency(localizedFile);
  return JSON.stringify(mergeOverEnglish(english, JSON.parse(fs.readFileSync(localizedFile, 'utf8'))));
};
