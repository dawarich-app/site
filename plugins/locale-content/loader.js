const fs = require('fs');
const path = require('path');
const { mergeOverEnglish } = require('./merge');

module.exports = function localeContentLoader(source) {
  const { locale, contentDir } = this.getOptions();
  const english = JSON.parse(source);
  const relative = path.relative(path.join(contentDir, 'en'), this.resourcePath);
  const localizedFile = path.join(contentDir, locale, relative);
  if (locale === 'en' || !fs.existsSync(localizedFile)) return JSON.stringify(english);
  this.addDependency(localizedFile);
  return JSON.stringify(mergeOverEnglish(english, JSON.parse(fs.readFileSync(localizedFile, 'utf8'))));
};
